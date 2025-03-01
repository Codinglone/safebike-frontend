import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Image,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import heroImage from "../assets/landing.jpg";

const Home = () => {
  return (
    <Container maxW="container.xl">
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} py={20}>
        <VStack spacing={5} align="flex-start" justify="center">
          <Heading size="2xl">
            Fast and Reliable Package Delivery in Rwanda
          </Heading>
          <Text fontSize="lg">
            SafeBike Rwanda connects you with trusted motorcycle riders to
            deliver your packages quickly and securely.
          </Text>
          <Box pt={5}>
            <Button
              as={RouterLink}
              to="/auth/register/passenger"
              colorScheme="blue"
              size="lg"
              mr={4}
            >
              Send a Package
            </Button>
            <Button
              as={RouterLink}
              to="/auth/register/rider"
              variant="outline"
              colorScheme="blue"
              size="lg"
            >
              Become a Rider
            </Button>
          </Box>
        </VStack>
        <Box>
          <Box
            bg="gray.200"
            height="400px"
            borderRadius="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image src={heroImage} />
          </Box>
        </Box>
      </SimpleGrid>

      <VStack spacing={10} py={20}>
        <Heading textAlign="center">How it Works</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Heading size="md" mb={4}>
              1. Create Request
            </Heading>
            <Text>
              Easily create a package delivery request with recipient and
              location details.
            </Text>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Heading size="md" mb={4}>
              2. Rider Accepts
            </Heading>
            <Text>
              A nearby motorcycle rider accepts your delivery request.
            </Text>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Heading size="md" mb={4}>
              3. Fast Delivery
            </Heading>
            <Text>
              Track your package in real-time as it's delivered safely to its
              destination.
            </Text>
          </Box>
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default Home;
