import Link from 'next/link';
import { useColorMode, Container, Flex, NavLink, Button } from 'theme-ui';
import { useHasMounted } from 'src/hooks';

export default function Header() {
  const [colorMode, setColorMode] = useColorMode();
  const handleThemeChange = () =>
    setColorMode(colorMode === 'light' ? 'dark' : 'light');
  const hasMounted = useHasMounted();
  const btnText = !hasMounted || colorMode === 'light' ? 'Dark' : 'Light';
  const links = [
    { href: '/', label: 'Home' },
    { href: '/charts', label: 'Charts' },
    { href: '/spring-playground', label: 'Spring Playground' },
  ];
  return (
    // see theme.layout.container for styles
    <Container as="header">
      <Flex as="nav">
        {/* passHref is required with NavLink */}
        {links.map(({ href, label }) => (
          <Link key={label} href={href} passHref>
            <NavLink p={2}>{label}</NavLink>
          </Link>
        ))}

        <Button ml="auto" onClick={handleThemeChange}>
          {btnText}
        </Button>
      </Flex>
    </Container>
  );
}
