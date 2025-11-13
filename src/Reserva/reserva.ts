import { ReservaRepository } from './reserva.repository';
import { ReservaCreate, Reserva } from './reserva.entity';
import { pool } from '../database/connection';

export class ReservaService {
  private repository: ReservaRepository;

  constructor() {
    this.repository = new ReservaRepository();
  }

  // 🔹 Calcular diferencia de horas exacta
  private calcularHoras(hora_inicio: string, hora_fin: string): number {
    const inicio = new Date(`2000-01-01T${hora_inicio}`);
    const fin = new Date(`2000-01-01T${hora_fin}`);
    const diffMs = fin.getTime() - inicio.getTime();
    const diffHoras = diffMs / (1000 * 60 * 60);
    return Math.max(diffHoras, 1); // Mínimo 1 hora
  }

  // 🔹 Obtener precio vigente de la cancha
 private async obtenerPrecioVigente(id_cancha: number, fecha: string): Promise<number> {
  const [rows] = await pool.query(
    `SELECT valor_por_hora FROM precio 
     WHERE id_cancha = ? AND fecha_vigencia <= ? 
     ORDER BY fecha_vigencia DESC LIMIT 1`,
    [id_cancha, fecha]
  );
  
  const precios = rows as any[];
  if (precios.length === 0) {
    // ❌ CAMBIAR: precio_por_hora → precio
    const [rowsCancha] = await pool.query(
      'SELECT precio FROM cancha WHERE id_cancha = ?', // ✅ Cambiado
      [id_cancha]
    );
    const cancha = (rowsCancha as any[])[0];
    if (!cancha) {
      throw new Error(`No se encontró la cancha ${id_cancha}`);
    }
    return cancha.precio; // ✅ Cambiado
  }
  
  return precios[0].valor_por_hora;
}
  // 🔹 Calcular precio total automáticamente - CORREGIDO
  private async calcularPrecioTotal(data: {
    id_cancha: number;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
    id_servicios?: number[];
  }): Promise<number> {
    let precio_total = 0;

    // 1. Precio cancha (usando entidad precio)
    const precioPorHora = await this.obtenerPrecioVigente(data.id_cancha, data.fecha);
    const horas = this.calcularHoras(data.hora_inicio, data.hora_fin);
    const precioCancha = precioPorHora * horas;
    precio_total += precioCancha;

    console.log(`💰 Cálculo precio - Cancha: ${precioCancha}, Horas: ${horas}, Precio/hora: ${precioPorHora}`);

    // 2. Precio servicios - CORREGIDO: asegurar que sean números
    if (data.id_servicios && data.id_servicios.length > 0) {
      const placeholders = data.id_servicios.map(() => '?').join(',');
      const [rowsServicios] = await pool.query(
        `SELECT precio_servicio FROM servicio WHERE id_servicio IN (${placeholders})`,
        data.id_servicios
      );
      
      // CORREGIDO: asegurar que se suman números
      const sumaServicios = (rowsServicios as any[]).reduce((acc, s) => {
        const precio = Number(s.precio_servicio) || 0;
        return acc + precio;
      }, 0);
      
      precio_total += sumaServicios;
      console.log(`💰 Cálculo precio - Servicios: ${sumaServicios}, Total servicios: ${data.id_servicios.length}`);
    }

    console.log(`💰 Cálculo precio - Total final: ${precio_total}`);
    return precio_total;
  }

  // 🔹 Crear reserva con cálculo automático
  async crearReserva(data: ReservaCreate): Promise<Reserva> {
    // Calcular precio total automáticamente
    const precioCalculado = await this.calcularPrecioTotal({
      id_cancha: data.id_cancha,
      fecha: data.fecha,
      hora_inicio: data.hora_inicio,
      hora_fin: data.hora_fin,
      id_servicios: data.id_servicios
    });

    // CORREGIDO: asegurar que el precio es un número válido
    data.precio_total = Number(precioCalculado.toFixed(2));

    console.log(`✅ Reserva creada - Precio total: ${data.precio_total}`);
    return this.repository.create(data);
  }

  // 🔹 Obtener todas las reservas con información completa
  async obtenerTodasConServicios(): Promise<any[]> {
    const reservas = await this.repository.findAllWithServicios();
    
    // Obtener información de usuarios y canchas para mostrar nombres
    const [usuarios] = await pool.query('SELECT id_usuario, nombre, apellido FROM usuario');
    const [canchas] = await pool.query('SELECT id_cancha, nombre FROM cancha');
    
    const usuariosMap = new Map((usuarios as any[]).map(u => [u.id_usuario, u]));
    const canchasMap = new Map((canchas as any[]).map(c => [c.id_cancha, c]));
    
    return reservas.map(reserva => {
      const usuario = usuariosMap.get(reserva.id_usuario);
      const cancha = canchasMap.get(reserva.id_cancha);
      
      return {
        id_reserva: reserva.id_reserva,
        id_usuario: reserva.id_usuario,
        usuario_nombre: usuario ? `${usuario.nombre} ${usuario.apellido}` : `Usuario ${reserva.id_usuario}`,
        id_cancha: reserva.id_cancha,
        cancha_nombre: cancha ? cancha.nombre : `Cancha ${reserva.id_cancha}`,
        fecha: reserva.fecha,
        hora_inicio: reserva.hora_inicio,
        hora_fin: reserva.hora_fin,
        precio_total: reserva.precio_total,
        servicios: reserva.servicios && reserva.servicios.length > 0 
          ? reserva.servicios.map((s: any) => s.nombre).join(', ')
          : '-'
      };
    });
  }

