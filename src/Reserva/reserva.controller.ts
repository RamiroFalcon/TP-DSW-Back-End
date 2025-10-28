import { Request, Response } from 'express';
import { ReservaService } from './reserva';

export class ReservaController {
  constructor(private service: ReservaService) {}

  crear = async (req: Request, res: Response): Promise<void> => {
    try {
      const reserva = this.service.crearReserva(req.body);
      res.status(201).json({
        success: true,
        data: reserva,
        message: 'Reserva creada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al crear reserva'
      });
    }
  };

  obtenerTodas = async (req: Request, res: Response): Promise<void> => {
    try {
      const reservas = this.service.obtenerTodas();
      res.status(200).json({
        success: true,
        data: reservas
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener reservas'
      });
    }
  };

  obtenerPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const reserva = this.service.obtenerPorId(id);
      res.status(200).json({
        success: true,
        data: reserva
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Reserva no encontrada'
      });
    }
  };

  obtenerPorCancha = async (req: Request, res: Response): Promise<void> => {
    try {
      const id_cancha = parseInt(req.params.id_cancha);
      const reservas = this.service.obtenerPorCancha(id_cancha);
      res.status(200).json({
        success: true,
        data: reservas
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener reservas por cancha'
      });
    }
  };

  obtenerPorCliente = async (req: Request, res: Response): Promise<void> => {
    try {
      const id_cliente = parseInt(req.params.id_cliente);
      const reservas = this.service.obtenerPorCliente(id_cliente);
      res.status(200).json({
        success: true,
        data: reservas
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener reservas por cliente'
      });
    }
  };

  obtenerPorFecha = async (req: Request, res: Response): Promise<void> => {
    try {
      const fecha = req.params.fecha;
      const reservas = this.service.obtenerPorFecha(fecha);
      res.status(200).json({
        success: true,
        data: reservas
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener reservas por fecha'
      });
    }
  };

  actualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const reserva = this.service.actualizarReserva(id, req.body);
      res.status(200).json({
        success: true,
        data: reserva,
        message: 'Reserva actualizada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al actualizar reserva'
      });
    }
  };

  eliminar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      this.service.eliminarReserva(id);
      res.status(200).json({
        success: true,
        message: 'Reserva eliminada exitosamente'
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Reserva no encontrada'
      });
    }
  };
}