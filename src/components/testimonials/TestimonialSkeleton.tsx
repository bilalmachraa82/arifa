import { Skeleton } from "@/components/ui/skeleton";

export function TestimonialSkeleton() {
  return (
    <div className="bg-card rounded-sm p-8 animate-pulse">
      <div className="flex items-start gap-4 mb-6">
        <Skeleton className="w-14 h-14 rounded-full flex-shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

export function TestimonialsGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(count)].map((_, i) => (
        <TestimonialSkeleton key={i} />
      ))}
    </div>
  );
}
