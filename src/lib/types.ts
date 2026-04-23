export type SpotStatus = "free" | "occupied" | "reserved" | "ev";

export interface ParkingSpot {
  id: string;
  label: string;
  row: number;
  col: number;
  status: SpotStatus;
  sector: string;
}

export interface ParkingSector {
  id: string;
  name: string;
  total: number;
  free: number;
  occupied: number;
  reserved: number;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  type: "info" | "warning" | "success" | "alert";
  read: boolean;
}

export interface HistoricalPoint {
  time: string;
  occupancy: number;
  revenue: number;
  avgStayMinutes: number;
}

export interface KpiCard {
  label: string;
  value: string;
  delta: number;
  hint?: string;
}
