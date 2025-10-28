export class Reserva {
    constructor(
        public id_reserva: number,
        public id_cancha: number,
        public id_cliente: number,
        public fecha: string,
        public hora_ini: string,
        public hora_fin: string,
        public estado: string,
    ) {}
}