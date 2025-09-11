# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.

## Deployment (Quiz Show)

This app runs a Node SSR server and serves both API/SSE and static assets. Use a reverse proxy (nginx) in front of the Node process. Uploads are written to `public/uploads` and must be persistent and writable.

### Requirements

- Node 20+
- MySQL/MariaDB with `DATABASE_URL`
- nginx (reverse proxy)
- Writable directory: `public/uploads`

### Environment variables

- `NODE_ENV=production`
- `PORT=3000` (or any port you proxy to)
- `DATABASE_URL="mysql://user:pass@host:3306/dbname"`

### Build and migrate

```bash
npm ci
npm run build
DATABASE_URL="mysql://user:pass@host:3306/dbname" npx prisma migrate deploy
```

### Build output: where client and server go

After `npm run build`, the output lives inside your project directory:

```
/srv/quiz_show
  ├─ build/
  │  ├─ client/   # static client assets
  │  └─ server/   # server bundle (entry: ./build/server/index.js)
  ├─ public/
  │  └─ uploads/  # user-uploaded files (persist + writable)
  └─ ...
```

- Do not move these folders to a separate `www` root. Keep them in place.
- Start the app from `/srv/quiz_show` with `npm run start`; it runs `./build/server/index.js` and serves the client assets automatically.
- Uploads are stored at `/srv/quiz_show/public/uploads` and are reachable at `/uploads/...`.

### Run with pm2

Commit a template without secrets:

```js
// ecosystem.example.config.js
module.exports = {
  apps: [
    {
      name: "quiz-show",
      cwd: "/srv/quiz_show", // adjust on your server
      script: "npm",
      args: "run start",
      instances: 1, // important: SSE + in-memory state
      exec_mode: "fork",
      watch: false,
      max_memory_restart: "512M",
    },
  ],
};
```

On the server, copy to `ecosystem.config.js` and provide env via shell or the file:

```bash
export NODE_ENV=production
export PORT=3000
export DATABASE_URL='mysql://user:pass@host:3306/dbname'
pm2 start /srv/quiz_show/ecosystem.config.js --update-env
pm2 save
pm2 startup
```

Make uploads persistent and writable:

```bash
mkdir -p /srv/quiz_show/public/uploads
chown -R www-data:www-data /srv/quiz_show/public/uploads
```

### nginx reverse proxy

```nginx
server {
  listen 80;
  server_name quiz.example.com;

  # match app's 1 GB upload handler
  client_max_body_size 1024m;

  location / {
    proxy_pass         http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header   Host $host;
    proxy_set_header   X-Forwarded-Proto $scheme;
    proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;

    # Server-Sent Events
    proxy_buffering off;
    proxy_read_timeout 3600s;
  }
}
```

Optional: Let nginx serve static without copying to a separate www directory:

```nginx
location /assets/ {
  alias /srv/quiz_show/build/client/assets/;
  access_log off;
  expires 1y;
  add_header Cache-Control "public, immutable";
}

location /uploads/ {
  alias /srv/quiz_show/public/uploads/;
  expires off;
}
```

For HTTPS, enable TLS (e.g. Certbot) and keep the upstream on `http://127.0.0.1:3000`.

### Updates

```bash
git pull
npm ci
npm run build
DATABASE_URL="mysql://user:pass@host:3306/dbname" npx prisma migrate deploy
pm2 reload quiz-show
```

### Security & Hardening

- Keeping the app under `/srv/quiz_show` is fine (FHS: site-specific served data). Do not expose the project directory directly as a web root. Let nginx proxy requests and only alias specific static paths.
- Run the app as a non-root user (e.g. `www-data` or a dedicated `quiz` user). Example:

```bash
# optional dedicated user
useradd -r -s /usr/sbin/nologin quiz || true

chown -R quiz:www-data /srv/quiz_show
find /srv/quiz_show -type d -exec chmod 750 {} \;
find /srv/quiz_show -type f -exec chmod 640 {} \;

# uploads directory must be writable by the app user and readable by nginx
chmod 750 /srv/quiz_show/public/uploads
```

- Do not alias the whole project in nginx. Only alias:
  - `/assets/` → `/srv/quiz_show/build/client/assets/`
  - `/uploads/` → `/srv/quiz_show/public/uploads/`
- Keep the Node port internal. Either bind to loopback or block externally:

```bash
# Allow only HTTP/HTTPS from the internet; block 3000
ufw allow 80,443/tcp
ufw deny 3000/tcp || true
```

- Store secrets (.env) outside aliased paths and outside any directory served by nginx.

### Docker (alternative)

```bash
docker build -t quiz-show:latest .
docker run -d --name quiz-show \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e DATABASE_URL='mysql://user:pass@host:3306/dbname' \
  -p 3000:3000 \
  -v /srv/quiz_show/uploads:/app/public/uploads \
  quiz-show:latest

# once per deployment to apply DB migrations
docker run --rm \
  -e DATABASE_URL='mysql://user:pass@host:3306/dbname' \
  quiz-show:latest npx prisma migrate deploy
```

Notes:

- Run exactly 1 app instance (SSE + in-memory state).
- The app writes uploads to `public/uploads` (configure nginx and permissions accordingly).
