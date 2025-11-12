import { DisponibilidadService } from '../disponibilidad/disponibilidad.service';
import { CanchaRepository } from '../cancha/cancha.repository';
import { pool } from '../database/connection';
import { RowDataPacket } from 'mysql2';
import { CanchaConDisponibilidad } from './busqueda-cancha.entity';

export class BusquedaCanchaService {
  private disponibilidadService: DisponibilidadService;

  constructor(private canchaRepository: CanchaRepository) {
    this.disponibilidadService = new DisponibilidadService(canchaRepository);
  }

  async buscarCanchasDisponibles(
    fecha: string,
    id_tipo?: number,
    id_localidad?: number
  ): Promise<CanchaConDisponibilidad[]> {
    // 1. Query con JOIN para obtener nombres de tipo y localidad
    let query = `
      SELECT 
        c.*,
        tc.deporte as tipo_nombre,
        l.nombre as localidad_nombre
      FROM cancha c
      LEFT JOIN tipo_cancha tc ON c.id_tipo = tc.id_tipo
      LEFT JOIN localidad l ON c.id_localidad = l.id
      WHERE c.estado = 'disponible'
    `;
    
    const params: any[] = [];

    if (id_tipo) {
      query += ' AND c.id_tipo = ?';
      params.push(id_tipo);
    }

    if (id_localidad) {
      query += ' AND c.id_localidad = ?';
      params.push(id_localidad);
    }

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    const canchas = rows as any[];

    // 2. Para cada cancha, obtener horarios disponibles
    const canchasConDisponibilidad: CanchaConDisponibilidad[] = [];

    for (const cancha of canchas) {
      try {
        const horarios = await this.disponibilidadService.obtenerHorariosDisponibles({
          id_cancha: cancha.id_cancha,
          fecha
        });

        // Solo incluir canchas con al menos 1 horario disponible
        const tieneDisponibilidad = horarios.some(h => h.disponible);
        
        if (tieneDisponibilidad) {
          canchasConDisponibilidad.push({
            id_cancha: cancha.id_cancha,
            nombre: cancha.nombre,
            estado: cancha.estado,
            id_tipo: cancha.id_tipo,
            id_localidad: cancha.id_localidad,
            precio: cancha.precio,
            hora_apertura: cancha.hora_apertura,
            hora_cierre: cancha.hora_cierre,
            tipo_nombre: cancha.tipo_nombre,
            localidad_nombre: cancha.localidad_nombre,
            horarios_disponibles: horarios
          });
        }
      } catch (error) {
        console.error(`Error obteniendo disponibilidad para cancha ${cancha.id_cancha}:`, error);
      }
    }

    return canchasConDisponibilidad;
  }
}