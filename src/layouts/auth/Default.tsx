// Chakra imports
import { Box, Flex } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import Footer from 'components/footer/FooterAuth';

function AuthIllustration(props: { children: JSX.Element | string; illustrationBackground?: string }) {
	const { children } = props;
	// Chakra color mode
	return (
		<Flex position='relative' h='100vh' w='100%'>
			<Flex
				h='100%'
				w='100%'
				maxW='100%'
				mx='auto'
				pt={{ base: '20px', sm: '30px', md: '40px', lg: '40px' }}
				px={{ base: '20px', sm: '25px', md: '30px', lg: '40px' }}
				justifyContent='center'
				alignItems='center'
				direction='column'
				position='relative'>

				<Flex
					direction='column'
					w='100%'
					h='100%'
					justifyContent='center'
					alignItems='center'
					position='relative'
					zIndex='2'>
					{children}
					<Box
						mt='auto'
						mb='20px'
						w='100%'
						textAlign='center'>
						<Footer />
					</Box>
				</Flex>
			</Flex>
		</Flex>
	);
}
// PROPS

AuthIllustration.propTypes = {
	illustrationBackground: PropTypes.string,
	image: PropTypes.any
};

export default AuthIllustration;
