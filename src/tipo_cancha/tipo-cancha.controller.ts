import { Request, Response } from 'express';
import { TipoCanchaService } from './tipo-cancha';

export class TipoCanchaController {
  constructor(private service: TipoCanchaService) {}

  crear = async (req: Request, res: Response): Promise<void> => {
    try {
      const tipoCancha = this.service.crearTipoCancha(req.body);
      res.status(201).json({
        success: true,
        data: tipoCancha,
        message: 'Tipo de cancha creado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al crear tipo de cancha'
      });
    }
  };

  obtenerTodos = async (req: Request, res: Response): Promise<void> => {
    try {
      const tipos = this.service.obtenerTodos();
      res.status(200).json({
        success: true,
        data: tipos
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener tipos de cancha'
      });
    }
  };

  obtenerPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const tipo = this.service.obtenerPorId(id);
      res.status(200).json({
        success: true,
        data: tipo
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Tipo de cancha no encontrado'
      });
    }
  };

  actualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const tipo = this.service.actualizarTipoCancha(id, req.body);
      res.status(200).json({
        success: true,
        data: tipo,
        message: 'Tipo de cancha actualizado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al actualizar tipo de cancha'
      });
    }
  };

  eliminar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      this.service.eliminarTipoCancha(id);
      res.status(200).json({
        success: true,
        message: 'Tipo de cancha eliminado exitosamente'
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Tipo de cancha no encontrado'
      });
    }
  };
}