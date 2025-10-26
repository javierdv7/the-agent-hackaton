export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const upstream = await fetch("https://agentworkers.vicmoor07.workers.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      return new Response(text || "Upstream error", { status: upstream.status });
    }

    // Asume JSON; si upstream devuelve texto, adapta según tu caso.
    const data = await upstream.json();
    return Response.json(data, {
      headers: {
        // Útil si luego llamas esta API desde otra origen
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ aiMessage: `Proxy error: ${msg}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