  // 🔹 Obtener reserva por ID con información completa
  async obtenerPorIdConServicios(id_reserva: number) {
    const reserva = await this.repository.findByIdWithServicios(id_reserva);
    if (reserva) {
      // Obtener información de usuario y cancha
      const [usuarios] = await pool.query('SELECT id_usuario, nombre, apellido FROM usuario WHERE id_usuario = ?', [reserva.id_usuario]);
      const [canchas] = await pool.query('SELECT id_cancha, nombre FROM cancha WHERE id_cancha = ?', [reserva.id_cancha]);
      
      const usuario = (usuarios as any[])[0];
      const cancha = (canchas as any[])[0];
      
      return {
        ...reserva,
        usuario_nombre: usuario ? `${usuario.nombre} ${usuario.apellido}` : `Usuario ${reserva.id_usuario}`,
        cancha_nombre: cancha ? cancha.nombre : `Cancha ${reserva.id_cancha}`,
        servicios: reserva.servicios && reserva.servicios.length > 0 
          ? reserva.servicios.map((s: any) => s.nombre).join(', ')
          : '-'
      };
    }
    return null;
  }

  // 🔹 Actualizar reserva con cálculo automático
  async actualizarReserva(reservaData: any): Promise<Reserva> {
    // Obtener servicios actuales de la reserva
    const serviciosActuales = await this.repository.findServiciosByReserva(reservaData.id_reserva);
    const id_servicios_actuales = serviciosActuales.map(s => s.id_servicio);
    
    // Combinar servicios existentes con los nuevos si se proporcionan
    const id_servicios = reservaData.id_servicios || id_servicios_actuales;

    // Calcular precio total automáticamente
    const precio_total = await this.calcularPrecioTotal({
      id_cancha: reservaData.id_cancha,
      fecha: reservaData.fecha,
      hora_inicio: reservaData.hora_inicio,
      hora_fin: reservaData.hora_fin,
      id_servicios: id_servicios
    });

    // CORREGIDO: asegurar que el precio es un número válido
    const precioTotalFinal = Number(precio_total.toFixed(2));

    console.log(`✅ Reserva actualizada - Precio total: ${precioTotalFinal}`);

    // Actualizar reserva
    const reservaActualizada: Reserva = {
      id_reserva: reservaData.id_reserva,
      id_usuario: reservaData.id_usuario,
      id_cancha: reservaData.id_cancha,
      fecha: reservaData.fecha,
      hora_inicio: reservaData.hora_inicio,
      hora_fin: reservaData.hora_fin,
      precio_total: precioTotalFinal
    };

    await this.repository.actualizar(reservaActualizada);

    // Actualizar servicios si se proporcionaron nuevos
    if (reservaData.id_servicios) {
      // Eliminar servicios actuales
      await pool.query('DELETE FROM reserva_servicio WHERE id_reserva = ?', [reservaData.id_reserva]);
      
      // Agregar nuevos servicios
      if (reservaData.id_servicios.length > 0) {
        await this.repository.addServicios(reservaData.id_reserva, reservaData.id_servicios);
      }
    }

    return reservaActualizada;
  }

  // 🔹 Calcular precio en tiempo real (para el frontend) - CORREGIDO
  async calcularPrecioEnTiempoReal(data: {
    id_cancha: number;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
    id_servicios: number[];
  }): Promise<{ precio_total: number; precio_cancha: number; precio_servicios: number }> {
    const precioPorHora = await this.obtenerPrecioVigente(data.id_cancha, data.fecha);
    const horas = this.calcularHoras(data.hora_inicio, data.hora_fin);
    const precio_cancha = Number((precioPorHora * horas).toFixed(2));

    let precio_servicios = 0;
    if (data.id_servicios && data.id_servicios.length > 0) {
      const placeholders = data.id_servicios.map(() => '?').join(',');
      const [rowsServicios] = await pool.query(
        `SELECT precio_servicio FROM servicio WHERE id_servicio IN (${placeholders})`,
        data.id_servicios
      );
      
      // CORREGIDO: asegurar que se suman números
      precio_servicios = (rowsServicios as any[]).reduce((acc, s) => {
        const precio = Number(s.precio_servicio) || 0;
        return acc + precio;
      }, 0);
      
      precio_servicios = Number(precio_servicios.toFixed(2));
    }

    const precio_total = Number((precio_cancha + precio_servicios).toFixed(2));

    console.log(`💰 Cálculo tiempo real - Cancha: ${precio_cancha}, Servicios: ${precio_servicios}, Total: ${precio_total}`);

    return {
      precio_total,
      precio_cancha,
      precio_servicios
    };
  }

