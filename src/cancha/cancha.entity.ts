export interface Cancha {
  id: number;
  nombre: string;
  id_tipo: number;
  id_localidad: number;
  precio: number;
}

export interface CanchaCreate {
  nombre: string;
  id_tipo: number;
  id_localidad: number;
  precio: number;
}

export interface CanchaUpdate {
  nombre?: string;
  id_tipo?: number;
  id_localidad?: number;
  precio?: number;
}
