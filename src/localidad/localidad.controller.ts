import { Request, Response } from 'express';
import { LocalidadService } from './localidad';

export class LocalidadController {
  constructor(private service: LocalidadService) {}

  // POST /api/localidades
  crear = async (req: Request, res: Response): Promise<void> => {
    try {
      const localidad = this.service.crearLocalidad(req.body);
      res.status(201).json({
        success: true,
        data: localidad,
        message: 'Localidad creada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al crear localidad'
      });
    }
  };

  // GET /api/localidades
  obtenerTodas = async (req: Request, res: Response): Promise<void> => {
    try {
      const localidades = this.service.obtenerTodas();
      res.status(200).json({
        success: true,
        data: localidades
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener localidades'
      });
    }
  };

  // GET /api/localidades/:id
  obtenerPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const localidad = this.service.obtenerPorId(id);
      res.status(200).json({
        success: true,
        data: localidad
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Localidad no encontrada'
      });
    }
  };

  // PUT /api/localidades/:id
  actualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const localidad = this.service.actualizarLocalidad(id, req.body);
      res.status(200).json({
        success: true,
        data: localidad,
        message: 'Localidad actualizada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al actualizar localidad'
      });
    }
  };

  // DELETE /api/localidades/:id
  eliminar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      this.service.eliminarLocalidad(id);
      res.status(200).json({
        success: true,
        message: 'Localidad eliminada exitosamente'
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Localidad no encontrada'
      });
    }
  };
}