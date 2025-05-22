import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UrlAnalytics } from "@/types/url";
import { subDays, format, isAfter, parseISO } from "date-fns";

type WeeklyClicksChartProps = {
  analytics: UrlAnalytics;
};

export function WeeklyClicksChart({ analytics }: WeeklyClicksChartProps) {
  const today = new Date();
  const lastWeek = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, 6 - i);
    return {
      date: format(date, "MMMM d, yyyy"),
      clicks: 0,
      dateObj: date,
    };
  });

  // Count clicks per day for the last week
  analytics.clickHistory.forEach((click) => {
    const clickDate = parseISO(click.clickedAt);
    const sevenDaysAgo = subDays(today, 6);

    if (isAfter(clickDate, sevenDaysAgo)) {
      const dayIndex = lastWeek.findIndex(
        (day) =>
          format(day.dateObj, "yyyy-MM-dd") === format(clickDate, "yyyy-MM-dd")
      );

      if (dayIndex !== -1) {
        lastWeek[dayIndex].clicks += 1;
      }
    }
  });

  const data = lastWeek.map((day) => ({
    date: day.date,
    clicks: day.clicks,
  }));

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Clicks in the Last 7 Days</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="clicks" fill="#abecd6" name="Clicks" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
