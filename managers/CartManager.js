const fs = require("fs");
const path = require("path");

class CartManager {
  constructor() {
    this.cartsFile = path.join(__dirname, "../data/carts.json");
  }

  async getCarts() {
    try {
      if (!fs.existsSync(this.cartsFile)) return [];
      
      const data = await fs.promises.readFile(this.cartsFile, "utf-8");
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error al leer los carritos:", error);
      return [];
    }
  }

  async saveCarts(carts) {
    try {
      await fs.promises.writeFile(this.cartsFile, JSON.stringify(carts, null, 2));
    } catch (error) {
      console.error("Error al guardar los carritos:", error);
    }
  }

  async addCart() {
    try {
      const carts = await this.getCarts();
      const id = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;  
      const newCart = { id, products: [] };
      
      carts.push(newCart);
      await this.saveCarts(carts);

      return newCart;
    } catch (error) {
      console.error("Error al agregar un carrito:", error);
      return null;
    }
  }

  async getCartById(cid) {
    try {
      const carts = await this.getCarts();
      return carts.find((cart) => cart.id === cid) || null;
    } catch (error) {
      console.error(`Error al obtener el carrito con ID ${cid}:`, error);
      return null;
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const carts = await this.getCarts();
      const cartIndex = carts.findIndex((cart) => cart.id === cid);

      if (cartIndex === -1) return null;

      const cart = carts[cartIndex];
      const productIndex = cart.products.findIndex((p) => p.productId === pid);

      if (productIndex === -1) {
        cart.products.push({ productId: pid, quantity: 1 });
      } else {
        cart.products[productIndex].quantity += 1;
      }

      carts[cartIndex] = cart;
      await this.saveCarts(carts);
      return cart;
    } catch (error) {
      console.error(`Error al agregar producto ${pid} al carrito ${cid}:`, error);
      return null;
    }
  }
}

module.exports = CartManager;
