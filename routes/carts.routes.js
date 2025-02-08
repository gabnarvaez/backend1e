const express = require("express");
const CartManager = require("../managers/CartManager");
const router = express.Router();
const cartManager = new CartManager();


router.post("/", async (req, res) => {
  const newCart = await cartManager.addCart();
  res.status(201).json(newCart);
});


router.get("/:cid", async (req, res) => {
  const cart = await cartManager.getCartById(parseInt(req.params.cid));
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: "Carrito no encontrado" });
  }
});


router.post("/:cid/product/:pid", async (req, res) => {
  const updatedCart = await cartManager.addProductToCart(parseInt(req.params.cid), parseInt(req.params.pid));
  if (updatedCart) {
    res.json(updatedCart);
  } else {
    res.status(404).json({ error: "Carrito no encontrado" });
  }
});

module.exports = router;
