import { Hono } from 'hono';
import trackRoute from './routes/track';
import statsRoute from './routes/stats';
type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', async (c, next) => {
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type');
  if (c.req.method === 'OPTIONS') return c.body(null, 204);
  await next();
});
app.get('/',async(c)=>{
   return c.json({ status: 'tracked' });
})
app.route('/track', trackRoute); // Mount /track here
app.route('/stats', statsRoute);

export default app;

