import { LocalidadRepository } from './localidad.repository';
import { Localidad, LocalidadCreate, LocalidadUpdate } from './localidad.entity';

export class LocalidadService {
  constructor(private repository: LocalidadRepository) {}

  crearLocalidad(data: LocalidadCreate): Localidad {
    // Validaciones
    if (!data.nombre || data.nombre.trim().length === 0) {
      throw new Error('El nombre de la localidad es requerido');
    }
    
    if (data.nombre.length > 100) {
      throw new Error('El nombre de la localidad no puede exceder 100 caracteres');
    }

    return this.repository.create(data);
  }

  obtenerTodas(): Localidad[] {
    return this.repository.findAll();
  }

  obtenerPorId(id: number): Localidad {
    const localidad = this.repository.findById(id);
    if (!localidad) {
      throw new Error(`Localidad con id ${id} no encontrada`);
    }
    return localidad;
  }

  actualizarLocalidad(id: number, data: LocalidadUpdate): Localidad {
    if (!data.nombre || data.nombre.trim().length === 0) {
      throw new Error('El nombre de la localidad es requerido');
    }

    if (data.nombre.length > 100) {
      throw new Error('El nombre de la localidad no puede exceder 100 caracteres');
    }

    const localidad = this.repository.update(id, data.nombre);
    if (!localidad) {
      throw new Error(`Localidad con id ${id} no encontrada`);
    }
    return localidad;
  }

  eliminarLocalidad(id: number): void {
    const eliminado = this.repository.delete(id);
    if (!eliminado) {
      throw new Error(`Localidad con id ${id} no encontrada`);
    }
  }
}
