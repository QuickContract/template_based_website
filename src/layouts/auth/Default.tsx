// Chakra imports
import { Box, Flex } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import Footer from 'components/footer/FooterAuth';
import FixedPlugin from 'components/fixedPlugin/FixedPlugin';

function AuthIllustration(props: { children: JSX.Element | string; illustrationBackground: string }) {
	const { children, illustrationBackground } = props;
	// Chakra color mode
	return (
		<Flex position='relative' h='100vh' w='100%'>
			<Flex
				h='100%'
				w='100%'
				maxW={{ base: '100%', md: '100%', lg: '1313px' }}
				mx='auto'
				pt={{ base: '20px', sm: '30px', md: '40px', lg: '0px' }}
				px={{ base: '20px', sm: '25px', md: '30px', lg: '30px', xl: '0px' }}
				ps={{ base: '20px', lg: '30px', xl: '70px' }}
				justifyContent={{ base: 'center', lg: 'space-between' }}
				alignItems={{ base: 'center', lg: 'flex-start' }}
				direction={{ base: 'column', lg: 'row' }}
				position='relative'>

				<Flex
					direction='column'
					w={{ base: '100%', lg: '50%' }}
					h='100%'
					justifyContent='center'
					alignItems={{ base: 'center', lg: 'flex-start' }}
					position='relative'
					zIndex='2'>
					{children}
					<Box
						display={{ base: 'block', lg: 'none' }}
						mt='auto'
						mb='20px'>
						<Footer />
					</Box>
				</Flex>

				<Box
					display={{ base: 'none', md: 'block' }}
					h='100%'
					w={{ base: '100%', md: '40%', lg: '50%', xl: '50%' }}
					position={{ base: 'absolute', lg: 'relative' }}
					right={{ base: '0px', lg: 'auto' }}
					top='0px'
					zIndex='1'>
					<Flex
						bg={`url(${illustrationBackground})`}
						justify='center'
						align='end'
						w='100%'
						h='100%'
						bgSize='cover'
						bgPosition='50%'
						position='absolute'
						borderBottomLeftRadius={{ base: '0px', md: '60px', lg: '120px', xl: '200px' }}
					/>
				</Box>

				<Box
					display={{ base: 'none', lg: 'block' }}
					position='absolute'
					left='20px'
					bottom='20px'
					zIndex='3'>
					<Footer />
				</Box>
			</Flex>
			<FixedPlugin />
		</Flex>
	);
}
// PROPS

AuthIllustration.propTypes = {
	illustrationBackground: PropTypes.string,
	image: PropTypes.any
};

export default AuthIllustration;
