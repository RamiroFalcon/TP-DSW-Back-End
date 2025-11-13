import { CanchaRepository } from '../cancha/cancha.repository.js';
import { pool } from '../database/connection.js';
import { RowDataPacket } from 'mysql2';
import { DisponibilidadRequest, FranjaHoraria } from '../cancha/cancha.entity.js';

export class DisponibilidadService {
  constructor(private canchaRepository: CanchaRepository) {}

  async obtenerHorariosDisponibles(datos: DisponibilidadRequest): Promise<FranjaHoraria[]> {
    console.log('🕐 Obteniendo horarios para:', datos);
    
    // 1. Obtener configuración de la cancha
    const cancha = await this.canchaRepository.findById(datos.id_cancha);
    if (!cancha) {
      throw new Error('Cancha no encontrada');
    }

    // 2. Obtener reservas existentes para ese día
    const [reservasRows] = await pool.query<RowDataPacket[]>(
      'SELECT id_reserva, hora_inicio, hora_fin FROM reserva WHERE id_cancha = ? AND fecha = ?',
      [datos.id_cancha, datos.fecha]
    );

    const reservas = reservasRows as Array<{
      id_reserva: number;
      hora_inicio: string;
      hora_fin: string;
    }>;

    console.log(`📅 Reservas existentes: ${reservas.length}`);

    // 3. Generar franjas horarias de 1 hora (08:00 a 22:00)
    const franjas: FranjaHoraria[] = [];
    
    for (let hora = 8; hora < 22; hora++) {
      const horaInicioStr = `${hora.toString().padStart(2, '0')}:00:00`;
      const horaFinStr = `${(hora + 1).toString().padStart(2, '0')}:00:00`;

      // Verificar si esta franja está reservada
      const reservaExistente = reservas.find(reserva => {
        const reservaInicio = this.timeToMinutes(reserva.hora_inicio);
        const reservaFin = this.timeToMinutes(reserva.hora_fin);
        const franjaInicio = hora * 60;
        const franjaFin = (hora + 1) * 60;

        // Hay conflicto si se superponen
        return franjaInicio < reservaFin && franjaFin > reservaInicio;
      });

      franjas.push({
        hora_inicio: horaInicioStr,
        hora_fin: horaFinStr,
        disponible: !reservaExistente,
        reserva_id: reservaExistente?.id_reserva
      });
    }

    console.log(`⏰ Franjas generadas: ${franjas.length}, disponibles: ${franjas.filter(f => f.disponible).length}`);
    return franjas;
  }

  async verificarDisponibilidad(
    id_cancha: number,
    fecha: string,
    hora_inicio: string,
    hora_fin: string
  ): Promise<boolean> {
    const [reservasRows] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM reserva WHERE id_cancha = ? AND fecha = ? AND ((hora_inicio < ? AND hora_fin > ?) OR (hora_inicio < ? AND hora_fin > ?))',
      [id_cancha, fecha, hora_fin, hora_inicio, hora_inicio, hora_fin]
    );

    const count = (reservasRows[0] as any).count;
    return count === 0;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}