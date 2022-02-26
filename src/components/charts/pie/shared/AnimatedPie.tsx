import { FC } from 'react';
import { ProvidedProps, PieArcDatum } from '@visx/shape/lib/shapes/Pie';
import { BaseDataPoint } from 'src/utils';
import { Group } from '@visx/group';
import { animated, useTransition, interpolate } from 'react-spring';
import { useThemeUI } from 'theme-ui';
import { ExactTheme } from 'src/theme';

// react-spring transition definitions
type AnimatedStyles = { startAngle: number; endAngle: number; opacity: number };

const fromLeaveTransition = ({ endAngle }: PieArcDatum<any>) => ({
  // enter from 360° if end angle is > 180°
  startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  opacity: 0,
});

const enterUpdateTransition = ({ startAngle, endAngle }: PieArcDatum<any>) => ({
  startAngle,
  endAngle,
  opacity: 1,
});

type AnimatedPieProps<Datum> = ProvidedProps<Datum> & {
  getKey: (d: PieArcDatum<Datum>) => string;
  getColor: (d: PieArcDatum<Datum>) => string;
  onClickDatum: (d: PieArcDatum<Datum>) => void;
  onMouseOver: (e: any, d: Datum) => void;
  onMouseLeave: VoidFunction;
  delay?: number;
};

export const AnimatedPie: FC<AnimatedPieProps<BaseDataPoint>> = ({
  arcs,
  path,
  getKey,
  getColor,
  onClickDatum,
  onMouseLeave,
  onMouseOver,
}) => {
  const context = useThemeUI();

  const { text } = context.theme.rawColors as ExactTheme['rawColors'];
  const transitions = useTransition<PieArcDatum<BaseDataPoint>, AnimatedStyles>(
    arcs,
    {
      from: fromLeaveTransition,
      enter: enterUpdateTransition,
      update: enterUpdateTransition,
      leave: fromLeaveTransition,
      keys: getKey,
    }
  );
  return transitions((props, arc, { key }) => {
    const [centroidX, centroidY] = path.centroid(arc);
    const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;

    return (
      <Group key={key}>
        <animated.path
          // compute interpolated path d attribute from intermediate angle values
          d={interpolate(
            [props.startAngle, props.endAngle],
            (startAngle, endAngle) =>
              path({
                ...arc,
                startAngle,
                endAngle,
              })
          )}
          fill={getColor(arc)}
          onClick={() => onClickDatum(arc)}
          onTouchStart={() => onClickDatum(arc)}
          onMouseLeave={onMouseLeave}
          onMouseOver={(e) => onMouseOver(e, arc.data)}
        />
        {hasSpaceForLabel && (
          <animated.g style={{ opacity: props.opacity }}>
            <text
              fill={text}
              x={centroidX}
              y={centroidY}
              dy=".33em"
              fontSize={11}
              textAnchor="middle"
              pointerEvents="none"
            >
              {getKey(arc)}
            </text>
          </animated.g>
        )}
      </Group>
    );
  });
};
