import { pool } from '../database/connection';
import { ResultSetHeader } from 'mysql2';

export interface Precio {
  id_precio: number;
  id_cancha: number;
  valor_por_hora: number;
  fecha_vigencia: string;
}

export interface PrecioCreate {
  id_cancha: number;
  valor_por_hora: number;
  fecha_vigencia: string;
}

export class PrecioRepository {
  async create(precio: PrecioCreate): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO precio (id_cancha, valor_por_hora, fecha_vigencia) VALUES (?, ?, ?)',
      [precio.id_cancha, precio.valor_por_hora, precio.fecha_vigencia]
    );
    return result.insertId;
  }

  async findByCancha(id_cancha: number): Promise<Precio[]> {
    const [rows] = await pool.query(
      'SELECT * FROM precio WHERE id_cancha = ? ORDER BY fecha_vigencia DESC',
      [id_cancha]
    );
    return rows as Precio[];
  }

  async findActualByCancha(id_cancha: number): Promise<Precio | null> {
    const [rows] = await pool.query(
      `SELECT * FROM precio 
       WHERE id_cancha = ? 
       ORDER BY fecha_vigencia DESC 
       LIMIT 1`,
      [id_cancha]
    );
    const [precio] = rows as Precio[];
    return precio || null;
  }

  async update(id_precio: number, valor_por_hora: number): Promise<void> {
    await pool.query('UPDATE precio SET valor_por_hora = ? WHERE id_precio = ?', [
      valor_por_hora,
      id_precio
    ]);
  }

  async delete(id_precio: number): Promise<void> {
    await pool.query('DELETE FROM precio WHERE id_precio = ?', [id_precio]);
  }
}
