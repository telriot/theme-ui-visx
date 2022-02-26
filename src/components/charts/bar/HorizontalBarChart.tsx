import { FC, useMemo, useRef } from 'react';
import { useResizeObserver } from 'src/hooks';
import { getLabel, getValue, largeIntToAbbr } from 'src/utils';
import { Group } from '@visx/group';
import { LinearGradient } from '@visx/gradient';
import { scaleBand, scaleLinear } from '@visx/scale';
import { useThemeUI } from 'theme-ui';
import { RectClipPath } from '@visx/clip-path';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { ExactTheme } from 'src/theme';
import { IBaseDataPoint } from 'types';
import { SizeWrapper, TitleWrapper } from '../wrappers';
import { BarChartProps } from './types';
import { AnimatedBar } from './shared/AnimatedBar';

export interface HorizontalBarChartProps extends BarChartProps {
  className?: string;
}

export const HorizontalBarChart: FC<HorizontalBarChartProps> = ({
  data,
  title,
  mx = 100,
  my = 100,
  ...props
}) => {
  // theme
  const context = useThemeUI();
  const { primary, text, highlight, muted } = context.theme
    .rawColors as ExactTheme['rawColors'];
  // animation
  // const transitions = useTransition({
  //   to: { width: 1 },
  //   from: { width: 0 },
  // });
  // dimensions
  const wrapperRef = useRef(null);
  const dimensions = useResizeObserver(wrapperRef);
  const width = props.width || dimensions?.width || 0;
  const height = props.height || dimensions?.height || 0;

  // bounds
  const xMax = Math.max(0, width - mx);
  const yMax = Math.max(0, height - my);

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
          <div>Year: {datum.label}</div>
          <div>Population: {datum.getAbbrValue()}</div>
        </div>
      ),
    });
  };
  // scales, memoize for performance
  const numTicks = useMemo(() => Math.floor(xMax / 100), [xMax]);
  const xScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [0, xMax],
        domain: [0, Math.max(...data.map(getValue))],
        round: false,
      }),
    [data, xMax]
  );
  const yScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, yMax],
        domain: data.map(getLabel),
        padding: 0.5,
      }),
    [yMax, data]
  );
  console.log(data, 'DATA');
  return (
    <TitleWrapper title={title}>
      <SizeWrapper ref={wrapperRef}>
        {!width ? null : (
          <svg ref={tooltipContainerRef} width="100%" height="100%">
            <LinearGradient from={muted} to={highlight} id="bgGradient" />
            <rect
              data-testid="chart-bg"
              width={width}
              height={height}
              fill="url(#bgGradient)"
              rx={14}
            />

            <Group top={my / 2} left={mx / 2} clipPath="url(#zoom-clip)">
              <RectClipPath id="zoom-clip" width={xMax} height={yMax + 40} />
              <Group width={xMax} height={yMax}>
                {data.map((d) => {
                  const label = getLabel(d);
                  const barHeight = xScale(d.value);
                  const barWidth = yScale.bandwidth();
                  const barX = 0;
                  const barY = yScale(d.label);
                  return (
                    <AnimatedBar
                      key={`bar-${label}`}
                      x={barX}
                      y={barY}
                      width={barHeight}
                      height={barWidth}
                      fill={primary}
                      label={label}
                      direction="horizontal"
                      onMouseOver={(e) => handleTooltipMouseOver(e, d)}
                      onMouseLeave={handleTooltipLeave}
                      datum={d}
                    />
                  );
                })}
              </Group>
            </Group>
            <Group>
              <AxisBottom
                top={yMax + my / 2}
                left={mx / 2}
                scale={xScale}
                stroke={text}
                tickFormat={(value) => largeIntToAbbr(value as number)}
                tickStroke={text}
                tickLabelProps={() => ({
                  fill: text,
                  fontSize: 11,
                  textAnchor: 'middle',
                  dy: 4,
                })}
                hideZero
                tickLength={4}
                numTicks={numTicks || 10}
              />
            </Group>
            <AxisLeft
              left={mx / 2}
              top={my / 2}
              scale={yScale}
              labelOffset={100}
              stroke={text}
              tickLabelProps={() => ({
                fill: text,
                fontSize: 11,
                dx: -25,
                dy: yScale.bandwidth() / 2,
              })}
              hideAxisLine
              hideTicks
              hideZero
            />
          </svg>
        )}
        {tooltipOpen && (
          <TooltipInPortal
            data-testid="portal-tooltip"
            // set this to random so it correctly updates with parent bounds
            key={Math.random()}
            top={tooltipTop}
            left={tooltipLeft}
            sx={{
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
