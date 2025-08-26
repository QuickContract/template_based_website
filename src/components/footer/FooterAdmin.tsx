/*eslint-disable*/

import { Flex, Link, List, ListItem, Text, useColorModeValue } from '@chakra-ui/react';
import QuickContractLogo from 'components/icons/QuickContractLogo';

export default function Footer() {
	const textColor = useColorModeValue('gray.400', 'white');
	return (
		<Flex
			zIndex='3'
			flexDirection={{
				base: 'column',
				xl: 'row'
			}}
			alignItems={{
				base: 'center',
				xl: 'start'
			}}
			justifyContent='space-between'
			px={{ base: '30px', md: '50px' }}
			pb='30px'>
			<Text
				color={textColor}
				textAlign={{
					base: 'center',
					xl: 'start'
				}}
				mb={{ base: '20px', xl: '0px' }}>
				&copy; {new Date().getFullYear()}
				<Flex as='span' alignItems='center' ms='4px' gap='4px'>
					<QuickContractLogo variant='compact' />. All Rights Reserved. Made with love by
					<Link mx='3px' color={textColor} href='#' target='_blank' fontWeight='700'>
						<QuickContractLogo variant='compact' />!
					</Link>
				</Flex>
			</Text>
			<List display='flex'>
				<ListItem
					me={{
						base: '20px',
						md: '44px'
					}}>
					<Link fontWeight='500' color={textColor} href='mailto:hello@quickcontract.com'>
						Support
					</Link>
				</ListItem>
				<ListItem
					me={{
						base: '20px',
						md: '44px'
					}}>
					<Link fontWeight='500' color={textColor} href='#'>
						License
					</Link>
				</ListItem>
				<ListItem
					me={{
						base: '20px',
						md: '44px'
					}}>
					<Link fontWeight='500' color={textColor} href='#'>
						Terms of Use
					</Link>
				</ListItem>
				<ListItem>
					<Link fontWeight='500' color={textColor} href='#'>
						Blog
					</Link>
				</ListItem>
			</List>
		</Flex>
	);
}
