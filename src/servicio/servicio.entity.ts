export interface Servicio {
  id_servicio: number;
  nombre: string;
  precio: number;
}

export interface ServicioCreate {
  nombre: string;
  precio: number;
}

export interface ServicioUpdate {
  nombre?: string;
  precio?: number;
}

export interface ReservaServicio {
  id_reserva: number;
  id_servicio: number;
}
