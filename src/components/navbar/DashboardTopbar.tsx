import React from 'react';
import { Box, Button, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { asIcon } from '../../utils/iconUtils';
import { MdMenu } from 'react-icons/md';

interface DashboardTopbarProps {
  onOpen: () => void;
}

export default function DashboardTopbar({ onOpen }: DashboardTopbarProps) {
  const location = useLocation();
  
  // Chakra color mode
  const navbarBg = useColorModeValue('white', 'navy.800');
  const shadow = useColorModeValue('14px 17px 40px 4px rgba(112, 144, 176, 0.08)', 'unset');
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard/create-contract':
        return 'Create Contract';
      case '/dashboard/all-contracts':
        return 'All Contracts';
      default:
        return 'Dashboard';
    }
  };

  return (
    <Box
      bg={navbarBg}
      boxShadow={shadow}
      position="sticky"
      top="0"
      zIndex="100"
      px={{ base: '20px', md: '30px' }}
      py="20px"
    >
      <Flex align="center" justify="space-between">
        {/* Mobile Menu Button */}
        <Button
          display={{ base: 'flex', lg: 'none' }}
          onClick={onOpen}
          variant="ghost"
          p="8px"
          borderRadius="8px"
          _hover={{ bg: useColorModeValue('gray.100', 'whiteAlpha.100') }}
        >
          <Icon as={asIcon(MdMenu)} w="24px" h="24px" color={textColor} />
        </Button>

        {/* Page Title */}
        <Text
          fontSize={{ base: '20px', md: '24px' }}
          fontWeight="700"
          color={textColor}
          ml={{ base: '0', lg: '0' }}
        >
          {getPageTitle()}
        </Text>

        {/* Right side - can be used for notifications, profile, etc. */}
        <Box />
      </Flex>
    </Box>
  );
}
