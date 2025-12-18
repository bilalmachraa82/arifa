import { Skeleton } from "@/components/ui/skeleton";

export function BlogHeroSkeleton() {
  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center animate-pulse">
      <Skeleton className="aspect-[16/10] rounded-sm" />
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-5 w-28" />
      </div>
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="bg-card rounded-sm overflow-hidden shadow-soft animate-pulse">
      <Skeleton className="aspect-[16/10]" />
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-12 w-full" />
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function BlogGridSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}
