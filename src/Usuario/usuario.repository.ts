import { Repository } from '../shared/repository.js'
import { pool } from '../shared/db/conn.mysql.js'
import { Usuario } from './usuario.entity.js'
import { ResultSetHeader, RowDataPacket } from 'mysql2'

export class UsuarioRepository implements Repository<Usuario> {
    public async findAll(): Promise<Usuario[]> {
        const [rows] = await pool.query('SELECT id_usuario, nombre, apellido, dni, telefono, email FROM usuarios')
        return rows as Usuario[]
    }

    public async findOne(item: { id: number }): Promise<Usuario | undefined> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id_usuario, nombre, apellido, dni, telefono, email FROM usuarios WHERE id_usuario = ?',
            [item.id]
        )
        if (rows.length === 0) {
            return undefined
        }
        const row = rows[0]
        return new Usuario(row.id_usuario, row.nombre, row.apellido, row.dni, row.telefono, row.email)
    }

    public async add(item: Usuario): Promise<Usuario | undefined> {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO usuarios (nombre, apellido, dni, telefono, email) VALUES (?, ?, ?, ?, ?)',
            [item.nombre, item.apellido, item.dni, item.telefono, item.email]
        )
        if (result.affectedRows === 1) {
            item.id_usuario = result.insertId
            return item
        }
        return undefined
    }

    public async update(item: Usuario): Promise<Usuario | undefined> {
        const usuarioActual = await this.findOne({ id: item.id_usuario })
        if (!usuarioActual) {
            return undefined
        }

        const usuarioActualizado = {
            ...usuarioActual,
            ...(item.nombre !== undefined && { nombre: item.nombre }),
            ...(item.apellido !== undefined && { apellido: item.apellido }),
            ...(item.dni !== undefined && { dni: item.dni }),
            ...(item.telefono !== undefined && { telefono: item.telefono }),
            ...(item.email !== undefined && { email: item.email })
        }

        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE usuarios SET nombre = ?, apellido = ?, dni = ?, telefono = ?, email = ? WHERE id_usuario = ?',
            [usuarioActualizado.nombre, usuarioActualizado.apellido, usuarioActualizado.dni, 
             usuarioActualizado.telefono, usuarioActualizado.email, item.id_usuario]
        )
        
        if (result.affectedRows === 1) {
            return this.findOne({ id: item.id_usuario })
        }
        return undefined
    }

    public async delete(item: { id: number }): Promise<Usuario | undefined> {
        const usuarioToDelete = await this.findOne(item)
        if (!usuarioToDelete) {
            return undefined
        }
        const [result] = await pool.query<ResultSetHeader>(
            'DELETE FROM usuarios WHERE id_usuario = ?',
            [item.id]
        )
        if (result.affectedRows === 1) {
            return usuarioToDelete
        }
        return undefined
    }

    // Métodos adicionales específicos
    public async findByDni(dni: string): Promise<Usuario | undefined> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id_usuario, nombre, apellido, dni, telefono, email FROM usuarios WHERE dni = ?',
            [dni]
        )
        if (rows.length === 0) {
            return undefined
        }
        const row = rows[0]
        return new Usuario(row.id_usuario, row.nombre, row.apellido, row.dni, row.telefono, row.email)
    }

    public async findByEmail(email: string): Promise<Usuario | undefined> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id_usuario, nombre, apellido, dni, telefono, email FROM usuarios WHERE email = ?',
            [email]
        )
        if (rows.length === 0) {
            return undefined
        }
        const row = rows[0]
        return new Usuario(row.id_usuario, row.nombre, row.apellido, row.dni, row.telefono, row.email)
    }
}