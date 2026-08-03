import { NextResponse } from "next/server";
import { refreshPrices } from "@/lib/price-index";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Cron: guarda un snapshot de precios de todos los materiales. Lo dispara la
// Scheduled Function de Netlify (o cualquier cron externo) con el secret.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const { searchParams } = new URL(req.url);
  const provided =
    searchParams.get("secret") ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const result = await refreshPrices();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("refresh-prices error", error);
    return NextResponse.json({ error: "Fallo el refresh." }, { status: 500 });
  }
}
