import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { mockProducts } from "@/data/mock";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Package } from "lucide-react";

type StatusFilter = "all" | "ACTIVE" | "SOLD" | "REMOVED";

const STATUS_STYLES: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
  ACTIVE: { variant: "default", className: "bg-green-600 hover:bg-green-700 text-white" },
  SOLD: { variant: "default", className: "bg-amber-500 hover:bg-amber-600 text-white" },
  REMOVED: { variant: "destructive", className: "" },
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ListingGrid({ products }: { products: typeof mockProducts }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <Package className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <h3 className="mb-2 text-lg font-semibold">No listings found</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          You don't have any listings matching this filter.
        </p>
        <Button asChild>
          <Link to="/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Create your first listing
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        const style = STATUS_STYLES[product.status];
        return (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-[3/2] overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold line-clamp-1">{product.title}</h3>
                <span className="text-lg font-bold shrink-0">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">{product.category}</Badge>
                <Badge variant={style.variant} className={style.className}>
                  {product.status}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                Listed on {formatDate(product.createdAt)}
              </p>

              <div className="flex items-center gap-2 pt-1">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link to={`/products/${product.id}/edit`}>
                    <Edit className="mr-2 h-3.5 w-3.5" />
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-destructive hover:text-destructive"
                  disabled={product.status === "REMOVED"}
                  onClick={() => {
                    product.status = "REMOVED";
                    product.updatedAt = new Date().toISOString();
                    // Force re-render by dispatching a custom event
                    window.dispatchEvent(new Event("listings-updated"));
                  }}
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default function MyListingsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<StatusFilter>("all");
  const [, forceUpdate] = useState(0);

  // Listen for listing updates to force re-render after delete
  useEffect(() => {
    function handleUpdate() {
      forceUpdate((n) => n + 1);
    }
    window.addEventListener("listings-updated", handleUpdate);
    return () => window.removeEventListener("listings-updated", handleUpdate);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const myListings = useMemo(
    () => mockProducts.filter((p) => p.seller.id === user?.id),
    [user?.id, forceUpdate]
  );

  const filteredListings = useMemo(() => {
    if (activeTab === "all") return myListings;
    return myListings.filter((p) => p.status === activeTab);
  }, [myListings, activeTab]);

  const counts = useMemo(
    () => ({
      all: myListings.length,
      ACTIVE: myListings.filter((p) => p.status === "ACTIVE").length,
      SOLD: myListings.filter((p) => p.status === "SOLD").length,
      REMOVED: myListings.filter((p) => p.status === "REMOVED").length,
    }),
    [myListings]
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Listings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your product listings
          </p>
        </div>
        <Button asChild>
          <Link to="/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Create New Listing
          </Link>
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as StatusFilter)}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
          <TabsTrigger value="ACTIVE">Active ({counts.ACTIVE})</TabsTrigger>
          <TabsTrigger value="SOLD">Sold ({counts.SOLD})</TabsTrigger>
          <TabsTrigger value="REMOVED">Removed ({counts.REMOVED})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <ListingGrid products={filteredListings} />
        </TabsContent>
        <TabsContent value="ACTIVE">
          <ListingGrid products={filteredListings} />
        </TabsContent>
        <TabsContent value="SOLD">
          <ListingGrid products={filteredListings} />
        </TabsContent>
        <TabsContent value="REMOVED">
          <ListingGrid products={filteredListings} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
