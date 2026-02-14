import { Link } from "react-router";
import { XCircle, ShoppingCart, ArrowLeft } from "lucide-react";

const OrderCancelled = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-red-50 p-6 rounded-full">
        <XCircle className="w-16 h-16 text-red-500" />
      </div>
      
      <h1 className="mt-6 text-3xl font-bold text-gray-900">Order Cancelled</h1>
      <p className="mt-2 text-lg text-gray-600 max-w-md">
        Your payment was not processed, and no charges were made. 
        Your items are still waiting for you in your cart!
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        <Link 
          to="/product-filter" 
          className="flex items-center justify-center gap-2 px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          Back to Shop
        </Link>
        
        <Link 
          to="/" 
          className="flex items-center justify-center gap-2 px-8 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </Link>
      </div>
    </div>
  );
};

export default OrderCancelled;