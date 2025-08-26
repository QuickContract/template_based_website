import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Icon,
  Image,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Textarea
} from '@chakra-ui/react';
import { asIcon } from '../../utils/iconUtils';
import { MdUpload, MdEdit, MdDelete, MdDraw } from 'react-icons/md';

interface SignatureFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  required?: boolean;
  signatureType?: 'upload' | 'digital' | 'both';
}

export default function SignatureField({ 
  value, 
  onChange, 
  label, 
  required = false,
  signatureType = 'both' 
}: SignatureFieldProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'digital'>('digital');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  
  // Chakra color mode
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Please select a file smaller than 5MB",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDigitalSignature = (signatureText: string) => {
    onChange(signatureText);
  };

  const handleClear = () => {
    onChange('');
  };

  const renderUploadTab = () => (
    <VStack spacing="15px" align="stretch">
      {/* Upload functionality commented out for now
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        ref={fileInputRef}
        display="none"
      />
      
      {!value ? (
        <Box
          border="2px dashed"
          borderColor={borderColor}
          borderRadius="12px"
          p="40px"
          textAlign="center"
          cursor="pointer"
          _hover={{ borderColor: 'blue.300' }}
          onClick={() => fileInputRef.current?.click()}
        >
          <VStack spacing="15px">
            <Icon as={asIcon(MdUpload)} w="40px" h="40px" color="gray.400" />
            <Text color="gray.500" fontSize="sm">
              Click to upload signature image
            </Text>
            <Text color="gray.400" fontSize="xs">
              Supports: JPG, PNG, GIF (Max: 5MB)
            </Text>
          </VStack>
        </Box>
      ) : (
        <Box position="relative">
          <Image
            src={value}
            alt="Signature"
            maxH="150px"
            mx="auto"
            borderRadius="8px"
            border="1px solid"
            borderColor={borderColor}
          />
          <HStack position="absolute" top="10px" right="10px" spacing="8px">
            <Button
              size="sm"
              variant="ghost"
              colorScheme="blue"
              onClick={() => fileInputRef.current?.click()}
            >
              <Icon as={asIcon(MdEdit)} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              colorScheme="red"
              onClick={handleClear}
            >
              <Icon as={asIcon(MdDelete)} />
            </Button>
          </HStack>
        </Box>
      )}
      */}
      <Text color="gray.500" fontSize="sm" textAlign="center">
        Upload functionality temporarily disabled
      </Text>
    </VStack>
  );

  const renderDigitalTab = () => (
    <VStack spacing="15px" align="stretch">
      <Textarea
        placeholder="Type your signature here..."
        value={value}
        onChange={(e) => handleDigitalSignature(e.target.value)}
        rows={3}
        fontFamily="'Dancing Script', cursive"
        fontSize="18px"
        resize="none"
      />
      <Text fontSize="xs" color="gray.500" textAlign="center">
        Type your name or signature text above
      </Text>
    </VStack>
  );

  return (
    <Box>
      <Text mb="15px" fontSize="sm" fontWeight="500" color={textColor}>
        {label} {required && <Text as="span" color="red.500">*</Text>}
      </Text>
      
      {signatureType === 'both' ? (
        <Tabs index={activeTab === 'upload' ? 0 : 1} onChange={(index) => setActiveTab(index === 0 ? 'upload' : 'digital')}>
          <TabList>
            <Tab>Upload Image</Tab>
            <Tab>Digital Signature</Tab>
          </TabList>
          <TabPanels>
            <TabPanel p="20px 0">
              {renderUploadTab()}
            </TabPanel>
            <TabPanel p="20px 0">
              {renderDigitalTab()}
            </TabPanel>
          </TabPanels>
        </Tabs>
      ) : signatureType === 'upload' ? (
        renderUploadTab()
      ) : (
        renderDigitalTab()
      )}
    </Box>
  );
}
