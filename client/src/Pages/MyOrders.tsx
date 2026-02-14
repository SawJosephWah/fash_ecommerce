import { useGetMyOrdersQuery } from "@/store/slices/orderApiSlice";
import { Loader2, Package, AlertCircle, RefreshCcw, Eye, ShoppingBag } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import type { OrderItem } from "@/Types/Order";

const MyOrders = () => {
    const { data: orders, isLoading, isError, refetch } = useGetMyOrdersQuery();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="animate-spin text-zinc-400" size={32} />
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-tighter">Fetching your history...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-zinc-50 border border-dashed border-zinc-200 rounded-xl max-w-4xl mx-auto mt-10">
                <AlertCircle className="text-red-500 mb-4" size={40} />
                <h2 className="text-lg font-black uppercase tracking-tighter">Failed to load orders</h2>
                <button onClick={() => refetch()} className="mt-4 flex items-center gap-2 px-6 py-2 bg-black text-white text-xs font-bold uppercase rounded-lg">
                    <RefreshCcw size={14} /> Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
            <div className="flex justify-between items-end border-b border-zinc-200 pb-6">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter italic text-[#18181b]">My Order History</h1>
                    <p className="text-zinc-500 text-sm font-medium mt-1 uppercase tracking-tight">Track and manage your purchases</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-zinc-50 border-b border-zinc-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Order ID</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Total Price</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Status</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {orders?.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-zinc-400 text-sm uppercase font-bold tracking-tight">
                                    No orders found.
                                </td>
                            </tr>
                        ) : (
                            orders?.map((order) => (
                                <tr key={order._id} className="group hover:bg-zinc-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs font-bold text-zinc-900 uppercase">
                                        {order._id}
                                    </td>
                                    <td className="px-6 py-4 font-black text-zinc-900">
                                        ${order.bill.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border inline-block ${order.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' :
                                            order.status === 'shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                order.status === 'delivered' ? 'bg-zinc-900 text-white border-zinc-900' :
                                                    'bg-zinc-100 text-zinc-500 border-zinc-200'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {/* --- DIALOG START --- */}
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-md text-[10px] font-black uppercase tracking-tighter hover:bg-zinc-900 hover:text-white transition-all shadow-sm">
                                                    <Eye size={14} />
                                                    View Detail
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-md rounded-none border-zinc-200">
                                                <DialogHeader>
                                                    <DialogTitle className="text-xl font-black uppercase tracking-tighter">Order Details</DialogTitle>
                                                    <DialogDescription className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                                                        Order ID: {order._id}
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <div className="mt-4 space-y-4">
                                                    {order.items.map((item: OrderItem, idx: number) => (
                                                        <div key={idx} className="flex items-center justify-between p-3 border border-zinc-100 bg-zinc-50 rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-white rounded border border-zinc-200">
                                                                    <ShoppingBag size={18} className="text-zinc-400" />
                                                                </div>
                                                                <div className="text-left">
                                                                    <p className="text-xs font-black uppercase tracking-tight text-zinc-900">{item.name}</p>
                                                                    <p className="text-[10px] font-bold text-zinc-500 uppercase">
                                                                        Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <p className="text-xs font-black text-zinc-900">${(item.price * item.quantity).toFixed(2)}</p>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-6 pt-4 border-t border-zinc-100 flex justify-between items-center">
                                                    <span className="text-xs font-black uppercase text-zinc-400">Total Amount</span>
                                                    <span className="text-lg font-black text-zinc-900">${order.bill.toFixed(2)}</span>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                        {/* --- DIALOG END --- */}
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

export default MyOrders;