// routes/track.ts
import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { events } from '../db/schema';
import { parseBrowser, parseDevice } from '../utils/parse';

type Bindings = {
  DB: D1Database;
};

const trackRoute = new Hono<{ Bindings: Bindings }>();

trackRoute.post('/', async (c) => {
  try {
    if (!c.env.DB) {
      return c.json({ error: "Database not configured" }, 500);
    }

    const db = drizzle(c.env.DB);
    let body: any = {};
    try {
      body = await c.req.json();
      console.log("Request body:", body);
    } catch (e) {
      console.log("No JSON body, using empty object");
      body = {};
    }

    const userAgent = c.req.header('User-Agent') || '';
    const country = c.req.header('CF-IPCountry') || 'Unknown';
    const referrer = body.referrer || 'Direct';
    const device = parseDevice(userAgent);
    const browser = parseBrowser(userAgent);
    const timestamp = Date.now();

    const insertData = {
      timestamp,
      country,
      device,
      browser,
      referrer,
    };
    
    await db.insert(events).values(insertData);
    
    return c.json({ status: 'tracked' });
    
  } catch (err) {
    console.error("❌ Error inserting analytics data:", err);
    console.error("❌ Error stack:", (err as Error).stack);
    return c.json({ 
      error: "Internal Server Error", 
      message: (err as Error).message,
      stack: (err as Error).stack // Remove this in production
    }, 500);
  }
});

export default trackRoute;