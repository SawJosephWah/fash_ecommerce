import { Menu } from "lucide-react";
import { Link } from "react-router"; // Use react-router-dom

const SecondaryBar = () => {
  // Array matching your database seeder categories exactly
  const navItems = [
    { label: "T shirt", value: "t-shirt" },
    { label: "Hoodie", value: "hoodie" },
    { label: "Shirt", value: "shirt" },
    { label: "Gym", value: "gym" },
    { label: "Shorts", value: "short" },
    { label: "Jeans", value: "jeans" },
  ];

  return (
    <div className="flex items-center justify-between px-6 py-2 bg-zinc-100 border-b border-zinc-200">
      {/* Left Side: Menu Trigger */}
      <button className="flex items-center gap-2 group cursor-pointer text-zinc-800 hover:text-black transition-colors">
        <Menu size={20} />
        <span className="font-semibold uppercase tracking-wide text-xs">
          Categories
        </span>
      </button>

      {/* Right Side: Navigation Links */}
      <div className="flex items-center gap-8">
        {navItems.map((item) => (
          <Link
            key={item.value}
            // Navigate to product-filter with category as a query parameter
            to={`/product-filter?category=${item.value}`}
            className="text-xs font-bold uppercase tracking-tight text-zinc-600 hover:text-black transition-all"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SecondaryBar;