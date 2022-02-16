import React, { FC, useState, useMemo, useRef } from 'react';
import Pie, { ProvidedProps, PieArcDatum } from '@visx/shape/lib/shapes/Pie';
import { scaleOrdinal } from '@visx/scale';
import { BaseDataPoint, getLabel, getValue, largeIntToAbbr } from 'src/utils';
import { Group } from '@visx/group';
import { LinearGradient } from '@visx/gradient';
import { useResizeObserver } from 'src/hooks';
import color from 'color';
import { animated, useTransition, interpolate } from 'react-spring';
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { useThemeUI } from 'theme-ui';
import { ExactTheme } from 'src/theme';
import { IBaseDataPoint } from 'types';
import { PieChartProps } from './types';
import { SizeWrapper, TitleWrapper } from '../wrappers';

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

const AnimatedPie: FC<AnimatedPieProps<BaseDataPoint>> = ({
  arcs,
  path,
  getKey,
  getColor,
  onClickDatum,
  onMouseLeave,
  onMouseOver,
}) => {
  const context = useThemeUI();

  const { primary, text, highlight, purple, muted } = context.theme
    .rawColors as ExactTheme['rawColors'];
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
      <g key={key}>
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
      </g>
    );
  });
};

export const PieChart: FC<PieChartProps> = ({
  data,
  title,
  padding = 50,
  ...props
}) => {
  // theme
  const context = useThemeUI();
  const { primary, text, highlight, purple, muted } = context.theme
    .rawColors as ExactTheme['rawColors'];

  // dimensions
  const wrapperRef = useRef(null);
  const dimensions = useResizeObserver(wrapperRef);
  const width = props.width || dimensions?.width || 0;
  const height = props.height || dimensions?.height || 0;
  const innerWidth = Math.max(0, width - padding * 2);
  const innerHeight = Math.max(0, height - padding * 2);
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerX = innerWidth / 2;
  const centerY = innerHeight / 2;
  // tooltip
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip();

  const { containerRef: tooltipContainerRef, TooltipInPortal } =
    useTooltipInPortal({
      detectBounds: true,
      scroll: true,
    });

  let tooltipTimeout: number;
  const handleTooltipLeave = () => {
    tooltipTimeout = window.setTimeout(() => {
      hideTooltip();
    }, 200);
  };

  const handleTooltipMouseOver = (event: any, datum: IBaseDataPoint) => {
    clearTimeout(tooltipTimeout);
    const coords = localPoint(event.target.ownerSVGElement, event);
    if (!coords) return;
    showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: (
        <div>
          <div>Cause: {datum.label}</div>
          <div>Delayed flights:{datum.getAbbrValue()}</div>
        </div>
      ),
    });
  };

  const colorScale = useMemo(
    () =>
      scaleOrdinal<string>({
        domain: data.map(getLabel),
        range: data.map((el, i) =>
          color(primary)
            .lighten((i + 1) / data.length)
            .hex()
        ),
      }),
    [data, primary]
  );

  return (
    <TitleWrapper title={title}>
      <SizeWrapper height={height} ref={wrapperRef}>
        <svg ref={tooltipContainerRef} width="100%" height="100%">
          <LinearGradient from={muted} to={highlight} id="bgGradient" />
          <rect width={width} height={height} fill="url(#bgGradient)" rx={14} />
          <Group top={centerY + padding} left={centerX + padding}>
            <Pie<BaseDataPoint>
              data={data}
              pieValue={getValue}
              pieSortValues={() => -1}
              outerRadius={radius}
            >
              {(pie) => (
                <AnimatedPie
                  {...pie}
                  getKey={(arc) => getLabel(arc.data)}
                  onClickDatum={() => null}
                  getColor={(arc) => colorScale(getLabel(arc.data)) as string}
                  onMouseLeave={handleTooltipLeave}
                  onMouseOver={handleTooltipMouseOver}
                />
              )}
            </Pie>
          </Group>
        </svg>
        {tooltipOpen && (
          <TooltipInPortal
            // set this to random so it correctly updates with parent bounds
            key={Math.random()}
            top={tooltipTop}
            left={tooltipLeft}
            style={{
              ...defaultStyles,
              background: muted,
              color: text,
              textAlign: 'center',
            }}
          >
            {tooltipData}
          </TooltipInPortal>
        )}
      </SizeWrapper>
    </TitleWrapper>
  );
};
