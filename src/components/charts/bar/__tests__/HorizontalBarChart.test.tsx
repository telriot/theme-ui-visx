import { render, screen, waitFor } from 'test-utils';
import userEvent from '@testing-library/user-event';
import { Globals } from 'react-spring';
import { HorizontalBarChart } from '../HorizontalBarChart';
import { BaseDataPoint } from 'src/utils';
import { HorizontalBarChartProps } from '..';

Globals.assign({
  skipAnimation: true,
});

const chartBgId = 'chart-bg';
const tooltipId = 'portal-tooltip';
const barId = 'animated-bar';

const baseProps = {
  title: 'Test title',
  height: 400,
  width: 400,
  data: (
    [
      [100, 'Rome'],
      [200, 'Paris'],
      [300, 'Berlin'],
    ] as [number, string][]
  ).map((el) => new BaseDataPoint(...el)),
  xScaleType: 'string',
} as HorizontalBarChartProps;

const View = () => <HorizontalBarChart {...baseProps} />;

describe('Horizontal Bar Chart with valid data', () => {
  beforeEach(() => {
    render(<View />);
  });
  test('It renders without crashing', async () => {
    expect(document.querySelector('.visx-axis-bottom')).toBeInTheDocument();
    expect(document.querySelector('.visx-axis-left')).toBeInTheDocument();
    expect(screen.getByTestId(chartBgId)).toBeInTheDocument();
    expect(screen.getByText(baseProps.title!)).toBeInTheDocument();
    const bars = await screen.findAllByTestId(barId);
    expect(bars).toHaveLength(baseProps.data.length);
  });
});
