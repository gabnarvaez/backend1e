const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { engine } = require("express-handlebars");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

const productsRouter = require("./routes/products.routes.js");
const cartsRouter = require("./routes/carts.routes.js");

const app = express();
const PORT = 8080;
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(cors());

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

const PRODUCTS_FILE = path.join(__dirname, "Data", "products.json");

const loadProducts = () => {
    try {
        if (!fs.existsSync(PRODUCTS_FILE)) {
            fs.writeFileSync(PRODUCTS_FILE, "[]");
        }
        return JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"));
    } catch (error) {
        console.error("❌ Error al cargar productos:", error);
        return [];
    }
};

const saveProducts = (products) => {
    try {
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    } catch (error) {
        console.error("❌ Error al guardar productos:", error);
    }
};

let products = loadProducts();

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.get("/", (req, res) => res.render("home", { products }));
app.get("/realtimeproducts", (req, res) => res.render("realTimeProducts", { products }));

io.on("connection", (socket) => {
    console.log("🟢 Cliente conectado");

    socket.emit("updateProducts", products);

    socket.on("newProduct", (product) => {
        product.id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push(product);
        saveProducts(products);
        io.emit("updateProducts", products);
    });

    socket.on("deleteProduct", (id) => {
        id = Number(id);
        products = products.filter(product => product.id !== id);
        saveProducts(products);
        io.emit("updateProducts", products);
    });

    socket.on("disconnect", () => console.log("🔴 Cliente desconectado"));
});

server.listen(PORT, () => console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`));
