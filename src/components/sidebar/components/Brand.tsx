// Chakra imports
import { Flex, useColorModeValue } from '@chakra-ui/react';

// Custom components
import QuickContractLogo from 'components/icons/QuickContractLogo';
import { HSeparator } from 'components/separator/Separator';

export function SidebarBrand() {
	//   Chakra color mode
	let logoColor = useColorModeValue('navy.700', 'white');

	return (
		<Flex alignItems='center' flexDirection='column'>
			<QuickContractLogo h='40px' w='auto' my='32px' color={logoColor} />
			<HSeparator mb='20px' />
		</Flex>
	);
}

export default SidebarBrand;
