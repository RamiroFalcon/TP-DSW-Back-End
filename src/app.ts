import express from 'express';
import canchaRouter from './cancha/cancha.routes.js';
import usuarioRouter from './usuario/usuario.routes.js';
import tipoCanchaRouter from './tipo_cancha/tipo-cancha.routes.js';
import localidadRouter from './Localidad/localidad.routes.js';
import reservaRouter from './reserva/reserva.routes.js';
import precioRoutes from './precio/precio.routes';
import servicioRoutes from './servicio/servicio.routes';
import reservaServicioRoutes from './reserva-servicio/reserva-servicio.routes.js';


const app = express();
app.use(express.json());

// ✅ Montar rutas principales (sin volver a escribir /api adentro del router)
app.use('/api/canchas', canchaRouter);
app.use('/api/usuarios', usuarioRouter);
app.use('/api/tipo-canchas', tipoCanchaRouter);
app.use('/api/localidades', localidadRouter);
app.use('/api/reservas', reservaRouter);
app.use('/precios', precioRoutes);
app.use('/servicios', servicioRoutes);
app.use('/reserva-servicio', reservaServicioRoutes);

// Manejador de rutas inexistentes
app.use((_, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
