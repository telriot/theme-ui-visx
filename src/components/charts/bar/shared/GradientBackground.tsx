import { FC } from 'react';
import { LinearGradient } from '@visx/gradient';

export interface GradientBackgroundProps {
  width: number;
  height: number;
  from: string;
  to: string;
}
export const GradientBackground: FC<GradientBackgroundProps> = ({
  width,
  height,
  from,
  to,
}) => (
  <>
    <LinearGradient from={from} to={to} id="bgGradient" />
    <rect
      data-testid="chart-bg"
      width={width}
      height={height}
      fill="url(#bgGradient)"
      rx={14}
    />
  </>
);
