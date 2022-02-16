import { swiss, deep } from '@theme-ui/presets';
import { Theme } from 'theme-ui';
import color from 'color';

const makeTheme = <T extends Theme>(t: T) => t;

const theme = makeTheme({
  ...swiss,
  colors: {
    ...swiss.colors,
    modes: {
      dark: {
        ...deep.colors,
      },
    },
  },
  rawColors: {
    ...swiss.colors,
    modes: {
      dark: {
        ...deep.colors,
      },
    },
    barLight: color(swiss.colors.primary).lighten(0.9).hex(),
    barDark: swiss.colors.primary,
  },
  layout: {
    container: {
      maxWidth: 1024,
      mx: 'auto',
      py: 3,
      px: 4,
    },
  },
  text: {
    subHeading: {
      fontSize: 3,
    },
  },
  buttons: {
    primary: {
      cursor: 'pointer',
      '&:hover': {
        bg: 'secondary',
      },
      transition: 'background .15s',
    },
  },
  links: {
    nav: {
      fontFamily: 'body',
    },
  },
});

export type ExactTheme = typeof theme;

export default theme;
