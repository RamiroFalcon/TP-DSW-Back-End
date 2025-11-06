import { ReservaRepository } from './reserva.repository';
import { ReservaCreate, Reserva } from './reserva.entity';
import { pool } from '../database/connection';

export class ReservaService {
  private repository: ReservaRepository;

  constructor() {
    this.repository = new ReservaRepository();
  }

  // Crear reserva y calcular precio total (cancha + servicios)
  async crearReserva(data: ReservaCreate): Promise<Reserva> {
    let precio_total = 0;

    // Precio cancha
    const [rowsCancha] = await pool.query('SELECT precio_por_hora FROM cancha WHERE id_cancha = ?', [data.id_cancha]);
    const cancha = (rowsCancha as any[])[0];
    const horas = Number(data.hora_fin.split(':')[0]) - Number(data.hora_inicio.split(':')[0]) || 1;
    precio_total += cancha.precio_por_hora * horas;

    // Precio servicios
    if (data.id_servicios && data.id_servicios.length > 0) {
      const [rowsServicios] = await pool.query(`SELECT precio FROM servicio WHERE id_servicio IN (${data.id_servicios.join(',')})`);
      const sumaServicios = (rowsServicios as any[]).reduce((acc, s) => acc + s.precio, 0);
      precio_total += sumaServicios;
    }

    data.precio_total = precio_total;

    return this.repository.create(data);
  }

  async obtenerTodasConServicios() {
    return this.repository.findAllWithServicios();
  }

  async obtenerPorIdConServicios(id_reserva: number) {
    return this.repository.findByIdWithServicios(id_reserva);
  }

  async agregarServicios(id_reserva: number, id_servicios: number[]) {
    // Sumar precios de servicios
    const [rowsServicios] = await pool.query(`SELECT precio FROM servicio WHERE id_servicio IN (${id_servicios.join(',')})`);
    const sumaServicios = (rowsServicios as any[]).reduce((acc, s) => acc + s.precio, 0);

    // Actualizar precio total
    await pool.query('UPDATE reserva SET precio_total = precio_total + ? WHERE id_reserva = ?', [sumaServicios, id_reserva]);

    // Guardar servicios
    return this.repository.addServicios(id_reserva, id_servicios);
  }

  async eliminarServicio(id_reserva: number, id_servicio: number) {
    // Obtener precio del servicio
    const [rows] = await pool.query('SELECT precio FROM servicio WHERE id_servicio = ?', [id_servicio]);
    const servicio = (rows as any[])[0];

    // Actualizar precio total
    await pool.query('UPDATE reserva SET precio_total = precio_total - ? WHERE id_reserva = ?', [servicio.precio, id_reserva]);

    return this.repository.removeServicio(id_reserva, id_servicio);
  }

  async eliminarReserva(id_reserva: number) {
    return this.repository.delete(id_reserva, 0, 0); // Podés ajustar id_usuario/id_cancha si querés
  }

  async actualizarReserva(reserva: Reserva) {
    // Recalcular precio cancha
    const horaInicio = Number(reserva.hora_inicio.split(':')[0]);
    const horaFin = Number(reserva.hora_fin.split(':')[0]);
    const horas = horaFin - horaInicio || 1;
    const [rowsCancha] = await pool.query('SELECT precio_por_hora FROM cancha WHERE id_cancha = ?', [reserva.id_cancha]);
    const cancha = (rowsCancha as any[])[0];
    let precio_total = cancha.precio_por_hora * horas;

    // Precio servicios
    const servicios = await this.repository.findServiciosByReserva(reserva.id_reserva);
    precio_total += servicios.reduce((acc, s) => acc + s.precio, 0);

    reserva.precio_total = precio_total;

    return this.repository.actualizar(reserva);
  }
  async obtenerServicios(id_reserva: number) {
    return this.repository.findServiciosByReserva(id_reserva);
  }
}