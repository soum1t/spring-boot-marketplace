import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { mockProducts } from "@/data/mock";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, Search, Trash2, Package } from "lucide-react";
import type { Product } from "@/types";

const statusColor: Record<Product["status"], string> = {
  ACTIVE: "bg-green-100 text-green-800 border-green-200",
  SOLD: "bg-blue-100 text-blue-800 border-blue-200",
  REMOVED: "bg-red-100 text-red-800 border-red-200",
};

export default function AdminProducts() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>(() => [...mockProducts]);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  const handleRemove = (productId: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, status: "REMOVED" as const } : p
      )
    );
  };

  const filterByStatus = (status: string) => {
    let filtered = products;
    if (status !== "all") {
      filtered = products.filter(
        (p) => p.status === status.toUpperCase()
      );
    }
    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(query)
      );
    }
    return filtered;
  };

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
        <h1 className="text-2xl font-bold">Product Management</h1>
        <p className="text-sm text-muted-foreground">
          View and manage all product listings ({products.length} total)
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs for status filter */}
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All ({products.length})</TabsTrigger>
          <TabsTrigger value="active">
            Active ({products.filter((p) => p.status === "ACTIVE").length})
          </TabsTrigger>
          <TabsTrigger value="sold">
            Sold ({products.filter((p) => p.status === "SOLD").length})
          </TabsTrigger>
          <TabsTrigger value="removed">
            Removed ({products.filter((p) => p.status === "REMOVED").length})
          </TabsTrigger>
        </TabsList>

        {["all", "active", "sold", "removed"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <ProductList
              products={filterByStatus(tab)}
              onRemove={handleRemove}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function ProductList({
  products,
  onRemove,
}: {
  products: Product[];
  onRemove: (id: number) => void;
}) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <Package className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <h3 className="mb-2 text-lg font-semibold">No products found</h3>
        <p className="text-sm text-muted-foreground">
          No products match your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((product) => (
        <Card key={product.id}>
          <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{product.title}</span>
                <Badge className={statusColor[product.status]}>
                  {product.status}
                </Badge>
              </div>
              <div className="mt-1 flex flex-wrap gap-x-4 text-sm text-muted-foreground">
                <span>ID: {product.id}</span>
                <span>${product.price.toFixed(2)}</span>
                <span>{product.category}</span>
                <span>Seller: {product.seller.name}</span>
                <span>
                  Listed: {new Date(product.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => onRemove(product.id)}
              disabled={product.status === "REMOVED"}
              title={
                product.status === "REMOVED"
                  ? "Already removed"
                  : "Remove listing"
              }
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
