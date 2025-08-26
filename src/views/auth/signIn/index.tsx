

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
// Custom components
import DefaultAuth from "layouts/auth/Default";
import { asIcon } from 'utils/iconUtils';
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import QuickContractLogo from "components/icons/QuickContractLogo";
import { useAuth } from "contexts/AuthContext";

function SignIn() {
  const navigate = useNavigate();
  const toast = useToast();
  const { login, isLoggedIn } = useAuth();
  
  // Redirect if already logged in
  React.useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoggedIn, navigate]);
  
  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");

  // Form state
  const [show, setShow] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = React.useState({
    email: '',
    password: ''
  });

  const handleClick = () => setShow(!show);

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters long';
    return '';
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate fields
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        toast({
          title: "Success!",
          description: "Welcome to Quick Contract!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Please check your email and password and try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DefaultAuth>
      <Box
        maxW={{ base: "100%", sm: "400px", md: "450px", lg: "500px" }}
        w='100%'
        mx='auto'
        bg={useColorModeValue('white', 'navy.800')}
        borderRadius='20px'
        boxShadow='xl'
        p={{ base: '30px', sm: '40px', md: '50px' }}
        border='1px solid'
        borderColor={useColorModeValue('gray.200', 'whiteAlpha.100')}>
        
        <Box w='100%' textAlign='center' mb={{ base: '30px', md: '40px' }}>
          <Flex alignItems='center' justifyContent='center' mb='20px' gap='15px'>
            <QuickContractLogo variant='large' />
          </Flex>
          <Text
            mb={{ base: '24px', md: '36px' }}
            color={textColorSecondary}
            fontWeight='400'
            fontSize={{ base: 'sm', md: 'md' }}>
            Enter your email and password to sign in!
          </Text>
        </Box>
        
        <Box
          as="form"
          onSubmit={handleSubmit}
          zIndex='2'
          w='100%'
          maxW='100%'
          background='transparent'
          borderRadius='15px'
          mx='auto'
          mb={{ base: "20px", md: "24px" }}>
          
          <FormControl isInvalid={!!errors.email} mb={{ base: '20px', md: '24px' }}>
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
              fontWeight='500'
              size={{ base: 'md', md: 'lg' }}
              h={{ base: '40px', md: '48px' }}
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              _focus={{
                borderColor: errors.email ? 'red.500' : 'brand.500',
                boxShadow: errors.email ? '0 0 0 1px red.500' : '0 0 0 1px brand.500'
              }}
            />
            <FormErrorMessage fontSize="12px" fontWeight="400">
              {errors.email}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.password} mb={{ base: '20px', md: '24px' }}>
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
                fontWeight='500'
                size={{ base: 'md', md: 'lg' }}
                h={{ base: '40px', md: '48px' }}
                type={show ? "text" : "password"}
                variant='auth'
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                _focus={{
                  borderColor: errors.password ? 'red.500' : 'brand.500',
                  boxShadow: errors.password ? '0 0 0 1px red.500' : '0 0 0 1px brand.500'
                }}
              />
              <InputRightElement 
                display='flex' 
                alignItems='center' 
                h={{ base: '40px', md: '48px' }}
                pr={{ base: '12px', md: '16px' }}
              >
                <Icon
                  color={textColorSecondary}
                  _hover={{ cursor: "pointer", color: textColorBrand }}
                  as={asIcon(show ? RiEyeCloseLine : MdOutlineRemoveRedEye)}
                  onClick={handleClick}
                  boxSize={{ base: '18px', md: '20px' }}
                />
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage fontSize="12px" fontWeight="400">
              {errors.password}
            </FormErrorMessage>
          </FormControl>

          <Flex justifyContent='space-between' align='center' mb='24px'>
            <FormControl display='flex' alignItems='center'>
              <Checkbox
                id='remember-login'
                colorScheme='brandScheme'
                me='10px'
                isChecked={formData.rememberMe}
                onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
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
            type="submit"
            fontSize={{ base: 'xs', sm: 'sm' }}
            variant='brand'
            fontWeight='500'
            w='100%'
            h={{ base: '45px', md: '50px' }}
            mb={{ base: '20px', md: '24px' }}
            py={{ base: '12px', md: '15px' }}
            isLoading={isLoading}
            loadingText="Signing In..."
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'lg'
            }}
            _active={{
              transform: 'translateY(0)'
            }}>
            Sign In
          </Button>
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
        </Box>
      </Box>
    </DefaultAuth>
  );
}

export default SignIn;
