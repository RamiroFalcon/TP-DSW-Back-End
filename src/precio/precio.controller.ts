import { Request, Response } from 'express';
import { PrecioService } from '../precio/precio';

export class PrecioController {
  private service: PrecioService;

  constructor() {
    this.service = new PrecioService();
  }

  async crear(req: Request, res: Response): Promise<void> {
    try {
      const id = await this.service.crear(req.body);
      res.status(201).json({ success: true, id });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async obtenerPorCancha(req: Request, res: Response): Promise<void> {
    try {
      const id_cancha = parseInt(req.params.id_cancha);
      const precios = await this.service.obtenerPorCancha(id_cancha);
      res.status(200).json({ success: true, data: precios });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async obtenerPrecioActual(req: Request, res: Response): Promise<void> {
    try {
      const id_cancha = parseInt(req.params.id_cancha);
      const precio = await this.service.obtenerPrecioActual(id_cancha);
      res.status(200).json({ success: true, data: precio });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async actualizar(req: Request, res: Response): Promise<void> {
    try {
      const id_precio = parseInt(req.params.id_precio);
      const { valor_por_hora } = req.body;
      await this.service.actualizar(id_precio, valor_por_hora);
      res.status(200).json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async eliminar(req: Request, res: Response): Promise<void> {
    try {
      const id_precio = parseInt(req.params.id_precio);
      await this.service.eliminar(id_precio);
      res.status(200).json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
