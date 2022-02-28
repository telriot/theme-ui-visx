import { IBaseDataPoint } from "types";

export interface SingleSeriesChartProps {
  data: IBaseDataPoint[];
  title?: string;
  height?: number;
  width?: number;
}
