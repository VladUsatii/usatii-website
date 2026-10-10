import { searchSite } from "@/lib/site-search";
export async function GET(request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() || "";
  if (!query || query.length > 200) return Response.json({ results: [] });
  try { return Response.json({ results: await searchSite(query) }, { headers: { "Cache-Control": "public, max-age=60" } }); }
  catch { return Response.json({ error: "Search is temporarily unavailable. Please try again." }, { status: 500 }); }
}
