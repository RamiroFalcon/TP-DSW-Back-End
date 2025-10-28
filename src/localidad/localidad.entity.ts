export interface Localidad {
  id: number;
  nombre: string;
}

export interface LocalidadCreate {
  nombre: string;
}

export interface LocalidadUpdate {
  nombre?: string;
}