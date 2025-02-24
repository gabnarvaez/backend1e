const express = require("express");
const CartManager = require("../managers/CartManager");

const router = express.Router();
const cartManager = new CartManager();

// Crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.addCart();
    res.status(201).json(newCart);
  } catch (error) {
    console.error("Error al crear carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener carrito por ID
router.get("/:cid", async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    if (isNaN(cid)) return res.status(400).json({ error: "ID de carrito inválido" });

    const cart = await cartManager.getCartById(cid);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener carrito por ID:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Agregar producto a un carrito
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    if (isNaN(cid) || isNaN(pid)) {
      return res.status(400).json({ error: "ID de carrito o producto inválido" });
    }

    const updatedCart = await cartManager.addProductToCart(cid, pid);
    if (updatedCart) {
      res.json(updatedCart);
    } else {
      res.status(404).json({ error: "Carrito o producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;

