import { useState } from "react";
import { useParams, Link } from "react-router";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { mockProducts } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShoppingCart, ArrowLeft, Minus, Plus, Edit } from "lucide-react";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);

  const product = mockProducts.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to browse
          </Link>
        </Button>
      </div>
    );
  }

  const isSold = product.status === "SOLD";
  const isSeller = user?.id === product.seller.id;
  const canAddToCart = !isSold && !isSeller;

  const handleAddToCart = () => {
    if (canAddToCart) {
      addItem(product, quantity);
      setQuantity(1);
    }
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        to="/products"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to browse
      </Link>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image section */}
        <div className="relative">
          <Card className="overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-auto aspect-square object-cover"
            />
            {isSold && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-5xl font-bold tracking-widest uppercase -rotate-12 border-4 border-white px-8 py-4">
                  SOLD
                </span>
              </div>
            )}
          </Card>
        </div>

        {/* Details section */}
        <div className="flex flex-col gap-6">
          {/* Title */}
          <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>

          {/* Price */}
          <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>

          {/* Badges */}
          <div className="flex items-center gap-3">
            <Badge variant="secondary">{product.category}</Badge>
            <Badge variant={isSold ? "destructive" : "default"}>
              {product.status}
            </Badge>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          <Separator />

          {/* Seller info */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Seller</h2>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>
                  {getInitials(product.seller.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{product.seller.name}</p>
                <p className="text-sm text-muted-foreground">
                  Member since {formatDate(product.seller.createdAt)}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex flex-col gap-4">
            {/* Quantity selector + Add to cart */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1 || !canAddToCart}
                  className="h-10 w-10"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium tabular-nums">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={incrementQuantity}
                  disabled={!canAddToCart}
                  className="h-10 w-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={!canAddToCart}
                className="flex-1 min-w-[160px]"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>

            {isSold && (
              <p className="text-sm text-destructive font-medium">
                This item has been sold and is no longer available.
              </p>
            )}

            {isSeller && !isSold && (
              <p className="text-sm text-muted-foreground">
                You cannot purchase your own listing.
              </p>
            )}

            {/* Edit listing link for seller */}
            {isSeller && (
              <Button variant="outline" asChild>
                <Link to={`/products/${product.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Listing
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
