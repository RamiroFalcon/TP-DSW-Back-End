import { Repository } from '../shared/repository.js'
import { pool } from '../shared/db/conn.mysql.js'
import { Cancha } from './cancha.entity.js'
import { ResultSetHeader, RowDataPacket } from 'mysql2'

export class CanchaRepository implements Repository<Cancha> {
    public async findAll(): Promise<Cancha[]> {
        const [rows] = await pool.query('SELECT id_cancha, nombre, estado, id_tipo_cancha FROM canchas')
        return rows as Cancha[]
    }

    public async findOne(item: { id: number }): Promise<Cancha | undefined> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id_cancha, nombre, estado, id_tipo_cancha FROM canchas WHERE id_cancha = ?',
            [item.id]
        )
        if (rows.length === 0) {
            return undefined
        }
        const row = rows[0]
        return new Cancha(row.id_cancha, row.nombre, row.estado, row.id_tipo_cancha)
    }

    public async add(item: Cancha): Promise<Cancha | undefined> {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO canchas (nombre, estado, id_tipo_cancha) VALUES (?, ?, ?)',
            [item.nombre, item.estado, item.id_tipo_cancha]
        )
        if (result.affectedRows === 1) {
            item.id_cancha = result.insertId
            return item
        }
        return undefined
    }

    public async update(item: Cancha): Promise<Cancha | undefined> {
        const canchaActual = await this.findOne({ id: item.id_cancha })
        if (!canchaActual) {
            return undefined
        }

        const canchaActualizada = {
            ...canchaActual,
            ...(item.nombre !== undefined && { nombre: item.nombre }),
            ...(item.estado !== undefined && { estado: item.estado }),
            ...(item.id_tipo_cancha !== undefined && { id_tipo_cancha: item.id_tipo_cancha })
        }

        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE canchas SET nombre = ?, estado = ?, id_tipo_cancha = ? WHERE id_cancha = ?',
            [canchaActualizada.nombre, canchaActualizada.estado, canchaActualizada.id_tipo_cancha, item.id_cancha]
        )
        
        if (result.affectedRows === 1) {
            return this.findOne({ id: item.id_cancha })
        }
        return undefined
    }

    public async delete(item: { id: number }): Promise<Cancha | undefined> {
        const canchaToDelete = await this.findOne(item)
        if (!canchaToDelete) {
            return undefined
        }
        const [result] = await pool.query<ResultSetHeader>(
            'DELETE FROM canchas WHERE id_cancha = ?',
            [item.id]
        )
        if (result.affectedRows === 1) {
            return canchaToDelete
        }
        return undefined
    }
}