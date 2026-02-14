import mongoose, { Schema, Document, Types } from 'mongoose';

interface Image { // Capitalized interface names are standard
    url: string;
    public_id: string; // Changed from public_alt to match Cloudinary
}
// 1. Define the Interface
export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    instock_count: number;
    category: string;
    sizes: string[];
    colors: string[];
    images: Image[];
    is_new_arrival: boolean;
    is_featured: boolean; // Assuming 'is_' in photo meant featured or active
    rating_count: number;
    user: Types.ObjectId; // Reference to the user who created it
    createdAt: Date;
    updatedAt: Date;
}

// 2. Create the Schema
const productSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: [true, 'A product must have a name'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'A product must have a description'],
        },
        price: {
            type: Number,
            required: [true, 'A product must have a price'],
        },
        instock_count: {
            type: Number,
            default: 0,
        },
        category: {
            type: String,
            required: [true, 'A product must belong to a category'],
        },
        sizes: [String],
        colors: [String],
        images: [
            {
                url: String,
                public_id: String,
            },
        ],
        is_new_arrival: {
            type: Boolean,
            default: false,
        },
        is_featured: { // Mapping the 'is_' column from your photo
            type: Boolean,
            default: false,
        },
        rating_count: {
            type: Number,
            default: 0,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Product must belong to a user'],
        },
    },
    {
        timestamps: true, // This automatically handles createdAt and updatedAt
    }
);

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;