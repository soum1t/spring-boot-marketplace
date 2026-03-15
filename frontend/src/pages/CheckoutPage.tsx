import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, Link } from "react-router";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { mockOrders } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard, CheckCircle, ArrowLeft } from "lucide-react";
import type { Order } from "@/types";

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      navigate("/cart", { replace: true });
    }
  }, [items.length, orderPlaced, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-6" />
        <h1 className="text-3xl font-bold mb-3">Order Placed Successfully!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link to="/orders">View Orders</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const shippingAddress = [address1, address2, city, state, zip]
      .filter(Boolean)
      .join(", ");

    const newOrder: Order = {
      id: Date.now(),
      buyer: user!,
      items: items.map((item, index) => ({
        id: Date.now() + index,
        product: item.product,
        quantity: item.quantity,
        priceAtPurchase: item.product.price,
        seller: item.product.seller,
      })),
      totalAmount,
      status: "PENDING",
      shippingAddress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockOrders.push(newOrder);
    clearCart();
    setOrderPlaced(true);
  };

  const isFormValid =
    fullName.trim() !== "" &&
    address1.trim() !== "" &&
    city.trim() !== "" &&
    state.trim() !== "" &&
    zip.trim() !== "";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        to="/cart"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Cart
      </Link>

      <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Forms */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address1">Address Line 1</Label>
                  <Input
                    id="address1"
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    placeholder="123 Main St"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address2">Address Line 2</Label>
                  <Input
                    id="address2"
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    placeholder="Apt 4B (optional)"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Springfield"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="IL"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">Zip Code</Label>
                    <Input
                      id="zip"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="62701"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Section */}
            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 rounded-md border border-dashed p-4 text-muted-foreground">
                  <CreditCard className="h-5 w-5 shrink-0" />
                  <p className="text-sm">
                    Payment will be processed (mock)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Item list */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between gap-2 text-sm"
                    >
                      <span className="text-muted-foreground line-clamp-1">
                        {item.product.title} &times; {item.quantity}
                      </span>
                      <span className="shrink-0 tabular-nums font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="tabular-nums">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={!isFormValid}
                >
                  Place Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
