export interface Pago {
  id_pago: number;
  id_reserva: number;
  monto: number;
  estado: 'pendiente' | 'completado' | 'fallido' | 'reembolsado';
  metodo_pago?: 'tarjeta' | 'efectivo' | 'transferencia';
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  transaccion_id?: string;
}

export interface PagoCreate {
  id_reserva: number;
  monto: number;
  metodo_pago?: 'tarjeta' | 'efectivo' | 'transferencia';
}

export interface PagoUpdate {
  estado?: 'pendiente' | 'completado' | 'fallido' | 'reembolsado';
  transaccion_id?: string;
}