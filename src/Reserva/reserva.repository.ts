import { pool } from '../database/connection';
import { Reserva, ReservaCreate, ReservaUpdate } from './reserva.entity';
import { ResultSetHeader } from 'mysql2';

export class ReservaRepository {
 
  async findAll(): Promise<Reserva[]> {
    const [rows] = await pool.query('SELECT * FROM reserva');
    return rows as Reserva[];
  }


  async findByIdReserva(id_reserva: number): Promise<Reserva | null> {
    const [rows] = await pool.query('SELECT * FROM reserva WHERE id_reserva = ?', [id_reserva]);
    const result = rows as Reserva[];
    return result.length > 0 ? result[0] : null;
  }


  async findByUsuario(id_usuario: number): Promise<Reserva[]> {
    const [rows] = await pool.query('SELECT * FROM reserva WHERE id_usuario = ?', [id_usuario]);
    return rows as Reserva[];
  }

  
  async findByCancha(id_cancha: number): Promise<Reserva[]> {
    const [rows] = await pool.query('SELECT * FROM reserva WHERE id_cancha = ?', [id_cancha]);
    return rows as Reserva[];
  }

 
  async findByFecha(fecha: string): Promise<Reserva[]> {
    const [rows] = await pool.query('SELECT * FROM reserva WHERE fecha = ?', [fecha]);
    return rows as Reserva[];
  }

  
  async findByRangoFecha(fecha_inicio: string, fecha_fin: string): Promise<any[]> {
    const [rows] = await pool.query(
      `
      SELECT 
        c.id_cancha,
        r.hora_inicio,
        r.hora_fin,
        u.nombre AS nombre_cliente,
        u.apellido AS apellido_cliente
      FROM reserva r
      JOIN cancha c ON r.id_cancha = c.id_cancha
      JOIN usuario u ON r.id_usuario = u.id_usuario
      WHERE r.fecha BETWEEN ? AND ?
      ORDER BY r.fecha, r.hora_inicio
      `,
      [fecha_inicio, fecha_fin]
    );
    return rows as any[];
  }

  async create(data: ReservaCreate): Promise<Reserva> {
    const { id_usuario, id_cancha, fecha, hora_inicio, hora_fin, precio_total } = data;
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO reserva (id_usuario, id_cancha, fecha, hora_inicio, hora_fin, precio_total) VALUES (?, ?, ?, ?, ?, ?)',
      [id_usuario, id_cancha, fecha, hora_inicio, hora_fin, precio_total]
    );
    const id_reserva = result.insertId;

   
    if (data.id_servicios && data.id_servicios.length > 0) {
      for (const id_servicio of data.id_servicios) {
        await pool.query('INSERT INTO reserva_servicio (id_reserva, id_servicio) VALUES (?, ?)', [id_reserva, id_servicio]);
      }
    }

    return { id_reserva, ...data };
  }


  async actualizar(reserva: Reserva): Promise<Reserva> {
    await pool.query(
      'UPDATE reserva SET hora_inicio = ?, hora_fin = ?, fecha = ?, precio_total = ? WHERE id_reserva = ?',
      [reserva.hora_inicio, reserva.hora_fin, reserva.fecha, reserva.precio_total, reserva.id_reserva]
    );
    return reserva;
  }

   async delete(id_reserva: number): Promise<void> {
 
    await pool.query('DELETE FROM reserva_servicio WHERE id_reserva = ?', [id_reserva]);
   
    await pool.query('DELETE FROM reserva WHERE id_reserva = ?', [id_reserva]);
  }


  async addServicios(id_reserva: number, id_servicios: number[]): Promise<void> {
    for (const id_servicio of id_servicios) {
      await pool.query('INSERT INTO reserva_servicio (id_reserva, id_servicio) VALUES (?, ?)', [id_reserva, id_servicio]);
    }
  }

 
  async removeServicio(id_reserva: number, id_servicio: number): Promise<void> {
    await pool.query('DELETE FROM reserva_servicio WHERE id_reserva = ? AND id_servicio = ?', [id_reserva, id_servicio]);
  }


  async findServiciosByReserva(id_reserva: number): Promise<any[]> {
    const [rows] = await pool.query(
      `SELECT s.id_servicio, s.nombre, s.precio_servicio as precio
       FROM servicio s
       JOIN reserva_servicio rs ON s.id_servicio = rs.id_servicio
       WHERE rs.id_reserva = ?`,
      [id_reserva]
    );
    return rows as any[];
  }


  async findAllWithServicios(): Promise<any[]> {
    const [reservas] = await pool.query('SELECT * FROM reserva');
    const reservasConServicios = await Promise.all(
      (reservas as any[]).map(async (reserva) => {
        const servicios = await this.findServiciosByReserva(reserva.id_reserva);
        return { ...reserva, servicios };
      })
    );
    return reservasConServicios;
  }

  // 🔹➕ NUEVO: Obtener una reserva por ID con servicios
  async findByIdWithServicios(id_reserva: number): Promise<any | null> {
    const [rows] = await pool.query('SELECT * FROM reserva WHERE id_reserva = ?', [id_reserva]);
    const [reserva] = rows as any[];
    if (!reserva) return null;
    const servicios = await this.findServiciosByReserva(id_reserva);
    return { ...reserva, servicios };
  }
}