import { Request, Response } from 'express';
import { UsuarioService } from './usuario';

export class UsuarioController {
  constructor(private service: UsuarioService) {}

  crear = async (req: Request, res: Response): Promise<void> => {
    try {
      const usuario = this.service.crearUsuario(req.body);
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

  obtenerTodos = async (req: Request, res: Response): Promise<void> => {
    try {
      const usuarios = this.service.obtenerTodos();
      res.status(200).json({
        success: true,
        data: usuarios
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener usuarios'
      });
    }
  };

  obtenerPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const usuario = this.service.obtenerPorId(id);
      res.status(200).json({
        success: true,
        data: usuario
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Usuario no encontrado'
      });
    }
  };

  obtenerPorDni = async (req: Request, res: Response): Promise<void> => {
    try {
      const dni = req.params.dni;
      const usuario = this.service.obtenerPorDni(dni);
      res.status(200).json({
        success: true,
        data: usuario
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Usuario no encontrado'
      });
    }
  };

  obtenerPorLocalidad = async (req: Request, res: Response): Promise<void> => {
    try {
      const id_localidad = parseInt(req.params.id_localidad);
      const usuarios = this.service.obtenerPorLocalidad(id_localidad);
      res.status(200).json({
        success: true,
        data: usuarios
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener usuarios por localidad'
      });
    }
  };

  obtenerPorRol = async (req: Request, res: Response): Promise<void> => {
    try {
      const rol = req.params.rol;
      const usuarios = this.service.obtenerPorRol(rol);
      res.status(200).json({
        success: true,
        data: usuarios
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener usuarios por rol'
      });
    }
  };

  actualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const usuario = this.service.actualizarUsuario(id, req.body);
      res.status(200).json({
        success: true,
        data: usuario,
        message: 'Usuario actualizado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al actualizar usuario'
      });
    }
  };

  eliminar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      this.service.eliminarUsuario(id);
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