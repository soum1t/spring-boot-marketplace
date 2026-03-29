import type { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  return <div>{product.name}</div>;
}
