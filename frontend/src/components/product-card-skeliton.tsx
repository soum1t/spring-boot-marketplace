import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
      <Skeleton className="w-full aspect-4/3 rounded-none shrink-0" />

      <CardHeader className="grow">
        <div className="flex justify-between items-center gap-4 mb-2">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-6 w-1/4 shrink-0" />
        </div>

        <div className="space-y-2 mt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </CardHeader>

      <CardFooter className="pt-0 pb-0 shrink-0">
        <div className="mt-4 w-full flex gap-2">
          <Skeleton className="h-10 w-14 mb-2 rounded-md shrink-0" />
          <Skeleton className="h-10 grow rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md shrink-0" />
        </div>
      </CardFooter>
    </Card>
  );
}
