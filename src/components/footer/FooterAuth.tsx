/* eslint-disable */

import {
  Flex,
  Link,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import QuickContractLogo from 'components/icons/QuickContractLogo';

export default function Footer() {
  let textColor = useColorModeValue('gray.400', 'white');
  return (
    <Flex
      zIndex="3"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      w="100%"
      textAlign="center"
      py="20px"
    >
      <Text
        color={textColor}
        textAlign="center"
        fontSize="sm"
      >
        <Flex as="span" alignItems="center" justifyContent="center" gap="4px" flexWrap="wrap">
          &copy; {new Date().getFullYear()} <QuickContractLogo variant='compact' />. All Rights Reserved. Made with love by
          <Link
            mx="3px"
            color="blue"
            href="https://sitehec.com"
            target="_blank"
            fontWeight="700"
          >
            Sitehec Technologies
          </Link>
        </Flex>
      </Text>
    </Flex>
  );
}
