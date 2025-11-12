import { Request, Response } from 'express';
import { BusquedaCanchaService } from './busqueda-cancha';
import { CanchaRepository } from '../cancha/cancha.repository';

const canchaRepository = new CanchaRepository();
const service = new BusquedaCanchaService(canchaRepository);

export async function buscarCanchas(req: Request, res: Response) {
  try {
    const { fecha, id_tipo, id_localidad } = req.query;

    // Validar fecha requerida
    if (!fecha) {
      return res.status(400).json({
        success: false,
        message: 'La fecha es requerida'
      });
    }

    // Validar formato de fecha
    if (!String(fecha).match(/^\d{4}-\d{2}-\d{2}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de fecha inválido. Use YYYY-MM-DD'
      });
    }

    const canchas = await service.buscarCanchasDisponibles(
      String(fecha),
      id_tipo ? Number(id_tipo) : undefined,
      id_localidad ? Number(id_localidad) : undefined
    );

    res.json({
      success: true,
      data: {
        fecha: fecha,
        filtros: {
          id_tipo: id_tipo || null,
          id_localidad: id_localidad || null
        },
        total_canchas: canchas.length,
        canchas
      }
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}