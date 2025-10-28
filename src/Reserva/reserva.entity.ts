export interface Reserva {
  id_reserva: number;
  id_cancha: number;
  id_cliente: number;
  fecha: string; // formato: YYYY-MM-DD
  hora_inicio: string; // formato: HH:MM
  hora_fin: string; // formato: HH:MM
}

export interface ReservaCreate {
  id_cancha: number;
  id_cliente: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
}

export interface ReservaUpdate {
  id_cancha?: number;
  id_cliente?: number;
  fecha?: string;
  hora_inicio?: string;
  hora_fin?: string;
}