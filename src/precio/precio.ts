import { PrecioRepository, PrecioCreate } from './precio.repository';

export class PrecioService {
  private repository: PrecioRepository;

  constructor() {
    this.repository = new PrecioRepository();
  }

  async crear(data: PrecioCreate): Promise<number> {
    return this.repository.create(data);
  }

  async obtenerPorCancha(id_cancha: number) {
    return this.repository.findByCancha(id_cancha);
  }

  async obtenerPrecioActual(id_cancha: number) {
    const precio = await this.repository.findActualByCancha(id_cancha);
    if (!precio) throw new Error('No hay precio vigente para esta cancha');
    return precio;
  }

  async actualizar(id_precio: number, valor_por_hora: number) {
    return this.repository.update(id_precio, valor_por_hora);
  }

  async eliminar(id_precio: number) {
    return this.repository.delete(id_precio);
  }
}
