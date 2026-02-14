import { X } from "lucide-react";

interface CartItemProps {
  _id: string;
  name: string;
  price: number;
  size: string;
  color: string;
  image: string;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export const CartItem: React.FC<CartItemProps> = ({ 
  name, price, size, color, image, quantity, onIncrease, onDecrease, onRemove 
}) => {
  return (
    <div className="py-6 flex gap-4">
      <div className="w-20 h-24 bg-zinc-50 border border-zinc-100 overflow-hidden shrink-0">
        <img src={image} alt={name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
      </div>
      
      <div className="flex flex-col justify-between flex-1">
        <div>
          <div className="flex justify-between items-start">
            <h4 className="text-[11px] font-bold uppercase tracking-tight text-zinc-900 leading-tight">{name}</h4>
            <button onClick={onRemove} className="text-zinc-300 hover:text-black transition-colors">
              <X size={14} />
            </button>
          </div>
          <p className="text-[9px] text-zinc-400 uppercase mt-1">Size: {size} / Color: {color}</p>
        </div>

        <div className="flex justify-between items-end">
          <div className="flex items-center border border-zinc-200">
            <button onClick={onDecrease} className="px-2 py-1 text-xs hover:bg-zinc-50 border-r border-zinc-200">—</button>
            <span className="px-3 text-[10px] font-bold font-mono">{quantity}</span>
            <button onClick={onIncrease} className="px-2 py-1 text-xs hover:bg-zinc-50 border-l border-zinc-200">+</button>
          </div>
          <span className="text-xs font-black">${(price * quantity).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};