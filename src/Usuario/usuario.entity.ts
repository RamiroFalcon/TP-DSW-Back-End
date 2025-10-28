export class Usuario {
    constructor(
        public id_usuario: number,
        public nombre: string,
        public apellido: string,
        public dni: string,
        public telefono: string,
        public email: string
    ) {}
}