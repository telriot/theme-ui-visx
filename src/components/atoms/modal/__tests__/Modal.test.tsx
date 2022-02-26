import { render, screen } from 'test-utils';
import userEvent from '@testing-library/user-event';
import { Modal } from '../Modal';
import { Globals } from 'react-spring';

Globals.assign({
  skipAnimation: true,
});

const handleClose = jest.fn();
const content = 'test modal content';
const modalId = 'modal';
const modalContainerId = 'modal-container';
const modalOverlayId = 'modal-overlay';

const View = ({ isOpen }: { isOpen: boolean }) => (
  <Modal onClose={handleClose} isOpen={isOpen}>
    {content}
  </Modal>
);

describe('On closed modal', () => {
  let modal: Element;
  let modalContainer: Element;
  let overlay: Element;
  beforeEach(() => {
    render(<View isOpen={false} />);
    modal = screen.getByTestId(modalId);
    modalContainer = screen.getByTestId(modalContainerId);
    overlay = screen.getByTestId(modalOverlayId);
  });
  test('It renders without crashing', () => {
    expect(overlay).toBeInTheDocument();
    expect(modal).toBeInTheDocument();
    expect(modalContainer).toBeInTheDocument();
  });
  test('Modal is hidden', () => {
    expect(overlay).toHaveStyle({ opacity: 0 });
    expect(modal).toHaveStyle({ opacity: 0 });
  });
});

describe('On open modal', () => {
  let modal: Element;
  let modalContainer: Element;
  let overlay: Element;
  beforeEach(() => {
    render(<View isOpen />);
    modal = screen.getByTestId(modalId);
    modalContainer = screen.getByTestId(modalContainerId);
    overlay = screen.getByTestId(modalOverlayId);
  });
  test('It renders without crashing', () => {
    expect(overlay).toBeInTheDocument();
    expect(modal).toBeInTheDocument();
    expect(modalContainer).toBeInTheDocument();
  });
  test('Modal is visible', () => {
    expect(overlay).toHaveStyle({ opacity: 0.6 });
    expect(modal).toHaveStyle({ opacity: 1 });
  });
  test('Click outside modal calls onClose handler', () => {
    userEvent.click(overlay);
    userEvent.click(modal);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
