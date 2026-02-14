import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router";

const SearchBar = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && keyword.trim()) {
      // Navigates to /product-filter?keyword=yoursearch
      navigate(`/product-filter?keyword=${encodeURIComponent(keyword)}`);
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-4">
      <div className="relative group">
        <Search 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" 
          size={18} 
        />
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Search for your favorite styles..."
          className="w-full bg-zinc-800 text-white border-none rounded-full py-2 pl-10 pr-4 focus:ring-1 focus:ring-zinc-600 outline-none transition-all placeholder:text-zinc-500 text-sm"
        />
      </div>
    </div>
  );
};

export default SearchBar;