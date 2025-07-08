import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { sql } from 'drizzle-orm';
import { events } from '../db/schema';

type Bindings = {
  DB: D1Database;
};

const statsRoute = new Hono<{ Bindings: Bindings }>();

statsRoute.get('/', async (c) => {
  const db = drizzle(c.env.DB);

  // Group by country
  const byCountry = await db
    .select({
      country: events.country,
      count: sql<number>`count(*)`,
    })
    .from(events)
    .groupBy(events.country);

  // Group by device
  const byDevice = await db
    .select({
      device: events.device,
      count: sql<number>`count(*)`,
    })
    .from(events)
    .groupBy(events.device);

  // Group by browser
  const byBrowser = await db
    .select({
      browser: events.browser,
      count: sql<number>`count(*)`,
    })
    .from(events)
    .groupBy(events.browser);

  // Group by referrer
  const byReferrer = await db
    .select({
      referrer: events.referrer,
      count: sql<number>`count(*)`,
    })
    .from(events)
    .groupBy(events.referrer);

  return c.json({
    byCountry,
    byDevice,
    byBrowser,
    byReferrer,
  });
});

export default statsRoute;
