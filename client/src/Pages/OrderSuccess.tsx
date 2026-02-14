import { useEffect } from "react"; // Added useEffect
import { useDispatch } from "react-redux"; // Added useDispatch
import { useSearchParams, Link } from "react-router";
import { useConfirmOrderQuery } from "@/store/slices/orderApiSlice";
import { clearCart } from "@/store/slices/addToCartSlice";
import { CheckCircle2, Loader2, AlertCircle, ShoppingBag } from "lucide-react";

const OrderSuccess = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { data: order, isLoading, error } = useConfirmOrderQuery(sessionId || "", {
    skip: !sessionId,
    pollingInterval: 3000, 
  });

  // --- CLEAR CART LOGIC ---
  useEffect(() => {
    // We only clear the cart if 'order' exists (meaning verification passed)
    if (order) {
      dispatch(clearCart());
    }
  }, [order, dispatch]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <h2 className="mt-4 text-xl font-semibold">Verifying your payment...</h2>
      </div>
    );
  }

  if (error || !sessionId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <h2 className="mt-4 text-2xl font-bold text-gray-800">Something went wrong</h2>
        <p className="text-gray-600 mt-2">We couldn't confirm your order. Please check your email.</p>
        <Link to="/" className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center px-4">
      <CheckCircle2 className="w-20 h-20 text-green-500" />
      <h1 className="mt-6 text-3xl font-bold text-gray-900">Payment Successful!</h1>
      <p className="mt-2 text-lg text-gray-600">Thank you, {order?.customer}. Your order is confirmed.</p>
      
      <div className="mt-8 bg-white rounded-xl border border-gray-200 w-full max-w-2xl overflow-hidden shadow-sm">
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-gray-700">Order Summary</h3>
          <span className="text-xs font-mono text-gray-400">ID: {order?._id}</span>
        </div>

        <div className="p-6 space-y-4 text-left">
          {order?.items.map((item: any, index: number) => (
            <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 p-2 rounded">
                  <ShoppingBag className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity} | Size: {item.size} | Color: {item.color}
                  </p>
                </div>
              </div>
              <p className="font-medium text-gray-700">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-6 border-t">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Total Amount Paid</span>
            <span className="text-2xl font-bold text-green-600">${order?.bill.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Link to="/" className="mt-10 px-10 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all transform hover:scale-105">
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderSuccess;