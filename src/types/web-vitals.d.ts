declare module 'web-vitals' {
  export type Metric = {
    id: string;
    name: string;
    value: number;
    delta?: number;
    entries: PerformanceEntry[];
  };

  export type ReportHandler = (metric: Metric) => void;

  export function getCLS(onReport: ReportHandler): void;
  export function getFCP(onReport: ReportHandler): void;
  export function getFID(onReport: ReportHandler): void;
  export function getLCP(onReport: ReportHandler): void;
  export function getTTFB(onReport: ReportHandler): void;
} 