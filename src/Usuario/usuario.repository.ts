import { pool } from '../database/connection';
import { Usuario, UsuarioCreate, UsuarioUpdate } from './usuario.entity';
import { ResultSetHeader } from 'mysql2';
import { RolUsuario } from './usuario.entity';;

export class UsuarioRepository {
  async findAll(): Promise<Usuario[]> {
    const [rows] = await pool.query('SELECT * FROM usuario');
    return rows as Usuario[];
  }

  async findById(id_usuario: number): Promise<Usuario | null> {
    const [rows] = await pool.query('SELECT * FROM usuario WHERE id_usuario = ?', [id_usuario]);
    const usuarios = rows as Usuario[];
    return usuarios.length ? usuarios[0] : null;
  }

  async findByDni(dni: number): Promise<Usuario | null> {
    const [rows] = await pool.query('SELECT * FROM usuario WHERE dni = ?', [dni]);
    const usuarios = rows as Usuario[];
    return usuarios.length ? usuarios[0] : null;
  }
   async findByRol(rol: RolUsuario): Promise<Usuario[]> {
    const [rows] = await pool.query('SELECT * FROM usuario WHERE rol = ?', [rol]);
    return rows as Usuario[];
  }


  async create(data: UsuarioCreate): Promise<Usuario> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO usuario (dni, nombre, apellido, rol, id_localidad) VALUES (?, ?, ?, ?, ?)',
      [data.dni, data.nombre, data.apellido, data.rol, data.id_localidad]
    );
    const insertedId = result.insertId;
    return { id_usuario: insertedId, ...data };
  }

async update(id: number, datos: UsuarioUpdate): Promise<Usuario> {
  const [result] = await pool.query(
    'UPDATE usuario SET ? WHERE id_usuario = ?',
    [datos, id]
  );

  // @ts-ignore
  if ((result as any).affectedRows === 0) {
    throw new Error('Usuario no encontrado');
  }

  const [rows] = await pool.query(
    'SELECT * FROM usuario WHERE id_usuario = ?',
    [id]
  );

  return (rows as Usuario[])[0];
}
  async delete(id_usuario: number): Promise<void> {
    await pool.query('DELETE FROM usuario WHERE id_usuario = ?', [id_usuario]);
  }
}
