import Link from 'next/link';
import { useColorMode, Container, Flex, NavLink, Button } from 'theme-ui';
import { useHasMounted } from 'src/hooks';

export default function Header() {
  const [colorMode, setColorMode] = useColorMode();
  const handleThemeChange = () =>
    setColorMode(colorMode === 'light' ? 'dark' : 'light');
  const hasMounted = useHasMounted();
  const btnText = !hasMounted || colorMode === 'light' ? 'Dark' : 'Light';
  return (
    // see theme.layout.container for styles
    <Container as="header">
      <Flex as="nav">
        {/* passHref is required with NavLink */}
        <Link href="/" passHref>
          <NavLink p={2}>Home</NavLink>
        </Link>
        <Link href="/style" passHref>
          <NavLink p={2}>Style Guide</NavLink>
        </Link>
        <Link href="/test-page" passHref>
          <NavLink p={2}>Test Page</NavLink>
        </Link>
        <Button ml="auto" onClick={handleThemeChange}>
          {btnText}
        </Button>
      </Flex>
    </Container>
  );
}
