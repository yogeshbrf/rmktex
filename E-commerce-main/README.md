# Shop.Etc — Premium Fashion Marketplace

React (Vite) storefront with an Express + MySQL API.

## Quick start

```bash
npm run dev
```

That one command does everything:

1. installs frontend and backend dependencies if they are missing,
2. prepares the database — creates the schema and loads the sample catalog the
   first time it runs (later runs skip seeding so your data is kept),
3. starts the API **and** the frontend together.

Then open **http://localhost:5173**.

| Service  | URL                            |
| -------- | ------------------------------ |
| Frontend | http://localhost:5173          |
| API      | http://localhost:3001/api      |
| Health   | http://localhost:3001/api/health |

Press `Ctrl+C` once to stop both processes.

### Demo account

| Role  | Email                | Password   |
| ----- | -------------------- | ---------- |
| Admin | `admin@shopetc.com`  | `admin123` |

Customer accounts can be created from the `/register` page.

## Prerequisites

- **Node.js 18+**
- **MySQL 8** running locally (it only has to be running — the database and
  tables are created for you).

## Configuration

The backend reads its settings from `server/.env`:

```ini
PORT=3001
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-password-here
DB_NAME=ecommerce_store

SESSION_SECRET=dev-secret-key-123-change-in-production
SESSION_MAX_AGE=604800000

FRONTEND_URL=http://localhost:5173
```

`server/.env.example` lists the same keys if you need to recreate the file.
If your MySQL credentials differ, update `DB_USER` / `DB_PASSWORD` and run
`npm run dev` again.

## Troubleshooting

| Symptom | Fix |
| ------- | --- |
| `Database setup failed` | MySQL is not running, or `DB_USER` / `DB_PASSWORD` in `server/.env` are wrong. |
| `Port 3001 is already in use` | A previous run is still up. Stop it, or start with `PORT=3002 npm run dev`. |
| Store data fails to load in the browser | Make sure the command is still running — the frontend proxies `/api` to the API, so both halves must be up. |

## Other scripts

Run from the project root:

| Command | Description |
| ------- | ----------- |
| `npm run dev` / `npm start` | Everything (see above). |
| `npm run dev:web` | Frontend only. |
| `npm run dev:api` | API only, with reload on change. |
| `npm run build` | Production build into `dist/` (obfuscated, code-split). |
| `npm run preview` | Serve the production build. |
| `npm run lint` | ESLint. |

Inside `server/`:

| Command | Description |
| ------- | ----------- |
| `npm run bootstrap` | Create the database/schema and seed it if it is empty. |
| `npm run init-db` | Create the database and tables only. |
| `npm run seed` | **Reset** all catalog data and reload the sample dataset. |

## Project structure

```
├── scripts/dev.js        # the one-command launcher
├── src/                  # React app (pages, components, contexts)
├── server/
│   ├── bootstrap.js      # idempotent database setup
│   ├── config/           # knex connection + schema
│   ├── routes/           # /api endpoints
│   └── seed.js           # sample catalog data
└── vite.config.js        # dev server + /api proxy
```
