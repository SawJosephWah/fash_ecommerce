import { Request,Response } from "express";

import Stripe from "stripe";

import { AuthRequest } from "../middlewares/authMiddleware"; // Adjust path as needed
import { catchAsync } from "../utils/catchAsync";
import Order from "../models/orderModel";
import TempCart from "../models/tempCartModel";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any,
});

export const createOrderAndCheckOutSession = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { items, bill } = req.body;
    const userId = req.user?._id;
    const userName = req.user?.name;

    // 1. Create the TempCart in MongoDB first
    const tempCart = await TempCart.create({
      userId,
      items,
    });

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          metadata: {
            productId: item.productId.toString(),
            color: item.color,
            size: item.size,
          },
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects cents
      },
      quantity: item.quantity,
    }));

    // 3. Create Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.CORS_ORIGIN}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CORS_ORIGIN}/order-cancelled`,
      metadata: {
        userId: userId?.toString() || "",
        bill: bill.toString(),
        tempCartId: tempCart._id.toString(), 
        customer : userName!.toString()
      },
    });

    res.status(200).json({
      status: "success",
      data: session.url
    });
  }
);



export const confirmSessionId = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const session_id = req.params.session_id as string;

    // 1. Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // 2. Security check: Has the payment actually been made?
    if (!session || session.payment_status !== "paid") {  
      res.status(403);
      throw new Error("Payment not completed");
    }

    // 3. Find the order in our DB (Created by our webhook)
    const order = await Order.findOne({ stripeSessionId: session.id });

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    // 4. Return the order to the frontend
    res.status(200).json(order);
  }
);


// @route GET | api/orders
export const getOrderByUser = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    
    // Modified: Added status and wrapped orders in data
    res.status(200).json({
      status: "success",
      data: orders
    });
  }
);

// @route GET | api/orders/all
export const getAllOrders = catchAsync(
  async (req: Request, res: Response) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    
    // Modified: Added status and wrapped orders in data
    res.status(200).json({
      status: "success",
      data: orders
    });
  }
);

// @route PATCH | api/orders/:orderId
export const changeOrderStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      res.status(404);
      throw new Error("Order not found");
    }

    // Modified: Added status and wrapped updatedOrder in data
    res.status(200).json({
      status: "success",
      data: updatedOrder
    });
  }
);