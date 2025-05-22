import { GenericPieChart, PieChartData } from "./GenericPieChart";

type DeviceChartProps = {
  deviceData: Record<string, number>;
};

export function DeviceTypeChart({ deviceData }: DeviceChartProps) {
  const data: PieChartData[] = Object.entries(deviceData).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  return <GenericPieChart title="Device Types" data={data} />;
}
