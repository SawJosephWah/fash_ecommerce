"use client"

import React from "react";
import { X, ShoppingBag } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "@/store/index";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  type CartItem as CartItemType
} from "@/store/slices/addToCartSlice";
// 1. Import the mutation hook
import { useCreateOrderMutation } from "@/store/slices/orderApiSlice";
import { CartItem } from "./CartItem";
import type { CreateOrderRequest } from "@/Types/Order";
import { toast } from "sonner";

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  // 2. Initialize the mutation (not calling it yet)
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const { cartItems } = useSelector((state: RootState) => state.cart);

  const total = cartItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0);

  // 3. Handle Checkout Logic
  const handleCheckout = async () => {
    // 1. Prepare data using the Interface we created
    const orderData: CreateOrderRequest = {
      items: cartItems.map((item: CartItemType) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: item.image // Included as per your updated OrderItem interface
      })),
      bill: total
    };

    try {
      // 2. Execute the mutation
      const response = await createOrder(orderData).unwrap();

      // 3. Redirect to Stripe
      if (response.data) {
        window.location.href = response.data;
      }
    } catch (err:any) {

      const errorMessage = err?.data?.message || "Failed to create checkout session";

      toast.error(errorMessage, {
        description: "Please log in to proceed with your purchase.",
      });

      console.error("Checkout Error:", err);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-zinc-100">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter">Your Bag</h2>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                {itemCount} {itemCount === 1 ? 'Item' : 'Items'} selected
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-zinc-100 transition-colors group">
              <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto py-4">
            {cartItems.length > 0 ? (
              <div className="divide-y divide-zinc-50 px-6">
                {cartItems.map((item: CartItemType) => (
                  <CartItem
                    key={item._id}
                    {...item}
                    onIncrease={() => dispatch(increaseQuantity(item._id))}
                    onDecrease={() => dispatch(decreaseQuantity(item._id))}
                    onRemove={() => dispatch(removeFromCart(item._id))}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-zinc-400 space-y-4">
                <ShoppingBag size={40} strokeWidth={1} className="opacity-20" />
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold">Your bag is empty</p>
                <button onClick={onClose} className="text-[10px] underline underline-offset-4 hover:text-black transition-colors uppercase font-bold">
                  Start Shopping
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-zinc-100 bg-white">
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Subtotal</span>
                  <span className="text-lg font-black tracking-tighter">${total.toFixed(2)}</span>
                </div>
                <p className="text-[9px] text-zinc-400 uppercase leading-relaxed">
                  Shipping and taxes calculated at checkout.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full bg-black text-white py-5 font-bold uppercase text-[11px] tracking-[0.3em] hover:bg-zinc-800 transition-all shadow-xl active:scale-[0.98] disabled:bg-zinc-400"
                >
                  {isLoading ? "Processing..." : "Checkout"}
                </button>
                <button
                  onClick={() => dispatch(clearCart())}
                  className="w-full py-3 text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ShoppingCart;