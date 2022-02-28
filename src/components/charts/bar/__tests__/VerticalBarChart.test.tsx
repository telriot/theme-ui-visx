import { render, screen, waitForElementToBeRemoved } from 'test-utils';
import userEvent from '@testing-library/user-event';
import { Globals } from 'react-spring';
import { VerticalBarChart } from '../VerticalBarChart';
import { BaseDataPoint } from 'src/utils';
import { VerticalBarChartProps } from '..';

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
} as VerticalBarChartProps;

const View = () => <VerticalBarChart {...baseProps} />;

describe('Vertical Bar Chart with valid data', () => {
  beforeEach(() => {
    render(<View />);
  });
  test('It renders without crashing', () => {
    expect(document.querySelector('.visx-axis-bottom')).toBeInTheDocument();
    expect(document.querySelector('.visx-axis-left')).toBeInTheDocument();
    expect(screen.getByTestId(chartBgId)).toBeInTheDocument();
    expect(screen.getByText(baseProps.title!)).toBeInTheDocument();
  });
  test('Renders the correct number of elements', async () => {
    const bars = await screen.findAllByTestId(barId);
    expect(bars).toHaveLength(baseProps.data.length);
  });
  test('It renders tooltip on mouseover', async () => {
    let tooltip: Element | null;
    tooltip = await screen.queryByTestId(tooltipId);
    expect(tooltip).not.toBeInTheDocument();
    const bar = (await screen.findAllByTestId(barId))[0];
    userEvent.hover(bar);
    tooltip = await screen.queryByTestId(tooltipId);
    expect(tooltip).toBeInTheDocument();
    userEvent.unhover(bar);
    await waitForElementToBeRemoved(tooltip).catch((err) => console.log(err));
    expect(tooltip).not.toBeInTheDocument();
  });
});
