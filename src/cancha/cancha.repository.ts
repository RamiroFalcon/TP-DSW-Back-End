import { Repository } from '../shared/repository.js'
import { Cancha } from './cancha.entity.js'
import { pool } from '../shared/db/conn.mysql.js';


export class CanchaRepository implements Repository<Cancha> {
    public async findAll(): Promise<Cancha[]> {
    const [rows] = await pool.query('SELECT id_cancha, nombre, estado FROM canchas');
    return rows as Cancha[];
  }

  public async findOne(item: { id: number }): Promise<Cancha | undefined> {
    const [rows] = await pool.query(
    'SELECT id_cancha, nombre, estado FROM canchas WHERE id_cancha = ?',
    [item.id]
    );
    const row = (rows as any[])[0];
    return row ? (row as Cancha) : undefined;
  }

  public async add(item: Cancha): Promise<Cancha | undefined> {
    const [result] = await pool.query(
    'INSERT INTO canchas (id_cancha, nombre, estado) VALUES (?, ?, ?)',
    [item.id_cancha, item.nombre, item.estado]
    );
    // Si insertó, devolvés lo insertado (o lo buscás por ID si preferís)
    // @ts-ignore (si tu TS se queja del tipo de result)
    if (result.affectedRows > 0) return this.findOne({ id: item.id_cancha });
    return undefined;
  }

  public async update(item: Cancha): Promise<Cancha | undefined> {
    const [result] = await pool.query(
    'UPDATE canchas SET nombre = ?, estado = ? WHERE id_cancha = ?',
    [item.nombre, item.estado, item.id_cancha]
    );
    // @ts-ignore
    if (result.affectedRows > 0) return this.findOne({ id: item.id_cancha });
    return undefined;
  }

  public async delete(item: { id: number }): Promise<Cancha | undefined> {
    const cancha = await this.findOne({ id: item.id });
    if (!cancha) return undefined;

    const [result] = await pool.query(
      'DELETE FROM canchas WHERE id_cancha = ?',
      [item.id]
    );
    // @ts-ignore
    if (result.affectedRows > 0) return cancha;
    return undefined;
  }
}