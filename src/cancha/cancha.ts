import { CanchaRepository } from './cancha.repository';
import { Cancha, CanchaCreate, CanchaUpdate } from './cancha.entity';
import { TipoCanchaRepository } from './tipo-cancha.repository';

export class CanchaService {
  constructor(
    private repository: CanchaRepository,
    private tipoCanchaRepository: TipoCanchaRepository
  ) {}

  crearCancha(data: CanchaCreate): Cancha {
    if (!data.nombre || data.nombre.trim().length === 0) {
      throw new Error('El nombre de la cancha es requerido');
    }
    
    const estadosValidos = ['disponible', 'ocupada', 'mantenimiento'];
    if (!estadosValidos.includes(data.estado)) {
      throw new Error('Estado inválido. Debe ser: disponible, ocupada o mantenimiento');
    }

    // Verificar que el tipo de cancha existe
    const tipoCancha = this.tipoCanchaRepository.findById(data.id_tipo);
    if (!tipoCancha) {
      throw new Error(`Tipo de cancha con id ${data.id_tipo} no existe`);
    }

    return this.repository.create(data);
  }

  obtenerTodas(): Cancha[] {
    return this.repository.findAll();
  }

  obtenerPorId(id: number): Cancha {
    const cancha = this.repository.findById(id);
    if (!cancha) {
      throw new Error(`Cancha con id ${id} no encontrada`);
    }
    return cancha;
  }

  obtenerPorTipo(id_tipo: number): Cancha[] {
    return this.repository.findByTipo(id_tipo);
  }

  actualizarCancha(id: number, data: CanchaUpdate): Cancha {
    if (data.estado) {
      const estadosValidos = ['disponible', 'ocupada', 'mantenimiento'];
      if (!estadosValidos.includes(data.estado)) {
        throw new Error('Estado inválido');
      }
    }

    if (data.id_tipo) {
      const tipoCancha = this.tipoCanchaRepository.findById(data.id_tipo);
      if (!tipoCancha) {
        throw new Error(`Tipo de cancha con id ${data.id_tipo} no existe`);
      }
    }

    const cancha = this.repository.update(id, data);
    if (!cancha) {
      throw new Error(`Cancha con id ${id} no encontrada`);
    }
    return cancha;
  }

  eliminarCancha(id: number): void {
    const eliminado = this.repository.delete(id);
    if (!eliminado) {
      throw new Error(`Cancha con id ${id} no encontrada`);
    }
  }
}