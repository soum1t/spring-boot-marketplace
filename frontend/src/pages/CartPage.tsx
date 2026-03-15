import { Link } from "react-router";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold mb-3">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Button asChild size="lg">
          <Link to="/">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Start Shopping
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Continue Shopping
      </Link>

      <h1 className="text-3xl font-bold tracking-tight mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex gap-4">
                {/* Thumbnail */}
                <Link to={`/products/${item.product.id}`} className="shrink-0">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.title}
                    className="w-20 h-20 rounded-md object-cover"
                  />
                </Link>

                {/* Item details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        to={`/products/${item.product.id}`}
                        className="font-semibold hover:underline line-clamp-1"
                      >
                        {item.product.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        Sold by {item.product.seller.name}
                      </p>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      ${item.product.price.toFixed(2)}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity controls */}
                    <div className="flex items-center border rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-10 text-center text-sm font-medium tabular-nums">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Line total */}
                      <span className="font-semibold tabular-nums">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>

                      {/* Remove button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Cart Summary */}
        <div>
          <Card className="p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums">${totalAmount.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="tabular-nums">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <Button asChild className="w-full mt-6" size="lg" disabled={items.length === 0}>
              <Link to="/checkout">Proceed to Checkout</Link>
            </Button>

            <Button variant="outline" asChild className="w-full mt-3">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
