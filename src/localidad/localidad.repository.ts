import { Localidad, LocalidadCreate } from './localidad.entity';

export class LocalidadRepository {
  private localidades: Localidad[] = [];
  private currentId: number = 1;

  // Crear
  create(data: LocalidadCreate): Localidad {
    const nuevaLocalidad: Localidad = {
      id: this.currentId++,
      nombre: data.nombre
    };
    this.localidades.push(nuevaLocalidad);
    return nuevaLocalidad;
  }

  // Leer todas
  findAll(): Localidad[] {
    return this.localidades;
  }

  // Leer por ID
  findById(id: number): Localidad | undefined {
    return this.localidades.find(loc => loc.id === id);
  }

  // Actualizar
  update(id: number, nombre: string): Localidad | null {
    const index = this.localidades.findIndex(loc => loc.id === id);
    if (index === -1) return null;
    
    this.localidades[index].nombre = nombre;
    return this.localidades[index];
  }

  // Eliminar
  delete(id: number): boolean {
    const index = this.localidades.findIndex(loc => loc.id === id);
    if (index === -1) return false;
    
    this.localidades.splice(index, 1);
    return true;
  }
}
