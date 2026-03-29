import NavBar from "@/components/navbar";
import ProductCard from "@/components/product-card";
import type { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function ShopPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get("/product/all");
      return response.data;
    },
  });

  if (isLoading) {
    return <div>loading</div>;
  }

  return (
    <div>
      <div className="border-b">
        <NavBar className="max-w-7xl m-auto" />
      </div>
      <div className="max-w-6xl m-auto">
        {data?.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
