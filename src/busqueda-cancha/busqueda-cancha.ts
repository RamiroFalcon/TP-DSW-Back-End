import { DisponibilidadService } from '../disponibilidad/disponibilidad.service.js';
import { CanchaRepository } from '../cancha/cancha.repository.js';
import { pool } from '../database/connection.js';
import { RowDataPacket } from 'mysql2';
import { CanchaConDisponibilidad } from './busqueda-cancha.entity.js';

export class BusquedaCanchaService {
  private disponibilidadService: DisponibilidadService;

  constructor(private canchaRepository: CanchaRepository) {
    this.disponibilidadService = new DisponibilidadService(canchaRepository);
  }

  async buscarCanchasPorNombre(
    deporte: string,
    localidad: string,
    fecha?: string
  ): Promise<CanchaConDisponibilidad[]> {
    console.log('🔍 Búsqueda por nombre:', { deporte, localidad, fecha });

    // Buscar IDs por nombres
    const [tipoRows] = await pool.query<RowDataPacket[]>(
      'SELECT id_tipo FROM tipocancha WHERE deporte = ?',
      [deporte]
    );

    const [localidadRows] = await pool.query<RowDataPacket[]>(
      'SELECT id_localidad FROM localidad WHERE nombre = ?',
      [localidad]
    );

    console.log('📊 IDs encontrados:', {
      tipoRows: tipoRows,
      localidadRows: localidadRows
    });

    if (tipoRows.length === 0) {
      console.log('❌ No se encontró el deporte:', deporte);
      return [];
    }

    if (localidadRows.length === 0) {
      console.log('❌ No se encontró la localidad:', localidad);
      return [];
    }

    const id_tipo = tipoRows[0].id_tipo;
    const id_localidad = localidadRows[0].id_localidad;

    console.log('🎯 Buscando con IDs:', { id_tipo, id_localidad });

    // Ahora buscar canchas con esos IDs
    return await this.buscarCanchasDisponibles(
      fecha || new Date().toISOString().split('T')[0],
      id_tipo,
      id_localidad
    );
  }

  async buscarCanchasDisponibles(
    fecha: string,
    id_tipo?: number,
    id_localidad?: number
  ): Promise<CanchaConDisponibilidad[]> {
    console.log('🔍 Búsqueda por IDs:', { fecha, id_tipo, id_localidad });

    // Query con JOIN para obtener nombres
    let query = `
      SELECT 
        c.id_cancha,
        c.nombre,
        c.estado,
        c.id_tipo,
        c.id_localidad,
        c.hora_apertura,
        c.hora_cierre,
        tc.deporte as tipo_nombre,
        l.nombre as localidad_nombre
      FROM cancha c
      LEFT JOIN tipocancha tc ON c.id_tipo = tc.id_tipo
      LEFT JOIN localidad l ON c.id_localidad = l.id_localidad
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

    console.log('📝 SQL Query:', query);
    console.log('📝 SQL Params:', params);

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    const canchas = rows as any[];

    console.log('📊 Canchas encontradas:', canchas);

    if (canchas.length === 0) {
      console.log('❌ No se encontraron canchas');
      return [];
    }

    // Para cada cancha, obtener horarios disponibles
    const canchasConDisponibilidad: CanchaConDisponibilidad[] = [];

    for (const cancha of canchas) {
      console.log('🏟️ Procesando cancha:', cancha);
      
      try {
        const horarios = await this.disponibilidadService.obtenerHorariosDisponibles({
          id_cancha: cancha.id_cancha,
          fecha
        });

        console.log('⏰ Horarios obtenidos:', horarios);

        // Incluir la cancha con sus horarios (disponibles o no)
        canchasConDisponibilidad.push({
          id_cancha: cancha.id_cancha,
          nombre: cancha.nombre,
          estado: cancha.estado,
          id_tipo: cancha.id_tipo,
          id_localidad: cancha.id_localidad,
          hora_apertura: cancha.hora_apertura,
          hora_cierre: cancha.hora_cierre,
          tipo_nombre: cancha.tipo_nombre,
          localidad_nombre: cancha.localidad_nombre,
          horarios_disponibles: horarios
        });

        console.log('✅ Cancha agregada:', canchasConDisponibilidad[canchasConDisponibilidad.length - 1]);
      } catch (error) {
        console.error(`❌ Error obteniendo disponibilidad para cancha ${cancha.id_cancha}:`, error);
        
        // Incluir la cancha sin horarios en caso de error
        canchasConDisponibilidad.push({
          id_cancha: cancha.id_cancha,
          nombre: cancha.nombre,
          estado: cancha.estado,
          id_tipo: cancha.id_tipo,
          id_localidad: cancha.id_localidad,
          hora_apertura: cancha.hora_apertura,
          hora_cierre: cancha.hora_cierre,
          tipo_nombre: cancha.tipo_nombre,
          localidad_nombre: cancha.localidad_nombre,
          horarios_disponibles: []
        });
      }
    }

    console.log('🎉 Resultado final:', canchasConDisponibilidad);
    return canchasConDisponibilidad;
  }
}