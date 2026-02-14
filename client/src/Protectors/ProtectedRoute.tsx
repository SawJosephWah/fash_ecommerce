import { Navigate, Outlet } from 'react-router';
import { useGetMeQuery } from '@/store/slices/userApiSlice';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = () => {
  const { isLoading, isError } = useGetMeQuery();
  
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="animate-spin text-zinc-500" size={32} />
      </div>
    );
  }

  return !isError ? <Outlet /> : <Navigate to="/login"/>;
};

export default ProtectedRoute;