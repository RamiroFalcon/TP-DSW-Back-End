export interface Cancha {
  id_cancha: number;
  nombre: string;
  estado: 'disponible' | 'ocupada' | 'mantenimiento';
  id_tipo: number;
  id_localidad: number;
  precio_hora?: number; // ⬅️ USAR precio_hora como en la BD
  hora_apertura: string;
  hora_cierre: string;
}

export interface CanchaCreate {
  nombre: string;
  estado?: 'disponible' | 'ocupada' | 'mantenimiento';
  id_tipo: number;
  id_localidad: number;
  precio_hora?: number;
  hora_apertura?: string;
  hora_cierre?: string;
}

export interface CanchaUpdate {
  nombre?: string;
  estado?: 'disponible' | 'ocupada' | 'mantenimiento';
  id_tipo?: number;
  id_localidad?: number;
  precio_hora?: number;
  hora_apertura?: string;
  hora_cierre?: string;
}

export interface DisponibilidadRequest {
  id_cancha: number;
  fecha: string;
}

export interface FranjaHoraria {
  hora_inicio: string;
  hora_fin: string;
  disponible: boolean;
  reserva_id?: number;
}