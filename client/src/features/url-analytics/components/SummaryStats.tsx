import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UrlAnalytics } from "@/types/url";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink } from "lucide-react";

type SummaryStatsProps = {
  analytics: UrlAnalytics;
};

export function SummaryStats({ analytics }: SummaryStatsProps) {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{analytics.totalClicks}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              {formatDistanceToNow(new Date(analytics.createdAt))} ago
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Original URL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <p className="text-sm break-all">{analytics.originalUrl}</p>
            <a
              href={analytics.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
