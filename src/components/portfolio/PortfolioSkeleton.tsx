import { Skeleton } from "@/components/ui/skeleton";

export function PortfolioCardSkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-sm bg-card animate-pulse">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent">
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full bg-background/20" />
            <Skeleton className="h-5 w-20 rounded-full bg-background/20" />
          </div>
          <Skeleton className="h-6 w-3/4 bg-background/20" />
          <Skeleton className="h-4 w-1/2 bg-background/20" />
        </div>
      </div>
    </div>
  );
}

export function PortfolioGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(count)].map((_, i) => (
        <PortfolioCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProjectDetailSkeleton() {
  return (
    <div className="space-y-12 animate-pulse">
      {/* Hero */}
      <div className="space-y-6">
        <div className="flex gap-3">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-14 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
      </div>
      {/* Image */}
      <Skeleton className="aspect-[16/9] w-full rounded-sm" />
      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-5/6" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-sm" />
          <Skeleton className="h-24 w-full rounded-sm" />
        </div>
      </div>
    </div>
  );
}
