import crypto from "node:crypto";
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.argv.includes("--dev");
const port = Number(process.env.PORT || 4173);
const suitePath = path.join(__dirname, "data", "suite.json");
const analyticsPath = path.join(__dirname, "data", "analytics.json");

const DEFAULT_SLIDE_ORDER = [
  "hero",
  "problem",
  "breakthrough",
  "market",
  "trust",
  "moat",
  "team",
  "ask",
  "closing"
];

const defaultSuite = {
  version: 1,
  documents: {
    onePager: {},
    teaserDeck: {},
    pitchDeck: {}
  },
  sources: {
    onePager: "teaserDeck",
    teaserDeck: "pitchDeck",
    pitchDeck: ""
  },
  slideOrder: {
    onePager: [...DEFAULT_SLIDE_ORDER],
    teaserDeck: [...DEFAULT_SLIDE_ORDER],
    pitchDeck: [...DEFAULT_SLIDE_ORDER]
  },
  settings: {
    adminPassword: "472918",
    pitchEmail: "investor@aiai3d.io",
    pitchPassword: "aiai3d",
    pitchAccess: [
      {
        email: "investor@aiai3d.io",
        password: "aiai3d",
        label: "Default Investor",
        active: true,
        createdAt: new Date().toISOString()
      }
    ]
  },
  customSlides: {
    onePager: [],
    teaserDeck: [],
    pitchDeck: []
  }
};

const defaultAnalytics = {
  lastOpened: null,
  totalSeconds: 0,
  viewSeconds: {},
  slideSeconds: {},
  investorSeconds: {},
  investorSlideSeconds: {},
  investorLastSeen: {},
  investorLogins: {}
};

const sessions = new Map();

const normalizeSuite = (candidate = {}) => {
  const fallbackAccess = candidate.settings?.pitchEmail
    ? [{
        email: candidate.settings.pitchEmail,
        password: candidate.settings.pitchPassword || defaultSuite.settings.pitchPassword,
        label: "Default Investor",
        active: true,
        createdAt: new Date().toISOString()
      }]
    : defaultSuite.settings.pitchAccess;

  return {
    ...defaultSuite,
    ...candidate,
    documents: {
      ...defaultSuite.documents,
      ...(candidate.documents || {})
    },
    sources: {
      ...defaultSuite.sources,
      ...(candidate.sources || {})
    },
    slideOrder: {
      ...defaultSuite.slideOrder,
      ...(candidate.slideOrder || {})
    },
    settings: {
      ...defaultSuite.settings,
      ...(candidate.settings || {}),
      pitchAccess: (candidate.settings?.pitchAccess || fallbackAccess).map((entry) => ({
        email: String(entry.email || "").trim(),
        password: String(entry.password || ""),
        label: String(entry.label || entry.email || "Investor"),
        active: entry.active !== false,
        createdAt: entry.createdAt || new Date().toISOString()
      }))
    },
    customSlides: {
      ...defaultSuite.customSlides,
      ...(candidate.customSlides || {})
    }
  };
};

const normalizeAnalytics = (candidate = {}) => ({
  ...defaultAnalytics,
  ...candidate,
  viewSeconds: {
    ...defaultAnalytics.viewSeconds,
    ...(candidate.viewSeconds || {})
  },
  slideSeconds: {
    ...defaultAnalytics.slideSeconds,
    ...(candidate.slideSeconds || {})
  },
  investorSeconds: {
    ...defaultAnalytics.investorSeconds,
    ...(candidate.investorSeconds || {})
  },
  investorSlideSeconds: {
    ...defaultAnalytics.investorSlideSeconds,
    ...(candidate.investorSlideSeconds || {})
  },
  investorLastSeen: {
    ...defaultAnalytics.investorLastSeen,
    ...(candidate.investorLastSeen || {})
  },
  investorLogins: {
    ...defaultAnalytics.investorLogins,
    ...(candidate.investorLogins || {})
  }
});

async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") console.error(`Could not read ${filePath}`, error);
    return fallback;
  }
}

async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function resolveDocument(suite, documentKey, seen = new Set()) {
  const normalized = normalizeSuite(suite);
  if (seen.has(documentKey)) return {};
  seen.add(documentKey);

  const sourceKey = normalized.sources?.[documentKey];
  const sourceContent = sourceKey && sourceKey !== documentKey
    ? resolveDocument(normalized, sourceKey, seen)
    : {};

  return {
    ...sourceContent,
    ...(normalized.documents?.[documentKey] || {})
  };
}

function publicSuite(suite, mode) {
  const normalized = normalizeSuite(suite);
  const includePitch = mode === "admin" || mode === "pitch";

  if (mode === "admin") return normalized;

  return {
    ...normalized,
    documents: {
      onePager: resolveDocument(normalized, "onePager"),
      teaserDeck: resolveDocument(normalized, "teaserDeck"),
      pitchDeck: includePitch ? resolveDocument(normalized, "pitchDeck") : {}
    },
    customSlides: {
      onePager: normalized.customSlides.onePager || [],
      teaserDeck: normalized.customSlides.teaserDeck || [],
      pitchDeck: includePitch ? (normalized.customSlides.pitchDeck || []) : []
    },
    sources: {
      onePager: "",
      teaserDeck: "",
      pitchDeck: ""
    },
    settings: {
      pitchEmail: normalized.settings.pitchEmail
    }
  };
}

function createSession(kind, meta = {}) {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, {
    kind,
    ...meta,
    expiresAt: Date.now() + 1000 * 60 * 60 * 8
  });
  return token;
}

