import { FC, useMemo, useRef } from 'react';
import Pie from '@visx/shape/lib/shapes/Pie';
import { scaleOrdinal } from '@visx/scale';
import { BaseDataPoint, getLabel, getValue } from 'src/utils';
import { Group } from '@visx/group';
import { LinearGradient } from '@visx/gradient';
import { useResizeObserver } from 'src/hooks';
import color from 'color';
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { useThemeUI, useColorMode } from 'theme-ui';
import { ExactTheme } from 'src/theme';
import { IBaseDataPoint } from 'types';
import { PieChartProps } from './types';
import { SizeWrapper, TitleWrapper } from '../wrappers';
import { AnimatedPie } from './shared/AnimatedPie';

interface DonutChartProps extends PieChartProps {
  thickness?: number;
}
export const DonutChart: FC<DonutChartProps> = ({
  data,
  title,
  padding = 50,
  thickness = 50,
  onClickDatum,
  ...props
}) => {
  // theme
  const context = useThemeUI();
  const [colorMode] = useColorMode();
  const { primary, text, highlight, muted } = context.theme
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
          <div>Delayed flights: {datum.getAbbrValue()}</div>
        </div>
      ),
    });
  };

  const colorScale = useMemo(() => {
    const extractDark = (i: number) =>
      color(primary)
        .darken((i + 1) / data.length)
        .hex();
    const extractLight = (i: number) =>
      color(primary)
        .lighten((i + 1) / data.length)
        .hex();
    return scaleOrdinal<string>({
      domain: data.map(getLabel),
      range: data.map((_, i) =>
        colorMode === 'dark' ? extractDark(i) : extractLight(i)
      ),
    });
  }, [data, primary, colorMode]);

  const handleClickDatum =
    typeof onClickDatum !== 'undefined' ? onClickDatum : () => null;

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
              innerRadius={radius - thickness}
            >
              {(pie) => (
                <AnimatedPie
                  {...pie}
                  getKey={(arc) => getLabel(arc.data)}
                  onClickDatum={handleClickDatum}
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
