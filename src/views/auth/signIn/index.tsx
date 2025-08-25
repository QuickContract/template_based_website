

import React from "react";
import { NavLink } from "react-router-dom";
// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import DefaultAuth from "layouts/auth/Default";
import { asIcon } from 'utils/iconUtils';
// Assets
import illustration from "assets/img/auth/auth.png";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";

function SignIn() {
  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: "100%", sm: "400px", md: "450px", lg: "500px" }}
        w='100%'
        mx='auto'
        h='100%'
        alignItems='center'
        justifyContent='center'
        mb={{ base: "20px", md: "40px" }}
        px={{ base: "20px", sm: "25px", md: "30px" }}
        mt={{ base: "0px", md: "0px" }}
        flexDirection='column'>
        <Box w='100%' textAlign={{ base: 'center', md: 'left' }} mb={{ base: '20px', md: '30px' }}>
          <Heading color={textColor} fontSize={{ base: '28px', sm: '32px', md: '36px' }} mb='10px'>
            Welcome to Quick Contract
          </Heading>
          <Text
            mb={{ base: '24px', md: '36px' }}
            color={textColorSecondary}
            fontWeight='400'
            fontSize={{ base: 'sm', md: 'md' }}>
            Enter your email and password to sign in!
          </Text>
        </Box>
        <Flex
          zIndex='2'
          direction='column'
          w='100%'
          maxW='100%'
          background='transparent'
          borderRadius='15px'
          mx='auto'
          mb={{ base: "20px", md: "30px" }}>
          
          <FormControl>
            <FormLabel
              display='flex'
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              mb='8px'>
              Email<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              isRequired={true}
              variant='auth'
              fontSize={{ base: 'xs', sm: 'sm' }}
              type='email'
              placeholder='mail@quickcontract.com'
              mb={{ base: '20px', md: '24px' }}
              fontWeight='500'
              size={{ base: 'md', md: 'lg' }}
              h={{ base: '40px', md: '48px' }}
            />
            <FormLabel
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              display='flex'>
              Password<Text color={brandStars}>*</Text>
            </FormLabel>
            <InputGroup size={{ base: 'md', md: 'lg' }}>
              <Input
                isRequired={true}
                fontSize={{ base: 'xs', sm: 'sm' }}
                placeholder='Min. 8 characters'
                mb={{ base: '20px', md: '24px' }}
                size={{ base: 'md', md: 'lg' }}
                h={{ base: '40px', md: '48px' }}
                type={show ? "text" : "password"}
                variant='auth'
              />
              <InputRightElement display='flex' alignItems='center' mt='4px'>
                <Icon
                  color={textColorSecondary}
                  _hover={{ cursor: "pointer" }}
                  as={asIcon(show ? RiEyeCloseLine : MdOutlineRemoveRedEye)}
                  onClick={handleClick}
                />
              </InputRightElement>
            </InputGroup>
            <Flex justifyContent='space-between' align='center' mb='24px'>
              <FormControl display='flex' alignItems='center'>
                <Checkbox
                  id='remember-login'
                  colorScheme='brandScheme'
                  me='10px'
                />
                <FormLabel
                  htmlFor='remember-login'
                  mb='0'
                  fontWeight='normal'
                  color={textColor}
                  fontSize='sm'>
                  Keep me logged in
                </FormLabel>
              </FormControl>
              <NavLink to='/auth/forgot-password'>
                <Text
                  color={textColorBrand}
                  fontSize='sm'
                  w='124px'
                  fontWeight='500'>
                  Forgot password?
                </Text>
              </NavLink>
            </Flex>
            <Button
              fontSize={{ base: 'xs', sm: 'sm' }}
              variant='brand'
              fontWeight='500'
              w='100%'
              h={{ base: '45px', md: '50px' }}
              mb={{ base: '20px', md: '24px' }}
              py={{ base: '12px', md: '15px' }}>
              Sign In
            </Button>
          </FormControl>
          <Flex
            flexDirection='column'
            justifyContent='center'
            alignItems={{ base: 'center', md: 'start' }}
            maxW='100%'
            mt='0px'
            textAlign={{ base: 'center', md: 'left' }}>
            <Text color={textColorDetails} fontWeight='400' fontSize={{ base: '12px', sm: '14px' }}>
              Not registered yet?
              <NavLink to='/auth/sign-up'>
                <Text
                  color={textColorBrand}
                  as='span'
                  ms='5px'
                  fontWeight='500'>
                  Create an Account
                </Text>
              </NavLink>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
