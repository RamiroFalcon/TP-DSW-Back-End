
export class Cancha {
    constructor(
        public id_cancha: number,
        public nombre: string,
        public estado: 'disponible' | 'ocupada' | 'mantenimiento'
    ) {}
}
