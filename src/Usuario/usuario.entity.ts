export enum RolUsuario {
  CLIENTE = 'cliente',
  ADMINISTRADOR = 'administrador'
}

export interface Usuario {
  id_usuario: number;
  dni: string;
  nombre: string;
  apellido: string;
  id_localidad: number;
  rol: RolUsuario;
}

export interface UsuarioCreate {
  dni: string;
  nombre: string;
  apellido: string;
  id_localidad: number;
  rol: RolUsuario;
}

export interface UsuarioUpdate {
  dni?: string;
  nombre?: string;
  apellido?: string;
  id_localidad?: number;
  rol?: RolUsuario;
}