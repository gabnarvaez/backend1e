const express = require("express");
const mongoose = require("mongoose");
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

// Obtener carrito por ID (con populate)
router.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({ error: "ID de carrito inválido" });
    }

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

// Vista para detalle del carrito
router.get("/view/:cid", async (req, res) => {
  try {
      const cid = req.params.cid;
      if (!mongoose.Types.ObjectId.isValid(cid)) {
          return res.status(400).send("ID inválido");
      }

      const cart = await cartManager.getCartById(cid);
      if (!cart) {
          return res.status(404).send("Carrito no encontrado");
      }

      res.render("cartDetail", { cart });
  } catch (error) {
      console.error("Error al cargar carrito:", error);
      res.status(500).send("Error interno del servidor");
  }
});


// Agregar producto a un carrito
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;

    if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
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


// 🔥 NUEVOS ENDPOINTS 🔥

// DELETE api/carts/:cid/products/:pid → eliminar producto específico del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const cart = await cartManager.getCartById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = cart.products.filter(p => p.product._id.toString() !== pid);
    await cart.save();

    res.json({ message: "Producto eliminado del carrito", cart });
  } catch (error) {
    console.error("Error al eliminar producto del carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// PUT api/carts/:cid → actualizar todos los productos del carrito
router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const cart = await cartManager.getCartById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = products;
    await cart.save();

    res.json({ message: "Carrito actualizado", cart });
  } catch (error) {
    console.error("Error al actualizar carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// PUT api/carts/:cid/products/:pid → actualizar SOLO la cantidad de un producto
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const cart = await cartManager.getCartById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const product = cart.products.find(p => p.product._id.toString() === pid);
    if (!product) return res.status(404).json({ error: "Producto no encontrado en carrito" });

    product.quantity = quantity;
    await cart.save();

    res.json({ message: "Cantidad actualizada", cart });
  } catch (error) {
    console.error("Error al actualizar cantidad:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// DELETE api/carts/:cid → eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const cart = await cartManager.getCartById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = [];
    await cart.save();

    res.json({ message: "Todos los productos eliminados del carrito", cart });
  } catch (error) {
    console.error("Error al vaciar carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
