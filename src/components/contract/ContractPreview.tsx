import React, { useState } from 'react';
import {
  Box,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  IconButton,
  Flex,
  Icon
} from '@chakra-ui/react';
import { asIcon } from '../../utils/iconUtils';
import { MdDownload, MdClose } from 'react-icons/md';
import { getTemplateById, injectTemplateData } from '../../config/contractTemplates';
import { generatePDF } from '../../utils/pdfGenerator';
import { generateDOCX, downloadDOCX } from '../../utils/docxGenerator';

interface ContractPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  subcategoryId: string;
  formData: Record<string, any>;
}

export default function ContractPreview({ isOpen, onClose, subcategoryId, formData }: ContractPreviewProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingDOCX, setIsGeneratingDOCX] = useState(false);
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  const template = getTemplateById(subcategoryId);
  const previewContent = template ? injectTemplateData(template, formData) : 'Template not found';

  const generateFilename = () => {
    const ownerName = formData.ownerName || 'Owner';
    const contractorName = formData.contractorName || 'Contractor';
    const contractDate = formData.contractDate || new Date().toISOString().split('T')[0];
    return `Builder-Agreement_${ownerName}_${contractorName}_${contractDate}`;
  };

  const handleDownloadPDF = async () => {
    if (!template) {
      toast({
        title: 'Error',
        description: 'Template not found',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsGeneratingPDF(true);
    try {
      await generatePDF({
        subcategoryId,
        formData,
        template: template.content
      });
      
      toast({
        title: 'Success',
        description: 'PDF opened in new tab',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate PDF',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadDOCX = async () => {
    if (!template) {
      toast({
        title: 'Error',
        description: 'Template not found',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsGeneratingDOCX(true);
    try {
      const docxBuffer = await generateDOCX({
        subcategoryId,
        formData,
        template: template.content
      });
      
      const filename = `${generateFilename()}.docx`;
      downloadDOCX(docxBuffer, filename);
      
      toast({
        title: 'Success',
        description: 'DOCX downloaded successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('DOCX generation error:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate DOCX',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsGeneratingDOCX(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent bg={bgColor}>
        <ModalHeader>
          <Flex justify="space-between" align="center">
            <Text color={textColor} fontSize="xl" fontWeight="bold">
              Contract Preview
            </Text>
            <IconButton
              aria-label="Close preview"
              icon={<Icon as={asIcon(MdClose)} />}
              variant="ghost"
              onClick={onClose}
              size="sm"
            />
          </Flex>
        </ModalHeader>
        
        <ModalBody>
          <VStack spacing={6} align="stretch">
            <Box
              bg={useColorModeValue('gray.50', 'whiteAlpha.50')}
              p={6}
              borderRadius="lg"
              border="1px solid"
              borderColor={useColorModeValue('gray.200', 'whiteAlpha.200')}
              maxH="60vh"
              overflowY="auto"
            >
              <Text
                color={textColor}
                fontSize="md"
                lineHeight="1.8"
                whiteSpace="pre-wrap"
                fontFamily="Noto Sans Devanagari, sans-serif"
              >
                {previewContent}
              </Text>
            </Box>
          </VStack>
        </ModalBody>
        
        <ModalFooter>
          <HStack spacing={4}>
            <Button
              leftIcon={<Icon as={asIcon(MdDownload)} />}
              colorScheme="purple"
              onClick={handleDownloadPDF}
              isLoading={isGeneratingPDF}
              loadingText="Generating PDF"
            >
              Download PDF
            </Button>
            <Button
              leftIcon={<Icon as={asIcon(MdDownload)} />}
              colorScheme="orange"
              onClick={handleDownloadDOCX}
              isLoading={isGeneratingDOCX}
              loadingText="Generating DOCX"
            >
              Download DOCX
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
