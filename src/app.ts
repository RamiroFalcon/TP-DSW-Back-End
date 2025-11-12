import express from 'express';
import cors from 'cors';
import busquedaCanchaRouter from './busqueda-cancha/busqueda-cancha.routes.js'; 
import disponibilidadRouter from './disponibilidad/disponibilidad.routes.js';
import canchaRouter from './cancha/cancha.routes.js';
import usuarioRouter from './usuario/usuario.routes.js';
import tipoCanchaRouter from './tipo_cancha/tipo-cancha.routes.js';
import localidadRouter from './localidad/localidad.routes.js';
import reservaRouter from './reserva/reserva.routes.js';
import precioRoutes from './precio/precio.routes.js';
import servicioRoutes from './servicio/servicio.routes.js';
import reservaServicioRoutes from './reserva-servicio/reserva-servicio.routes.js';
import authRouter from './auth/auth.routes.js';


const app = express();
app.use(express.json());
app.use(cors()); 

// ✅ Montar rutas principales (sin volver a escribir /api adentro del router)
app.use('/api/canchas', canchaRouter);
app.use('/api/usuarios', usuarioRouter);
app.use('/api/tipo-canchas', tipoCanchaRouter); //para obtener deportes
app.use('/api/localidades', localidadRouter); //para obtener localidades
app.use('/api/reservas', reservaRouter);
app.use('/api/precios', precioRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/reserva-servicio', reservaServicioRoutes);
app.use('/api/auth', authRouter);
app.use('/api/buscar-canchas', busquedaCanchaRouter); //para buscar canchas
app.use('/api/disponibilidad', disponibilidadRouter);

// Manejador de rutas inexistentes
app.use((_, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
