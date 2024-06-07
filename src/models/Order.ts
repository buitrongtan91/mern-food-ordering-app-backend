import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    deliverDetails: {
        email: { type: String, required: true },
        name: { type: String, required: true },
        addressLine1: { type: String, required: true },
        city: { type: String, required: true },
    },
    cartItems: [
        {
            menuItemId: { type: String, required: true },
            quantity: { type: Number, required: true },
            name: { type: String, required: true },
        },
    ],
    totalAmount: { type: Number },
    status: {
        type: String,
        enum: ["placed", "paid", "pending", "completed", "delivered", "cancelled"],
        default: "placed",
    },
    createdAt: { type: Date, required: true, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
