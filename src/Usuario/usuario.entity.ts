// Enum para rol de usuariexport type RolUsuario = 'cliente' | 'administrador';
export enum RolUsuario {
  CLIENTE = 'cliente',
  ADMINISTRADOR = 'administrador'
}



export interface Usuario {
  id_usuario: number;
  dni: number;
  nombre: string;
  apellido: string;
  rol: RolUsuario;
  id_localidad: number;
}

export interface UsuarioCreate {
  dni: number;
  nombre: string;
  apellido: string;
  rol: RolUsuario;
  id_localidad: number;
}

export interface UsuarioUpdate {
  id_usuario: number;
  dni?: number;
  nombre?: string;
  apellido?: string;
  rol?: RolUsuario;
  id_localidad?: number;
}
