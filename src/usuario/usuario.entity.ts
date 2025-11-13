// Enum para rol de usuario
export enum RolUsuario {
  CLIENTE = 'cliente',
  ADMINISTRADOR = 'administrador'
}

export interface Usuario {
  id_usuario: number;
  dni: string;
  nombre: string;
  apellido: string;
  email: string | null;
  username: string | null;
  password: string | null;
  rol: RolUsuario;
  id_localidad: number;
}

export interface UsuarioCreate {
  dni: string;
  nombre: string;
  apellido: string;
  email?: string;
  username?: string;
  password?: string;
  rol: RolUsuario;
  id_localidad: number;
}

export interface UsuarioUpdate {
  id_usuario: number;
  dni?: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  username?: string;
  password?: string;
  rol?: RolUsuario;
  id_localidad?: number;
}

export interface LoginDto {
  username: string;
  password: string;
}