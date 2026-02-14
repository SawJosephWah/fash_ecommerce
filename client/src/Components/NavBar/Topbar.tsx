import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router";
import { LayoutDashboard, LogIn, LogOut, ShoppingCart, User, UserPlus, ClipboardList } from "lucide-react";
import SearchBar from "./SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { toast } from "sonner";
import { useLogoutMutation, useGetMeQuery } from "../../store/slices/userApiSlice"; 
import type { RootState } from "../../store";
import { apiSlice } from "@/store/slices/apiSlice";

interface TopBarProps {
  onOpenCart: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onOpenCart }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // 1. Get Auth state
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  
  // 2. Conditional Fetching: Only fetch "me" if we have userInfo (token)
  // This prevents 401 errors for guest users.
  const { data: meData } = useGetMeQuery(undefined, {
    skip: !userInfo,
  });
  
  // 3. Derived State: Calculate admin status on the fly
  const isAdmin = meData?.data?.user?.role === "admin";
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [logoutApiCall] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(apiSlice.util.resetApiState());
      dispatch(logout());
      toast.success("Logged out successfully");
      navigate('/login');
    } catch (err: any) {
      toast.error(err?.data?.message || "Logout failed");
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-[#18181b]">
      <Link to="/" className="text-2xl font-black tracking-tighter text-white shrink-0">
        FASH.COM
      </Link>

      <SearchBar />

      <div className="flex items-center gap-6 text-white shrink-0">
        {/* Cart Trigger */}
        <button
          onClick={onOpenCart}
          className="hover:text-zinc-300 transition-colors relative outline-none cursor-pointer p-1"
        >
          <ShoppingCart size={22} />
          {totalItems > 0 && (
            <span className="absolute top-1 right-0 transform translate-x-1/2 -translate-y-1/2 bg-white text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-zinc-900">
              {totalItems}
            </span>
          )}
        </button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hover:text-zinc-300 transition-colors outline-none cursor-pointer">
              <User size={22} />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48 rounded-none border-zinc-800">
            {userInfo ? (
              <>
                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-zinc-400">
                  {userInfo.name || "My Account"}
                </DropdownMenuLabel>

                <Link to="/my-orders">
                  <DropdownMenuItem className="cursor-pointer">
                    <ClipboardList className="mr-2 h-4 w-4" /> My Orders
                  </DropdownMenuItem>
                </Link>

                <Link to="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <Link to="/login">
                  <DropdownMenuItem className="cursor-pointer">
                    <LogIn className="mr-2 h-4 w-4" /> Login
                  </DropdownMenuItem>
                </Link>

                <Link to="/register">
                  <DropdownMenuItem className="cursor-pointer">
                    <UserPlus className="mr-2 h-4 w-4" /> Register
                  </DropdownMenuItem>
                </Link>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Admin Dashboard Link */}
        {isAdmin && (
          <Link
            to="/admin"
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 transition-colors rounded-none border border-zinc-700 text-[10px] uppercase tracking-widest font-bold"
          >
            <LayoutDashboard size={18} />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default TopBar;