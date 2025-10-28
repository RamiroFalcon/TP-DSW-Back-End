import { Cancha, CanchaCreate } from './cancha.entity';

export class CanchaRepository {
  private canchas: Cancha[] = [];
  private currentId: number = 1;

  create(data: CanchaCreate): Cancha {
    const nuevaCancha: Cancha = {
      id_cancha: this.currentId++,
      nombre: data.nombre,
      estado: data.estado,
      id_tipo: data.id_tipo
    };
    this.canchas.push(nuevaCancha);
    return nuevaCancha;
  }

  findAll(): Cancha[] {
    return this.canchas;
  }

  findById(id: number): Cancha | undefined {
    return this.canchas.find(cancha => cancha.id_cancha === id);
  }

  findByTipo(id_tipo: number): Cancha[] {
    return this.canchas.filter(cancha => cancha.id_tipo === id_tipo);
  }

  update(id: number, data: Partial<Cancha>): Cancha | null {
    const index = this.canchas.findIndex(cancha => cancha.id_cancha === id);
    if (index === -1) return null;
    
    this.canchas[index] = { ...this.canchas[index], ...data };
    return this.canchas[index];
  }

  delete(id: number): boolean {
    const index = this.canchas.findIndex(cancha => cancha.id_cancha === id);
    if (index === -1) return false;
    
    this.canchas.splice(index, 1);
    return true;
  }
}
