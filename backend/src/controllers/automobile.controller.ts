import { AutomobileType, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export async function listAutomobiles(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;

  const automobiles = await prisma.automobile.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  res.json(automobiles);
}

export async function createAutomobile(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;
  const { model, plate, type } = req.body as {
    model?: string;
    plate?: string;
    type?: string;
  };

  if (!model || !plate || !type) {
    res.status(400).json({ message: "Campos obrigatórios: model, plate, type (CAR | MOTORCYCLE)." });
    return;
  }

  const normalizedType = type.toUpperCase();
  if (normalizedType !== "CAR" && normalizedType !== "MOTORCYCLE") {
    res.status(400).json({ message: "O campo type deve ser CAR ou MOTORCYCLE." });
    return;
  }

  const existing = await prisma.automobile.findUnique({ where: { plate } });
  if (existing) {
    res.status(409).json({ message: "Placa já cadastrada." });
    return;
  }

  const automobile = await prisma.automobile.create({
    data: {
      model,
      plate: plate.toUpperCase(),
      type: normalizedType as AutomobileType,
      userId,
    },
  });

  res.status(201).json(automobile);
}

export async function deleteAutomobile(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;
  const id = req.params["id"] as string;

  const automobile = await prisma.automobile.findUnique({ where: { id } });

  if (!automobile) {
    res.status(404).json({ message: "Automóvel não encontrado." });
    return;
  }

  if (automobile.userId !== userId) {
    res.status(403).json({ message: "Acesso negado." });
    return;
  }

  await prisma.automobile.delete({ where: { id } });
  res.status(204).send();
}
