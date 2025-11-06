import { pool } from '../database/connection';
import { Cancha, CanchaCreate, CanchaUpdate } from './cancha.entity';
import { ResultSetHeader } from 'mysql2';

export class CanchaRepository {
  async findAll(): Promise<Cancha[]> {
    const [rows] = await pool.query('SELECT * FROM cancha');
    return rows as Cancha[];
  }

  async findById(id: number): Promise<Cancha | null> {
    const [rows] = await pool.query('SELECT * FROM cancha WHERE id = ?', [id]);
    const canchas = rows as Cancha[];
    return canchas.length ? canchas[0] : null;
  }

  async findByTipo(id_tipo: number): Promise<Cancha[]> {
    const [rows] = await pool.query('SELECT * FROM cancha WHERE id_tipo = ?', [id_tipo]);
    return rows as Cancha[];
  }

  async create(data: CanchaCreate): Promise<Cancha> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO cancha (nombre, id_tipo, id_localidad, precio) VALUES (?, ?, ?, ?)',
      [data.nombre, data.id_tipo, data.id_localidad, data.precio]
    );
    const insertedId = result.insertId;
    return { id: insertedId, ...data };
  }

  async update(id: number, data: CanchaUpdate): Promise<void> {
    await pool.query('UPDATE cancha SET ? WHERE id = ?', [data, id]);
  }

  async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM cancha WHERE id = ?', [id]);
  }
}

