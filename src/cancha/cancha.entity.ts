export interface Cancha {
  id_cancha: number;
  nombre: string;
  estado: 'disponible' | 'ocupada' | 'mantenimiento';
  id_tipo: number;
  id_localidad: number;
  precio: number;
  hora_apertura: string; // formato HH:MM:SS
  hora_cierre: string;   // formato HH:MM:SS
}

export interface CanchaCreate {
  nombre: string;
  estado?: 'disponible' | 'ocupada' | 'mantenimiento';
  id_tipo: number;
  id_localidad: number;
  precio: number;
  hora_apertura?: string;
  hora_cierre?: string;
}

export interface CanchaUpdate {  
  nombre?: string;
  estado?: 'disponible' | 'ocupada' | 'mantenimiento';
  id_tipo?: number;
  id_localidad?: number;
  precio?: number;
  hora_apertura?: string;
  hora_cierre?: string;
}

export interface DisponibilidadRequest {
  id_cancha: number;
  fecha: string; // formato YYYY-MM-DD
}

export interface FranjaHoraria {
  hora_inicio: string;
  hora_fin: string;
  disponible: boolean;
  reserva_id?: number;
}