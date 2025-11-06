export interface TipoCancha {
  id_tipo: number;
  nombre: string;
  deporte: string;
}

export interface TipoCanchaCreate {
  nombre: string;
  deporte: string;
}

export interface TipoCanchaUpdate {
  nombre?: string;
  deporte?: string;
}