import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from "@/store/slices/orderApiSlice";
import { Loader2, Package, Mail, AlertCircle, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

const OrderManagement = () => {
    // 1. Added isError and refetch to the query hook
    const { data: orders, isLoading, isError, refetch } = useGetAllOrdersQuery();
    const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            await updateStatus({ orderId, status: newStatus }).unwrap();
            toast.success(`Order updated to ${newStatus}`);
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    // 2. Handle Loading State
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="animate-spin text-zinc-400" size={32} />
                <p className="text-zinc-500 text-sm font-bold uppercase tracking-tighter">Loading Orders...</p>
            </div>
        );
    }

    // 3. Handle Error State
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-zinc-200 rounded-xl">
                <AlertCircle className="text-red-500 mb-4" size={40} />
                <h2 className="text-lg font-black uppercase tracking-tighter">Failed to load orders</h2>
                <p className="text-zinc-500 text-sm mb-6">There was a problem connecting to the server.</p>
                <button 
                    onClick={() => refetch()}
                    className="flex items-center gap-2 px-6 py-2 bg-zinc-900 text-white text-xs font-bold uppercase rounded-lg hover:bg-zinc-800 transition-all"
                >
                    <RefreshCcw size={14} />
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-black uppercase tracking-tighter">Order Management</h1>

            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-zinc-50 border-b border-zinc-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Customer</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Items</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Total</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Status</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {orders?.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-zinc-400 text-sm uppercase font-bold">
                                    No orders found.
                                </td>
                            </tr>
                        ) : (
                            orders?.map((order) => (
                                <tr key={order._id} className="hover:bg-zinc-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Mail size={14} className="text-zinc-400" />
                                            <span className="font-medium text-zinc-900">{order.customer}</span>
                                        </div>
                                        <div className="text-[10px] text-zinc-400 font-mono mt-1 uppercase tracking-tighter">{order._id}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-zinc-600">
                                            <Package size={14} />
                                            <span className="text-sm font-bold">{order.items.length} Items</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-zinc-900">${order.bill.toFixed(2)}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                            order.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' :
                                            order.status === 'shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                            order.status === 'delivered' ? 'bg-zinc-900 text-white border-zinc-900' :
                                            'bg-zinc-100 text-zinc-500 border-zinc-200'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            disabled={isUpdating}
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className="text-[10px] font-black uppercase border border-zinc-200 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer bg-white"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="paid">Paid</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderManagement;