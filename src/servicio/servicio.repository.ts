import { pool } from '../database/connection.js';
import { ResultSetHeader } from 'mysql2';
import { Servicio, ServicioCreate, ServicioUpdate } from './servicio.entity.js';

export class ServicioRepository {
  async findAll(): Promise<Servicio[]> {
    const [rows] = await pool.query('SELECT * FROM servicio');
    return rows as Servicio[];
  }

  async findById(id_servicio: number): Promise<Servicio | null> {
    const [rows] = await pool.query('SELECT * FROM servicio WHERE id_servicio = ?', [id_servicio]);
    const [servicio] = rows as Servicio[];
    return servicio || null;
  }

  async create(data: ServicioCreate): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO servicio (nombre, precio_servicio) VALUES (?, ?)',
      [data.nombre, data.precio_servicio]
    );
    return result.insertId;
  }

  async update(id_servicio: number, data: ServicioUpdate): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.nombre !== undefined) {
      fields.push('nombre = ?');
      values.push(data.nombre);
    }
    if (data.precio_servicio !== undefined) {
      fields.push('precio_servicio = ?');
      values.push(data.precio_servicio);
    }

    if (fields.length === 0) return;

    values.push(id_servicio);
    await pool.query(`UPDATE servicio SET ${fields.join(', ')} WHERE id_servicio = ?`, values);
  }

  async delete(id_servicio: number): Promise<void> {
    await pool.query('DELETE FROM servicio WHERE id_servicio = ?', [id_servicio]);
  }

  // 🔗 Relación con reservas
  async asignarAReserva(id_reserva: number, id_servicios: number[]): Promise<void> {
    if (id_servicios.length === 0) return;

    const values = id_servicios.map((id) => [id_reserva, id]);
    await pool.query('INSERT INTO reserva_servicio (id_reserva, id_servicio) VALUES ?', [values]);
  }

  async obtenerPorReserva(id_reserva: number): Promise<Servicio[]> {
    const [rows] = await pool.query(
      `SELECT s.* 
       FROM servicio s
       INNER JOIN reserva_servicio rs ON s.id_servicio = rs.id_servicio
       WHERE rs.id_reserva = ?`,
      [id_reserva]
    );
    return rows as Servicio[];
  }
}