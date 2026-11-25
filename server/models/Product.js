const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        category: {
            type: String,
            default: "General",
            trim: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        stock: {
            type: Number,
            default: 1,
            min: 0
        },
        description: {
            type: String,
            default: "",
            trim: true
        },
        imageUrl: {
            type: String,
            default: ""
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Product", productSchema);