  // Mantener los demás métodos igual...
  async agregarServicios(id_reserva: number, id_servicios: number[]): Promise<void> {
    // Sumar precios de servicios
    if (id_servicios.length > 0) {
      const placeholders = id_servicios.map(() => '?').join(',');
      const [rowsServicios] = await pool.query(
        `SELECT precio_servicio FROM servicio WHERE id_servicio IN (${placeholders})`,
        id_servicios
      );
      
      // CORREGIDO: asegurar que se suman números
      const sumaServicios = (rowsServicios as any[]).reduce((acc, s) => {
        const precio = Number(s.precio_servicio) || 0;
        return acc + precio;
      }, 0);

      // Actualizar precio total
      await pool.query(
        'UPDATE reserva SET precio_total = precio_total + ? WHERE id_reserva = ?', 
        [sumaServicios, id_reserva]
      );
    }

    // Guardar servicios
    return this.repository.addServicios(id_reserva, id_servicios);
  }

  async eliminarServicio(id_reserva: number, id_servicio: number) {
    // Obtener precio del servicio
    const [rows] = await pool.query('SELECT precio_servicio FROM servicio WHERE id_servicio = ?', [id_servicio]);
    const servicios = rows as any[];
    
    if (servicios.length > 0) {
      const servicio = servicios[0];
      const precio = Number(servicio.precio_servicio) || 0;
      // Actualizar precio total
      await pool.query('UPDATE reserva SET precio_total = precio_total - ? WHERE id_reserva = ?', [precio, id_reserva]);
    }

    return this.repository.removeServicio(id_reserva, id_servicio);
  }

 async eliminarReserva(id_reserva: number) {
    // CORREGIDO: Solo pasar el id_reserva
    return this.repository.delete(id_reserva);
  }

  async obtenerServicios(id_reserva: number) {
    return this.repository.findServiciosByReserva(id_reserva);
  }
 async verificarDisponibilidad(data: {
    id_cancha: number;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
  }): Promise<boolean> {
    const [reservasExistentes] = await pool.query(
      `SELECT * FROM reserva 
       WHERE id_cancha = ? AND fecha = ? 
       AND (
         (hora_inicio < ? AND hora_fin > ?) OR
         (hora_inicio >= ? AND hora_inicio < ?) OR
         (hora_fin > ? AND hora_fin <= ?)
       )`,
      [
        data.id_cancha, data.fecha,
        data.hora_fin, data.hora_inicio,
        data.hora_inicio, data.hora_fin,
        data.hora_inicio, data.hora_fin
      ]
    );

    return (reservasExistentes as any[]).length === 0;
  }

  // 🔹 NUEVO: Obtener reservas por usuario
  async obtenerPorUsuario(id_usuario: number): Promise<any[]> {
    const reservas = await this.repository.findByUsuario(id_usuario);
    
    // Enriquecer con información de canchas y servicios
    const reservasCompletas = await Promise.all(
      reservas.map(async (reserva) => {
        const servicios = await this.repository.findServiciosByReserva(reserva.id_reserva);
        
        // Obtener información de la cancha
        const [canchas] = await pool.query(
          `SELECT c.nombre, l.nombre as localidad, t.nombre as tipo, t.deporte 
           FROM cancha c 
           LEFT JOIN localidad l ON c.id_localidad = l.id_localidad
           LEFT JOIN tipo_cancha t ON c.id_tipo = t.id_tipo
           WHERE c.id_cancha = ?`,
          [reserva.id_cancha]
        );
        
        const cancha = (canchas as any[])[0] || {};
        
        return {
          ...reserva,
          cancha_nombre: cancha.nombre,
          localidad: cancha.localidad,
          deporte: cancha.deporte,
          tipo_cancha: cancha.tipo,
          servicios: servicios.map(s => s.nombre)
        };
      })
    );
    
    return reservasCompletas;
  }

  // 🔹 NUEVO: Permitir modificación solo si el pago está pendiente
  async puedeModificar(id_reserva: number): Promise<boolean> {
    // Verificar si existe un pago completado para esta reserva
    const [pagos] = await pool.query(
      'SELECT estado FROM pago WHERE id_reserva = ? ORDER BY fecha_creacion DESC LIMIT 1',
      [id_reserva]
    );
    
    const pago = (pagos as any[])[0];
    
    // Si no hay pago o el pago está pendiente, se puede modificar
    return !pago || pago.estado === 'pendiente';
  }
}