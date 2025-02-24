const fs = require("fs");
const path = require("path");

class ProductManager {
  constructor() {
    this.productsFile = path.join(__dirname, "../data/products.json");
  }

  async getProducts() {
    const data = await fs.promises.readFile(this.productsFile, "utf-8");
    return JSON.parse(data);
  }

  async getProductById(pid) {
    const products = await this.getProducts();
    return products.find((product) => product.id === pid);
  }

  async addProduct(newProduct) {
    const products = await this.getProducts();
    const id = Date.now();  
    const product = { id, ...newProduct };
    products.push(product);
    await fs.promises.writeFile(this.productsFile, JSON.stringify(products, null, 2));
    return product;
  }

  async updateProduct(pid, updatedFields) {
    const products = await this.getProducts();
    const productIndex = products.findIndex((product) => product.id === pid);
    if (productIndex !== -1) {
      const updatedProduct = { ...products[productIndex], ...updatedFields };
      products[productIndex] = updatedProduct;
      await fs.promises.writeFile(this.productsFile, JSON.stringify(products, null, 2));
      return updatedProduct;
    }
    return null;
  }


  async deleteProduct(pid) {
    const products = await this.getProducts();
    const newProducts = products.filter((product) => product.id !== pid);
    await fs.promises.writeFile(this.productsFile, JSON.stringify(newProducts, null, 2));
    return newProducts;
  }
}

module.exports = ProductManager;
