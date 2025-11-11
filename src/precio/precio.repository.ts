import { pool } from '../database/connection';
import { ResultSetHeader } from 'mysql2';

export interface Precio {
  id_precio: number;
  id_cancha: number;
  valor_por_hora: number;
  fecha_vigencia: string;
  cancha_nombre?: string; // ✅ Añadido para el JOIN
}

export interface PrecioCreate {
  id_cancha: number;
  valor_por_hora: number;
  fecha_vigencia: string;
}

export class PrecioRepository {
  async create(precio: PrecioCreate): Promise<number> {
    try {
      const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO precio (id_cancha, valor_por_hora, fecha_vigencia) VALUES (?, ?, ?)',
        [precio.id_cancha, precio.valor_por_hora, precio.fecha_vigencia]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error en PrecioRepository.create:', error);
      throw error;
    }
  }

  async obtenerTodos(): Promise<Precio[]> {
    try {
      const [rows] = await pool.query(
        `SELECT p.*, c.nombre as cancha_nombre 
         FROM precio p 
         LEFT JOIN cancha c ON p.id_cancha = c.id_cancha 
         ORDER BY p.fecha_vigencia DESC`
      );
      return rows as Precio[];
    } catch (error) {
      console.error('Error en PrecioRepository.obtenerTodos:', error);
      throw error;
    }
  }

  async findByCancha(id_cancha: number): Promise<Precio[]> {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM precio WHERE id_cancha = ? ORDER BY fecha_vigencia DESC',
        [id_cancha]
      );
      return rows as Precio[];
    } catch (error) {
      console.error('Error en PrecioRepository.findByCancha:', error);
      throw error;
    }
  }

  async findActualByCancha(id_cancha: number): Promise<Precio | null> {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM precio 
         WHERE id_cancha = ? 
         ORDER BY fecha_vigencia DESC 
         LIMIT 1`,
        [id_cancha]
      );
      const [precio] = rows as Precio[];
      return precio || null;
    } catch (error) {
      console.error('Error en PrecioRepository.findActualByCancha:', error);
      throw error;
    }
  }

  async update(id_precio: number, precioData: Partial<Precio>): Promise<void> {
    try {
      const { valor_por_hora, fecha_vigencia } = precioData;
      await pool.query(
        'UPDATE precio SET valor_por_hora = ?, fecha_vigencia = ? WHERE id_precio = ?', 
        [valor_por_hora, fecha_vigencia, id_precio]
      );
    } catch (error) {
      console.error('Error en PrecioRepository.update:', error);
      throw error;
    }
  }

  async delete(id_precio: number): Promise<void> {
    try {
      await pool.query('DELETE FROM precio WHERE id_precio = ?', [id_precio]);
    } catch (error) {
      console.error('Error en PrecioRepository.delete:', error);
      throw error;
    }
  }

  async findById(id_precio: number): Promise<Precio | null> {
    try {
      const [rows] = await pool.query(
        `SELECT p.*, c.nombre as cancha_nombre 
         FROM precio p 
         LEFT JOIN cancha c ON p.id_cancha = c.id_cancha 
         WHERE p.id_precio = ?`,
        [id_precio]
      );
      const [precio] = rows as Precio[];
      return precio || null;
    } catch (error) {
      console.error('Error en PrecioRepository.findById:', error);
      throw error;
    }
  }
}