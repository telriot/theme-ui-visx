import { SingleSeriesChartProps } from '../types';

export interface BarChartProps extends SingleSeriesChartProps {
  my?: number;
  mx?: number;
  xScaleType?: 'string' | 'date';
}
