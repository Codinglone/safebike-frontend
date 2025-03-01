import { Box, Container } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const MainLayout = () => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />
      <Container maxW="container.xl" flex="1" py={8}>
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
};

export default MainLayout;