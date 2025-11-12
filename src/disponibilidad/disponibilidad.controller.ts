import { Request, Response } from 'express';
import { DisponibilidadService } from './disponibilidad.service';
import { CanchaRepository } from '../cancha/cancha.repository';

const canchaRepository = new CanchaRepository();
const service = new DisponibilidadService(canchaRepository);

export async function obtenerDisponibilidad(req: Request, res: Response) {
  try {
    const { id_cancha, fecha } = req.params;
    
    if (!fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Formato de fecha inválido. Use YYYY-MM-DD' 
      });
    }

    const franjas = await service.obtenerHorariosDisponibles({
      id_cancha: Number(id_cancha),
      fecha
    });

    res.json({ success: true, data: franjas });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function verificarDisponibilidad(req: Request, res: Response) {
  try {
    const { id_cancha, fecha, hora_inicio, hora_fin } = req.body;
    
    if (!id_cancha || !fecha || !hora_inicio || !hora_fin) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: id_cancha, fecha, hora_inicio, hora_fin'
      });
    }

    const disponible = await service.verificarDisponibilidad(
      id_cancha,
      fecha,
      hora_inicio,
      hora_fin
    );

    res.json({ success: true, data: { disponible } });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}