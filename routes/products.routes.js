const express = require("express");
const ProductManager = require("../managers/ProductManager");

const router = express.Router();
const productManager = new ProductManager();

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener producto por ID
router.get("/:pid", async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    if (isNaN(pid)) return res.status(400).json({ error: "ID de producto inválido" });

    const product = await productManager.getProductById(pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener producto por ID:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Crear un nuevo producto
router.post("/", async (req, res) => {
  try {
    const { title, description, price, stock, category } = req.body;
    if (!title || !description || !price || !stock || !category) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error al agregar producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Actualizar un producto
router.put("/:pid", async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    if (isNaN(pid)) return res.status(400).json({ error: "ID de producto inválido" });

    const updatedProduct = await productManager.updateProduct(pid, req.body);
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Eliminar un producto
router.delete("/:pid", async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    if (isNaN(pid)) return res.status(400).json({ error: "ID de producto inválido" });

    const deletedProduct = await productManager.deleteProduct(pid);
    if (deletedProduct) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
