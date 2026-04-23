import { Request, Response } from "express";
import { sendParkingNotification } from "../services/slack.service";

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
