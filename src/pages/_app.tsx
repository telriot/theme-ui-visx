import App from 'next/app';
import { ThemeProvider, Container } from 'theme-ui';
import NProgress from 'next-nprogress-emotion';

import Header from 'src/components/layout/Header';
import theme from 'src/theme';

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <Header />
        <NProgress
          color="#29d"
          options={{ trickleSpeed: 50 }}
          showAfterMs={300}
          spinner
        />
        <Container>
          <Component {...pageProps} />
        </Container>
      </ThemeProvider>
    );
  }
}

export default MyApp;
