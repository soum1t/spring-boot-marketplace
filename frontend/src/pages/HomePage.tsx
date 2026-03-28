import { Link } from "react-router";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CloudLightning, Star } from "lucide-react";

const reviews = [
  {
    name: "Aria Patel",
    role: "Design Lead",
    text: "The quality is consistently premium and checkout feels effortless every time.",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80",
    rating: 5,
  },
  {
    name: "Daniel Brooks",
    role: "Entrepreneur",
    text: "Shipping is very fast and the product matches exactly what the photos promise.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    rating: 5,
  },
  {
    name: "Maya Lewis",
    role: "Marketing Manager",
    text: "A modern store with sharp curation. I keep coming back for each new drop.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    rating: 4,
  },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 pb-14 pt-5 sm:px-6 lg:px-8 lg:pt-8">
        <section className="flex flex-col items-center justify-center px-2 py-8 text-center sm:px-4 sm:py-12 lg:py-14">
          <div className="max-w-3xl space-y-5">
            <div className="flex items-center justify-center gap-2">
              <div className="grid size-8 place-items-center bg-primary text-primary-foreground">
                <CloudLightning className="size-4" />
              </div>
              <span className="font-heading text-sm tracking-wide">Ecomm</span>
            </div>

            <Badge
              variant="outline"
              className="border-primary/30 bg-background/60 text-primary backdrop-blur"
            >
              New season curation
            </Badge>

            <h1 className="font-heading text-3xl leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              One storefront for premium everyday essentials.
            </h1>

            <p className="mx-auto max-w-2xl text-muted-foreground">
              Clean design, fast experiences, and standout products from fashion
              to home. Discover collections built for modern lifestyles.
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              <Button size="lg" className="gap-1.5" asChild>
                <Link to="/shop">
                  Start shopping
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl tracking-tight sm:text-2xl">
              What Shoppers Say
            </h2>
            <Badge variant="outline">Real reviews</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {reviews.map((item) => (
              <Card
                key={item.name}
                className="border-border/70 bg-background/80 backdrop-blur-sm"
              >
                <CardHeader className="flex-row items-center gap-3 space-y-0">
                  <Avatar>
                    <AvatarImage src={item.image} alt={item.name} />
                    <AvatarFallback>
                      {item.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-sm">{item.name}</CardTitle>
                    <p className="text-muted-foreground">{item.role}</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={`${item.name}-${i}`} className="size-3.5" />
                    ))}
                  </div>
                  <p className="text-muted-foreground">"{item.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <footer className="px-2 py-3 text-muted-foreground/90 sm:px-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="grid size-6 place-items-center border border-border/60 bg-background/40 text-primary">
                <CloudLightning className="size-3.5" />
              </div>
              <span className="font-heading text-xs tracking-wide">Ecomm</span>
            </div>
            <p className="text-xs">© 2026 All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
