import { FC, useMemo, useRef } from 'react';
import {
  useKeyDownListener,
  useResizeObserver,
  useXDragAndZoom,
} from 'src/hooks';
import { formatToMDY, getLabel, getValue, largeIntToAbbr } from 'src/utils';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { LinearGradient } from '@visx/gradient';
import { scaleBand, scaleLinear } from '@visx/scale';
import { Drag } from '@visx/drag';
import { useThemeUI } from 'theme-ui';
import { RectClipPath } from '@visx/clip-path';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { ExactTheme } from 'src/theme';
import { IBaseDataPoint } from 'types';
import { SizeWrapper, TitleWrapper } from '../wrappers';
import { BarChartProps } from './types';

export interface VerticalBarChartProps extends BarChartProps {
  className?: string;
}
export const VerticalBarChart: FC<VerticalBarChartProps> = ({
  data,
  title,
  mx = 100,
  my = 100,
  xScaleType = 'string',
  ...props
}) => {
  // theme
  const context = useThemeUI();
  const { primary, text, highlight, muted } = context.theme
    .rawColors as ExactTheme['rawColors'];

  // dimensions
  const wrapperRef = useRef(null);
  const dimensions = useResizeObserver(wrapperRef);
  const width = props.width || dimensions?.width || 0;
  const height = props.height || dimensions?.height || 0;
  // bounds
  const xMax = Math.max(0, width - mx);
  const yMax = Math.max(0, height - my);
  console.log(height, yMax);

  // use x range hook
  const isShiftDown = useKeyDownListener('Shift');
  const {
    handleDragEnd,
    handleDragMove,
    handleWheelZoom,
    xRange,
    xTranslation,
  } = useXDragAndZoom(xMax);

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
          <div>Close: {datum.value}</div>
          <div>Date: {datum.label}</div>
        </div>
      ),
    });
  };

  // scales, memoize for performance
  const numTicks = useMemo(() => Math.floor(xRange[1] / 100), [xRange]);
  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: xRange,
        round: false,
        domain: data.map(getLabel),
        padding: 0.3,
      }),
    [data, xRange]
  );
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        round: false,
        domain: [0, Math.max(...data.map(getValue))],
      }),
    [yMax, data]
  );
  const colorScale = useMemo(
    () =>
      scaleLinear<string>({
        range: [highlight, primary],
        round: false,
        domain: [0, Math.max(...data.map(getValue))],
      }),
    [data, highlight, primary]
  );

  return (
    <TitleWrapper title={title}>
      <SizeWrapper ref={wrapperRef}>
        <svg ref={tooltipContainerRef} width="100%" height="100%">
          <LinearGradient from={muted} to={highlight} id="bgGradient" />
          <rect width={width} height={height} fill="url(#bgGradient)" rx={14} />

          <Group top={my / 2} left={mx / 2} clipPath="url(#zoom-clip)">
            <RectClipPath id="zoom-clip" width={xMax} height={yMax + 40} />

            <Group
              sx={{ transform: `translateX(${xTranslation}px)` }}
              width={xMax}
              height={yMax}
            >
              {data.map((d) => {
                const label = getLabel(d);
                const barWidth = xScale.bandwidth();
                const barHeight = yMax - (yScale(getValue(d)) ?? 0);
                const barX = xScale(d.label);
                const barY = yMax - barHeight;
                return (
                  <Bar
                    key={`bar-${label}`}
                    x={barX}
                    y={barY}
                    width={barWidth}
                    height={barHeight}
                    fill={colorScale(d.value)}
                    sx={{ transition: 'width .4s .4s' }}
                    onMouseOver={(e) => handleTooltipMouseOver(e, d)}
                    onMouseLeave={handleTooltipLeave}
                  />
                );
              })}
            </Group>
            <Group sx={{ transform: `translateX(${xTranslation}px)` }}>
              <AxisBottom
                top={yMax}
                scale={xScale}
                tickFormat={xScaleType === 'date' ? formatToMDY : undefined}
                stroke={text}
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
            <Drag
              key={`drag-area`}
              width={xMax}
              height={yMax}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
              resetOnStart
            >
              {({ dragStart, dragEnd, dragMove, isDragging }) => (
                <rect
                  width={xMax}
                  height={yMax}
                  rx={14}
                  sx={{
                    cursor: isShiftDown
                      ? isDragging
                        ? 'grabbing'
                        : 'grab'
                      : 'default',
                    pointerEvents: isShiftDown ? 'all' : 'none',
                  }}
                  fill="transparent"
                  onMouseMove={dragMove}
                  onMouseUp={dragEnd}
                  onMouseDown={dragStart}
                  onMouseOut={dragEnd}
                  onTouchStart={dragStart}
                  onTouchMove={dragMove}
                  onTouchEnd={dragEnd}
                  onWheel={handleWheelZoom}
                />
              )}
            </Drag>
          </Group>

          <AxisLeft
            left={mx / 2}
            top={my / 2}
            scale={yScale}
            labelOffset={100}
            stroke={text}
            tickFormat={(value) => largeIntToAbbr(value as number)}
            tickStroke={text}
            tickLabelProps={() => ({
              fill: text,
              fontSize: 11,
              dx: -25,
            })}
            hideZero
            tickLength={4}
          />
        </svg>
        {tooltipOpen && (
          <TooltipInPortal
            // set this to random so it correctly updates with parent bounds
            key={Math.random()}
            top={tooltipTop}
            left={tooltipLeft}
            sx={{
              ...defaultStyles,
              background: muted,
              color: text,
              textAlign: 'center',
              zIndex: 'top',
            }}
          >
            {tooltipData}
          </TooltipInPortal>
        )}
      </SizeWrapper>
    </TitleWrapper>
  );
};
