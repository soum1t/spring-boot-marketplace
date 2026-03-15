import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { mockOrders } from "@/data/mock";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Package, DollarSign } from "lucide-react";
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

const ALL_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function SalesPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Track status changes locally so the UI re-renders
  const [statusMap, setStatusMap] = useState<Record<number, OrderStatus>>({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const salesOrders = useMemo(() => {
    if (!user) return [];
    return mockOrders.filter((order) =>
      order.items.some((item) => item.seller.id === user.id)
    );
  }, [user]);

  // Initialize status map from mock data
  useEffect(() => {
    const initial: Record<number, OrderStatus> = {};
    for (const order of salesOrders) {
      initial[order.id] = order.status;
    }
    setStatusMap(initial);
  }, [salesOrders]);

  if (!isAuthenticated || !user) {
    return null;
  }

  function handleStatusChange(orderId: number, newStatus: OrderStatus) {
    // Update the mock order in place
    const order = mockOrders.find((o) => o.id === orderId);
    if (order) {
      order.status = newStatus;
    }
    setStatusMap((prev) => ({ ...prev, [orderId]: newStatus }));
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Sales</h1>
        <p className="text-sm text-muted-foreground">
          Manage orders containing your products
        </p>
      </div>

      {salesOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <DollarSign className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="mb-2 text-lg font-semibold">No sales yet</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            You haven't sold any items yet. Once buyers purchase your products,
            they'll appear here.
          </p>
          <Button asChild>
            <Link to="/">Browse Marketplace</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {salesOrders.map((order) => {
            const yourItems = order.items.filter(
              (item) => item.seller.id === user!.id
            );
            const yourTotal = yourItems.reduce(
              (sum, item) => sum + item.priceAtPurchase * item.quantity,
              0
            );
            const currentStatus = statusMap[order.id] ?? order.status;

            return (
              <Card key={order.id}>
                <CardHeader className="pb-2">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-base">
                        Order #{order.id}
                      </CardTitle>
                      <Badge
                        variant={statusVariant[currentStatus]}
                        className={statusColor[currentStatus]}
                      >
                        {currentStatus}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Buyer: {order.buyer.name}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Your items in this order */}
                  <div className="mb-4 space-y-3">
                    {yourItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 text-sm"
                      >
                        <Package className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="flex-1 min-w-0 truncate">
                          {item.product.title}
                        </span>
                        <span className="text-muted-foreground">
                          x{item.quantity}
                        </span>
                        <span className="font-medium">
                          ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t pt-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Your total:
                      </span>
                      <span className="font-bold">
                        ${yourTotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Update status:
                      </span>
                      <Select
                        value={currentStatus}
                        onValueChange={(value) =>
                          handleStatusChange(order.id, value as OrderStatus)
                        }
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ALL_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
