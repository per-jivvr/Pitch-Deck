# aiai3D Investor Suite

Full-stack investor deck app with:

- One Pager, Teaser Deck, and Pitch Deck views.
- Shared server-side persistence for admin edits in `data/suite.json`.
- Server-side analytics persistence in `data/analytics.json`.
- Admin login for editing content, images, access credentials, slide order, custom slides, data labels, and analytics.
- Per-investor Pitch Deck email/password access.
- Investor-targeted analytics by email, including logins, last seen, total time, and slide time.
- Data-flow visibility for Pitch Deck -> Teaser Deck -> One Pager inheritance.

## Run Locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:4173
```

## Production

```bash
npm run build
npm run start
```

## Default Access

Admin password:

```text
472918
```

Default Pitch Deck access:

```text
investor@aiai3d.io
1234
```

Change these in the Admin panel under `Access`.

Additional investor emails can be added in Admin -> Access. Each investor gets separate credentials and separate analytics.

## Persistence Model

Admin changes are written to:

```text
data/suite.json
```

Visitor engagement analytics are written to:

```text
data/analytics.json
```

These files are shared by the server, so the next viewer receives the latest saved data.

## Data Flow

Pitch Deck is the source of truth. Teaser Deck reads missing fields from Pitch Deck, and One Pager reads missing fields from Teaser Deck. Editing a field in a downstream document creates a local override. Clear the override to inherit from the upstream source again.
