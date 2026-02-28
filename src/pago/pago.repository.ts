import { pool } from '../database/connection.js';
import { Pago, PagoCreate, PagoUpdate } from './pago.entity.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class PagoRepository {
  async create(data: PagoCreate): Promise<Pago> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO pago (id_reserva, monto, estado, metodo_pago, fecha_creacion, fecha_actualizacion) 
       VALUES (?, ?, 'pendiente', ?, NOW(), NOW())`,
      [data.id_reserva, data.monto, data.metodo_pago || 'tarjeta']
    );

    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM pago WHERE id_pago = ?',
      [result.insertId]
    );

    return rows[0] as Pago;
  }

  async findById(id_pago: number): Promise<Pago | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM pago WHERE id_pago = ?',
      [id_pago]
    );
    return rows.length ? (rows[0] as Pago) : null;
  }

  async findByReserva(id_reserva: number): Promise<Pago | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM pago WHERE id_reserva = ? ORDER BY fecha_creacion DESC LIMIT 1',
      [id_reserva]
    );
    return rows.length ? (rows[0] as Pago) : null;
  }

  async update(id_pago: number, data: PagoUpdate): Promise<Pago> {
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE pago SET estado = ?, transaccion_id = ?, fecha_actualizacion = NOW() 
       WHERE id_pago = ?`,
      [data.estado, data.transaccion_id, id_pago]
    );

    if (result.affectedRows === 0) {
      throw new Error('Pago no encontrado');
    }

    const pago = await this.findById(id_pago);
    if (!pago) throw new Error('Pago no encontrado después de actualizar');
    
    return pago;
  }

  async updateEstadoByReserva(id_reserva: number, estado: Pago['estado']): Promise<void> {
    await pool.query(
      'UPDATE pago SET estado = ?, fecha_actualizacion = NOW() WHERE id_reserva = ?',
      [estado, id_reserva]
    );
  }
}