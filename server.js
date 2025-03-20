const express = require("express");
const cors = require("cors");
const { engine } = require("express-handlebars");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const ProductManager = require("./managers/ProductManager");

const productsRouter = require("./routes/products.routes.js");
const cartsRouter = require("./routes/carts.routes.js");

const app = express();
const PORT = 8080;
const server = http.createServer(app);
const io = socketIo(server);

// 🔥 Conexión a Mongo
const connectDB = require('./db.js');
connectDB();

const productManager = new ProductManager();

// Middlewares
app.use(express.json());
app.use(cors());

// Configuración de Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Rutas API
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Rutas de vistas
app.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("home", { products });
});

app.get("/realtimeproducts", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", { products });
});

// WebSockets
io.on("connection", async (socket) => {
    console.log("🟢 Cliente conectado");

    // Enviar productos actuales
    socket.emit("updateProducts", await productManager.getProducts());

    // Agregar producto
    socket.on("newProduct", async (product) => {
        const newProduct = await productManager.addProduct(product);
        io.emit("updateProducts", await productManager.getProducts());
    });

    // Eliminar producto
    socket.on("deleteProduct", async (id) => {
        await productManager.deleteProduct(Number(id));
        io.emit("updateProducts", await productManager.getProducts());
    });

    socket.on("disconnect", () => console.log("🔴 Cliente desconectado"));
});

// Iniciar servidor
server.listen(PORT, () => console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`));
