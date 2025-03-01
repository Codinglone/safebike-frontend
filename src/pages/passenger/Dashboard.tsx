import { Box, Heading, Text, SimpleGrid, Stat, StatLabel, StatNumber, StatGroup, Card, CardBody } from '@chakra-ui/react';

const PassengerDashboard = () => {
  return (
    <Box>
      <Heading mb={6}>Passenger Dashboard</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Packages</StatLabel>
              <StatNumber>0</StatNumber>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Active Deliveries</StatLabel>
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
      
      <Text>Welcome to your SafeBike dashboard! Create a new package delivery or track your existing ones.</Text>
    </Box>
  );
};

export default PassengerDashboard;