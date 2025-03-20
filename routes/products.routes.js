const express = require("express");
const mongoose = require("mongoose");
const ProductManager = require("../managers/ProductManager");

const router = express.Router();
const productManager = new ProductManager();

// 🔥 GET /products con paginación, filtros y ordenamiento (JSON)
router.get("/", async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);

        // Filtros
        let filter = {};
        if (query) {
            if (query === "disponible") {
                filter.availability = true;
            } else if (query === "nodisponible") {
                filter.availability = false;
            } else {
                filter.category = query;
            }
        }

        // Ordenamiento
        let sortOption = {};
        if (sort === "asc") {
            sortOption.price = 1;
        } else if (sort === "desc") {
            sortOption.price = -1;
        }

        const productsData = await productManager.getProductsPaginated(filter, limit, page, sortOption);

        res.json(productsData);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 🔥 GET /products/view con paginación y renderizado de vista handlebars
router.get("/view", async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);

        let filter = {};
        if (query) {
            if (query === "disponible") {
                filter.availability = true;
            } else if (query === "nodisponible") {
                filter.availability = false;
            } else {
                filter.category = query;
            }
        }

        let sortOption = {};
        if (sort === "asc") {
            sortOption.price = 1;
        } else if (sort === "desc") {
            sortOption.price = -1;
        }

        const productsData = await productManager.getProductsPaginated(filter, limit, page, sortOption);

        res.render("home", productsData);
    } catch (error) {
        console.error("Error al renderizar productos:", error);
        res.status(500).send("Error cargando productos");
    }
});

// 🔥 Vista para detalle del producto
router.get("/view/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).send("ID inválido");
        }

        const product = await productManager.getProductById(pid);
        if (!product) {
            return res.status(404).send("Producto no encontrado");
        }

        res.render("productDetail", { product });
    } catch (error) {
        console.error("Error al cargar producto:", error);
        res.status(500).send("Error al cargar producto");
    }
});

// 🔥 GET /products/:pid con ObjectId (JSON)
router.get("/:pid", async (req, res) => {
    const pid = req.params.pid;
    if (!mongoose.Types.ObjectId.isValid(pid)) {
        return res.status(400).json({ error: "ID de producto inválido" });
    }

    const product = await productManager.getProductById(pid);
    product ? res.json(product) : res.status(404).json({ error: "Producto no encontrado" });
});

// POST (crear producto)
router.post("/", async (req, res) => {
    try {
        const product = await productManager.addProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT (actualizar producto)
router.put("/:pid", async (req, res) => {
    const pid = req.params.pid;
    if (!mongoose.Types.ObjectId.isValid(pid)) {
        return res.status(400).json({ error: "ID inválido" });
    }

    const updatedProduct = await productManager.updateProduct(pid, req.body);
    updatedProduct ? res.json(updatedProduct) : res.status(404).json({ error: "Producto no encontrado" });
});

// DELETE
router.delete("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const result = await productManager.deleteProduct(pid);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
