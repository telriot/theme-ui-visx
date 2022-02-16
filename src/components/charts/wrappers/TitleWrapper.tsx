import { FC, ReactNode } from 'react';
import { Box, Heading } from 'theme-ui';

export interface TitleWrapperProps {
  title?: string;
  children: ReactNode;
}
export const TitleWrapper: FC<TitleWrapperProps> = ({ title, children }) => (
  <Box>
    {Boolean(title) && (
      <Heading mb={2} variant="subHeading">
        {title}
      </Heading>
    )}
    {children}
  </Box>
);
