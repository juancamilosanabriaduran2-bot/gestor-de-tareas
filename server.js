import express from "express";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.url}`);
  next();
});

const tareas = [
  { titulo: "leer-un-libro", descripcion: "Vas a leer un libro de tu elección", estado: "pendiente", pasos: ["Abrir el libro", "Leer una página", "Cerrar el libro"] },
  { titulo: "ver-una-pelicula", descripcion: "Vas a ver una película de tu elección", estado: "completada", pasos: ["Seleccionar la película", "Iniciar la reproducción", "Cerrar la película"] },
  { titulo: "escribir-un-diario", descripcion: "Vas a escribir en tu diario", estado: "activa", pasos: ["Abrir el diario", "Escribir algo relacionado a tu día a día", "Cerrar el diario"] },
];

app.get("/tareas", (req, res) => {
  res.json(tareas);
});

app.get("/tareas/ob/:estado", (req, res) => {
  const estado = req.params.estado.toLowerCase();
  const resultado = tareas.filter((t) => t.estado === estado);
  if (resultado.length === 0) {
    return res.status(404).json({ message: `No hay tareas con estado ${estado}.` });
  }
  res.json(resultado);
});

app.get("/tareas/:titulo", (req, res) => {
  const titulo = req.params.titulo.toLowerCase();
  const tarea = tareas.find((t) => t.titulo.toLowerCase() === titulo);
  if (!tarea) {
    return res.status(404).json({ message: `No existe la tarea con título ${titulo}.` });
  }
  res.json(tarea);
});

app.post("/tareas", (req, res) => {
  const { titulo, descripcion, estado, pasos } = req.body;
  const faltantes = [];
  if (!titulo) faltantes.push("titulo");
  if (!descripcion) faltantes.push("descripcion");
  if (!estado) faltantes.push("estado");
  if (!pasos) faltantes.push("pasos");
  if (faltantes.length > 0) {
    return res.status(400).json({ error: `Faltan los siguientes campos obligatorios: ${faltantes.join(", ")}.` });
  }
  if (tareas.some((t) => t.titulo.toLowerCase() === titulo.toLowerCase())) {
    return res.status(409).json({ message: "Ya existe una tarea con ese título." });
  }
  const nueva = { titulo, descripcion, estado, pasos };
  tareas.push(nueva);
  res.status(201).json(nueva);
});

app.put("/tareas/:titulo", (req, res) => {
  const tarea = tareas.find((t) => t.titulo.toLowerCase() === req.params.titulo.toLowerCase());
  if (!tarea) return res.status(404).json({ message: "No existe la tarea solicitada." });
  const { titulo, descripcion, estado, pasos } = req.body;
  if (!titulo || !descripcion || !estado || !pasos) {
    return res.status(400).json({ message: "Envía titulo, descripcion, estado y pasos." });
  }
  if (titulo.toLowerCase() !== tarea.titulo.toLowerCase() && tareas.some((t) => t.titulo.toLowerCase() === titulo.toLowerCase())) {
    return res.status(409).json({ message: "Ya existe una tarea con ese título." });
  }
  tarea.titulo = titulo;
  tarea.descripcion = descripcion;
  tarea.estado = estado;
  tarea.pasos = pasos;
  res.json(tarea);
});

app.patch("/tareas/:titulo/estado", (req, res) => {
  const tarea = tareas.find((t) => t.titulo.toLowerCase() === req.params.titulo.toLowerCase());
  if (!tarea) return res.status(404).json({ message: "No existe la tarea solicitada." });
  const { estado } = req.body;
  if (!estado) return res.status(400).json({ message: "Envía el campo estado." });
  tarea.estado = estado;
  res.json(tarea);
});

app.delete("/tareas/:titulo", (req, res) => {
  const indice = tareas.findIndex((t) => t.titulo.toLowerCase() === req.params.titulo.toLowerCase());
  if (indice === -1) return res.status(404).json({ message: "No existe la tarea solicitada." });
  const eliminada = tareas.splice(indice, 1);
  res.json({ message: "Tarea eliminada.", tarea: eliminada[0] });
});

app.use((req, res) => {
  res.status(404).json({ message: `No existe la ruta ${req.method} ${req.url}` });
});

app.listen(3002, () => {
  console.log("Servidor escuchando en el puerto http://localhost:3002");
});
