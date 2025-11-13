import { Request, Response } from 'express';
import { CanchaService } from './cancha';
import { pool } from '../database/connection'; // ✅ Agregar esta importación

export class CanchaController {
  constructor(private service: CanchaService) {}

  crear = async (req: Request, res: Response): Promise<void> => {
    try {
      const cancha = await this.service.crearCancha(req.body);
      res.status(201).json({
        success: true,
        data: cancha,
        message: 'Cancha creada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al crear cancha'
      });
    }
  };

  obtenerTodas = async (req: Request, res: Response): Promise<void> => {
    try {
      const canchas = await this.service.obtenerTodas();
      res.status(200).json({
        success: true,
        data: canchas
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener canchas'
      });
    }
  };

  obtenerPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const cancha = await this.service.obtenerPorId(id);
      res.status(200).json({
        success: true,
        data: cancha
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Cancha no encontrada'
      });
    }
  };

  obtenerPorTipo = async (req: Request, res: Response): Promise<void> => {
    try {
      const id_tipo = parseInt(req.params.id_tipo);
      const canchas = await this.service.obtenerPorTipo(id_tipo);
      res.status(200).json({
        success: true,
        data: canchas
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener canchas por tipo'
      });
    }
  };

  actualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const cancha = await this.service.actualizarCancha(id, req.body);
      res.status(200).json({
        success: true,
        data: cancha,
        message: 'Cancha actualizada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al actualizar cancha'
      });
    }
  };

  eliminar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      await this.service.eliminarCancha(id);
      res.status(200).json({
        success: true,
        message: 'Cancha eliminada exitosamente'
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Cancha no encontrada'
      });
    }
  };

 obtenerDisponibilidad = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fecha, id_localidad, id_tipo } = req.query;
    
    console.log(`🔍 Buscando disponibilidad - Fecha: ${fecha}, Localidad: ${id_localidad}, Tipo: ${id_tipo}`);
    
    // 1. Obtener todas las canchas que cumplan con los filtros
    let query = `
      SELECT c.*, l.nombre as localidad_nombre, t.nombre as tipo_nombre, t.deporte 
      FROM cancha c 
      LEFT JOIN localidad l ON c.id_localidad = l.id_localidad
      LEFT JOIN tipo_cancha t ON c.id_tipo = t.id_tipo
      WHERE c.estado = 'disponible'
    `;
    
    const params = [];
    
    if (id_localidad) {
      query += ' AND c.id_localidad = ?';
      params.push(id_localidad);
    }
    
    if (id_tipo) {
      query += ' AND c.id_tipo = ?';
      params.push(id_tipo);
    }
    
    const [canchas] = await pool.query(query, params);
    console.log(`🏟️ Canchas encontradas: ${(canchas as any[]).length}`);
    
    // 2. Para cada cancha, calcular horarios disponibles
    const canchasConDisponibilidad = await Promise.all(
      (canchas as any[]).map(async (cancha) => {
        // Obtener reservas existentes para esta cancha en la fecha específica
        const [reservas] = await pool.query(
          'SELECT hora_inicio, hora_fin FROM reserva WHERE id_cancha = ? AND fecha = ?',
          [cancha.id_cancha, fecha]
        );
        
        console.log(` Cancha ${cancha.nombre}: ${(reservas as any[]).length} reservas encontradas`);
        
        // 3. Calcular horarios disponibles basados en hora_apertura y hora_cierre
        const horariosOcupados = (reservas as any[]).map(r => ({
          inicio: r.hora_inicio,
          fin: r.hora_fin
        }));
        
        // Usar horarios de la cancha o valores por defecto
        const horaApertura = cancha.hora_apertura || '08:00:00';
        const horaCierre = cancha.hora_cierre || '22:00:00';
        
        const horariosDisponibles = this.calcularHorariosDisponibles(
          horaApertura, 
          horaCierre, 
          horariosOcupados
        );
        
        return {
          ...cancha,
          horarios_disponibles: horariosDisponibles,
          horarios_ocupados: horariosOcupados,
          total_reservas: horariosOcupados.length
        };
      })
    );
    
    res.json({ 
      success: true, 
      data: canchasConDisponibilidad,
      message: `Disponibilidad obtenida para ${canchasConDisponibilidad.length} canchas`
    });
    
  } catch (error: any) {
    console.error('❌ Error en obtenerDisponibilidad:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener disponibilidad: ' + error.message 
    });
  }
};


private calcularHorariosDisponibles(
  horaApertura: string, 
  horaCierre: string, 
  horariosOcupados: any[]
): string[] {
  const horariosDisponibles = [];
  
 
  const apertura = parseInt(horaApertura.split(':')[0]);
  const cierre = parseInt(horaCierre.split(':')[0]);
  
  console.log(`🕐 Calculando horarios de ${apertura}:00 a ${cierre}:00`);
  
  // Generar horarios cada hora desde apertura hasta cierre-1
  for (let hora = apertura; hora < cierre; hora++) {
    const horario = `${hora.toString().padStart(2, '0')}:00:00`;
    const horarioFin = `${(hora + 1).toString().padStart(2, '0')}:00:00`;
    
    // Verificar si el horario está ocupado
    const estaOcupado = horariosOcupados.some(ocupado => {
      // Si los horarios se superponen, está ocupado
      return !(horarioFin <= ocupado.inicio || horario >= ocupado.fin);
    });
    
    if (!estaOcupado) {
      horariosDisponibles.push(horario);
    }
  }
  
  console.log(`🕐 Horarios disponibles calculados: ${horariosDisponibles.length}`);
  return horariosDisponibles;
}
}