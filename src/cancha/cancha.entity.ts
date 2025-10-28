export interface Cancha {
  id_cancha: number;
  nombre: string;
  estado: 'disponible' | 'ocupada' | 'mantenimiento'
  id_tipo: number;
}

export interface CanchaCreate {
  nombre: string;
  estado: string;
  id_tipo: number;
}

export interface CanchaUpdate {
  nombre?: string;
  estado?: string;
  id_tipo?: number;
}