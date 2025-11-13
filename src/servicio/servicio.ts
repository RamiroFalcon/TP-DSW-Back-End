import { ServicioRepository } from './servicio.repository';
import { ServicioCreate, ServicioUpdate } from './servicio.entity';
import { pool } from '../database/connection';

export class ServicioService {
  private repository: ServicioRepository;

  constructor() {
    this.repository = new ServicioRepository();
  }

  async obtenerTodos() {
    return this.repository.findAll();
  }

  async obtenerPorId(id_servicio: number) {
    const servicio = await this.repository.findById(id_servicio);
    if (!servicio) throw new Error('Servicio no encontrado');
    return servicio;
  }

  async crearServicio(data: ServicioCreate) {
    return this.repository.create(data);
  }

  async actualizarServicio(id_servicio: number, data: ServicioUpdate) {
    // 🔹 ACTUALIZAR PRECIO EN RESERVAS EXISTENTES - CORREGIDO: usar precio_servicio
    if (data.precio_servicio !== undefined) {
      // 1. Obtener el precio anterior
      const [oldPriceRows] = await pool.query('SELECT precio_servicio FROM servicio WHERE id_servicio = ?', [id_servicio]);
      const oldPrice = (oldPriceRows as any[])[0]?.precio_servicio;
      
      // 2. Actualizar el servicio
      await this.repository.update(id_servicio, data);
      
      // 3. Actualizar precio en reservas que tengan este servicio
      if (oldPrice !== undefined && data.precio_servicio !== undefined) {
        const diferencia = data.precio_servicio - oldPrice;
        
        // Actualizar precio_total en todas las reservas que tengan este servicio
        await pool.query(
          `UPDATE reserva r 
           JOIN reserva_servicio rs ON r.id_reserva = rs.id_reserva 
           SET r.precio_total = r.precio_total + ? 
           WHERE rs.id_servicio = ?`,
          [diferencia, id_servicio]
        );
      }
    } else {
      // Si no cambia el precio, actualizar normalmente
      await this.repository.update(id_servicio, data);
    }
    
    return { success: true, message: 'Servicio actualizado correctamente' };
  }

  async eliminarServicio(id_servicio: number) {
    // 🔹 ACTUALIZAR PRECIO EN RESERVAS ANTES DE ELIMINAR - CORREGIDO: usar precio_servicio
    // 1. Obtener el precio del servicio
    const [priceRows] = await pool.query('SELECT precio_servicio FROM servicio WHERE id_servicio = ?', [id_servicio]);
    const precio = (priceRows as any[])[0]?.precio_servicio;
    
    if (precio !== undefined) {
      // 2. Restar el precio de las reservas que tengan este servicio
      await pool.query(
        `UPDATE reserva r 
         JOIN reserva_servicio rs ON r.id_reserva = rs.id_reserva 
         SET r.precio_total = r.precio_total - ? 
         WHERE rs.id_servicio = ?`,
        [precio, id_servicio]
      );
    }
    
    // 3. Eliminar el servicio
    return this.repository.delete(id_servicio);
  }

  // 🔗 Para relación con reservas
  async asignarServiciosAReserva(id_reserva: number, id_servicios: number[]) {
    return this.repository.asignarAReserva(id_reserva, id_servicios);
  }

  async obtenerServiciosDeReserva(id_reserva: number) {
    return this.repository.obtenerPorReserva(id_reserva);
  }
}