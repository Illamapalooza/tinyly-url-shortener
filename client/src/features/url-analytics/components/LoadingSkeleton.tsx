import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-32 mb-4" />
        <Skeleton className="h-12 w-full max-w-2xl" />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-20" />
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Original URL Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>

      {/* Weekly Chart */}
      <Card className="col-span-full">
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent className="h-[300px]">
          <div className="h-full w-full bg-muted/20 rounded-md animate-pulse flex items-center justify-center">
            <Skeleton className="h-4/5 w-4/5" />
          </div>
        </CardContent>
      </Card>

      {/* Mobile vs Desktop Chart */}
      <Card className="col-span-full">
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent className="h-[250px]">
          <div className="h-full w-full bg-muted/20 rounded-md animate-pulse flex items-center justify-center">
            <div className="rounded-full h-40 w-40 bg-muted/40 animate-pulse"></div>
          </div>
        </CardContent>
      </Card>

      {/* Chart Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent className="h-[250px]">
                <div className="h-full w-full bg-muted/20 rounded-md animate-pulse flex items-center justify-center">
                  <div className="rounded-full h-32 w-32 bg-muted/40 animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
