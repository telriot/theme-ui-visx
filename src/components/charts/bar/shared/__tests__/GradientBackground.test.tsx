import { render, screen } from 'test-utils';
import { GradientBackground } from '../GradientBackground';

const View = () => (
  <svg height="400" width="400">
    <GradientBackground width={200} height={200} from="#333" to="#fff" />
  </svg>
);

const backgroundId = 'chart-bg';
test('It renders without crashing', () => {
  render(<View />);
  expect(screen.getByTestId(backgroundId)).toBeInTheDocument();
});
