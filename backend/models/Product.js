import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    stock: {
        type: Number,
        default: 1
    },

    rating: {
        type: Number,
        default: 0
    },

    images: [
        {
            filename: {
                type: String,
                required: true
            },
            contentType: {
                type: String,
                required: true
            },
            data: {
                type: Buffer,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],

    createdAt: {
        type: Date,
        default: Date.now
    }

});

export default mongoose.model("Product", productSchema);