import { Request, Response } from 'express';
import { LocalidadService } from './localidad.js';

export class LocalidadController {
  constructor(private service: LocalidadService) {}

  // POST /api/localidades
  crear = async (req: Request, res: Response): Promise<void> => {
    try {
      const localidad = await this.service.crearLocalidad(req.body); // ✅ Añade await
      res.status(201).json(localidad); // ✅ Devuelve directamente el array/objeto
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Error al crear localidad'
      });
    }
  };

  // GET /api/localidades
  obtenerTodas = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('🔍 Intentando obtener todas las localidades...');
      const localidades = await this.service.obtenerTodas(); // ✅ Añade await
      console.log('✅ Localidades obtenidas:', localidades);
      res.status(200).json(localidades); // ✅ Devuelve directamente el array
    } catch (error) {
      console.error('❌ Error al obtener localidades:', error);
      res.status(500).json({
        message: 'Error al obtener localidades',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };

  // GET /api/localidades/:id
  obtenerPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const localidad = await this.service.obtenerPorId(id); // ✅ Añade await
      res.status(200).json(localidad);
    } catch (error) {
      res.status(404).json({
        message: error instanceof Error ? error.message : 'Localidad no encontrada'
      });
    }
  };

  // PUT /api/localidades/:id
  actualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const localidad = await this.service.actualizarLocalidad(id, req.body); // ✅ Añade await
      res.status(200).json(localidad);
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Error al actualizar localidad'
      });
    }
  };

  // DELETE /api/localidades/:id
  eliminar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      await this.service.eliminarLocalidad(id); // ✅ Añade await
      res.status(200).json({ message: 'Localidad eliminada exitosamente' });
    } catch (error) {
      res.status(404).json({
        message: error instanceof Error ? error.message : 'Localidad no encontrada'
      });
    }
  };
}