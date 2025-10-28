import { Reserva, ReservaCreate } from './reserva.entity';

export class ReservaRepository {
  private reservas: Reserva[] = [];
  private currentId: number = 1;

  create(data: ReservaCreate): Reserva {
    const nuevaReserva: Reserva = {
      id_reserva: this.currentId++,
      id_cancha: data.id_cancha,
      id_cliente: data.id_cliente,
      fecha: data.fecha,
      hora_inicio: data.hora_inicio,
      hora_fin: data.hora_fin
    };
    this.reservas.push(nuevaReserva);
    return nuevaReserva;
  }

  findAll(): Reserva[] {
    return this.reservas;
  }

  findById(id: number): Reserva | undefined {
    return this.reservas.find(reserva => reserva.id_reserva === id);
  }

  findByCancha(id_cancha: number): Reserva[] {
    return this.reservas.filter(reserva => reserva.id_cancha === id_cancha);
  }

  findByCliente(id_cliente: number): Reserva[] {
    return this.reservas.filter(reserva => reserva.id_cliente === id_cliente);
  }

  findByFecha(fecha: string): Reserva[] {
    return this.reservas.filter(reserva => reserva.fecha === fecha);
  }

  findByCanchaYFecha(id_cancha: number, fecha: string): Reserva[] {
    return this.reservas.filter(
      reserva => reserva.id_cancha === id_cancha && reserva.fecha === fecha
    );
  }

  update(id: number, data: Partial<Reserva>): Reserva | null {
    const index = this.reservas.findIndex(reserva => reserva.id_reserva === id);
    if (index === -1) return null;
    
    this.reservas[index] = { ...this.reservas[index], ...data };
    return this.reservas[index];
  }

  delete(id: number): boolean {
    const index = this.reservas.findIndex(reserva => reserva.id_reserva === id);
    if (index === -1) return false;
    
    this.reservas.splice(index, 1);
    return true;
  }
}
