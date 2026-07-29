import { NextResponse } from "next/server";
import { compare } from "@/lib/providers/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
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
    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200" },
    });
  } catch (error) {
    console.error("compare error", error);
    return NextResponse.json(
      { error: "No pudimos completar la búsqueda. Intentá de nuevo." },
      { status: 500 }
    );
  }
}
