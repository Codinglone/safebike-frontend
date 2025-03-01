import { useEffect, useState } from 'react';
import { 
  Box, Heading, Text, SimpleGrid, Badge, Button, 
  VStack, HStack, Spinner, useToast, Divider
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getMyPackages, Package, cancelPackage } from '../../api/packages';

const statusColors = {
  PENDING: 'yellow',
  ACCEPTED: 'blue',
  PICKED_UP: 'purple',
  IN_TRANSIT: 'orange',
  DELIVERED: 'green',
  CANCELED: 'red'
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString();
};

const MyPackages = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const navigate = useNavigate();

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await getMyPackages();
      console.log('Packages data:', data); // Debug
      setPackages(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching packages:', err);
      setError(err.message || 'Failed to load packages');
      toast({
        title: 'Error',
        description: 'Failed to load your packages',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleCancel = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this package?')) {
      return;
    }

    try {
      await cancelPackage(id);
      toast({
        title: 'Package canceled',
        status: 'success',
        duration: 3000,
      });
      fetchPackages(); // Refresh the list
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to cancel package',
        status: 'error',
        duration: 5000,
      });
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box>
      <HStack justifyContent="space-between" mb={6}>
        <Heading size="lg">My Packages</Heading>
        <Button 
          colorScheme="blue" 
          onClick={() => navigate('/passenger/packages/new')}
        >
          New Package
        </Button>
      </HStack>

      {error && (
        <Text color="red.500" mb={4}>
          {error}
        </Text>
      )}

      {packages.length === 0 ? (
        <Box p={8} textAlign="center" borderWidth={1} borderRadius="lg">
          <Text mb={4}>You haven't created any package delivery requests yet.</Text>
          <Button 
            colorScheme="blue" 
            onClick={() => navigate('/passenger/packages/new')}
          >
            Create Your First Package
          </Button>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {packages.map((pkg) => (
            <Box 
              key={pkg.id} 
              p={5} 
              borderWidth={1} 
              borderRadius="lg" 
              boxShadow="md"
            >
              <HStack justifyContent="space-between" mb={3}>
                <Badge colorScheme={statusColors[pkg.status]} fontSize="0.9em" px={2} py={1} borderRadius="md">
                  {pkg.status.replace('_', ' ')}
                </Badge>
                <Text fontSize="sm" color="gray.500">
                  Created: {formatDate(pkg.createdAt)}
                </Text>
              </HStack>
              
              <VStack align="start" spacing={2} mb={4}>
                <Text fontWeight="bold">
                  From: {pkg.pickupLocation}
                </Text>
                <Text fontWeight="bold">
                  To: {pkg.deliveryLocation}
                </Text>
                <Text>Recipient: {pkg.recipientName}</Text>
                <Text>Contact: {pkg.recipientPhone}</Text>
                <Text noOfLines={2}>Description: {pkg.description}</Text>
                <Text>Value: {pkg.estimatedValue} RWF</Text>
              </VStack>
              
              <Divider mb={4} />
              
              {pkg.status === 'PENDING' && (
                <Button 
                  colorScheme="red" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleCancel(pkg.id)}
                >
                  Cancel Package
                </Button>
              )}
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default MyPackages;