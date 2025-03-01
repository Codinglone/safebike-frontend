import { useEffect, useState } from 'react';
import {
  Box, Heading, Text, SimpleGrid, Badge, Button,
  VStack, HStack, Spinner, useToast, Flex,
  Card, CardBody, Divider, Icon, Tabs, TabList,
  Tab, TabPanels, TabPanel, Select
} from '@chakra-ui/react';
import {
  MdLocationOn, MdPerson, MdPhone, MdDescription,
  MdAttachMoney, MdDirectionsBike, MdCheckCircle, MdLocalShipping
} from 'react-icons/md';
import {
  getRiderPackages,
  confirmPickup,
  confirmDelivery,
  Package
} from '../../api/packages';
import { useAuth } from '../../contexts/AuthContexts';

const MyDeliveries = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const { user } = useAuth();

  // Group packages by status
  const pendingPackages = packages.filter(pkg => pkg.status === 'ACCEPTED');
  const inProgressPackages = packages.filter(pkg => ['PICKED_UP', 'IN_TRANSIT'].includes(pkg.status));
  const deliveredPackages = packages.filter(pkg => pkg.status === 'DELIVERED');

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await getRiderPackages();
      
      // Handle different response formats
      let riderPackages = [];
      if (response.data) {
        riderPackages = response.data;
      } else if (Array.isArray(response)) {
        riderPackages = response;
      } else {
        console.warn('Unexpected response format:', response);
        riderPackages = [];
      }
      
      setPackages(riderPackages);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching rider packages:', err);
      setError(err.message || 'Failed to load your deliveries');
      toast({
        title: 'Error',
        description: 'Failed to load your deliveries',
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

  const handleConfirmPickup = async (packageId: string) => {
    setProcessingIds(prev => new Set(prev).add(packageId));
    try {
      await confirmPickup(packageId);
      
      toast({
        title: 'Pickup Confirmed',
        description: 'You have confirmed package pickup',
        status: 'success',
        duration: 3000,
      });
      
      // Refresh the list to update status
      fetchPackages();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to confirm pickup',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(packageId);
        return newSet;
      });
    }
  };

  const handleConfirmDelivery = async (packageId: string) => {
    setProcessingIds(prev => new Set(prev).add(packageId));
    try {
      await confirmDelivery(packageId);
      
      toast({
        title: 'Delivery Confirmed',
        description: 'You have confirmed package delivery',
        status: 'success',
        duration: 3000,
      });
      
      // Refresh the list to update status
      fetchPackages();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to confirm delivery',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(packageId);
        return newSet;
      });
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <Badge colorScheme="yellow">ACCEPTED</Badge>;
      case 'PICKED_UP':
        return <Badge colorScheme="blue">PICKED UP</Badge>;
      case 'IN_TRANSIT':
        return <Badge colorScheme="purple">IN TRANSIT</Badge>;
      case 'DELIVERED':
        return <Badge colorScheme="green">DELIVERED</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const renderPackageCard = (pkg: Package) => (
    <Card 
      key={pkg.id} 
      borderWidth={1} 
      borderRadius="lg" 
      overflow="hidden"
      boxShadow="md"
    >
      <CardBody>
        <HStack justifyContent="space-between" mb={3}>
          {getStatusBadge(pkg.status)}
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
        
        {pkg.status === 'ACCEPTED' && (
          <Button
            leftIcon={<Icon as={MdDirectionsBike} />}
            colorScheme="blue"
            width="full"
            isLoading={processingIds.has(pkg.id.toString())}
            onClick={() => handleConfirmPickup(pkg.id.toString())}
          >
            Confirm Pickup
          </Button>
        )}
        
        {(pkg.status === 'PICKED_UP' || pkg.status === 'IN_TRANSIT') && (
          <Button
            leftIcon={<Icon as={MdCheckCircle} />}
            colorScheme="green"
            width="full"
            isLoading={processingIds.has(pkg.id.toString())}
            onClick={() => handleConfirmDelivery(pkg.id.toString())}
          >
            Confirm Delivery
          </Button>
        )}
        
        {pkg.status === 'DELIVERED' && (
          <Button
            leftIcon={<Icon as={MdCheckCircle} />}
            colorScheme="green"
            width="full"
            isDisabled={true}
          >
            Delivered
          </Button>
        )}
      </CardBody>
    </Card>
  );

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading your deliveries...</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">My Deliveries</Heading>
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
            <Text fontSize="lg">You have no deliveries yet.</Text>
            <Text mt={4} color="gray.500">
              Check available packages to accept deliveries.
            </Text>
            <Button 
              mt={6}
              colorScheme="blue"
              onClick={() => window.location.href = '/rider/packages/available'}
            >
              Find Packages to Deliver
            </Button>
          </CardBody>
        </Card>
      ) : (
        <Tabs variant="enclosed" colorScheme="blue">
          <TabList mb={4}>
            <Tab>
              Pending Pickups
              {pendingPackages.length > 0 && 
                <Badge ml={2} colorScheme="yellow" borderRadius="full" px={2}>
                  {pendingPackages.length}
                </Badge>
              }
            </Tab>
            <Tab>
              In Progress
              {inProgressPackages.length > 0 && 
                <Badge ml={2} colorScheme="blue" borderRadius="full" px={2}>
                  {inProgressPackages.length}
                </Badge>
              }
            </Tab>
            <Tab>
              Delivered
              {deliveredPackages.length > 0 && 
                <Badge ml={2} colorScheme="green" borderRadius="full" px={2}>
                  {deliveredPackages.length}
                </Badge>
              }
            </Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel p={0}>
              {pendingPackages.length === 0 ? (
                <Box p={8} textAlign="center" borderWidth={1} borderRadius="lg">
                  <Text>No packages waiting for pickup.</Text>
                </Box>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mt={4}>
                  {pendingPackages.map(renderPackageCard)}
                </SimpleGrid>
              )}
            </TabPanel>
            
            <TabPanel p={0}>
              {inProgressPackages.length === 0 ? (
                <Box p={8} textAlign="center" borderWidth={1} borderRadius="lg">
                  <Text>No packages in transit.</Text>
                </Box>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mt={4}>
                  {inProgressPackages.map(renderPackageCard)}
                </SimpleGrid>
              )}
            </TabPanel>
            
            <TabPanel p={0}>
              {deliveredPackages.length === 0 ? (
                <Box p={8} textAlign="center" borderWidth={1} borderRadius="lg">
                  <Text>No delivered packages yet.</Text>
                </Box>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mt={4}>
                  {deliveredPackages.map(renderPackageCard)}
                </SimpleGrid>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </Box>
  );
};

export default MyDeliveries;