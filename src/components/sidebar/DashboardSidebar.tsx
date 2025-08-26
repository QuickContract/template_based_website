import React from 'react';
import { Box, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import QuickContractLogo from '../icons/QuickContractLogo';
import { asIcon } from '../../utils/iconUtils';
import { MdCreate, MdList, MdLogout } from 'react-icons/md';

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  // Chakra color mode
  const sidebarBg = useColorModeValue('white', 'navy.800');
  const shadow = useColorModeValue('14px 17px 40px 4px rgba(112, 144, 176, 0.08)', 'unset');
  const textColor = useColorModeValue('secondaryGray.500', 'white');
  const activeColor = useColorModeValue('brand.500', 'white');
  const activeBg = useColorModeValue('brand.50', 'whiteAlpha.100');
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.50');
  const hoverTextColor = useColorModeValue('secondaryGray.900', 'white');

  const menuItems = [
    {
      name: 'Create Contract',
      path: '/dashboard/create-contract',
      icon: MdCreate
    },
    {
      name: 'All Contracts',
      path: '/dashboard/all-contracts',
      icon: MdList
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth/sign-in');
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
    >
      <Flex direction="column" h="100%">
        {/* Logo */}
        <Box p="32px 20px" textAlign="center">
          <QuickContractLogo variant='large' />
        </Box>

        {/* Navigation Items */}
        <Flex direction="column" flex="1" px="20px">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Flex
                key={item.path}
                align="center"
                p="12px 16px"
                borderRadius="12px"
                mb="8px"
                cursor="pointer"
                bg={isActive ? activeBg : 'transparent'}
                color={isActive ? activeColor : textColor}
                _hover={{
                  bg: isActive ? activeBg : hoverBg,
                  color: isActive ? activeColor : hoverTextColor
                }}
                onClick={() => navigate(item.path)}
                transition="all 0.2s"
              >
                <Icon
                  as={asIcon(item.icon)}
                  w="20px"
                  h="20px"
                  me="12px"
                />
                <Text fontSize="sm" fontWeight="500">
                  {item.name}
                </Text>
              </Flex>
            );
          })}
        </Flex>

        {/* Logout Button */}
        <Box p="20px">
          <Flex
            align="center"
            p="12px 16px"
            borderRadius="12px"
            cursor="pointer"
            color="red.500"
            _hover={{
              bg: useColorModeValue('red.50', 'red.900'),
            }}
            onClick={handleLogout}
            transition="all 0.2s"
          >
            <Icon
              as={asIcon(MdLogout)}
              w="20px"
              h="20px"
              me="12px"
            />
            <Text fontSize="sm" fontWeight="500">
              Logout
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
