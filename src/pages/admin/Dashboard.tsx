import { Box, Heading, Text, SimpleGrid, Stat, StatLabel, StatNumber, Card, CardBody } from '@chakra-ui/react';

const AdminDashboard = () => {
  return (
    <Box>
      <Heading mb={6}>Admin Dashboard</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Users</StatLabel>
              <StatNumber>0</StatNumber>
            </Stat>
          </CardBody>
        </Card>
        
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
              <StatLabel>Active Riders</StatLabel>
              <StatNumber>0</StatNumber>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Pending Packages</StatLabel>
              <StatNumber>0</StatNumber>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      <Text>Welcome to the SafeBike Admin Dashboard! Manage users, packages, and monitor system activity.</Text>
    </Box>
  );
};

export default AdminDashboard;