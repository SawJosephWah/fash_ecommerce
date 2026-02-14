import { Navigate, Outlet } from 'react-router';
import { useGetMeQuery } from '@/store/slices/userApiSlice';
import { Loader2 } from 'lucide-react';

const AdminRoute = () => {
  // 1. Fetch the latest user data from the server
  const { data, isLoading, isError } = useGetMeQuery();

  // 2. Show loader while verifying credentials
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-zinc-900" size={32} />
      </div>
    );
  }

  // 3. Authorization Logic:

  const isAdmin = data?.data?.user.role === 'admin';

  if (isError || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // 4. If they are an authenticated admin, render the child components
  return <Outlet />;
};

export default AdminRoute;