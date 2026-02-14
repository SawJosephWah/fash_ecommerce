import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { z } from "zod";
import { toast } from "sonner";
import { useForgetPasswordMutation } from "../store/slices/userApiSlice"; // You'll need to add this to your slice

const forgetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgetFormData = z.infer<typeof forgetSchema>;

const ForgetPassword = () => {
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetFormData>({
    resolver: zodResolver(forgetSchema),
  });

  const onSubmit = async (data: ForgetFormData) => {
    try {
      await forgetPassword(data).unwrap();
      toast.success("Reset link sent to your email!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 bg-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-black tracking-tighter uppercase mb-2 text-zinc-900">
            Forgot Password
          </h1>
          <p className="text-zinc-500 text-sm">
            Enter your email to receive a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="relative">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5 text-zinc-400">
              Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="name@example.com"
              className={`w-full border-b py-2.5 outline-none transition-all placeholder:text-zinc-200 ${
                errors.email ? "border-red-500" : "border-zinc-200 focus:border-black"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-[10px] mt-1.5 font-medium italic">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#18181b] text-white py-4 text-xs font-bold uppercase tracking-[0.3em] hover:bg-black transition-all disabled:bg-zinc-300 mt-4 shadow-sm"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-12 text-center">
          <Link
            to="/login"
            className="text-xs text-black font-bold uppercase tracking-widest hover:text-zinc-600 transition-colors"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;