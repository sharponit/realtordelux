/** Developed by SaaSolutions SL ... */
export async function GET() { return Response.json({ ok:true, service:'frontend', aiServiceConfigured:Boolean(process.env.AI_SERVICE_URL) }); }
