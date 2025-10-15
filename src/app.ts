import express from 'express';

const app = express(); 

const canchas = [
    { id_cancha: 1, nombre: "Cancha 1", estado: "disponible" },
    { id_cancha: 2, nombre: "Cancha 2", estado: "ocupada" },
    { id_cancha: 3, nombre: "Cancha 3", estado: "mantenimiento" }
];


app.get("/api/canchas", (req, res) => {
    res.json(canchas);  
});

app.get("/api/canchas/:id", (req, res) => {
    const cancha = canchas.find(c => c.id_cancha === parseInt(req.params.id));
    if (!cancha) {
        return res.status(404).json({ message: "Cancha no encontrada" });
    }
    res.json(cancha);
});

app.use("/", (req, res) => {
  res.json({ message: 'Hello World!' });
} );

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000/');
}); 

