import { Box, Container, Stack, Text, Link } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box bg="gray.50" color="gray.700" mt={10}>
      <Container
        as={Stack}
        maxW="container.xl"
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Text>© 2025 SafeBike Rwanda. All rights reserved</Text>
        <Stack direction="row" spacing={6}>
          <Link href="#">About</Link>
          <Link href="#">Contact</Link>
          <Link href="#">Terms</Link>
          <Link href="#">Privacy</Link>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;