import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { mockOrders } from "@/data/mock";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Package } from "lucide-react";
import type { OrderStatus } from "@/types";

const statusColor: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
  SHIPPED: "bg-purple-100 text-purple-800 border-purple-200",
  DELIVERED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminOrders() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return mockOrders;
    return mockOrders.filter((order) => order.status === statusFilter);
  }, [statusFilter]);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <p className="text-sm text-muted-foreground">
          View and track all marketplace orders ({mockOrders.length} total)
        </p>
      </div>

      {/* Status Filter */}
      <div className="mb-6 max-w-xs">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {ORDER_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <Package className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="mb-2 text-lg font-semibold">No orders found</h3>
          <p className="text-sm text-muted-foreground">
            No orders match the selected filter.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Order #{order.id}</span>
                    <Badge className={statusColor[order.status]}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 text-sm text-muted-foreground">
                    <span>Buyer: {order.buyer.name}</span>
                    <span>
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"}
                    </span>
                    <span>
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/orders/${order.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
