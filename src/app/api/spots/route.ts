import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SpotsState = {
  vagas: boolean[];
  updatedAt: string | null;
};

const globalForSpots = globalThis as unknown as { __spots?: SpotsState };

if (!globalForSpots.__spots) {
  globalForSpots.__spots = { vagas: [], updatedAt: null };
}

export async function GET() {
  return NextResponse.json(globalForSpots.__spots, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Corpo da requisição deve ser JSON válido." },
      { status: 400 }
    );
  }

  const vagas = (body as { vagas?: unknown })?.vagas;

  if (
    !Array.isArray(vagas) ||
    vagas.some((v) => typeof v !== "boolean")
  ) {
    return NextResponse.json(
      {
        error:
          'Payload inválido. Esperado { "vagas": boolean[] } (true = livre, false = ocupada).',
      },
      { status: 400 }
    );
  }

  globalForSpots.__spots = {
    vagas: vagas as boolean[],
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({ ok: true, count: vagas.length });
}
