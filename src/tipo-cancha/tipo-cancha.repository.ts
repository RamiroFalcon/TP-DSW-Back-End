
import { Repository } from '../shared/repository.js'
import { pool } from '../shared/db/conn.mysql.js'
import { TipoCancha } from './tipo-cancha.entity.js'
import { ResultSetHeader, RowDataPacket } from 'mysql2'

export class TipoCanchaRepository implements Repository<TipoCancha> {
    public async findAll(): Promise<TipoCancha[]> {
        const [rows] = await pool.query('SELECT id_tipo_cancha, nombre, deporte FROM tipo_canchas')
        return rows as TipoCancha[]
    }

    public async findOne(item: { id: number }): Promise<TipoCancha | undefined> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id_tipo_cancha, nombre, deporte FROM tipo_canchas WHERE id_tipo_cancha = ?',
            [item.id]
        )
        if (rows.length === 0) {
            return undefined
        }
        const row = rows[0]
        return new TipoCancha(row.id_tipo_cancha, row.nombre, row.deporte)
    }

    public async add(item: TipoCancha): Promise<TipoCancha | undefined> {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO tipo_canchas (nombre, deporte) VALUES (?, ?)',
            [item.nombre, item.deporte]
        )
        if (result.affectedRows === 1) {
            item.id_tipo_cancha = result.insertId
            return item
        }
        return undefined
    }

    public async update(item: TipoCancha): Promise<TipoCancha | undefined> {
        // Primero obtenemos el tipo de cancha actual
        const tipoCanchaActual = await this.findOne({ id: item.id_tipo_cancha })
        if (!tipoCanchaActual) {
            return undefined
        }

        const tipoCanchaActualizado = {
         ...tipoCanchaActual,
        ...(item.nombre !== undefined && { nombre: item.nombre }),
        ...(item.deporte !== undefined && { deporte: item.deporte })

        }
        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE tipo_canchas SET nombre = ?, deporte = ? WHERE id_tipo_cancha = ?',
            [tipoCanchaActualizado.nombre, tipoCanchaActualizado.deporte, item.id_tipo_cancha]
        )

        if (result.affectedRows === 1) {
            return this.findOne({ id: item.id_tipo_cancha })
        }
        return undefined
    }


    public async delete(item: { id: number }): Promise<TipoCancha | undefined> {
        const tipoCanchaToDelete = await this.findOne(item)
        if (!tipoCanchaToDelete) {
            return undefined
        }
        const [result] = await pool.query<ResultSetHeader>(
            'DELETE FROM tipo_canchas WHERE id_tipo_cancha = ?',
            [item.id]
        )
        if (result.affectedRows === 1) {
            return tipoCanchaToDelete
        }
        return undefined
    }
}