import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Badge,
  Icon,
  Spinner
} from '@chakra-ui/react';
import { asIcon } from '../../utils/iconUtils';
import { MdEdit, MdDelete, MdDownload, MdVisibility } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { generatePDF } from '../../utils/pdfGenerator';
import { generateDOCX, downloadDOCX } from '../../utils/docxGenerator';
import { getTemplateById as getContractTemplate } from '../../config/contractTemplates';

interface Contract {
  id: string;
  category: string;
  subcategory: string;
  data: Record<string, any>;
  createdAt: string;
}

export default function AllContracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(null);
  const [downloadingPDF, setDownloadingPDF] = useState<string | null>(null);
  const [downloadingDOCX, setDownloadingDOCX] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();
  const cancelRef = useRef<HTMLButtonElement>(null);
  
  // Chakra color mode
  const cardBg = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = () => {
    const storedContracts = JSON.parse(localStorage.getItem('quickContractContracts') || '[]');
    setContracts(storedContracts);
  };

  const handleEdit = (contract: Contract) => {
    // Navigate to create contract with pre-filled data
    navigate('/dashboard/create-contract', { 
      state: { 
        editMode: true, 
        contractData: contract 
      } 
    });
  };

  const handleDelete = (contract: Contract) => {
    setContractToDelete(contract);
    onOpen();
  };

  const confirmDelete = () => {
    if (!contractToDelete) return;

    const updatedContracts = contracts.filter(c => c.id !== contractToDelete.id);
    localStorage.setItem('quickContractContracts', JSON.stringify(updatedContracts));
    setContracts(updatedContracts);
    
    toast({
      title: "Contract Deleted",
      description: "Contract has been deleted successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    onClose();
    setContractToDelete(null);
  };

  const generateFilename = (contract: Contract) => {
    const ownerName = contract.data.ownerName || 'Owner';
    const contractorName = contract.data.contractorName || 'Contractor';
    const contractDate = contract.data.contractDate || new Date().toISOString().split('T')[0];
    return `Builder-Agreement_${ownerName}_${contractorName}_${contractDate}`;
  };

  const handleDownloadPDF = async (contract: Contract) => {
    const template = getContractTemplate(contract.subcategory);
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

    setDownloadingPDF(contract.id);
    try {
      await generatePDF({
        subcategoryId: contract.subcategory,
        formData: contract.data,
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
      setDownloadingPDF(null);
    }
  };

  const handleDownloadDOCX = async (contract: Contract) => {
    const template = getContractTemplate(contract.subcategory);
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

    setDownloadingDOCX(contract.id);
    try {
      const docxBuffer = await generateDOCX({
        subcategoryId: contract.subcategory,
        formData: contract.data,
        template: template.content
      });
      
      const filename = `${generateFilename(contract)}.docx`;
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
      setDownloadingDOCX(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const getCategoryName = (categoryId: string) => {
    const categoryNames: Record<string, string> = {
      'construction': 'Construction Contracts'
    };
    return categoryNames[categoryId] || categoryId;
  };

  const getSubcategoryName = (subcategoryId: string) => {
    const subcategoryNames: Record<string, string> = {
      'builder-agreement-hindi': 'Builder Agreement (Hindi)'
    };
    return subcategoryNames[subcategoryId] || subcategoryId;
  };

  return (
    <Box>
      {/* Header */}
      <Box mb="30px">
        <Text fontSize="2xl" fontWeight="700" color={textColor} mb="10px">
          All Contracts
        </Text>
        <Text color="gray.500">
          Manage and view all your created contracts
        </Text>
      </Box>

      {/* Contracts Table */}
      <Box bg={cardBg} p="30px" borderRadius="20px" border="1px solid" borderColor={borderColor}>
        {contracts.length === 0 ? (
          <VStack spacing="20px" py="60px">
            <Text fontSize="lg" color="gray.500">
              No contracts found
            </Text>
            <Text color="gray.400" textAlign="center">
              Create your first contract to get started
            </Text>
            <Button 
              colorScheme="blue" 
              onClick={() => navigate('/dashboard/create-contract')}
            >
              Create Contract
            </Button>
          </VStack>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th color={textColor}>Contractor</Th>
                  <Th color={textColor}>Owner</Th>
                  <Th color={textColor}>Type</Th>
                  <Th color={textColor}>Date</Th>
                  <Th color={textColor}>Amount</Th>
                  <Th color={textColor}>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {contracts.map((contract) => (
                  <Tr key={contract.id}>
                    <Td color={textColor}>
                      {contract.data.contractorName || 'N/A'}
                    </Td>
                    <Td color={textColor}>
                      {contract.data.ownerName || 'N/A'}
                    </Td>
                    <Td color={textColor}>
                      <VStack align="start" spacing="2px">
                        <Text fontSize="sm" fontWeight="500">
                          {getCategoryName(contract.category)}
                        </Text>
                        <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                          {getSubcategoryName(contract.subcategory)}
                        </Badge>
                      </VStack>
                    </Td>
                    <Td color={textColor}>
                      {contract.data.contractDate ? formatDate(contract.data.contractDate) : 'N/A'}
                    </Td>
                    <Td color={textColor}>
                      {contract.data.ratePerSqFt && contract.data.plotAreaSqFt 
                        ? `₹${(contract.data.ratePerSqFt * contract.data.plotAreaSqFt).toLocaleString()}`
                        : 'N/A'
                      }
                    </Td>
                    <Td>
                      <HStack spacing="8px">
                        <IconButton
                          aria-label="View contract"
                          icon={<Icon as={asIcon(MdVisibility)} />}
                          size="sm"
                          variant="ghost"
                          colorScheme="blue"
                          onClick={() => handleEdit(contract)}
                        />
                        <IconButton
                          aria-label="Edit contract"
                          icon={<Icon as={asIcon(MdEdit)} />}
                          size="sm"
                          variant="ghost"
                          colorScheme="green"
                          onClick={() => handleEdit(contract)}
                        />
                        <IconButton
                          aria-label="Download PDF"
                          icon={downloadingPDF === contract.id ? <Spinner size="sm" /> : <Icon as={asIcon(MdDownload)} />}
                          size="sm"
                          variant="ghost"
                          colorScheme="purple"
                          onClick={() => handleDownloadPDF(contract)}
                          isLoading={downloadingPDF === contract.id}
                          isDisabled={downloadingPDF === contract.id || downloadingDOCX === contract.id}
                        />
                        <IconButton
                          aria-label="Download DOCX"
                          icon={downloadingDOCX === contract.id ? <Spinner size="sm" /> : <Icon as={asIcon(MdDownload)} />}
                          size="sm"
                          variant="ghost"
                          colorScheme="orange"
                          onClick={() => handleDownloadDOCX(contract)}
                          isLoading={downloadingDOCX === contract.id}
                          isDisabled={downloadingPDF === contract.id || downloadingDOCX === contract.id}
                        />
                        <IconButton
                          aria-label="Delete contract"
                          icon={<Icon as={asIcon(MdDelete)} />}
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleDelete(contract)}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Contract
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this contract? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
