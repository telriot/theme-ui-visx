import { IBaseDataPoint } from 'types';

export interface BarChartProps {
  data: IBaseDataPoint[];
  title?: string;
  height?: number;
  width?: number;
  my?: number;
  mx?: number;
}
