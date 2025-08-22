
import Sidebar from "../../components/Sidebar";
import ProductDetails from "../../components/ProductDetails";


export default function inventories() {
  return (
    <div className="flex h-screen">
      {/* Sidebar - Left Column */}
      <Sidebar />

      {/* Middle Section - Stock List */}
      <div className="flex-1">
        <ProductDetails/>
      </div>

      
    </div>
  );
}