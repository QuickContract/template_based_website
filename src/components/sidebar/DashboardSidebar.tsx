import React from 'react';
import { Box, Flex, Icon, Text, useColorModeValue, Avatar, VStack, HStack, Divider, useDisclosure, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Button } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import QuickContractLogo from '../icons/QuickContractLogo';
import { asIcon } from '../../utils/iconUtils';
import { MdCreate, MdList, MdLogout, MdDashboard, MdPerson } from 'react-icons/md';

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { isOpen: isLogoutOpen, onOpen: onLogoutOpen, onClose: onLogoutClose } = useDisclosure();
  
  // Chakra color mode
  const sidebarBg = useColorModeValue('white', 'navy.800');
  const shadow = useColorModeValue('14px 17px 40px 4px rgba(112, 144, 176, 0.08)', 'unset');
  const textColor = useColorModeValue('secondaryGray.500', 'white');
  const activeColor = useColorModeValue('brand.500', 'white');
  const activeBg = useColorModeValue('brand.50', 'whiteAlpha.100');
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.50');
  const hoverTextColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const redHoverBg = useColorModeValue('red.50', 'red.900');
  const redHoverBorder = useColorModeValue('red.200', 'red.700');
  const gray500 = useColorModeValue('gray.500', 'gray.400');
  const gray400 = useColorModeValue('gray.400', 'gray.500');
  const gray200 = useColorModeValue('gray.200', 'whiteAlpha.200');
  const gray300 = useColorModeValue('gray.300', 'whiteAlpha.300');
  const gray100 = useColorModeValue('gray.100', 'whiteAlpha.100');
  const whiteAlpha100 = useColorModeValue('whiteAlpha.100', 'whiteAlpha.100');

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard/create-contract',
      icon: MdDashboard,
      description: 'Create new contracts'
    },
    {
      name: 'All Contracts',
      path: '/dashboard/all-contracts',
      icon: MdList,
      description: 'View and manage contracts'
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth/sign-in', { replace: true });
  };

  const handleLogoutClick = () => {
    onLogoutOpen();
  };

  return (
    <Box
      display={{ base: isOpen ? 'block' : 'none', lg: 'block' }}
      position="fixed"
      left="0"
      top="0"
      h="100vh"
      w="280px"
      bg={sidebarBg}
      boxShadow={shadow}
      zIndex="1000"
      overflowY="auto"
      borderRight="2px solid"
      borderColor={borderColor}
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '1px',
        height: '100%',
        bg: gray100
      }}
    >
      <Flex direction="column" h="100%">
        {/* Logo Section */}
        <Box p="10px 20px" textAlign="center" borderBottom="2px solid" borderColor={borderColor} bg={gray100}>
          <QuickContractLogo h="60px" w="200px" variant="default" />
        </Box>

        {/* User Profile Section */}
        {/* <Box p="20px" borderBottom="2px solid" borderColor={borderColor} bg={gray100}>
          <HStack spacing="3" align="center">
            <Avatar
              size="sm"
              bg="brand.500"
              icon={<Icon as={asIcon(MdPerson)} color="white" />}
              ring="2px"
              ringColor={gray200}
            />
            <VStack align="start" spacing="1" flex="1">
              <Text fontSize="sm" fontWeight="600" color={textColor}>
                {user?.email || 'Admin User'}
              </Text>
              <Text fontSize="xs" color={gray500}>
                {user?.role || 'Administrator'}
              </Text>
            </VStack>
          </HStack>
        </Box> */}

        {/* Navigation Items */}
        <Flex direction="column" flex="1" px="20px" py="20px">
          <Box 
            mb="16px" 
            p="12px 16px" 
            borderRadius="12px" 
            bg={gray100}
            border="1px solid"
            borderColor={gray200}
          >
            <Text fontSize="xs" fontWeight="600" color={gray500} textTransform="uppercase" letterSpacing="0.5px">
              Navigation
            </Text>
          </Box>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Flex
                key={item.path}
                direction="column"
                p="16px"
                borderRadius="16px"
                mb="12px"
                cursor="pointer"
                bg={isActive ? activeBg : 'transparent'}
                color={isActive ? activeColor : textColor}
                border="2px solid"
                borderColor={isActive ? activeColor : gray200}
                _hover={{
                  bg: isActive ? activeBg : hoverBg,
                  color: isActive ? activeColor : hoverTextColor,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                  borderColor: isActive ? activeColor : gray300,
                  _before: {
                    transform: 'scaleX(1)'
                  }
                }}
                onClick={() => navigate(item.path)}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                position="relative"
                overflow="hidden"
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bg: isActive ? activeColor : 'transparent',
                  opacity: 0.1,
                  transform: 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 0.3s ease'
                }}
              >
                <HStack spacing="12px">
                  <Icon
                    as={asIcon(item.icon)}
                    w="20px"
                    h="20px"
                    color={isActive ? activeColor : textColor}
                  />
                  <VStack align="start" spacing="2px" flex="1">
                    <Text fontSize="sm" fontWeight="600">
                      {item.name}
                    </Text>
                    <Text fontSize="xs" color={gray500} lineHeight="1.2">
                      {item.description}
                    </Text>
                  </VStack>
                </HStack>
              </Flex>
            );
          })}
        </Flex>

        {/* Logout Button */}
        <Box p="20px" borderTop="1px solid" borderColor={borderColor}>
          <Flex
            align="center"
            p="16px"
            borderRadius="16px"
            cursor="pointer"
            color="red.500"
            bg="transparent"
            border="1px solid"
            borderColor="transparent"
            _hover={{
              bg: redHoverBg,
              borderColor: redHoverBorder,
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
            }}
            onClick={handleLogoutClick}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          >
            <Icon
              as={asIcon(MdLogout)}
              w="20px"
              h="20px"
              me="12px"
            />
            <Text fontSize="sm" fontWeight="600">
              Logout
            </Text>
          </Flex>
        </Box>
      </Flex>

      {/* Logout Warning Dialog */}
      <AlertDialog isOpen={isLogoutOpen} onClose={onLogoutClose} leastDestructiveRef={undefined}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Logout
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to logout? You will be redirected to the login page.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onLogoutClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleLogout} ml={3}>
                Logout
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
