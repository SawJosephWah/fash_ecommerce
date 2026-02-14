import { Outlet } from "react-router";
import Navbar from "../Components/NavBar/Navbar";
import Footer from "../Components/Footer";
import { ScrollRestoration } from "react-router";

const Main: React.FC = () => {
  return (
    // min-h-screen + flex-col makes the footer stay at the bottom
    <div className="flex flex-col min-h-screen bg-white">
      <ScrollRestoration />
      <Navbar />
      
      {/* flex-1 allows this section to grow and push the footer down */}
      <main className="flex-1">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Main;