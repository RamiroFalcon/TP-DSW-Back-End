import { UsuarioRepository } from './usuario.repository';
import { Usuario, UsuarioCreate, UsuarioUpdate, RolUsuario } from '../Usuario/Usuario.entity';
import { LocalidadRepository } from '../localidad/localidad.repository';

export class UsuarioService {
  constructor(
    private repository: UsuarioRepository,
    private localidadRepository: LocalidadRepository
  ) {}

  crearUsuario(data: UsuarioCreate): Usuario {
    if (!data.dni || data.dni.trim().length === 0) {
      throw new Error('El DNI es requerido');
    }
    
    // Validar formato DNI (solo números)
    if (!/^\d+$/.test(data.dni)) {
      throw new Error('El DNI debe contener solo números');
    }

    // Verificar que el DNI no exista
    const usuarioExistente = this.repository.findByDni(data.dni);
    if (usuarioExistente) {
      throw new Error('Ya existe un usuario con ese DNI');
    }

    if (!data.nombre || data.nombre.trim().length === 0) {
      throw new Error('El nombre es requerido');
    }

    if (!data.apellido || data.apellido.trim().length === 0) {
      throw new Error('El apellido es requerido');
    }

    // Verificar que la localidad existe
    const localidad = this.localidadRepository.findById(data.id_localidad);
    if (!localidad) {
      throw new Error(`Localidad con id ${data.id_localidad} no existe`);
    }

    // Validar rol
    if (!Object.values(RolUsuario).includes(data.rol)) {
      throw new Error('Rol inválido. Debe ser: cliente o administrador');
    }

    return this.repository.create(data);
  }

  obtenerTodos(): Usuario[] {
    return this.repository.findAll();
  }

  obtenerPorId(id: number): Usuario {
    const usuario = this.repository.findById(id);
    if (!usuario) {
      throw new Error(`Usuario con id ${id} no encontrado`);
    }
    return usuario;
  }

  obtenerPorDni(dni: string): Usuario {
    const usuario = this.repository.findByDni(dni);
    if (!usuario) {
      throw new Error(`Usuario con DNI ${dni} no encontrado`);
    }
    return usuario;
  }

  obtenerPorLocalidad(id_localidad: number): Usuario[] {
    return this.repository.findByLocalidad(id_localidad);
  }

  obtenerPorRol(rol: string): Usuario[] {
    return this.repository.findByRol(rol);
  }

  actualizarUsuario(id: number, data: UsuarioUpdate): Usuario {
    if (data.dni) {
      if (!/^\d+$/.test(data.dni)) {
        throw new Error('El DNI debe contener solo números');
      }
      // Verificar que el DNI no exista en otro usuario
      const usuarioConDni = this.repository.findByDni(data.dni);
      if (usuarioConDni && usuarioConDni.id_usuario !== id) {
        throw new Error('Ya existe otro usuario con ese DNI');
      }
    }

    if (data.id_localidad) {
      const localidad = this.localidadRepository.findById(data.id_localidad);
      if (!localidad) {
        throw new Error(`Localidad con id ${data.id_localidad} no existe`);
      }
    }

    if (data.rol && !Object.values(RolUsuario).includes(data.rol)) {
      throw new Error('Rol inválido');
    }

    const usuario = this.repository.update(id, data);
    if (!usuario) {
      throw new Error(`Usuario con id ${id} no encontrado`);
    }
    return usuario;
  }

  eliminarUsuario(id: number): void {
    const eliminado = this.repository.delete(id);
    if (!eliminado) {
      throw new Error(`Usuario con id ${id} no encontrado`);
    }
  }
}
