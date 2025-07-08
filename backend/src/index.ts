export interface Env {
  ANALYTICS_KV: KVNamespace;
}

// Device and browser detection
function parseDevice(ua: string): string {
  return /mobile/i.test(ua) ? "Mobile" : "Desktop";
}

function parseBrowser(ua: string): string {
    if (/edg/i.test(ua)) return "Edge";
  if (/chrome|crios/i.test(ua)) return "Chrome";
  if (/firefox/i.test(ua)) return "Firefox";
  if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) return "Safari";
  return "Other";
}

// Reusable JSON response with CORS headers
function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}

// Preflight response
function corsPreflight(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // Handle preflight CORS requests
    if (req.method === "OPTIONS") {
      return corsPreflight();
    }

    if (pathname === "/track" && req.method === "POST") {
      const data = await req.json().catch(() => ({})) as {
        referrer?: string;
      };

      const country = req.headers.get("CF-IPCountry") || "Unknown";
      const userAgent = req.headers.get("User-Agent") || "";
      const referrer = data.referrer || "Direct";
      const device = parseDevice(userAgent);
      const browser = parseBrowser(userAgent);
      const timestamp = Date.now();

      const event = {
        timestamp,
        country,
        device,
        browser,
        referrer
      };
console.log(event)
      const key = `event:${timestamp}`;
      await env.ANALYTICS_KV.put(key, JSON.stringify(event), {
        expirationTtl: 1800 // 30 minutes
      });

      return jsonResponse({ status: "Tracked" });
    }

    if (pathname === "/active" && req.method === "GET") {
      const keys = await env.ANALYTICS_KV.list({ prefix: "event:" });
      return jsonResponse({ activeVisitors: keys.keys.length });
    }

    return jsonResponse({ error: "Not Found" }, 404);
  }
};

