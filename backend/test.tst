// routes/track.ts
import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { events } from '../db/schema';
import { parseBrowser, parseDevice } from '../utils/parse';

type Bindings = {
  DB: D1Database;
};

const trackRoute = new Hono<{ Bindings: Bindings }>();
// Add this to your routes/track.ts
trackRoute.get('/test', async (c) => {
  try {
    if (!c.env.DB) {
      return c.json({ error: "DB not found" }, 500);
    }
    
    const db = drizzle(c.env.DB);
    
    // Try to select from the table
    const result = await db.select().from(events).limit(1);
    
    return c.json({ 
      status: 'Database connected', 
      tableExists: true,
      sampleData: result 
    });
  } catch (err) {
    return c.json({ 
      error: "Database error", 
      message: (err as Error).message 
    }, 500);
  }
});
trackRoute.post('/', async (c) => {
  try {
    console.log("Track route hit");
    
    // Check if DB binding exists
    if (!c.env.DB) {
      console.error("❌ DB binding not found");
      return c.json({ error: "Database not configured" }, 500);
    }
    
    console.log("✅ DB binding found");
    const db = drizzle(c.env.DB);

    let body: any = {};
    try {
      body = await c.req.json();
      console.log("📝 Request body:", body);
    } catch (e) {
      console.log("⚠️ No JSON body, using empty object");
      body = {};
    }

    const userAgent = c.req.header('User-Agent') || '';
    const country = c.req.header('CF-IPCountry') || 'Unknown';
    const referrer = body.referrer || 'Direct';

    console.log("🔍 Parsing user agent:", userAgent);
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
    
    console.log("💾 Inserting data:", insertData);

    await db.insert(events).values(insertData);
    
    console.log("✅ Data inserted successfully");
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
// Update your routes/track.ts with better debugging
trackRoute.get('/debug-db', async (c) => {
  try {
    if (!c.env.DB) {
      return c.json({ error: "DB binding not found" }, 500);
    }

    // Test raw D1 connection
    const tablesResult = await c.env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table';").all();
    
    // Test if events table exists
    let eventsTableExists = false;
    let eventsData = null;
    
    try {
      const eventsResult = await c.env.DB.prepare("SELECT * FROM events LIMIT 1;").all();
      eventsTableExists = true;
      eventsData = eventsResult.results;
    } catch (e) {
      eventsTableExists = false;
    }

    return c.json({
      status: 'Debug info',
      dbBinding: !!c.env.DB,
      tables: tablesResult.results,
      eventsTableExists,
      eventsData,
      timestamp: Date.now()
    });
    
  } catch (err) {
    return c.json({
      error: 'Debug failed',
      message: (err as Error).message,
      stack: (err as Error).stack
    }, 500);
  }
});
trackRoute.post('/test-raw-insert', async (c) => {
  try {
    console.log("=== Testing raw insert ===");
    
    if (!c.env.DB) {
      return c.json({ error: "DB not found" }, 500);
    }

    const insertData = {
      timestamp: Date.now(),
      country: 'TestCountry',
      device: 'TestDevice',
      browser: 'TestBrowser',
      referrer: 'TestReferrer'
    };

    console.log("💾 Raw insert data:", JSON.stringify(insertData));

    // Try raw D1 insert
    const result = await c.env.DB.prepare(`
      INSERT INTO events (timestamp, country, device, browser, referrer) 
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      insertData.timestamp,
      insertData.country,
      insertData.device,
      insertData.browser,
      insertData.referrer
    ).run();

    console.log("✅ Raw insert result:", result);

    return c.json({ 
      status: 'Raw insert successful',
      result: result,
      insertData: insertData
    });

  } catch (err) {
    console.error("❌ Raw insert error:", err);
    return c.json({ 
      error: "Raw insert failed", 
      message: (err as Error).message 
    }, 500);
  }
});
trackRoute.post('/create-table-now', async (c) => {
  try {
    if (!c.env.DB) {
      return c.json({ error: "DB not found" }, 500);
    }

    console.log("🔄 Creating table through worker...");

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER NOT NULL,
        country TEXT NOT NULL,
        device TEXT NOT NULL,
        browser TEXT NOT NULL,
        referrer TEXT NOT NULL
      )
    `;

    const result = await c.env.DB.prepare(createTableSQL).run();
    console.log("✅ Table creation result:", result);

    // Test if table was created
    const tablesResult = await c.env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table';").all();
    console.log("📋 Tables after creation:", tablesResult.results);

    return c.json({ 
      status: 'Table created through worker',
      result: result,
      tables: tablesResult.results
    });

  } catch (err) {
    console.error("❌ Table creation through worker failed:", err);
    return c.json({ 
      error: "Table creation failed", 
      message: (err as Error).message 
    }, 500);
  }
});
export default trackRoute;