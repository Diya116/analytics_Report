# Web Analytics – Cloudflare + CLI

A fast, self-hosted, privacy-focused web analytics solution powered by Cloudflare Workers, D1 (SQLite on the edge), Drizzle ORM, and Hono — with a built-in CLI tool to view real-time traffic stats from your terminal.

This repo includes:

- backend – Cloudflare Worker API + D1 storage
- analytics_cli – CLI to fetch and visualize traffic in terminal
- example_client – Sample frontend to track visits
---


## 🧱 Project Structure

```
.
├── analytics_cli       # CLI to visualize stats (Node.js)
├── backend             # Cloudflare Worker + API + DB schema
└── example_client      # Sample website using /track endpoint
```

---

## Getting Started

### 1. Clone Repo

```bash
git clone https://github.com/Diya116/minimal-analytics-tracker
cd minimal-analytics-tracker
```

---

### 2. Setup & Deploy Backend (Cloudflare Worker)

Inside backend/:

```bash
cd backend
npm install

# Create D1 DB
npx wrangler d1 create analytics

# Push DB schema (Drizzle)
npx drizzle-kit push

# Deploy the Worker
npx wrangler deploy
```

Worker endpoints will be like:

- POST https://your-app.workers.dev/track
- GET https://your-app.workers.dev/stats

Ensure wrangler.jsonc includes your D1 binding and environment config.

---

### 3. Try Frontend Tracking (example_client)

Edit example_client/index.html to use your deployed URL:

```html
<script>
  fetch("https://your-app.workers.dev/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ referrer: document.referrer })
  });
</script>
```

Open index.html in a browser to simulate visits.

---

### 4. Use CLI to View Stats (analytics_cli)

Inside analytics_cli/:

```bash
cd ../analytics_cli
npm install
npm link  # Registers `webstats` globally
```

Now run:

```bash
webstats
```

You'll see a formatted dashboard in your terminal showing:

- Country-wise visit count
- Device breakdown (Mobile/Desktop)
- Browser usage
- Referrers

---


## 🛠️ Tech Stack

- Cloudflare Workers + Wrangler
- D1 (SQLite on the edge)
- Drizzle ORM (type-safe SQL)
- Hono (lightweight web framework)
- CLI: Node.js + Chalk + cli-table3 + fetch

---

