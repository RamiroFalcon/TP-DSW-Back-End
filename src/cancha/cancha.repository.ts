import { pool } from '../database/connection';
import { Cancha, CanchaCreate, CanchaUpdate } from './cancha.entity';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class CanchaRepository {
  async findAll(): Promise<Cancha[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM cancha');
    return rows as Cancha[];
  }

  async findById(id: number): Promise<Cancha | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM cancha WHERE id_cancha = ?',
      [id]
    );
    const canchas = rows as Cancha[];
    return canchas.length ? canchas[0] : null;
  }

  async findByTipo(id_tipo: number): Promise<Cancha[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM cancha WHERE id_tipo = ?',
      [id_tipo]
    );
    return rows as Cancha[];
  }

  async create(data: CanchaCreate): Promise<Cancha> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO cancha (nombre, estado, id_tipo, id_localidad, precio, hora_apertura, hora_cierre) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        data.nombre,
        data.estado || 'disponible',
        data.id_tipo,
        data.id_localidad,
        data.precio_hora || 0,
        data.hora_apertura || '08:00:00',
        data.hora_cierre || '22:00:00'
      ]
    );

    return {
      id_cancha: result.insertId,
      nombre: data.nombre,
      estado: data.estado || 'disponible',
      id_tipo: data.id_tipo,
      id_localidad: data.id_localidad,
      precio_hora: data.precio_hora || 0,
      hora_apertura: data.hora_apertura || '08:00:00',
      hora_cierre: data.hora_cierre || '22:00:00'
    };
  }

  async update(id: number, datos: Partial<Cancha>): Promise<Cancha> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE cancha SET ? WHERE id_cancha = ?',
      [datos, id]
    );

    if (result.affectedRows === 0) {
      throw new Error('Cancha no encontrada');
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM cancha WHERE id_cancha = ?',
      [id]
    );

    return (rows as Cancha[])[0];
  }

  async delete(id: number): Promise<void> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM cancha WHERE id_cancha = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      throw new Error('Cancha no encontrada');
    }
  }
}