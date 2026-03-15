import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ShoppingCart,
  User,
  LogOut,
  Package,
  ClipboardList,
  Store,
  Search,
  Plus,
  Shield,
  Menu,
  X,
} from "lucide-react";

export function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/");
    }
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <Store className="h-6 w-6" />
          <span>Marketplace</span>
        </Link>

        {/* Search - center (desktop) */}
        <form onSubmit={handleSearch} className="hidden flex-1 max-w-md mx-8 md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-9 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </form>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" asChild>
            <Link to="/">Browse</Link>
          </Button>

          {isAuthenticated ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/products/new">
                  <Plus className="h-4 w-4" />
                  Sell Item
                </Link>
              </Button>

              {isAdmin && (
                <Button variant="ghost" asChild>
                  <Link to="/admin">
                    <Shield className="h-4 w-4" />
                    Admin
                  </Link>
                </Button>
              )}

              <Button variant="ghost" size="icon" asChild className="relative">
                <Link to="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]">
                      {totalItems}
                    </Badge>
                  )}
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {user?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase() ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/my-listings">
                      <Package className="h-4 w-4" />
                      My Listings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/orders">
                      <ClipboardList className="h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/sales">
                      <Store className="h-4 w-4" />
                      My Sales
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">
                  <User className="h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </nav>

        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t bg-white px-4 pb-4 md:hidden">
          {/* Mobile search */}
          <form onSubmit={handleSearch} className="relative my-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-9 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </form>

          <nav className="flex flex-col gap-1">
            <Button variant="ghost" asChild className="justify-start" onClick={closeMobileMenu}>
              <Link to="/">
                <Store className="h-4 w-4" />
                Browse
              </Link>
            </Button>

            {isAuthenticated ? (
              <>
                <Button variant="ghost" asChild className="justify-start" onClick={closeMobileMenu}>
                  <Link to="/products/new">
                    <Plus className="h-4 w-4" />
                    Sell Item
                  </Link>
                </Button>

                <Button variant="ghost" asChild className="justify-start" onClick={closeMobileMenu}>
                  <Link to="/cart">
                    <ShoppingCart className="h-4 w-4" />
                    Cart
                    {totalItems > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {totalItems}
                      </Badge>
                    )}
                  </Link>
                </Button>

                {isAdmin && (
                  <Button variant="ghost" asChild className="justify-start" onClick={closeMobileMenu}>
                    <Link to="/admin">
                      <Shield className="h-4 w-4" />
                      Admin
                    </Link>
                  </Button>
                )}

                <div className="my-2 h-px bg-border" />

                <p className="px-4 py-1 text-sm font-medium text-muted-foreground">
                  {user?.name}
                </p>

                <Button variant="ghost" asChild className="justify-start" onClick={closeMobileMenu}>
                  <Link to="/my-listings">
                    <Package className="h-4 w-4" />
                    My Listings
                  </Link>
                </Button>

                <Button variant="ghost" asChild className="justify-start" onClick={closeMobileMenu}>
                  <Link to="/orders">
                    <ClipboardList className="h-4 w-4" />
                    My Orders
                  </Link>
                </Button>

                <Button variant="ghost" asChild className="justify-start" onClick={closeMobileMenu}>
                  <Link to="/sales">
                    <Store className="h-4 w-4" />
                    My Sales
                  </Link>
                </Button>

                <div className="my-2 h-px bg-border" />

                <Button
                  variant="ghost"
                  className="justify-start text-destructive"
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="justify-start" onClick={closeMobileMenu}>
                  <Link to="/login">
                    <User className="h-4 w-4" />
                    Login
                  </Link>
                </Button>

                <Button asChild className="mt-1" onClick={closeMobileMenu}>
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
