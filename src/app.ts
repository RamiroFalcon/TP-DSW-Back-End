import express from 'express'
import { canchaRouter } from './cancha/cancha.routes.js'


const app = express();
app.use(express.json());

app.use('/api/canchas', canchaRouter);

app.use((_, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

