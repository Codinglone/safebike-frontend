import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  IconButton,
  useDisclosure,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link as RouterLink, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContexts";

const passengerLinks = [
  { name: "Dashboard", path: "/passenger" },
  { name: "Send a Package", path: "/passenger/packages/new" },
  { name: "My Packages", path: "/passenger/packages" },
];

const riderLinks = [
  { name: "Dashboard", path: "/rider" },
  { name: "Available Packages", path: "/rider/packages/available" },
  { name: "My Deliveries", path: "/rider/deliveries" },
];

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { isAuthenticated, user, logout, userType } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Box>
      <Flex
        bg="blue.600"
        color="white"
        minH="60px"
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle="solid"
        borderColor="blue.700"
        align="center"
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant="ghost"
            aria-label="Toggle Navigation"
          />
        </Flex>

        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Text
            textAlign={{ base: "center", md: "left" }}
            fontFamily="heading"
            fontWeight="bold"
            fontSize="xl"
            as={RouterLink}
            to="/"
          >
            SafeBike Rwanda
          </Text>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <Stack direction="row" spacing={4} align="center">
              <Box
                as={RouterLink}
                to="/"
                px={2}
                py={1}
                rounded="md"
                _hover={{ bg: "blue.700" }}
              >
                Home
              </Box>

              {isAuthenticated && userType === "passenger" && (
                <>
                  <Box
                    as={RouterLink}
                    to="/passenger"
                    px={2}
                    py={1}
                    rounded="md"
                    _hover={{ bg: "blue.700" }}
                  >
                    Dashboard
                  </Box>
                  <Box
                    as={RouterLink}
                    to="/passenger/packages/new"
                    px={2}
                    py={1}
                    rounded="md"
                    _hover={{ bg: "blue.700" }}
                  >
                    New Package
                  </Box>
                  <Box
                    as={RouterLink}
                    to="/passenger/packages"
                    px={2}
                    py={1}
                    rounded="md"
                    _hover={{ bg: "blue.700" }}
                  >
                    My Packages
                  </Box>
                </>
              )}


              {isAuthenticated && userType === "rider" && (
                <>
                  <Box
                    as={RouterLink}
                    to="/rider"
                    px={2}
                    py={1}
                    rounded="md"
                    _hover={{ bg: "blue.700" }}
                  >
                    Dashboard
                  </Box>
                  <Box
                    as={RouterLink}
                    to="/rider/packages/available"
                    px={2}
                    py={1}
                    rounded="md"
                    _hover={{ bg: "blue.700" }}
                  >
                    Available Packages
                  </Box>
                  <Box
                    as={RouterLink}
                    to="/rider/deliveries"
                    px={2}
                    py={1}
                    rounded="md"
                    _hover={{ bg: "blue.700" }}
                  >
                    My Deliveries
                  </Box>
                </>
              )}

              {isAuthenticated && userType === "admin" && (
                <>
                  <Box
                    as={RouterLink}
                    to="/admin"
                    px={2}
                    py={1}
                    rounded="md"
                    _hover={{ bg: "blue.700" }}
                  >
                    Dashboard
                  </Box>
                  <Box
                    as={RouterLink}
                    to="/admin/packages"
                    px={2}
                    py={1}
                    rounded="md"
                    _hover={{ bg: "blue.700" }}
                  >
                    Manage Packages
                  </Box>
                  <Box
                    as={RouterLink}
                    to="/admin/users"
                    px={2}
                    py={1}
                    rounded="md"
                    _hover={{ bg: "blue.700" }}
                  >
                    Manage Users
                  </Box>
                </>
              )}
            </Stack>
          </Flex>
        </Flex>

        <HStack spacing={3}>
          {isAuthenticated ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded="full"
                variant="link"
                cursor="pointer"
                minW={0}
              >
                <Avatar
                  size="sm"
                  name={`${user?.firstName} ${user?.lastName}`}
                />
              </MenuButton>
              <MenuList color="black">
                <MenuItem>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Stack
              flex={{ base: 1, md: 0 }}
              justify="flex-end"
              direction="row"
              spacing={6}
            >
              <Button
                as={RouterLink}
                to="/auth/login"
                fontSize="sm"
                fontWeight={400}
                variant="link"
                color="white"
              >
                Sign In
              </Button>
              <Button
                as={RouterLink}
                to="/auth/register/passenger"
                display={{ base: "none", md: "inline-flex" }}
                fontSize="sm"
                fontWeight={600}
                color="white"
                bg="blue.400"
                _hover={{ bg: "blue.300" }}
              >
                Sign Up
              </Button>
            </Stack>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
