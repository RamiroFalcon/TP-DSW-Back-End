export class Cancha {
    constructor(
        public id_cancha: number,
        public nombre: string,
        public estado: 'disponible' | 'reservada' | 'mantenimiento',
        public id_tipo_cancha: number
    ) {}
}