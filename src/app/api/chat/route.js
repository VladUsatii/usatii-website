export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { messages = [] } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing GROQ_API_KEY" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const model = process.env.GROQ_MODEL || "llama3-8b-8192";

    // Prepend a light system message to keep answers helpful & concise
    const withSystem = [
      {
        role: "system",
        content:
          "You are a concise, helpful assistant. Prefer clear answers with minimal fluff.",
      },
      ...messages.filter(Boolean).map(({ role, content }) => ({
        role: role === "assistant" || role === "user" ? role : "user",
        content: String(content || "").slice(0, 8000),
      })),
    ].slice(-20); // keep payload small

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: withSystem,
        temperature: 0.6,
        stream: false, // keep simple; easy to swap to true + stream piping later
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text().catch(() => "");
      return new Response(
        JSON.stringify({ error: "Provider error", detail: errText }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await groqRes.json();
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "I couldn’t generate a response.";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Bad request", detail: String(err?.message || err) }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}