function getSession(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const session = sessions.get(token);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    sessions.delete(token);
    return null;
  }
  return session;
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function recordInvestorLogin(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) return;
  const analytics = normalizeAnalytics(await readJson(analyticsPath, defaultAnalytics));
  analytics.lastOpened = new Date().toISOString();
  analytics.investorLastSeen[normalizedEmail] = analytics.lastOpened;
  analytics.investorLogins[normalizedEmail] = (analytics.investorLogins[normalizedEmail] || 0) + 1;
  await writeJson(analyticsPath, analytics);
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  res.end(JSON.stringify(payload));
}

async function handleApi(req, res, url) {
  try {
    if (req.method === "GET" && url.pathname === "/api/state") {
      const session = getSession(req);
      const suite = normalizeSuite(await readJson(suitePath, defaultSuite));
      const mode = session?.kind === "admin" ? "admin" : session?.kind === "pitch" ? "pitch" : "public";
      sendJson(res, 200, { suite: publicSuite(suite, mode), mode });
      return true;
    }

    if (req.method === "POST" && url.pathname === "/api/admin/login") {
      const suite = normalizeSuite(await readJson(suitePath, defaultSuite));
      const body = await readBody(req);
      if (body.password === suite.settings.adminPassword) {
        sendJson(res, 200, { token: createSession("admin") });
      } else {
        sendJson(res, 401, { error: "Incorrect password." });
      }
      return true;
    }

    if (req.method === "POST" && url.pathname === "/api/pitch/login") {
      const suite = normalizeSuite(await readJson(suitePath, defaultSuite));
      const body = await readBody(req);
      const providedEmail = String(body.email || "").trim().toLowerCase();
      const investor = (suite.settings.pitchAccess || []).find((entry) =>
        entry.active !== false &&
        String(entry.email || "").trim().toLowerCase() === providedEmail &&
        body.password === entry.password
      );
      const legacyMatch = providedEmail === String(suite.settings.pitchEmail || "").trim().toLowerCase() && body.password === suite.settings.pitchPassword;
      if (investor || legacyMatch) {
        await recordInvestorLogin(providedEmail);
        sendJson(res, 200, { token: createSession("pitch", { email: providedEmail }), email: providedEmail });
      } else {
        sendJson(res, 401, { error: "Incorrect email or password." });
      }
      return true;
    }

    if (req.method === "PUT" && url.pathname === "/api/suite") {
      const session = getSession(req);
      if (session?.kind !== "admin") {
        sendJson(res, 401, { error: "Admin session required." });
        return true;
      }
      const body = await readBody(req);
      const suite = normalizeSuite(body.suite || body);
      await writeJson(suitePath, suite);
      sendJson(res, 200, { suite: publicSuite(suite, "admin") });
      return true;
    }

    if (req.method === "GET" && url.pathname === "/api/analytics") {
      const analytics = normalizeAnalytics(await readJson(analyticsPath, defaultAnalytics));
      sendJson(res, 200, { analytics });
      return true;
    }

    if (req.method === "POST" && url.pathname === "/api/analytics/tick") {
      const session = getSession(req);
      const body = await readBody(req);
      const view = String(body.view || "unknown");
      const slideKey = String(body.slideKey || view);
      const metricKey = view === "onePager" ? "onePager" : `${view}:${slideKey}`;
      const seconds = Math.max(1, Math.min(60, Number(body.seconds || 1)));
      const investorEmail = session?.kind === "pitch" ? String(session.email || "").trim().toLowerCase() : "";
      const analytics = normalizeAnalytics(await readJson(analyticsPath, defaultAnalytics));

      analytics.lastOpened = new Date().toISOString();
      analytics.totalSeconds = (analytics.totalSeconds || 0) + seconds;
      analytics.viewSeconds[view] = (analytics.viewSeconds[view] || 0) + seconds;
      analytics.slideSeconds[metricKey] = (analytics.slideSeconds[metricKey] || 0) + seconds;
      if (investorEmail) {
        analytics.investorSeconds[investorEmail] = (analytics.investorSeconds[investorEmail] || 0) + seconds;
        analytics.investorSlideSeconds[investorEmail] = {
          ...(analytics.investorSlideSeconds[investorEmail] || {}),
          [metricKey]: ((analytics.investorSlideSeconds[investorEmail] || {})[metricKey] || 0) + seconds
        };
        analytics.investorLastSeen[investorEmail] = analytics.lastOpened;
      }

      await writeJson(analyticsPath, analytics);
      sendJson(res, 200, { analytics });
      return true;
    }
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { error: "Server error." });
    return true;
  }

  return false;
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp"
  }[ext] || "application/octet-stream";
}

async function serveStatic(req, res, url) {
  const distDir = path.join(__dirname, "dist");
  const requested = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.normalize(path.join(distDir, requested));

  if (!filePath.startsWith(distDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const data = await fs.readFile(filePath);
    res.writeHead(200, { "content-type": contentType(filePath) });
    res.end(data);
  } catch {
    try {
      const data = await fs.readFile(path.join(distDir, "index.html"));
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end(data);
    } catch {
      res.writeHead(503, { "content-type": "text/plain; charset=utf-8" });
      res.end("Build output not found. Run `npm run build` first, or use `npm run dev`.");
    }
  }
}

const vite = isDev
  ? await import("vite").then(({ createServer }) =>
      createServer({
        server: { middlewareMode: true },
        appType: "spa"
      })
    )
  : null;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (url.pathname.startsWith("/api/")) {
    const handled = await handleApi(req, res, url);
    if (handled) return;
  }

  if (vite) {
    vite.middlewares(req, res, () => {
      res.writeHead(404);
      res.end("Not found");
    });
    return;
  }

  await serveStatic(req, res, url);
});

server.listen(port, () => {
  console.log(`aiai3D Investor Suite running at http://localhost:${port}`);
});
