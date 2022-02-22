import { AppProps } from 'next/app';
import { ThemeProvider, Container } from 'theme-ui';
import NProgress from 'next-nprogress-emotion';

import Header from 'src/components/layout/Header';
import theme from 'src/theme';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <NProgress
        color={theme.rawColors?.purple?.toString() || '#aaa'}
        options={{ trickleSpeed: 50 }}
        showAfterMs={200}
        spinner
      />
      <Container>
        <Component {...pageProps} />
      </Container>
    </ThemeProvider>
  );
}

export default MyApp;
