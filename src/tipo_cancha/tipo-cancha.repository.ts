import { TipoCancha, TipoCanchaCreate } from './tipo-cancha.entity';

export class TipoCanchaRepository {
  private tiposCanchas: TipoCancha[] = [];
  private currentId: number = 1;

  create(data: TipoCanchaCreate): TipoCancha {
    const nuevoTipo: TipoCancha = {
      id_tipo: this.currentId++,
      nombre: data.nombre,
      deporte: data.deporte
    };
    this.tiposCanchas.push(nuevoTipo);
    return nuevoTipo;
  }

  findAll(): TipoCancha[] {
    return this.tiposCanchas;
  }

  findById(id: number): TipoCancha | undefined {
    return this.tiposCanchas.find(tipo => tipo.id_tipo === id);
  }

  update(id: number, data: Partial<TipoCancha>): TipoCancha | null {
    const index = this.tiposCanchas.findIndex(tipo => tipo.id_tipo === id);
    if (index === -1) return null;
    
    this.tiposCanchas[index] = { ...this.tiposCanchas[index], ...data };
    return this.tiposCanchas[index];
  }

  delete(id: number): boolean {
    const index = this.tiposCanchas.findIndex(tipo => tipo.id_tipo === id);
    if (index === -1) return false;
    
    this.tiposCanchas.splice(index, 1);
    return true;
  }
}
