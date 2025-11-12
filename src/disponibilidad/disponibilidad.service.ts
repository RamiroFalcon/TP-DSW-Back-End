import { CanchaRepository } from '../cancha/cancha.repository';
import { pool } from '../database/connection';
import { RowDataPacket } from 'mysql2';
import { DisponibilidadRequest, FranjaHoraria } from '../cancha/cancha.entity';

export class DisponibilidadService {
  private readonly DURACION_TURNO = 60; // 1 hora

  constructor(private canchaRepository: CanchaRepository) {}

  async obtenerHorariosDisponibles(datos: DisponibilidadRequest): Promise<FranjaHoraria[]> {
    const cancha = await this.canchaRepository.findById(datos.id_cancha);
    if (!cancha) {
      throw new Error('Cancha no encontrada');
    }

    // Obtener reservas del día
    const [reservasRows] = await pool.query<RowDataPacket[]>(
      'SELECT id_reserva, hora_inicio, hora_fin FROM reserva WHERE id_cancha = ? AND fecha = ?',
      [datos.id_cancha, datos.fecha]
    );
    const reservas = reservasRows as Array<{ id_reserva: number; hora_inicio: string; hora_fin: string }>;

    // Generar franjas de 1 hora
    const franjas: FranjaHoraria[] = [];
    let horaActual = this.timeToMinutes(cancha.hora_apertura);
    const horaFin = this.timeToMinutes(cancha.hora_cierre);

    while (horaActual + this.DURACION_TURNO <= horaFin) {
      const siguienteHora = horaActual + this.DURACION_TURNO;
      const horaInicioStr = this.minutesToTime(horaActual);
      const horaFinStr = this.minutesToTime(siguienteHora);

      const reserva = reservas.find(res => {
        const resInicio = this.timeToMinutes(res.hora_inicio);
        const resFin = this.timeToMinutes(res.hora_fin);
        return horaActual < resFin && siguienteHora > resInicio;
      });

      franjas.push({
        hora_inicio: horaInicioStr,
        hora_fin: horaFinStr,
        disponible: !reserva,
        reserva_id: reserva?.id_reserva
      });

      horaActual = siguienteHora;
    }

    return franjas;
  }

  async verificarDisponibilidad(id_cancha: number, fecha: string, hora_inicio: string, hora_fin: string): Promise<boolean> {
    const inicio = this.timeToMinutes(hora_inicio);
    const fin = this.timeToMinutes(hora_fin);
    
    if (fin - inicio !== this.DURACION_TURNO) {
      throw new Error('La reserva debe ser de exactamente 1 hora');
    }

    const franjas = await this.obtenerHorariosDisponibles({ id_cancha, fecha });
    const franja = franjas.find(f => 
      f.hora_inicio === hora_inicio + ':00' && 
      f.hora_fin === hora_fin + ':00'
    );

    return franja?.disponible || false;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:00`;
  }
}