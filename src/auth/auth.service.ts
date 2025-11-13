import { UsuarioRepository } from '../usuario/usuario.repository';
import { LoginDto } from '../usuario/usuario.entity';

export class AuthService {
  constructor(private usuarioRepository: UsuarioRepository) {}

  async login(datos: LoginDto) {
    const usuario = await this.usuarioRepository.findByUsername(datos.username);
    
    if (!usuario) {
      throw new Error('Usuario o contraseña incorrectos');
    }

    // Comparación directa de contraseña
    if (usuario.password !== datos.password) {
      throw new Error('Usuario o contraseña incorrectos');
    }

    // Retornar usuario sin la contraseña
    const { password, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }
}