import { Cancha, FranjaHoraria } from '../cancha/cancha.entity';

export interface CanchaConDisponibilidad extends Cancha {
  tipo_nombre?: string;      // Nombre del deporte
  localidad_nombre?: string; // Nombre de la localidad
  horarios_disponibles: FranjaHoraria[];
}

export interface BusquedaRequest {
  fecha: string;
  id_tipo?: number;
  id_localidad?: number;
}