import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { mockUsers } from "@/data/mock";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Trash2, Shield, User } from "lucide-react";
import type { User as UserType } from "@/types";

export default function AdminUsers() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<UserType[]>(() => [...mockUsers]);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const query = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
    );
  }, [users, search]);

  const handleDelete = (userId: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
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
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-sm text-muted-foreground">
          View and manage all registered users ({users.length} total)
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <User className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-semibold">No users found</h3>
            <p className="text-sm text-muted-foreground">
              No users match your search criteria.
            </p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id}>
              <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    {user.role === "ADMIN" ? (
                      <Shield className="h-5 w-5 text-primary" />
                    ) : (
                      <User className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.name}</span>
                      <Badge
                        variant={user.role === "ADMIN" ? "default" : "secondary"}
                      >
                        {user.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right text-sm text-muted-foreground">
                    <p>ID: {user.id}</p>
                    <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                    disabled={user.role === "ADMIN"}
                    title={
                      user.role === "ADMIN"
                        ? "Cannot delete admin users"
                        : "Delete user"
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
