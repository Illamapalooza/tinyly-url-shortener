export type UtmParams = {
  source?: string;
  medium?: string;
  campaign?: string;
};

export type VisitorInfo = {
  visitorId?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  ipAddress?: string;
};

export type DeviceAnalytics = {
  deviceTypes: Record<string, number>;
  browsers: Record<string, number>;
  operatingSystems: Record<string, number>;
};
