import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router";
import { mockProducts } from "@/data/mock";
import { CATEGORIES } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, SlidersHorizontal } from "lucide-react";

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Read filters from URL search params
  const keyword = searchParams.get("q") ?? "";
  const selectedCategory = searchParams.get("category") ?? "";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";

  // Local state for the search input (so we only update URL on submit)
  const [searchInput, setSearchInput] = useState(keyword);

  // Helper to update search params without losing other params
  function updateParams(updates: Record<string, string>) {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
    }
    setSearchParams(next, { replace: true });
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ q: searchInput.trim() });
  }

  function handleCategorySelect(category: string) {
    updateParams({ category: category === selectedCategory ? "" : category });
  }

  function handleClearFilters() {
    setSearchInput("");
    setSearchParams({}, { replace: true });
  }

  const hasActiveFilters = keyword || selectedCategory || minPrice || maxPrice;

  // Filter products
  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      // Only show ACTIVE products
      if (product.status !== "ACTIVE") return false;

      // Keyword search (title or description, case-insensitive)
      if (keyword) {
        const q = keyword.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc) return false;
      }

      // Category filter
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }

      // Price range
      if (minPrice) {
        const min = parseFloat(minPrice);
        if (!isNaN(min) && product.price < min) return false;
      }
      if (maxPrice) {
        const max = parseFloat(maxPrice);
        if (!isNaN(max) && product.price > max) return false;
      }

      return true;
    });
  }, [keyword, selectedCategory, minPrice, maxPrice]);

  // Sidebar content (shared between mobile overlay and desktop sidebar)
  const sidebarContent = (
    <div className="space-y-6">
      {/* Category filter */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Category
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "" ? "default" : "outline"}
            size="sm"
            onClick={() => updateParams({ category: "" })}
          >
            All
          </Button>
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Price range filter */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Price Range
        </h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            min={0}
            value={minPrice}
            onChange={(e) => updateParams({ minPrice: e.target.value })}
            className="w-full"
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            placeholder="Max"
            min={0}
            value={maxPrice}
            onChange={(e) => updateParams({ maxPrice: e.target.value })}
            className="w-full"
          />
        </div>
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          className="w-full text-destructive hover:text-destructive"
          onClick={handleClearFilters}
        >
          <X className="mr-2 h-4 w-4" />
          Clear filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search bar */}
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Search</Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="Toggle filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </form>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          {sidebarContent}
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Panel */}
            <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-background p-6 shadow-lg overflow-y-auto">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close filters"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {sidebarContent}
            </div>
          </div>
        )}

        {/* Product grid */}
        <main className="flex-1 min-w-0">
          {/* Results count */}
          <p className="mb-4 text-sm text-muted-foreground">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"} found
          </p>

          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <Search className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-semibold">No products found</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Try adjusting your search or filters to find what you're looking
                for.
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear all filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group"
                >
                  <Card className="h-full overflow-hidden transition-shadow group-hover:shadow-lg">
                    <div className="aspect-[3/2] overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="line-clamp-1 text-base">
                          {product.title}
                        </CardTitle>
                      </div>
                      <Badge variant="secondary" className="w-fit">
                        {product.category}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {product.seller.name}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
