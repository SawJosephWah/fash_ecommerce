import { Link } from "react-router"; // Import Link
import ProductList from "../Components/Product/ProductsList";
import { 
  useGetNewArrivalsQuery, 
  useGetFeaturedProductsQuery 
} from "../store/slices/productApiSlice";
import { ArrowRight } from "lucide-react"; // Nice touch for the button

const Home = () => {
  const { data: newArrivalsData, isLoading: isLoadingNew } = useGetNewArrivalsQuery();
  const { data: featuredData, isLoading: isLoadingFeatured } = useGetFeaturedProductsQuery();

  return (
    <div className="space-y-16 py-10">
      {/* --- NEW ARRIVALS SECTION --- */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8 border-b border-zinc-100 pb-4">
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest text-zinc-900">
              New Arrivals
            </h2>
            <div className="h-1 w-12 bg-black mt-2"></div>
          </div>

          {/* VIEW ALL BUTTON */}
          <Link 
            to="/product-filter" // Assuming your route is /shop or /products
            className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-black transition-colors"
          >
            View All 
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <ProductList 
          products={newArrivalsData?.data} 
          isLoading={isLoadingNew} 
        />
      </section>

      {/* --- FEATURED PRODUCTS SECTION --- */}
      <section className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-xl font-black uppercase tracking-widest text-zinc-900">
            Featured Selection
          </h2>
          <div className="h-1 w-12 bg-black mt-2"></div>
        </div>

        <ProductList 
          products={featuredData?.data} 
          isLoading={isLoadingFeatured} 
        />
      </section>
    </div>
  );
};

export default Home;