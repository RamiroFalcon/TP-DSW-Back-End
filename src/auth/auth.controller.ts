import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UsuarioRepository } from '../usuario/usuario.repository';

const repository = new UsuarioRepository();
const authService = new AuthService(repository);

export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Usuario y contraseña son requeridos' 
      });
    }

    const usuario = await authService.login({ username, password });
    res.json({ success: true, data: usuario });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
}