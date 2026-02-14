// components/RatingSelection.tsx
import { Star } from "lucide-react"; // Or use your own icon set

interface RatingSelectionProps {
    value: number;
    onChange: (val: number) => void;
}

export const RatingSelect = ({ value, onChange }: RatingSelectionProps) => {
    return (
        <div className="flex items-center gap-1 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button" // Important: prevents form submission on click
                    onClick={() => onChange(star)}
                    className="transition-colors focus:outline-none"
                >
                    <Star
                        size={20}
                        className={
                            star <= value 
                                ? "fill-black text-black" 
                                : "text-zinc-300 fill-transparent hover:text-zinc-400"
                        }
                    />
                </button>
            ))}
        </div>
    );
};