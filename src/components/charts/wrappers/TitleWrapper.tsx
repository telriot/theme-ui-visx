import { FC, ReactNode } from 'react';
import { Box, Heading } from 'theme-ui';

export interface TitleWrapperProps {
  title?: string;
  children: ReactNode;
}
export const TitleWrapper: FC<TitleWrapperProps> = ({ title, children }) => (
  <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    {Boolean(title) && (
      <Heading mb={2} variant="subHeading">
        {title}
      </Heading>
    )}
    <Box sx={{ flexGrow: 1 }}>{children}</Box>
  </Box>
);
