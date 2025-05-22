import { UrlAnalytics } from "@/types/url";
import { DeviceTypeChart } from "./DeviceTypeChart";
import { BrowserChart } from "./BrowserChart";
import { OSChart } from "./OSChart";
import { WeeklyClicksChart } from "./WeeklyClicksChart";

type AnalyticsChartsProps = {
  analytics: UrlAnalytics;
};

export function AnalyticsChartsSection({ analytics }: AnalyticsChartsProps) {
  return (
    <>
      {/* Weekly Clicks Chart */}
      <div className="mb-8">
        <WeeklyClicksChart analytics={analytics} />
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <DeviceTypeChart deviceData={analytics.deviceInfo.deviceTypes} />
        <BrowserChart deviceData={analytics.deviceInfo.browsers} />
        <OSChart deviceData={analytics.deviceInfo.operatingSystems} />
      </div>
    </>
  );
}
