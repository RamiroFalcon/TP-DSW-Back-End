import { pool } from '../database/connection';
import { TipoCancha, TipoCanchaCreate } from './tipo-cancha.entity';
import { ResultSetHeader } from 'mysql2';

export class TipoCanchaRepository {
  async findAll(): Promise<TipoCancha[]> {
    const [rows] = await pool.query('SELECT * FROM tipocancha');
    return rows as TipoCancha[];
  }

  async findById(id_tipo: number): Promise<TipoCancha | null> {
    const [rows] = await pool.query('SELECT * FROM tipocancha WHERE id_tipo = ?', [id_tipo]);
    const tipos = rows as TipoCancha[];
    return tipos.length ? tipos[0] : null;
  }

  async create(data: TipoCanchaCreate): Promise<TipoCancha> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO tipocancha (nombre, deporte) VALUES (?, ?)',
      [data.nombre, data.deporte]
    );
    const insertedId = result.insertId;
    return { id_tipo: insertedId, ...data };
  }

  async update(id: number, datos: Partial<TipoCancha>): Promise<TipoCancha> {
    const [result] = await pool.query(
      'UPDATE tipocancha SET ? WHERE id_tipo = ?',
      [datos, id]
    );

    // @ts-ignore
    if ((result as any).affectedRows === 0) {
      throw new Error('Tipo de cancha no encontrado');
    }

    const [rows] = await pool.query(
      'SELECT * FROM tipocancha WHERE id_tipo = ?',
      [id]
    );

    return (rows as TipoCancha[])[0];
  }

  async delete(id_tipo: number): Promise<void> {
    await pool.query('DELETE FROM tipocancha WHERE id_tipo = ?', [id_tipo]);
  }
}