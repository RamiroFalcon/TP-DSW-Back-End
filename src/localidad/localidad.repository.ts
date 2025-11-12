import { Localidad, LocalidadCreate } from './localidad.entity.js';
import { pool } from '../database/connection.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class LocalidadRepository {

  async create(data: LocalidadCreate): Promise<Localidad> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO localidad (nombre) VALUES (?)',
      [data.nombre]
    );
    
    return {
      id: result.insertId,
      nombre: data.nombre
    };
  }

  async findAll(): Promise<Localidad[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id_localidad as id, nombre FROM localidad'
    );
    return rows as Localidad[];
  }

  async findById(id: number): Promise<Localidad | undefined> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id_localidad as id, nombre FROM localidad WHERE id_localidad = ?',
      [id]
    );
    return rows[0] as Localidad | undefined;
  }

  async update(id: number, nombre: string): Promise<Localidad | null> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE localidad SET nombre = ? WHERE id_localidad = ?',
      [nombre, id]
    );
    
    if (result.affectedRows === 0) return null;
    
    return await this.findById(id) || null;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM localidad WHERE id_localidad = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}
