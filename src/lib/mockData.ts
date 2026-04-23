import type {
  HistoricalPoint,
  KpiCard,
  Notification,
  ParkingSector,
  ParkingSpot,
} from "./types";

const SECTORS = ["A", "B", "C", "D"] as const;

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function buildSpots(): ParkingSpot[] {
  const rnd = seededRandom(7);
  const spots: ParkingSpot[] = [];
  SECTORS.forEach((sector, sIdx) => {
    const rows = 4;
    const cols = 10;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const roll = rnd();
        let status: ParkingSpot["status"] = "free";
        if (roll < 0.45) status = "occupied";
        else if (roll < 0.55) status = "reserved";
        else if (roll < 0.6) status = "ev";
        spots.push({
          id: `${sector}-${r}-${c}`,
          label: `${sector}${(sIdx * rows * cols + r * cols + c + 1)
            .toString()
            .padStart(3, "0")}`,
          row: r,
          col: c,
          status,
          sector,
        });
      }
    }
  });
  return spots;
}

export function buildSectors(spots: ParkingSpot[]): ParkingSector[] {
  return SECTORS.map((id) => {
    const ofSector = spots.filter((s) => s.sector === id);
    const free = ofSector.filter((s) => s.status === "free" || s.status === "ev")
      .length;
    const occupied = ofSector.filter((s) => s.status === "occupied").length;
    const reserved = ofSector.filter((s) => s.status === "reserved").length;
    return {
      id,
      name: `Setor ${id}`,
      total: ofSector.length,
      free,
      occupied,
      reserved,
    };
  });
}

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    title: "Vaga liberada perto da entrada",
    body: "A vaga A007 ficou disponível no Setor A — entrada norte.",
    time: "agora",
    type: "success",
    read: false,
  },
  {
    id: "n2",
    title: "Ocupação acima da média",
    body: "Setor C está com 92% de ocupação. Considere redirecionar tráfego.",
    time: "há 3 min",
    type: "warning",
    read: false,
  },
  {
    id: "n3",
    title: "Reserva confirmada",
    body: "Sua reserva para B012 foi confirmada até 18:30.",
    time: "há 12 min",
    type: "info",
    read: false,
  },
  {
    id: "n4",
    title: "Anomalia detectada",
    body: "Sensor do Setor D relatou instabilidade. Equipe de manutenção notificada.",
    time: "há 1 h",
    type: "alert",
    read: true,
  },
  {
    id: "n5",
    title: "Relatório semanal pronto",
    body: "Seu relatório da semana 16 já está disponível na aba Relatórios.",
    time: "ontem",
    type: "info",
    read: true,
  },
  {
    id: "n6",
    title: "Carregador EV disponível",
    body: "Ponto de recarga no Setor A está livre agora.",
    time: "ontem",
    type: "success",
    read: true,
  },
];

export function buildHistorical(): HistoricalPoint[] {
  const hours = [
    "06h",
    "08h",
    "10h",
    "12h",
    "14h",
    "16h",
    "18h",
    "20h",
    "22h",
  ];
  const rnd = seededRandom(42);
  return hours.map((h) => {
    const occ = Math.round(30 + rnd() * 65);
    return {
      time: h,
      occupancy: occ,
      revenue: Math.round(300 + rnd() * 1500),
      avgStayMinutes: Math.round(35 + rnd() * 90),
    };
  });
}

export function buildKpis(sectors: ParkingSector[]): KpiCard[] {
  const total = sectors.reduce((a, s) => a + s.total, 0);
  const free = sectors.reduce((a, s) => a + s.free, 0);
  const occupied = sectors.reduce((a, s) => a + s.occupied, 0);
  const occupancy = Math.round((occupied / total) * 100);
  return [
    {
      label: "Vagas livres",
      value: String(free),
      delta: 4.2,
      hint: `de ${total} no total`,
    },
    {
      label: "Ocupação",
      value: `${occupancy}%`,
      delta: -2.1,
      hint: "em relação a ontem",
    },
    {
      label: "Tempo médio",
      value: "1h 12m",
      delta: 1.5,
      hint: "permanência",
    },
    {
      label: "Faturamento do dia",
      value: "R$ 4.820",
      delta: 8.9,
      hint: "vs média semanal",
    },
  ];
}
