import { ServicioRepository } from './servicio.repository';
import { ServicioCreate, ServicioUpdate } from './servicio.entity';

export class ServicioService {
  private repository: ServicioRepository;

  constructor() {
    this.repository = new ServicioRepository();
  }

  async obtenerTodos() {
    return this.repository.findAll();
  }

  async obtenerPorId(id_servicio: number) {
    const servicio = await this.repository.findById(id_servicio);
    if (!servicio) throw new Error('Servicio no encontrado');
    return servicio;
  }

  async crearServicio(data: ServicioCreate) {
    return this.repository.create(data);
  }

  async actualizarServicio(id_servicio: number, data: ServicioUpdate) {
    return this.repository.update(id_servicio, data);
  }

  async eliminarServicio(id_servicio: number) {
    return this.repository.delete(id_servicio);
  }

  // 🔗 Para relación con reservas
  async asignarServiciosAReserva(id_reserva: number, id_servicios: number[]) {
    return this.repository.asignarAReserva(id_reserva, id_servicios);
  }

  async obtenerServiciosDeReserva(id_reserva: number) {
    return this.repository.obtenerPorReserva(id_reserva);
  }
}
