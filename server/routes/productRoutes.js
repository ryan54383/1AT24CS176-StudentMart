const express = require("express");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find()
            .populate("seller", "name email department")
            .sort({ createdAt: -1 });

        return res.json({ products });
    } catch (error) {
        console.error("Fetch products error:", error);
        return res.status(500).json({ message: "Unable to load products" });
    }
});

// GET single product by ID
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate("seller", "name email department");

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.json({ product });
    } catch (error) {
        console.error("Get product error:", error);
        return res.status(500).json({ message: "Unable to load product details" });
    }
});

// POST create a product (Protected)
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { name, category, price, stock, description, imageUrl } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({ message: "Product name is required" });
        }

        if (price === undefined || isNaN(price) || Number(price) < 0) {
            return res.status(400).json({ message: "Valid price is required" });
        }

        const product = await Product.create({
            name: name.trim(),
            category: category ? category.trim() : "General",
            price: Number(price),
            stock: stock !== undefined ? Number(stock) : 1,
            description: description ? description.trim() : "",
            imageUrl: imageUrl ? imageUrl.trim() : "",
            seller: req.userId
        });

        return res.status(201).json({
            message: "Product added successfully",
            product
        });
    } catch (error) {
        console.error("Create product error:", error);
        return res.status(500).json({ message: "Unable to add product" });
    }
});

// PUT update product (Protected)
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { name, category, price, stock, description, imageUrl } = req.body;

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check ownership if seller is assigned
        if (product.seller && product.seller.toString() !== req.userId) {
            return res.status(403).json({ message: "You are not authorized to edit this product" });
        }

        if (name && name.trim()) product.name = name.trim();
        if (category && category.trim()) product.category = category.trim();
        if (price !== undefined && !isNaN(price) && Number(price) >= 0) product.price = Number(price);
        if (stock !== undefined && !isNaN(stock) && Number(stock) >= 0) product.stock = Number(stock);
        if (description !== undefined) product.description = description.trim();
        if (imageUrl !== undefined) product.imageUrl = imageUrl.trim();

        await product.save();
        await product.populate("seller", "name email department");

        return res.json({
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        console.error("Update product error:", error);
        return res.status(500).json({ message: "Unable to update product" });
    }
});

// DELETE remove product (Protected)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check ownership if seller is assigned
        if (product.seller && product.seller.toString() !== req.userId) {
            return res.status(403).json({ message: "You are not authorized to remove this product" });
        }

        await Product.findByIdAndDelete(req.params.id);

        return res.json({
            message: "Product removed successfully"
        });
    } catch (error) {
        console.error("Delete product error:", error);
        return res.status(500).json({ message: "Unable to remove product" });
    }
});

module.exports = router;
