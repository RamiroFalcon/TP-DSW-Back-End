export interface Reserva {
  id_reserva: number;
  id_usuario: number;
  id_cancha: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  precio_total: number;
}

export interface ReservaCreate {
  id_usuario: number;
  id_cancha: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  precio_total: number;
  id_servicios?: number[]; // opcional
}

export interface ReservaUpdate {
  id_reserva: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  precio_total: number;
}
