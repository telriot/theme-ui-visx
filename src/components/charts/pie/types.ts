import { PieArcDatum } from '@visx/shape/lib/shapes/Pie';
import { IBaseDataPoint } from 'types';
import { SingleSeriesChartProps } from '../types';

export interface PieChartProps extends SingleSeriesChartProps {
  padding?: number;
  onClickDatum?: (d: PieArcDatum<IBaseDataPoint>) => void;
}
