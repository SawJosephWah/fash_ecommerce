import { Link, Outlet, useLocation } from "react-router";
import {
    LayoutDashboard,
    LogOut,
    ChevronRight,
    PlusSquare,
    Boxes,
    ClipboardList
} from "lucide-react";
import type { ReactNode } from "react";

const AdminLayout = () => {
    const { pathname } = useLocation();

    interface MenuItem {
        name: string;
        path: string;
        icon: ReactNode;
    }

    const menuItems: MenuItem[] = [
        {
            name: "Dashboard",
            path: "/admin",
            icon: <LayoutDashboard size={18} strokeWidth={2} />
        },
        {
            name: "Order Management", // NEW MENU ITEM
            path: "/admin/manage-orders", // Ensure this matches your route
            icon: <ClipboardList size={18} strokeWidth={2} />
        },
        {
            name: "Product Management",
            path: "/admin/manage-products",
            icon: <Boxes size={18} strokeWidth={2} />
        },
        {
            name: "Create Product",
            path: "/admin/product-create",
            icon: <PlusSquare size={18} strokeWidth={2} />
        },
    ];
    return (
        <div className="flex min-h-screen bg-zinc-50">
            {/* LEFT SIDE: SIDEBAR */}
            <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col fixed h-full">
                <div className="p-6 border-b border-zinc-100">
                    <Link to="/admin" className="text-xl font-black tracking-tighter uppercase italic">
                        Fash<span className="text-zinc-400">.Admin</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1 mt-4">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all group ${isActive
                                    ? "bg-zinc-900 text-white"
                                    : "text-zinc-500 hover:bg-zinc-100 hover:text-black"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    <span className="text-sm font-bold uppercase tracking-tight">{item.name}</span>
                                </div>
                                {isActive && <ChevronRight size={14} />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-zinc-100">
                    <button className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-red-600 transition-colors w-full">
                        <LogOut size={18} />
                        <span className="text-sm font-bold uppercase tracking-tight">Logout</span>
                    </button>
                </div>
            </aside>

            {/* RIGHT SIDE: CONTENT */}
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;