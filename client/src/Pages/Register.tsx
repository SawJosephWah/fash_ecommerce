import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "../schemas/RegisterSchema";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { useGetMeQuery, useRegisterMutation } from "../store/slices/userApiSlice";
import { setUserInfo } from "../store/slices/authSlice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. Initialize Register Mutation
  const [registerUser, { isLoading: isRegisterLoading }] = useRegisterMutation();

  // 2. Fetch User Profile to verify session (Source of Truth)
  // We use isSuccess to check if the user is already authenticated via the API
  const { data: meData, isLoading: meLoading, isSuccess: isAuthenticated } = useGetMeQuery();

  // 3. Redirect if already authenticated by the API
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate, dispatch, meData]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await registerUser(data).unwrap();
      dispatch(setUserInfo(res.data.user));
      toast.success("Registration successful! Welcome.");
      navigate('/');
    } catch (err: any) {
      toast.error(err?.data?.message || "Registration failed. Please try again.");
    }
  };

  // 4. Loading Guard: Prevents form "flicker" while checking auth status
  if (meLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-zinc-300" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-black tracking-tighter uppercase mb-2 text-zinc-900">
            Create Account
          </h1>
          <p className="text-zinc-500 text-sm">Join FASH.COM for a premium experience.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-zinc-900">
              Full Name
            </label>
            <input
              {...register("name")}
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              className={`w-full border-b-2 py-2 outline-none transition-colors ${
                errors.name ? "border-red-500" : "border-zinc-200 focus:border-black"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-[10px] mt-1 font-medium italic">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-zinc-900">
              Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              autoComplete="email"
              placeholder="john@example.com"
              className={`w-full border-b-2 py-2 outline-none transition-colors ${
                errors.email ? "border-red-500" : "border-zinc-200 focus:border-black"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-[10px] mt-1 font-medium italic">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-zinc-900">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className={`w-full border-b-2 py-2 outline-none transition-colors ${
                errors.password ? "border-red-500" : "border-zinc-200 focus:border-black"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-[10px] mt-1 font-medium italic">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isRegisterLoading || isSubmitting}
            className="w-full bg-[#18181b] text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors disabled:bg-zinc-400 mt-4 shadow-sm"
          >
            {isRegisterLoading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-8 text-xs text-zinc-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-black font-bold underline underline-offset-4 hover:text-zinc-600 transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;