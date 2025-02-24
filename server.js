const express = require("express");
const cors = require("cors");
const fs = require("fs");
const productsRouter = require("./routes/products.routes.js");
const cartsRouter = require("./routes/carts.routes.js");


const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

const ensureFileExists = (filePath) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]"); 
  }
};

ensureFileExists("./Data/products.json");
ensureFileExists("./Data/carts.json");


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);


app.use((err, req, res, next) => {
  console.error("Error en el servidor:", err.stack);
  res.status(500).json({ error: "Ocurrió un error en el servidor" });
});


app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
