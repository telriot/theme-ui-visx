import { FC, MouseEvent } from 'react';
import { animated, useSpring } from 'react-spring';
import { IBaseDataPoint } from 'types';

interface IBarPathArgs {
  width: number;
  height: number;
  x?: number;
  y?: number;
}
interface AnimatedBarProps extends IBarPathArgs {
  datum: IBaseDataPoint;
  label: string;
  fill: string;
  onMouseOver: (e: MouseEvent, d: IBaseDataPoint) => void;
  onMouseLeave: VoidFunction;
  direction?: 'vertical' | 'horizontal';
}

export const AnimatedBar: FC<AnimatedBarProps> = ({
  label,
  width,
  height,
  x,
  y,
  onMouseLeave,
  onMouseOver,
  datum,
  fill,
  direction = 'vertical',
}) => {
  const springProps = useSpring({
    to: { transform: direction === 'vertical' ? 'scaleY(1)' : 'scaleX(1)' },
    from: { transform: direction === 'vertical' ? 'scaleY(0)' : 'scaleX(0)' },
    delay: 200,
  });

  return height && width ? (
    <animated.rect
      key={`bar-${label}`}
      fill={fill}
      x={x}
      y={y}
      width={width}
      height={height}
      style={springProps}
      onMouseEnter={(e) => onMouseOver(e, datum)}
      onMouseLeave={onMouseLeave}
    />
  ) : null;
};
