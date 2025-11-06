export interface Precio {
  id_precio: number;     // PK
  id_cancha: number;     // FK → cancha.id_cancha
  valor_por_hora: number;
  fecha_vigencia: string; // fecha desde la cual este precio es válido (YYYY-MM-DD)
}

export interface PrecioCreate {
  id_cancha: number;
  valor_por_hora: number;
  fecha_vigencia: string;
}
