// Temporary in-memory storage (RESET on each deployment)
let tokens: { token: string; platform: string; user_id: number }[] = [];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = body?.token;
    const platform = body?.platform || "web";

    if (!token) {
      return new Response(JSON.stringify({ error: "token required" }), { status: 400 });
    }

    const userId = 1; // static userId because no DB

    // check existing
    const existing = tokens.find(t => t.token === token);

    if (existing) {
      existing.platform = platform;
      existing.user_id = userId;
    } else {
      tokens.push({ token, platform, user_id: userId });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "server error" }), { status: 500 });
  }
}
