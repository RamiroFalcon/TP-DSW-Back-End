import { Repository } from '../shared/repository.js'
import { pool } from '../shared/db/conn.mysql.js'
import { Reserva } from './reserva.entity.js'
import { ResultSetHeader, RowDataPacket } from 'mysql2'

export class ReservaRepository implements Repository<Reserva> {
    public async findAll(): Promise<Reserva[]> {
        const [rows] = await pool.query(
            'SELECT id_reserva, id_cancha, id_cliente, fecha, hora_ini, hora_fin, estado FROM reservas'
        )
        return rows as Reserva[]
    }

    public async findOne(item: { id: number }): Promise<Reserva | undefined> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id_reserva, id_cancha, id_cliente, fecha, hora_ini, hora_fin, estado FROM reservas WHERE id_reserva = ?',
            [item.id]
        )
        if (rows.length === 0) {
            return undefined
        }
        const row = rows[0]
        return new Reserva(
            row.id_reserva,
            row.id_cancha,
            row.id_cliente,
            row.fecha,
            row.hora_ini,
            row.hora_fin,
            row.estado
        )
    }

    public async add(item: Reserva): Promise<Reserva | undefined> {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO reservas (id_cancha, id_cliente, fecha, hora_ini, hora_fin, estado) VALUES (?, ?, ?, ?, ?, ?)',
            [item.id_cancha, item.id_cliente, item.fecha, item.hora_ini, item.hora_fin, item.estado]
        )
        if (result.affectedRows === 1) {
            item.id_reserva = result.insertId
            return item
        }
        return undefined
    }

    public async update(item: Reserva): Promise<Reserva | undefined> {
        const reservaActual = await this.findOne({ id: item.id_reserva })
        if (!reservaActual) {
            return undefined
        }

        const reservaActualizada = {
            ...reservaActual,
            ...(item.id_cancha !== undefined && { id_cancha: item.id_cancha }),
            ...(item.id_cliente !== undefined && { id_cliente: item.id_cliente }),
            ...(item.fecha !== undefined && { fecha: item.fecha }),
            ...(item.hora_ini !== undefined && { hora_ini: item.hora_ini }),
            ...(item.hora_fin !== undefined && { hora_fin: item.hora_fin }),
            ...(item.estado !== undefined && { estado: item.estado })
        }

        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE reservas SET id_cancha = ?, id_cliente = ?, fecha = ?, hora_ini = ?, hora_fin = ?, estado = ? WHERE id_reserva = ?',
            [
                reservaActualizada.id_cancha,
                reservaActualizada.id_cliente,
                reservaActualizada.fecha,
                reservaActualizada.hora_ini,
                reservaActualizada.hora_fin,
                reservaActualizada.estado,
                item.id_reserva
            ]
        )
        
        if (result.affectedRows === 1) {
            return this.findOne({ id: item.id_reserva })
        }
        return undefined
    }

    public async delete(item: { id: number }): Promise<Reserva | undefined> {
        const reservaToDelete = await this.findOne(item)
        if (!reservaToDelete) {
            return undefined
        }
        const [result] = await pool.query<ResultSetHeader>(
            'DELETE FROM reservas WHERE id_reserva = ?',
            [item.id]
        )
        if (result.affectedRows === 1) {
            return reservaToDelete
        }
        return undefined
    }

    public async findByCancha(id_cancha: number): Promise<Reserva[]> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id_reserva, id_cancha, id_cliente, fecha, hora_ini, hora_fin, estado FROM reservas WHERE id_cancha = ?',
            [id_cancha]
        )
        return rows as Reserva[]
    }

    public async findByCliente(id_cliente: number): Promise<Reserva[]> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id_reserva, id_cancha, id_cliente, fecha, hora_ini, hora_fin, estado FROM reservas WHERE id_cliente = ?',
            [id_cliente]
        )
        return rows as Reserva[]
    }

    public async findByFecha(fecha: string): Promise<Reserva[]> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id_reserva, id_cancha, id_cliente, fecha, hora_ini, hora_fin, estado FROM reservas WHERE fecha = ?',
            [fecha]
        )
        return rows as Reserva[]
    }

    public async verificarDisponibilidad(id_cancha: number, fecha: string, hora_ini: string, hora_fin: string): Promise<boolean> {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT COUNT(*) as count FROM reservas 
             WHERE id_cancha = ? 
             AND fecha = ? 
             AND (
                 (hora_ini < ? AND hora_fin > ?) OR
                 (hora_ini < ? AND hora_fin > ?) OR
                 (hora_ini >= ? AND hora_fin <= ?)
             )`,
            [id_cancha, fecha, hora_fin, hora_ini, hora_fin, hora_ini, hora_ini, hora_fin]
        )
        return rows[0].count === 0
    }
}