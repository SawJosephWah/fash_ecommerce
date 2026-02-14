
import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db';
import { globalErrorHandler } from './controllers/errorController';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoute';
import stripe from 'stripe';
import TempCart from './models/tempCartModel';
import Order from './models/orderModel';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    // 1. Get the secret from environment variables
    const endpointSecret = process.env.WEBHOOK_SECRET;

    let event = req.body;

    // 2. Handle Signature Verification
    if (endpointSecret) {
      const signature = req.headers["stripe-signature"];
      try {
        if (!signature) throw new Error("Signature not found.");

        // IMPORTANT: req.body must be the raw buffer (express.raw handles this)
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          endpointSecret
        );
      } catch (err: any) {
        console.log(`⚠️ Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    }

    // 3. Handle the Event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const tempCartId = session.metadata?.tempCartId;

        if (tempCartId) {
          try {
            const tempCart = await TempCart.findById(tempCartId);

            if (tempCart) {
              // Create the real Order
              await Order.create({
                userId: tempCart.userId,
                items: tempCart.items,
                customer: session.metadata?.customer,
                bill: session.amount_total / 100, // Convert cents to dollars
                stripeSessionId: session.id,
                status: "paid",
                paymentIntentId: session.payment_intent,
              });

              // Cleanup
              await TempCart.findByIdAndDelete(tempCartId);
              console.log(`✅ Order successfully finalized for TempCart: ${tempCartId}`);
            } else {
              console.log("❌ TempCart not found in database.");
            }
          } catch (error) {
            console.error("Critical: Error processing order in webhook:", error);
            return res.sendStatus(500);
          }
        }
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    // Return a 200 to Stripe to acknowledge receipt
    res.json({ received: true });
  }
);


// Middleware

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use('/uploads', express.static('uploads'));

app.listen(3000, () => console.log('Running on port 3000'));

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);


//global handler
app.use(globalErrorHandler);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};


startServer();



// exult-talent-nifty-usable