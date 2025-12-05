let tokens: { token: string; platform: string; user_id: number }[] = [];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = body?.token;

    if (!token) {
      return new Response(JSON.stringify({ error: "token required" }), { status: 400 });
    }

    tokens = tokens.filter(t => t.token !== token);

    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "server error" }), { status: 500 });
  }
}
