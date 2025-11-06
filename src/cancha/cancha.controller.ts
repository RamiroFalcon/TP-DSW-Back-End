import { Request, Response } from 'express';
import { CanchaService } from './cancha';

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
}
