import { useState } from "react";
import TopBar from "./Topbar";
import ShoppingCart from "../ShoppingCart/Cart";
import SecondaryBar from "./Secondarybar";

const Navbar = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-white">
            {/* Pass the setter to TopBar so the icon can open the cart */}
            <TopBar onOpenCart={() => setIsCartOpen(true)} />
            <SecondaryBar />
            
            {/* The Cart Component */}
            <ShoppingCart 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)} 
            />
        </nav>
    );
};

export default Navbar