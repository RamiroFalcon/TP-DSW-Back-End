import { Repository } from '../shared/repository.js'
import { pool } from '../shared/db/conn.mysql.js'
import { Localidad } from './localidad.entity.js'
import { ResultSetHeader, RowDataPacket } from 'mysql2'

export class LocalidadRepository implements Repository<Localidad> {
    public async findAll(): Promise<Localidad[]> {
        const [rows] = await pool.query('SELECT id_localidad, nombre FROM localidades')
        return rows as Localidad[]
    }

    public async findOne(item: { id: number }): Promise<Localidad | undefined> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id_localidad, nombre FROM localidades WHERE id_localidad = ?',
            [item.id]
        )
        if (rows.length === 0) {
            return undefined
        }
        const row = rows[0]
        return new Localidad(row.id_localidad, row.nombre)
    }

    public async add(item: Localidad): Promise<Localidad | undefined> {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO localidades (nombre) VALUES (?)',
            [item.nombre]
        )
        if (result.affectedRows === 1) {
            item.id_localidad = result.insertId
            return item
        }
        return undefined
    }

    public async update(item: Localidad): Promise<Localidad | undefined> {
        const localidadActual = await this.findOne({ id: item.id_localidad })
        if (!localidadActual) {
            return undefined
        }

        const localidadActualizada = {
            ...localidadActual,
            ...(item.nombre !== undefined && { nombre: item.nombre })
        }

        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE localidades SET nombre = ? WHERE id_localidad = ?',
            [localidadActualizada.nombre, item.id_localidad]
        )
        
        if (result.affectedRows === 1) {
            return this.findOne({ id: item.id_localidad })
        }
        return undefined
    }

    public async delete(item: { id: number }): Promise<Localidad | undefined> {
        const localidadToDelete = await this.findOne(item)
        if (!localidadToDelete) {
            return undefined
        }
        const [result] = await pool.query<ResultSetHeader>(
            'DELETE FROM localidades WHERE id_localidad = ?',
            [item.id]
        )
        if (result.affectedRows === 1) {
            return localidadToDelete
        }
        return undefined
    }
}