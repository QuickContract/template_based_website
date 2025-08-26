import React from 'react';
import { Flex, Text, useColorModeValue } from '@chakra-ui/react';

interface QuickContractLogoProps {
  h?: string;
  w?: string;
  my?: string;
  color?: string;
  variant?: 'default' | 'compact' | 'large';
}

export const QuickContractLogo: React.FC<QuickContractLogoProps> = ({ 
  h = '40px', 
  w = 'auto', 
  my = '0px', 
  color,
  variant = 'default'
}) => {
  const logoColor = useColorModeValue('navy.700', 'white');
  
  // Gradient definitions for different variants
  const getGradient = () => {
    switch (variant) {
      case 'compact':
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)';
      case 'large':
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)';
      default:
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)';
    }
  };

  const getFontSize = () => {
    switch (variant) {
      case 'compact':
        return '16px';
      case 'large':
        return '32px';
      default:
        return '18px';
    }
  };

  const getFontWeight = () => {
    switch (variant) {
      case 'compact':
        return '600';
      case 'large':
        return '800';
      default:
        return 'bold';
    }
  };
  
  return (
    <Flex alignItems='center' h={h} w={w} my={my}>
      <Text 
        bgGradient={getGradient()}
        bgClip='text'
        fontSize={getFontSize()}
        fontWeight={getFontWeight()}
        fontFamily='"Inter", "Segoe UI", "Roboto", sans-serif'
        letterSpacing='-0.5px'
      >
        Quick Contract
      </Text>
    </Flex>
  );
};

export default QuickContractLogo;
