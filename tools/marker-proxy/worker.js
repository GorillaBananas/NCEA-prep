/* Optional proxy for AI marking (Cloudflare Worker).
   Use it if you do not want the API key in the student's browser.
   The browser sends the marking request here; the Worker adds the key and forwards it to the Claude API.

   Set up:
   1. npm i -g wrangler && wrangler login
   2. cd tools/marker-proxy && wrangler deploy
   3. wrangler secret put ANTHROPIC_API_KEY      (paste the key)
   4. On the site's AI marking page, put the Worker's address in "Proxy address" and leave the key empty.

   Limits: only the site's own origin may call it, only the listed models, and output is capped. */
const ALLOWED_ORIGINS = ['https://gorillabananas.github.io', 'http://localhost:8000'];
const MODELS = ['claude-sonnet-5-5', 'claude-haiku-5-5', 'claude-opus-5-5'];
const MAX_TOKENS = 3000;

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const cors = { 'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0], 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'content-type', Vary: 'Origin' };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (req.method !== 'POST' || !ALLOWED_ORIGINS.includes(origin)) return new Response('Not allowed', { status: 403, headers: cors });
    let body;
    try { body = await req.json(); } catch (e) { return new Response('Bad request', { status: 400, headers: cors }); }
    if (!MODELS.includes(body.model)) body.model = MODELS[0];
    body.max_tokens = Math.min(+body.max_tokens || MAX_TOKENS, MAX_TOKENS);
    delete body.tools; delete body.stream;
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify(body),
    });
    return new Response(r.body, { status: r.status, headers: Object.assign({ 'content-type': 'application/json' }, cors) });
  },
};
