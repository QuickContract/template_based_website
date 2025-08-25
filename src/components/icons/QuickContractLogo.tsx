import React from 'react';
import { Flex, Image, Text, useColorModeValue } from '@chakra-ui/react';

interface QuickContractLogoProps {
  h?: string;
  w?: string;
  my?: string;
  color?: string;
}

export const QuickContractLogo: React.FC<QuickContractLogoProps> = ({ h = '40px', w = 'auto', my = '0px', color }) => {
  const logoColor = useColorModeValue('navy.700', 'white');
  
  return (
    <Flex alignItems='center' h={h} w={w} my={my}>
      <Image 
        src='/src/assets/img/logo.png' 
        alt='Quick Contract Logo' 
        h='40px' 
        w='40px' 
        me='12px'
      />
      <Text 
        color={color || logoColor} 
        fontSize='18px' 
        fontWeight='bold'
        fontFamily='Arial, sans-serif'
      >
        Quick Contract
      </Text>
    </Flex>
  );
};

export default QuickContractLogo;
