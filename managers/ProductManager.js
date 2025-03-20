const Product = require("../Models/Product.model");

class ProductManager {
    async getProducts() {
        try {
            const products = await Product.find();
            return products;
        } catch (error) {
            console.error("❌ Error al obtener productos:", error);
            return [];
        }
    }

    async getProductById(pid) {
        try {
            const product = await Product.findById(pid);
            return product || null;
        } catch (error) {
            console.error("❌ Error al obtener producto por ID:", error);
            return null;
        }
    }

    async addProduct(newProduct) {
        if (!newProduct.title || !newProduct.price) {
            throw new Error("❌ El producto debe tener título y precio");
        }

        try {
            const product = new Product(newProduct);
            await product.save();
            return product;
        } catch (error) {
            console.error("❌ Error al agregar producto:", error);
            throw error;
        }
    }

    async updateProduct(pid, updatedFields) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(pid, updatedFields, { new: true });
            return updatedProduct;
        } catch (error) {
            console.error("❌ Error al actualizar producto:", error);
            return null;
        }
    }

    async deleteProduct(pid) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(pid);
            if (!deletedProduct) {
                throw new Error("❌ Producto no encontrado");
            }
            return { message: "✅ Producto eliminado", id: pid };
        } catch (error) {
            console.error("❌ Error al eliminar producto:", error);
            throw error;
        }
    }

    // 🔥 NUEVO MÉTODO PARA PAGINACIÓN + FILTROS + ORDENAMIENTO
    async getProductsPaginated(filter = {}, limit = 10, page = 1, sortOption = {}) {
        try {
            const options = {
                page,
                limit,
                sort: sortOption,
                lean: true // para devolver objetos planos
            };

            const result = await Product.paginate(filter, options);

            const { docs, totalPages, prevPage, nextPage, hasPrevPage, hasNextPage } = result;

            const baseUrl = `/api/products?limit=${limit}`;
            const prevLink = hasPrevPage ? `${baseUrl}&page=${prevPage}` : null;
            const nextLink = hasNextPage ? `${baseUrl}&page=${nextPage}` : null;

            return {
                status: "success",
                payload: docs,
                totalPages,
                prevPage,
                nextPage,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink,
                nextLink
            };
        } catch (error) {
            console.error("❌ Error en paginación de productos:", error);
            return {
                status: "error",
                payload: [],
                totalPages: 0,
                prevPage: null,
                nextPage: null,
                page: 1,
                hasPrevPage: false,
                hasNextPage: false,
                prevLink: null,
                nextLink: null
            };
        }
    }
}

module.exports = ProductManager;

