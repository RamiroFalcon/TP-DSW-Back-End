import { pool } from '../database/connection';
import { ResultSetHeader } from 'mysql2';
import { ReservaServicio, ReservaServicioCreate } from './reserva-servicio.entity.js';

export class ReservaServicioRepository {
  async agregar(data: ReservaServicioCreate): Promise<void> {
    await pool.query<ResultSetHeader>(
      'INSERT INTO reserva_servicio (id_reserva, id_servicio) VALUES (?, ?)',
      [data.id_reserva, data.id_servicio]
    );
  }

  async eliminar(id_reserva: number, id_servicio: number): Promise<void> {
    await pool.query('DELETE FROM reserva_servicio WHERE id_reserva = ? AND id_servicio = ?', [
      id_reserva,
      id_servicio
    ]);
  }

  async eliminarTodosPorReserva(id_reserva: number): Promise<void> {
    await pool.query('DELETE FROM reserva_servicio WHERE id_reserva = ?', [id_reserva]);
  }

  async obtenerPorReserva(id_reserva: number): Promise<any[]> {
    const [rows] = await pool.query(
      `SELECT s.id_servicio, s.nombre, s.precio 
       FROM reserva_servicio rs
       JOIN servicio s ON rs.id_servicio = s.id_servicio
       WHERE rs.id_reserva = ?`,
      [id_reserva]
    );
    return rows as any[];
  }
}
