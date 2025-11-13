export interface Servicio {
  id_servicio: number;
  nombre: string;
  precio_servicio: number;
}

export interface ServicioCreate {
  nombre: string;
  precio_servicio: number;
}

export interface ServicioUpdate {
  nombre?: string;
  precio_servicio?: number;
}

export interface ReservaServicio {
  id_reserva: number;
  id_servicio: number;
}
