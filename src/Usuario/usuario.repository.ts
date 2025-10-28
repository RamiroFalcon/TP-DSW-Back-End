import { Usuario, UsuarioCreate } from '../Usuario/Usuario.entity';



export class UsuarioRepository {
  private usuarios: Usuario[] = [];
  private currentId: number = 1;

  create(data: UsuarioCreate): Usuario {
    const nuevoUsuario: Usuario = {
      id_usuario: this.currentId++,
      dni: data.dni,
      nombre: data.nombre,
      apellido: data.apellido,
      id_localidad: data.id_localidad,
      rol: data.rol
    };
    this.usuarios.push(nuevoUsuario);
    return nuevoUsuario;
  }

  findAll(): Usuario[] {
    return this.usuarios;
  }

  findById(id: number): Usuario | undefined {
    return this.usuarios.find(user => user.id_usuario === id);
  }

  findByDni(dni: string): Usuario | undefined {
    return this.usuarios.find(user => user.dni === dni);
  }

  findByLocalidad(id_localidad: number): Usuario[] {
    return this.usuarios.filter(user => user.id_localidad === id_localidad);
  }

  findByRol(rol: string): Usuario[] {
    return this.usuarios.filter(user => user.rol === rol);
  }

  update(id: number, data: Partial<Usuario>): Usuario | null {
    const index = this.usuarios.findIndex(user => user.id_usuario === id);
    if (index === -1) return null;
    
    this.usuarios[index] = { ...this.usuarios[index], ...data };
    return this.usuarios[index];
  }

  delete(id: number): boolean {
    const index = this.usuarios.findIndex(user => user.id_usuario === id);
    if (index === -1) return false;
    
    this.usuarios.splice(index, 1);
    return true;
  }
}