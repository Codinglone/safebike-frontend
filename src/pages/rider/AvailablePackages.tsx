import { useEffect, useState } from 'react';
import { 
  Box, Heading, Text, SimpleGrid, Badge, Button, 
  VStack, HStack, Spinner, useToast, Flex,
  Card, CardBody, Divider, Icon
} from '@chakra-ui/react';
import { MdLocationOn, MdPerson, MdPhone, MdDescription, MdAttachMoney } from 'react-icons/md';
import { assignPackage, getAvailablePackages } from '../../api/packages';
import { useAuth } from '../../contexts/AuthContexts';
import client from '../../api/client';



interface Package {
  id: number | string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  pickupLocation: string;
  deliveryLocation: string;
  description: string;
  estimatedValue: number;
  status: string;
  passengerId: number;
  createdAt: string;
  updatedAt: string;
}

const AvailablePackages = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState<number | string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const { user } = useAuth();

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await getAvailablePackages();
      
      // Handle different response formats
      let availablePackages = [];
      if (response && response.data) {
        availablePackages = response.data;
      } else if (Array.isArray(response)) {
        availablePackages = response;
      } else {
        console.warn('Unexpected response format:', response);
        availablePackages = [];
      }
      
      setPackages(availablePackages);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching available packages:', err);
      setError(err.message || 'Failed to load available packages');
      toast({
        title: 'Error',
        description: 'Failed to load available packages',
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

  const handleAcceptPackage = async (packageId: number | string) => {
    if (!user || !user.id) {
      toast({
        title: 'Error',
        description: 'User information not found. Please log in again.',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    setAssigningId(packageId);
    try {
      // Log the user object to see what data you have
      console.log("User data for assignment:", user);
      
      // Just pass the package ID without plateNumber
      await client.post(`/packages/${packageId}/assign`, {
        riderId: user.id
      });
      
      toast({
        title: 'Package Accepted',
        description: 'You have successfully accepted this package for delivery',
        status: 'success',
        duration: 3000,
      });
      
      fetchPackages();
    } catch (err: any) {
      console.error('Error accepting package:', err);
      console.error('Error response:', err.response?.data);
      
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to accept package',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setAssigningId(null);
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading available packages...</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">Available Packages</Heading>
        <Button
          colorScheme="blue"
          size="sm"
          onClick={fetchPackages}
          isLoading={loading}
        >
          Refresh
        </Button>
      </Flex>

      {error && (
        <Text color="red.500" mb={4}>
          {error}
        </Text>
      )}

      {packages.length === 0 ? (
        <Card p={8} textAlign="center">
          <CardBody>
            <Text fontSize="lg">No packages available for pickup at the moment.</Text>
            <Text mt={4} color="gray.500">
              Check back later for new delivery requests.
            </Text>
            <Button 
              mt={6}
              colorScheme="blue"
              onClick={fetchPackages}
            >
              Refresh List
            </Button>
          </CardBody>
        </Card>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {packages.map((pkg) => (
            <Card 
              key={pkg.id} 
              borderWidth={1} 
              borderRadius="lg" 
              overflow="hidden"
              boxShadow="md"
            >
              <CardBody>
                <HStack justifyContent="space-between" mb={3}>
                  <Badge colorScheme="yellow" fontSize="0.9em" px={2} py={1} borderRadius="md">
                    AVAILABLE
                  </Badge>
                  <Text fontSize="sm" color="gray.500">
                    {formatDate(pkg.createdAt)}
                  </Text>
                </HStack>
                
                <VStack align="start" spacing={3} mb={4}>
                  <Flex align="center">
                    <Icon as={MdLocationOn} color="red.500" mr={2} />
                    <Text fontWeight="bold">
                      From: {pkg.pickupLocation}
                    </Text>
                  </Flex>
                  
                  <Flex align="center">
                    <Icon as={MdLocationOn} color="green.500" mr={2} />
                    <Text fontWeight="bold">
                      To: {pkg.deliveryLocation}
                    </Text>
                  </Flex>
                  
                  <Flex align="center">
                    <Icon as={MdPerson} mr={2} />
                    <Text>Recipient: {pkg.recipientName}</Text>
                  </Flex>
                  
                  <Flex align="center">
                    <Icon as={MdPhone} mr={2} />
                    <Text>Contact: {pkg.recipientPhone}</Text>
                  </Flex>
                  
                  <Flex align="center">
                    <Icon as={MdDescription} mr={2} />
                    <Text noOfLines={2}>Description: {pkg.description}</Text>
                  </Flex>
                  
                  <Flex align="center">
                    <Icon as={MdAttachMoney} mr={2} />
                    <Text>Value: {pkg.estimatedValue} RWF</Text>
                  </Flex>
                </VStack>
                
                <Divider mb={4} />
                
                <Button
                  colorScheme="blue"
                  width="full"
                  isLoading={assigningId === pkg.id}
                  onClick={() => handleAcceptPackage(pkg.id)}
                >
                  Accept Delivery
                </Button>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default AvailablePackages;