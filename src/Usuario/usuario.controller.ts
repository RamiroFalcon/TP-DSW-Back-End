import { Request, Response } from 'express';
import { UsuarioService } from '../usuario/usuario';
import { RolUsuario } from './usuario.entity';


export class UsuarioController {
  constructor(private service: UsuarioService) {}

  crear = async (req: Request, res: Response): Promise<void> => {
    try {
      const usuario = await this.service.crearUsuario(req.body);
      res.status(201).json({
        success: true,
        data: usuario,
        message: 'Usuario creado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al crear usuario'
      });
    }
  };

  obtenerTodos = async (_: Request, res: Response): Promise<void> => {
    try {
      const usuarios = await this.service.obtenerTodos();
      res.status(200).json({
        success: true,
        data: usuarios
      });
    } catch {
      res.status(500).json({
        success: false,
        message: 'Error al obtener usuarios'
      });
    }
  };

  obtenerPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const id_usuario = parseInt(req.params.id_usuario);
      const usuario = await this.service.obtenerPorId(id_usuario);
      res.status(200).json({ success: true, data: usuario });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Usuario no encontrado'
      });
    }
  };

  obtenerPorDni = async (req: Request, res: Response): Promise<void> => {
    try {
      const dni = parseInt(req.params.dni);
      const usuario = await this.service.obtenerPorDni(dni);
      res.status(200).json({ success: true, data: usuario });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Usuario no encontrado'
      });
    }
  };

   obtenerPorRol = async (req: Request, res: Response): Promise<void> => {
    try {
      const rolParam = req.params.rol as keyof typeof RolUsuario;

      // Validar que el rol exista
      if (!Object.values(RolUsuario).includes(rolParam as RolUsuario)) {
        res.status(400).json({ success: false, message: 'Rol inválido' });
        return;
      }

      const usuarios = await this.service.obtenerPorRol(rolParam as RolUsuario);
      res.json({ success: true, data: usuarios });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al obtener usuarios por rol' });
    }
  };


  actualizar = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const datos = req.body; // Debe coincidir con UsuarioUpdate
    const usuarioActualizado = await this.service.actualizar(id, datos);
    res.json({ success: true, data: usuarioActualizado });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar usuario' });
  }
};

  eliminar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id_usuario = parseInt(req.params.id_usuario);
      await this.service.eliminarUsuario(id_usuario);
      res.status(200).json({
        success: true,
        message: 'Usuario eliminado exitosamente'
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Usuario no encontrado'
      });
    }
  };
}
