import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { mockProducts } from "@/data/mock";
import { CATEGORIES } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ArrowLeft, ImageIcon } from "lucide-react";

export default function CreateListingPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const isValidImageUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const now = new Date().toISOString();
    const newId =
      mockProducts.length > 0
        ? Math.max(...mockProducts.map((p) => p.id)) + 1
        : 1;

    const newProduct = {
      id: newId,
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category,
      imageUrl: imageUrl.trim(),
      status: "ACTIVE" as const,
      seller: user,
      createdAt: now,
      updatedAt: now,
    };

    mockProducts.push(newProduct);
    navigate(`/products/${newId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link
        to="/products"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to browse
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What are you selling?"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your item in detail..."
                rows={5}
                required
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                min="0.01"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                required
              />
              {isValidImageUrl(imageUrl) ? (
                <div className="mt-3 rounded-lg border overflow-hidden">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                </div>
              ) : (
                imageUrl.length === 0 && (
                  <div className="mt-3 flex flex-col items-center justify-center h-64 rounded-lg border border-dashed text-muted-foreground">
                    <ImageIcon className="h-10 w-10 mb-2" />
                    <p className="text-sm">Image preview will appear here</p>
                  </div>
                )
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!title.trim() || !description.trim() || !price || !category || !imageUrl.trim()}
            >
              Create Listing
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
