import { useParams } from "react-router-dom";
import { useUrlAnalytics } from "../../features/url-analytics/hooks/use-url-analytics";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AnalyticsHeader } from "../../features/url-analytics/components/AnalyticsHeader";
import { SummaryStats } from "../../features/url-analytics/components/SummaryStats";
import { AnalyticsChartsSection } from "../../features/url-analytics/components/AnalyticsCharts";
import { LoadingSkeleton } from "../../features/url-analytics/components/LoadingSkeleton";

export function UrlAnalyticsPage() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const { analytics, isLoading, error } = useUrlAnalytics(shortCode || "");

  if (error) {
    return (
      <div className="bg-main-gradient">
        <div className="container mx-auto py-8 px-4">
          <AnalyticsHeader shortCode={shortCode || ""} />
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-main-gradient">
      <div className="container mx-auto py-8 px-4">
        {isLoading ? (
          <LoadingSkeleton />
        ) : analytics ? (
          <>
            <AnalyticsHeader shortCode={analytics.shortCode} />
            <SummaryStats analytics={analytics} />
            <AnalyticsChartsSection analytics={analytics} />
          </>
        ) : (
          <>
            <AnalyticsHeader shortCode={shortCode || ""} />
            <Alert>
              <AlertTitle>Not Found</AlertTitle>
              <AlertDescription>
                The URL with shortcode {shortCode} was not found.
              </AlertDescription>
            </Alert>
          </>
        )}
      </div>
    </div>
  );
}
