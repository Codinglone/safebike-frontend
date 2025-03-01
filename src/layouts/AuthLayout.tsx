import { Box, Container, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <Flex 
      minHeight="100vh"
      width="full"
      align="center"
      justifyContent="center"
      bg="gray.50"
    >
      <Container maxW="md" py={12}>
        <Box 
          bg="white" 
          p={8} 
          borderRadius="lg" 
          boxShadow="lg"
        >
          <Outlet />
        </Box>
      </Container>
    </Flex>
  );
};

export default AuthLayout;