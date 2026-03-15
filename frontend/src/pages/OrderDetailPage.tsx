import { useState, useMemo } from "react";
import { useParams, Link } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { mockOrders } from "@/data/mock";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, Truck, CheckCircle } from "lucide-react";
import type { OrderStatus } from "@/types";

const statusVariant: Record<OrderStatus, "secondary" | "default" | "destructive"> = {
  PENDING: "secondary",
  CONFIRMED: "default",
  SHIPPED: "default",
  DELIVERED: "secondary",
  CANCELLED: "destructive",
};

const statusColor: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
  SHIPPED: "bg-purple-100 text-purple-800 border-purple-200",
  DELIVERED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

const nextStatusMap: Partial<Record<OrderStatus, { label: string; status: OrderStatus; icon: typeof Package }>> = {
  PENDING: { label: "Confirm Order", status: "CONFIRMED", icon: CheckCircle },
  CONFIRMED: { label: "Mark as Shipped", status: "SHIPPED", icon: Truck },
  SHIPPED: { label: "Mark as Delivered", status: "DELIVERED", icon: CheckCircle },
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const order = useMemo(() => {
    return mockOrders.find((o) => o.id === Number(id));
  }, [id]);

  const [status, setStatus] = useState<OrderStatus>(order?.status ?? "PENDING");

  const isSellerOfAnyItem = useMemo(() => {
    if (!user || !order) return false;
    return order.items.some((item) => item.seller.id === user.id);
  }, [user, order]);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <Package className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="mb-2 text-lg font-semibold">Order not found</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            The order you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/orders">Back to Orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  function handleUpdateStatus(newStatus: OrderStatus) {
    // Update the mock order's status in place
    order!.status = newStatus;
    setStatus(newStatus);
  }

  const nextAction = nextStatusMap[status];

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" size="sm" className="mb-6" asChild>
        <Link to="/orders">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
      </Button>

      {/* Order header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.id}</h1>
          <p className="text-sm text-muted-foreground">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Badge
          variant={statusVariant[status]}
          className={`text-sm px-3 py-1 ${statusColor[status]}`}
        >
          {status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item, index) => (
                <div key={item.id}>
                  {index > 0 && <Separator className="mb-4" />}
                  <div className="flex gap-4">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium line-clamp-1">
                        {item.product.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Seller: {item.seller.name}
                      </p>
                      <div className="mt-1 flex items-center gap-4 text-sm">
                        <span>Qty: {item.quantity}</span>
                        <span className="font-medium">
                          ${item.priceAtPurchase.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Summary sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items</span>
                <span>{order.items.length}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {order.shippingAddress}
              </p>
            </CardContent>
          </Card>

          {/* Seller actions */}
          {isSellerOfAnyItem && nextAction && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Seller Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  onClick={() => handleUpdateStatus(nextAction.status)}
                >
                  <nextAction.icon className="mr-2 h-4 w-4" />
                  {nextAction.label}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
