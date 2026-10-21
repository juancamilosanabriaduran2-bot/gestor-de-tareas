import express from "express";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.url}`);
  next();
});

const tareas = [
  {
    titulo: "leer-un-libro",
    descripcion: "Vas a leer un libro de tu elección",
    estado: "pendiente",
    pasos: ["Abrir el libro", "Leer una página", "Cerrar el libro"],
  },
  {
    titulo: "ver-una-pelicula",
    descripcion: "Vas a ver una película de tu elección",
    estado: "completada",
    pasos: [
      "Seleccionar la película",
      "Iniciar la reproducción",
      "Cerrar la película",
    ],
  },
  {
    titulo: "escribir-un-diario",
    descripcion: "Vas a escribir en tu diario",
    estado: "activa",
    pasos: [
      "Abrir el diario",
      "Escribir algo relacionado a tu día a día",
      "Cerrar el diario",
    ],
  },
];

app.get("/tareas", (req, res) => {
  res.json(tareas);
});

app.get("/tareas/ob/:estado", (req, res) => {
  const estados = String(req.params.estado);

  const estado = tareas.find((t) => t.estado === estados.toLowerCase());

  if (!estado) {
    return res
      .status(404)
      .json({ message: `No existe la tarea con estado ${estados}.` });
  }

  res.json(estado);
});

app.get("/tareas/:titulo", (req, res) => {
  const titulo = String(req.params.titulo);

  const tarea = tareas.find((t) => t.titulo === titulo.toLowerCase());

  if (!tarea) {
    return res
      .status(404)
      .json({ message: `No existe la tarea con título ${titulo}.` });
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
    return res.status(400).json({
      error: `Faltan los siguientes campos obligatorios: ${faltantes.join(", ")}.`,
    });
  }
  {
  const nueva = {
    titulo,
    descripcion,
    estado,
    pasos
  };
  tareas.push(nueva);
  return res.status(201).json(nueva);
}});

app.use((req, res) => {
  res
    .status(404)
    .json({ message: `No existe la ruta ${req.method} ${req.url}` });
});

app.listen(3002, () => {
  console.log("Servidor escuchando en el puerto http://localhost:3002");
});
