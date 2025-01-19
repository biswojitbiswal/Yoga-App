import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type : String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    images: {
        type:[String],
        required: true,
    },
    reviews: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
        }
    ],
    averageRating: {
        type: Number,
        default: 3,
    }

}, {timestamps: true});

export const Product = mongoose.model("Product", productSchema)