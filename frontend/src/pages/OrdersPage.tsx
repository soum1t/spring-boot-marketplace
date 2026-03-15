import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { mockOrders } from "@/data/mock";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ArrowRight } from "lucide-react";
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

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const orders = useMemo(() => {
    if (!user) return [];
    return mockOrders.filter((order) => order.buyer.id === user.id);
  }, [user]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p className="text-sm text-muted-foreground">
          Track and manage your purchases
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <Package className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="mb-2 text-lg font-semibold">No orders yet</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <Button asChild>
            <Link to="/">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-base">
                    Order #{order.id}
                  </CardTitle>
                  <Badge
                    variant={statusVariant[order.status]}
                    className={statusColor[order.status]}
                  >
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p>
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/orders/${order.id}`}>
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
