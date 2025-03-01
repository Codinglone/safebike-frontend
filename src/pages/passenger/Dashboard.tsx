// src/pages/passenger/Dashboard.tsx
import { useState, useEffect } from 'react';
import { 
  Box, Heading, Text, SimpleGrid, Stat, StatLabel, 
  StatNumber, Card, CardBody, Button
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getMyPackages } from '../../api/packages';

const PassengerDashboard = () => {
  const [packageStats, setPackageStats] = useState({
    total: 0,
    active: 0,
    delivered: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackageStats = async () => {
      try {
        const packages = await getMyPackages();
        
        const stats = {
          total: packages.length,
          active: packages.filter(pkg => ['PENDING', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT'].includes(pkg.status)).length,
          delivered: packages.filter(pkg => pkg.status === 'DELIVERED').length
        };
        
        setPackageStats(stats);
      } catch (error) {
        console.error('Error fetching package statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackageStats();
  }, []);

  return (
    <Box>
      <Heading mb={6}>Passenger Dashboard</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Packages</StatLabel>
              <StatNumber>{loading ? '-' : packageStats.total}</StatNumber>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Active Deliveries</StatLabel>
              <StatNumber>{loading ? '-' : packageStats.active}</StatNumber>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Delivered</StatLabel>
              <StatNumber>{loading ? '-' : packageStats.delivered}</StatNumber>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      <Box textAlign="center" py={8}>
        <Text mb={6}>Need to send a package? Create a new delivery request now!</Text>
        <Button 
          colorScheme="blue" 
          size="lg" 
          onClick={() => navigate('/passenger/packages/new')}
        >
          Send a Package
        </Button>
      </Box>
    </Box>
  );
};

export default PassengerDashboard;