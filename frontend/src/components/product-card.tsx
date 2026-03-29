import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";
import { HeartIcon, ShoppingCartIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";

export default function ProductCard({ product }: { product: Product }) {
  // Using a fallback image as requested, mapping product ID to a stable random image
  const fallbackImage = `https://picsum.photos/seed/${product.id}/400/300`;

  const [qty, setQty] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  const handleQty = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value);
    if (num <= 0) {
      setQty(1);
    } else {
      setQty(num);
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
      <img
        src={fallbackImage}
        alt={product.name}
        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 will-change-transform"
      />
      <CardHeader className="grow">
        <div className="flex justify-between items-center gap-4 mb-2">
          <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
          <span className="font-bold text-primary shrink-0">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <CardDescription className="line-clamp-2 text-muted-foreground/80">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="pt-0 pb-0 shrink-0">
        <div className="mt-4 w-full flex gap-2">
          <Input
            type="number"
            value={qty}
            className="mb-2 max-w-14"
            onChange={handleQty}
          />
          <Button className="transition-all duration-300 hover:shadow-md">
            <ShoppingCartIcon />
            Add to Cart
          </Button>
          <Button
            className="transition-all duration-300 hover:shadow-md bg-transparent"
            onClick={() => {
              setIsLiked((prev) => !prev);
            }}
          >
            <HeartIcon stroke="red" fill={isLiked ? "red" : "none"} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
