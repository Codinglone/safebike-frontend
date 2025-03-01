import { useState, useEffect } from 'react';
import { 
  Box, Heading, Text, SimpleGrid, Stat, StatLabel, 
  StatNumber, Card, CardBody, Button, HStack, Spinner,
  Flex, Icon, Badge, Divider, useToast, IconButton,
  VStack
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getRiderPackages } from '../../api/packages';
import { MdRefresh, MdDirectionsBike, MdDeliveryDining, MdCheckCircle } from 'react-icons/md';
import { useAuth } from '../../contexts/AuthContexts';

const RiderDashboard = () => {
  const [deliveryStats, setDeliveryStats] = useState({
    active: 0,
    completed: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const fetchDeliveryStats = async () => {
    try {
      setRefreshing(true);
      const packages = await getRiderPackages();
      
      // Extract packages from response data
      const deliveries = Array.isArray(packages) ? packages : 
                        (packages.data ? packages.data : []);
      
      const stats = {
        total: deliveries.length,
        active: deliveries.filter(pkg => ['ACCEPTED', 'PICKED_UP', 'IN_TRANSIT'].includes(pkg.status)).length,
        completed: deliveries.filter(pkg => pkg.status === 'DELIVERED').length
      };
      
      setDeliveryStats(stats);
    } catch (error) {
      console.error('Error fetching delivery statistics:', error);
      toast({
        title: 'Error loading data',
        description: 'Could not load your delivery statistics',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDeliveryStats();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading your dashboard...</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading>Rider Dashboard</Heading>
        <IconButton
          aria-label="Refresh data"
          icon={<MdRefresh />}
          isLoading={refreshing}
          onClick={fetchDeliveryStats}
          size="md"
        />
      </Flex>

      {user && (
        <Card mb={6}>
          <CardBody>
            <VStack align="start" spacing={2}>
              <Flex alignItems="center">
                <Text fontWeight="bold" mr={2}>Status:</Text>
                <Badge colorScheme="green" px={2} py={1} borderRadius="md">
                  Active
                </Badge>
              </Flex>
              <Text><b>Name:</b> {user.firstName} {user.lastName}</Text>
              <Text><b>Plate Number:</b> {user.plateNumber}</Text>
              <Text><b>Phone:</b> {user.phoneNumber}</Text>
            </VStack>
          </CardBody>
        </Card>
      )}
      
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Card>
          <CardBody>
            <Stat>
              <Flex alignItems="center">
                <Icon as={MdDeliveryDining} boxSize={6} color="blue.500" mr={2} />
                <StatLabel>Total Deliveries</StatLabel>
              </Flex>
              <StatNumber>{deliveryStats.total}</StatNumber>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <Flex alignItems="center">
                <Icon as={MdDirectionsBike} boxSize={6} color="orange.500" mr={2} />
                <StatLabel>Active Deliveries</StatLabel>
              </Flex>
              <StatNumber>{deliveryStats.active}</StatNumber>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <Flex alignItems="center">
                <Icon as={MdCheckCircle} boxSize={6} color="green.500" mr={2} />
                <StatLabel>Completed Deliveries</StatLabel>
              </Flex>
              <StatNumber>{deliveryStats.completed}</StatNumber>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      <Divider my={6} />
      
      <Box textAlign="center" py={4}>
        <Text fontSize="lg" mb={6}>
          {deliveryStats.active > 0 
            ? "You have active deliveries to complete!" 
            : "Ready to start a new delivery? Check available packages now!"}
        </Text>
        <HStack spacing={4} justifyContent="center">
          <Button 
            colorScheme="blue" 
            size="lg" 
            onClick={() => navigate('/rider/packages/available')}
            leftIcon={<MdDeliveryDining />}
          >
            Find New Deliveries
          </Button>
          
          <Button 
            colorScheme="green" 
            size="lg"
            onClick={() => navigate('/rider/deliveries')}
            isDisabled={deliveryStats.active === 0}
            leftIcon={<MdDirectionsBike />}
          >
            {deliveryStats.active > 0 ? `Manage Deliveries (${deliveryStats.active})` : 'No Active Deliveries'}
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

export default RiderDashboard;