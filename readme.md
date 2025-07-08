A lightweight, privacy-focused analytics platform built using Cloudflare Workers, D1 (SQLite), Drizzle ORM, and Hono. It tracks visitor metadata (location, browser, device, referrer) and provides a developer-friendly CLI to visualize traffic in real time — without cookies or intrusive tracking.
Ideal for indie developers, small teams, or internal dashboards who want simple insights without relying on tools like Google Analytics.

***Tech Stack***
Cloudflare Workers + Hono (Web API at the edge)
Cloudflare D1 (SQLite-like DB on edge)
Drizzle ORM (type-safe DB queries)
Node.js CLI (using chalk, cli-table3, fetch)

**How It Works**
A small JS snippet (or fetch call) on your website POSTs to /track
Cloudflare Worker extracts metadata (User-Agent, country, referrer)
Data is stored in D1 via Drizzle
CLI app fetches from /stats and renders tables in your terminal
