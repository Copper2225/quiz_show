## Quiz Show (WIP)

An in-progress quiz show web app built for a youth group holiday camp. It supports live gameplay with teams, an admin control panel, and different question types. This project is not finished yet; some features are still being developed.

### Status

- Actively developed. Expect breaking changes.
- Core flows exist: admin controls, team view, multiple choice, buzzer, scoring.
- Missing/unfinished: authentication hardening, more question types, polish, error states, docs.

### Tech Stack

- React Router (SSR) with TypeScript
- Prisma + MySQL/MariaDB
- TailwindCSS and Radix UI
- Server‑Sent Events (SSE) for real-time updates

### Local Development

1) Install dependencies:

```bash
npm install
```

2) Configure database (MySQL/MariaDB) and `.env`:

```bash
DATABASE_URL="mysql://user:pass@localhost:3306/quiz_show"
```

3) Run migrations and start dev server:

```bash
npx prisma migrate dev
npm run dev
```

App: `http://localhost:5173`

### Production (overview)

- Build with `npm run build` (outputs to `build/client` and `build/server`).
- Run one server process (SSE relies on single instance or sticky sessions).
- Reverse proxy with nginx; keep `public/uploads` persistent and writable.
- Apply DB migrations during deploy: `npx prisma migrate deploy`.

### Project Structure

- `app/routes/show` — audience display, question rendering, scoring
- `app/routes/admin` — control panel for the quiz master
- `app/routes/user` — team-facing UI (buzzer, multiple choice, waiting)
- `app/routes/api` — API endpoints for answers, questions, teams, uploads
- `public/uploads` — media uploaded via the admin UI

### Contributing / Roadmap

Contributions and ideas are welcome. Short-term goals:

- Improve admin UX and validation
- Add more question types and media support
- Better resilience around SSE and reconnect behavior
- Simple auth and role separation
- Test coverage and CI

### License

MIT — see `LICENSE`.

### Acknowledgements

Built on top of the React Router full-stack template. Tailored for a youth group holiday camp quiz show.


