import NavBar from "@/components/navbar";
import ProductCard from "@/components/product-card";
import ProductCardSkeleton from "@/components/product-card-skeliton";
import type { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function ShopPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get("/product/all");
      return response.data;
    },
  });

  return (
    <div>
      <div className="border-b">
        <NavBar className="max-w-7xl m-auto" />
      </div>
      <div className="mt-10 max-w-6xl m-auto">
        <p className="text-2xl font-bold mb-6">All Products</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading &&
            Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          {data?.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
