const Cart = require("../models/Cart.model.js");
const mongoose = require("mongoose");

class CartManager {
  async getCarts() {
    try {
      const carts = await Cart.find().populate('products.product');
      return carts;
    } catch (error) {
      console.error("Error al obtener carritos:", error);
      return [];
    }
  }

  async addCart() {
    try {
      const newCart = new Cart({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      console.error("Error al agregar un carrito:", error);
      return null;
    }
  }

  async getCartById(cid) {
    try {
      const cart = await Cart.findById(cid).populate('products.product');
      return cart || null;
    } catch (error) {
      console.error(`Error al obtener el carrito con ID ${cid}:`, error);
      return null;
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const cart = await Cart.findById(cid);
      if (!cart) return null;

      const productIndex = cart.products.findIndex((p) => p.product.toString() === pid);

      if (productIndex === -1) {
        cart.products.push({ product: new mongoose.Types.ObjectId(pid), quantity: 1 });
      } else {
        cart.products[productIndex].quantity += 1;
      }

      await cart.save();
      return cart;
    } catch (error) {
      console.error(`Error al agregar producto ${pid} al carrito ${cid}:`, error);
      return null;
    }
  }
}

module.exports = CartManager;

