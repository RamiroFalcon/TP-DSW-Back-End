import express from 'express'
import { canchaRouter } from './cancha/cancha.routes.js'
import { tipoCanchaRouter } from './tipo-cancha/tipo-cancha.routes.js'
import { localidadRouter } from './localidad/localidad.routes.js'
import { usuarioRouter } from './usuario/usuario.routes.js'
import { reservaRouter } from './reserva/reserva.routes.js'

const app = express();
app.use(express.json());

app.use('/api/canchas', canchaRouter);
app.use('/api/tipo-canchas', tipoCanchaRouter);
app.use('/api/localidades', localidadRouter);
app.use('/api/usuarios', usuarioRouter);
app.use('/api/reservas', reservaRouter);

app.use((_, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});