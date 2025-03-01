import { Box, Heading, Text, SimpleGrid, Stat, StatLabel, StatNumber, StatGroup, Card, CardBody } from '@chakra-ui/react';

const RiderDashboard = () => {
  return (
    <Box>
      <Heading mb={6}>Rider Dashboard</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Accepted Packages</StatLabel>
              <StatNumber>0</StatNumber>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>In Transit</StatLabel>
              <StatNumber>0</StatNumber>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Delivered</StatLabel>
              <StatNumber>0</StatNumber>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      <Text>Welcome to your SafeBike rider dashboard! View available packages or manage your current deliveries.</Text>
    </Box>
  );
};

export default RiderDashboard;