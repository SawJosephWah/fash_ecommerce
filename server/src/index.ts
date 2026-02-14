
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
  async (req, res) => { // Added async here for database operations
    let event = req.body;

    if (endpointSecret) {
      const signature = req.headers["stripe-signature"];
      try {
        if (!signature) throw new Error("Signature not found.");
        event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
      } catch (err: any) {
        console.log(`⚠️ Webhook signature verification failed.`, err.message);
        return res.sendStatus(400);
      }
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        
        // 1. Get the tempCartId from metadata
        const tempCartId = session.metadata?.tempCartId;

        if (tempCartId) {
          try {
            // 2. Find the TempCart data
            const tempCart = await TempCart.findById(tempCartId);

            if (tempCart) {
              // 3. Create the real Order
              await Order.create({
                userId: tempCart.userId,
                items: tempCart.items,
                customer : session.metadata?.customer,
                // You can also get totals from the Stripe session itself
                bill: session.amount_total / 100, 
                stripeSessionId: session.id,
                status: "paid", // Mark as paid immediately
                paymentIntentId: session.payment_intent,
              });

              // 4. Delete the TempCart (Cleanup)
              await TempCart.findByIdAndDelete(tempCartId);
              console.log(`✅ Order created and TempCart ${tempCartId} deleted.`);
            } else {
              console.log("❌ TempCart not found in database.");
            }
          } catch (error) {
            console.error("Error processing order in webhook:", error);
            // We return 500 so Stripe retries later if it's a DB connection issue
            return res.sendStatus(500); 
          }
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}.`);
    }

    res.sendStatus(200);
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

// Use the secret from your Stripe Dashboard (Webhook settings)
const endpointSecret = "whsec_e5a8a124cf5745436994b3fe3289519cbad4496645626936e52722268a91fab3"; 


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