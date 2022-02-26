import { render, screen } from 'test-utils';
import userEvent from '@testing-library/user-event';
import { Globals } from 'react-spring';
import { BaseDataPoint } from 'src/utils';
import { AnimatedBar } from '../AnimatedBar';

Globals.assign({
  skipAnimation: true,
});

const handleMouseOver = jest.fn();
const handleMouseLeave = jest.fn();
const barId = 'animated-bar';
const baseProps = {
  datum: new BaseDataPoint(100, 'Something'),
  label: 'test label',
  fill: '#666',
  height: 100,
  width: 10,
  x: 10,
  y: 10,
  onMouseOver: handleMouseOver,
  onMouseLeave: handleMouseLeave,
};

const View = () => (
  <svg>
    <AnimatedBar {...baseProps} />
  </svg>
);

describe('On open modal', () => {
  let bar: Element;

  beforeEach(() => {
    render(<View />);
    bar = screen.getByTestId(barId);
  });
  test('It renders without crashing', () => {
    expect(bar).toBeInTheDocument();
  });
  test('It is displayed with correct attributes', () => {
    expect(bar).toHaveAttribute('fill', baseProps.fill);
    expect(bar).toHaveAttribute('height', baseProps.height.toString());
    expect(bar).toHaveAttribute('width', baseProps.width.toString());
    expect(bar).toHaveAttribute('x', baseProps.x.toString());
    expect(bar).toHaveAttribute('y', baseProps.y.toString());
  });
  test('It handles mouse events', () => {
    expect(handleMouseOver).not.toHaveBeenCalled();
    expect(handleMouseLeave).not.toHaveBeenCalled();
    userEvent.hover(bar);
    expect(handleMouseOver).toHaveBeenCalled();
    userEvent.unhover(bar);
    expect(handleMouseLeave).toHaveBeenCalled();
  });
});
