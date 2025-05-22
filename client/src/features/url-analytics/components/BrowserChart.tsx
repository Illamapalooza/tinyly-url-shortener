import { GenericPieChart, PieChartData } from "./GenericPieChart";

type DeviceChartProps = {
  deviceData: Record<string, number>;
};

export function BrowserChart({ deviceData }: DeviceChartProps) {
  const data: PieChartData[] = Object.entries(deviceData).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  return <GenericPieChart title="Browsers" data={data} />;
}
