import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { loginSchema, type LoginFormData } from "../schemas/LoginSchema";
import { useDispatch, useSelector } from "react-redux";
import { useGetMeQuery, useLoginMutation } from "../store/slices/userApiSlice";
import { setUserInfo } from "../store/slices/authSlice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { RootState } from "@/store";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const { isLoading: meLoading, isSuccess: isAuthenticated } = useGetMeQuery();

  useEffect(() => {
    // Only redirect if both the API is success AND we have userInfo in Redux
    if (isAuthenticated && userInfo) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, userInfo, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await login(data).unwrap();
      // res.data.user should match your backend response structure
      dispatch(setUserInfo(res.data.user));
      toast.success("Welcome back!");
      navigate('/');
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid credentials");
    }
  };

  // 4. Prevent "Flash of Login Form" while checking session
  if (meLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-zinc-300" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 bg-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-black tracking-tighter uppercase mb-2 text-zinc-900">
            Sign In
          </h1>
          <p className="text-zinc-500 text-sm">Welcome back to FASH.COM</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Email Input */}
          <div className="relative">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5 text-zinc-400">
              Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              className={`w-full border-b py-2.5 outline-none transition-all placeholder:text-zinc-200 ${errors.email ? "border-red-500" : "border-zinc-200 focus:border-black"
                }`}
            />
            {errors.email && (
              <p className="text-red-500 text-[10px] mt-1.5 font-medium italic">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="flex justify-between items-end mb-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                Password
              </label>
              <Link
                to="/forget-password"
                className="text-[10px] font-bold uppercase text-zinc-400 hover:text-black transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <input
              {...register("password")}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className={`w-full border-b py-2.5 outline-none transition-all placeholder:text-zinc-200 ${errors.password ? "border-red-500" : "border-zinc-200 focus:border-black"
                }`}
            />
            {errors.password && (
              <p className="text-red-500 text-[10px] mt-1.5 font-medium italic">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoginLoading || isSubmitting}
            className="w-full bg-[#18181b] text-white py-4 text-xs font-bold uppercase tracking-[0.3em] hover:bg-black transition-all disabled:bg-zinc-200 mt-4 shadow-sm"
          >
            {isLoginLoading ? 'Verifying...' : 'Login'}
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-xs text-zinc-500 tracking-wide">
            New to FASH.COM?{" "}
            <Link
              to="/register"
              className="text-black font-bold underline underline-offset-8 hover:text-zinc-600 transition-colors ml-1"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;