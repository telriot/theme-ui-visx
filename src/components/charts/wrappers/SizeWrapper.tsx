import { forwardRef, ReactNode } from 'react';
import { Box } from 'theme-ui';

export interface SizeWrapperRef {
  children: ReactNode;
  height?: number;
  width?: number;
  px?: number;
  py?: number;
}

export const SizeWrapper = forwardRef<HTMLDivElement, SizeWrapperRef>(
  ({ children, height, width, px = 0, py = 0 }, ref) => (
    <Box
      ref={ref}
      px={px}
      py={py}
      sx={{
        height: height ? `${height}px` : '100%',
        width: width ? `${width}px` : '100%',
      }}
    >
      {children}
    </Box>
  )
);

SizeWrapper.displayName = 'SizeWrapper';
