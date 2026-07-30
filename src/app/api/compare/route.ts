import { NextResponse } from "next/server";
import { compare } from "@/lib/providers/engine";
import { checkRate } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // Anti-abuso: 20 búsquedas por minuto por IP (el scraping es costoso).
  const rate = checkRate(req, "compare", 20, 60 * 1000);
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Demasiadas búsquedas. Esperá un momento." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } }
    );
  }

  const { searchParams } = new URL(req.url);
  const query = (searchParams.get("q") || "").trim();

  if (query.length < 2) {
    return NextResponse.json(
      { error: "Ingresá al menos 2 caracteres." },
      { status: 400 }
    );
  }

  try {
    const result = await compare({ query, limit: 12 });
    // No cachear: cada búsqueda debe traer datos frescos y evitar que quede
    // "pegado" el resultado de una búsqueda anterior (CDN / browser).
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "CDN-Cache-Control": "no-store",
        "Netlify-CDN-Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("compare error", error);
    return NextResponse.json(
      { error: "No pudimos completar la búsqueda. Intentá de nuevo." },
      { status: 500 }
    );
  }
}
