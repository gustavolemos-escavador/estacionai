import { Request, Response } from "express";
import { sendParkingNotification } from "../services/slack.service";

// In-memory state — persists for the lifetime of the process
interface SpotState {
  vagas: boolean[];
  updatedAt: string;
}

let currentState: SpotState | null = null;

// POST /api/spots/update  (legacy manual endpoint)
export async function updateSpots(req: Request, res: Response): Promise<void> {
  const { free, total, sector } = req.body as {
    free?: unknown;
    total?: unknown;
    sector?: unknown;
  };

  if (typeof free !== "number" || typeof total !== "number") {
    res.status(400).json({ message: "Campos obrigatórios: free (number), total (number)." });
    return;
  }

  if (free < 0 || total < 0 || free > total) {
    res.status(422).json({ message: "Valores inválidos: free deve ser >= 0 e <= total." });
    return;
  }

  const sectorStr = typeof sector === "string" ? sector : undefined;

  try {
    await sendParkingNotification(free, total, sectorStr);
    res.json({ message: "Notificação enviada com sucesso.", free, total, sector: sectorStr });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao enviar notificação Slack.";
    res.status(502).json({ message });
  }
}

// POST /api/spots/hardware  (ESP32 payload)
// Body: { "vagas": [true, false, true, ...] }
//   true  = vaga DISPONÍVEL
//   false = vaga OCUPADA
export async function hardwareUpdate(req: Request, res: Response): Promise<void> {
  const { vagas } = req.body as { vagas?: unknown };

  if (
    !Array.isArray(vagas) ||
    vagas.length === 0 ||
    !vagas.every((v) => typeof v === "boolean")
  ) {
    res.status(400).json({
      message: 'Campo obrigatório: "vagas" deve ser um array não-vazio de booleanos.',
    });
    return;
  }

  const spots = vagas as boolean[];
  const total = spots.length;
  const free = spots.filter(Boolean).length;

  currentState = { vagas: spots, updatedAt: new Date().toISOString() };

  try {
    await sendParkingNotification(free, total);
  } catch {
    // Notificação Slack é best-effort; não bloqueia a resposta ao hardware
  }

  res.json({ message: "Estado atualizado.", total, free, occupied: total - free, vagas: spots });
}

// GET /api/spots/status  (leitura pelo frontend)
export function getStatus(_req: Request, res: Response): void {
  if (!currentState) {
    res.status(404).json({ message: "Nenhum dado recebido do hardware ainda." });
    return;
  }

  const { vagas, updatedAt } = currentState;
  const total = vagas.length;
  const free = vagas.filter(Boolean).length;

  res.json({ total, free, occupied: total - free, vagas, updatedAt });
}
