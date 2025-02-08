const fs = require("fs");
const path = require("path");

class CartManager {
  constructor() {
    this.cartsFile = path.join(__dirname, "../data/carts.json");
  }

  async getCarts() {
    const data = await fs.promises.readFile(this.cartsFile, "utf-8");
    return JSON.parse(data);
  }

  async addCart() {
    const carts = await this.getCarts();
    const id = Date.now();  
    const newCart = { id, products: [] };
    carts.push(newCart);
    await fs.promises.writeFile(this.cartsFile, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async getCartById(cid) {
    const carts = await this.getCarts();
    return carts.find((cart) => cart.id === cid);
  }

  async addProductToCart(cid, pid) {
    const carts = await this.getCarts();
    const cart = carts.find((cart) => cart.id === cid);

    if (!cart) return null;

    const productIndex = cart.products.findIndex((product) => product.id === pid);
    if (productIndex === -1) {
      cart.products.push({ id: pid, quantity: 1 });
    } else {
      cart.products[productIndex].quantity += 1;
    }

    await fs.promises.writeFile(this.cartsFile, JSON.stringify(carts, null, 2));
    return cart;
  }
}

module.exports = CartManager;
