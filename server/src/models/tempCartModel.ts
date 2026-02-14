import mongoose, { Schema, Types } from "mongoose";
import { OrderItem, orderItemSchema } from "./orderModel";

interface ITempCart {
    userId: Types.ObjectId;
    items: OrderItem[];
    expiresAt: Date;
}


const tempCartSchema = new Schema<ITempCart>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    items: {
        type: [orderItemSchema],
        required: true
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 60 * 1000),
        index: { expires: 0 },
    },
});

const TempCart = mongoose.model<ITempCart>("TempCart", tempCartSchema);

export default TempCart;