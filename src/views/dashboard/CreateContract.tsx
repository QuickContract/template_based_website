import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useToast,
  Divider
} from '@chakra-ui/react';
import { contractCategories, ContractField } from '../../config/contractFields';
import ContractPreview from '../../components/contract/ContractPreview';
import SignatureField from '../../components/fields/SignatureField';

export default function CreateContract() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingContractId, setEditingContractId] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const toast = useToast();
  
  // Chakra color mode
  const cardBg = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  useEffect(() => {
    // Check if we're in edit mode
    if (location.state?.editMode && location.state?.contractData) {
      const contract = location.state.contractData;
      setIsEditMode(true);
      setEditingContractId(contract.id);
      setSelectedCategory(contract.category);
      setSelectedSubcategory(contract.subcategory);
      setFormData(contract.data);
    }
  }, [location.state]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory('');
    if (!isEditMode) {
      setFormData({});
    }
  };

  const handleSubcategoryChange = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
    if (!isEditMode) {
      setFormData({});
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getCurrentSubcategory = () => {
    if (!selectedCategory || !selectedSubcategory) return null;
    const category = contractCategories.find(cat => cat.id === selectedCategory);
    return category?.subcategories.find(sub => sub.id === selectedSubcategory);
  };

  const groupFields = (fields: ContractField[]) => {
    const groups = {
      basics: ['contractDate', 'contractorName', 'ownerName', 'projectAddress'],
      plot: ['plotOrHouseNumber', 'plotAreaSqFt', 'frontageFeet', 'depthFeet'],
      boundaries: ['boundaryNorth', 'boundarySouth', 'boundaryEast', 'boundaryWest'],
      financials: ['totalFloors', 'structureType', 'ratePerSqFt', 'advanceReceived'],
      timeline: ['startDate', 'completionDate'],
      witnesses: ['witness1Name', 'witness2Name', 'contractorSignature', 'ownerSignature', 'witness1Signature', 'witness2Signature']
    };

    const groupNames = {
      basics: 'Basic Information',
      plot: 'Plot Details',
      boundaries: 'Boundaries',
      financials: 'Financial & Structure',
      timeline: 'Timeline',
      witnesses: 'Signatures & Witnesses'
    };

    return Object.entries(groups).map(([key, fieldKeys]) => ({
      key,
      name: groupNames[key as keyof typeof groupNames],
      fields: fields.filter(field => fieldKeys.includes(field.key))
    }));
  };

  const renderField = (field: ContractField) => {
    if (field.type === 'signature') {
      return (
        <SignatureField
          value={formData[field.key] || ''}
          onChange={(value) => handleInputChange(field.key, value)}
          label={field.label}
          required={field.required}
          signatureType={field.signatureType}
        />
      );
    }

    const commonProps = {
      value: formData[field.key] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
        handleInputChange(field.key, e.target.value),
      placeholder: field.placeholder,
      isRequired: field.required,
      min: field.min
    };

    switch (field.type) {
      case 'textarea':
        return <Textarea {...commonProps} rows={3} />;
      case 'number':
        return <Input type="number" {...commonProps} />;
      case 'date':
        return (
          <Input 
            type="date" 
            {...commonProps} 
            onClick={(e) => (e.target as HTMLInputElement).showPicker()}
            cursor="pointer"
          />
        );
      case 'select':
        return (
          <Select {...commonProps}>
            <option value="">Select...</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        );
      default:
        return <Input type="text" {...commonProps} />;
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    const subcategory = getCurrentSubcategory();
    if (!subcategory) return;

    const requiredFields = subcategory.fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !formData[field.key]);

    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please fill in all required fields: ${missingFields.map(f => f.label).join(', ')}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Get existing contracts
    const contracts = JSON.parse(localStorage.getItem('quickContractContracts') || '[]');
    
    if (isEditMode && editingContractId) {
      // Update existing contract
      const updatedContracts = contracts.map((contract: any) => 
        contract.id === editingContractId 
          ? { ...contract, data: formData, updatedAt: new Date().toISOString() }
          : contract
      );
      localStorage.setItem('quickContractContracts', JSON.stringify(updatedContracts));
      
      toast({
        title: "Success!",
        description: "Contract updated successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      // Create new contract
      const newContract = {
        id: Date.now().toString(),
        category: selectedCategory,
        subcategory: selectedSubcategory,
        data: formData,
        createdAt: new Date().toISOString()
      };
      contracts.push(newContract);
      localStorage.setItem('quickContractContracts', JSON.stringify(contracts));

      toast({
        title: "Success!",
        description: "Contract created successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }

    // Reset form and navigate back to contracts list
    setFormData({});
    setSelectedCategory('');
    setSelectedSubcategory('');
    setIsEditMode(false);
    setEditingContractId(null);
    navigate('/dashboard/all-contracts');
  };

  const handleCancel = () => {
    if (isEditMode) {
      navigate('/dashboard/all-contracts');
    } else {
      setFormData({});
      setSelectedCategory('');
      setSelectedSubcategory('');
    }
  };

  const handlePreview = () => {
    if (!selectedSubcategory) {
      toast({
        title: "Preview Error",
        description: "Please select a subcategory first.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setIsPreviewOpen(true);
  };

  const currentSubcategory = getCurrentSubcategory();
  const fieldGroups = currentSubcategory ? groupFields(currentSubcategory.fields) : [];
  
  // Chakra color mode values for accordion
  const accordionBg = useColorModeValue('gray.50', 'whiteAlpha.50');
  const accordionHoverBg = useColorModeValue('gray.100', 'whiteAlpha.100');

  return (
    <Box>
      {/* Header */}
      <Box mb="30px">
        <Text fontSize="2xl" fontWeight="700" color={textColor} mb="10px">
          {isEditMode ? 'Edit Contract' : 'Create New Contract'}
        </Text>
        <Text color="gray.500">
          {isEditMode 
            ? 'Update the contract information below'
            : 'Select contract type and fill in the required information'
          }
        </Text>
      </Box>

      {/* Category Selection */}
      <Box bg={cardBg} p="30px" borderRadius="20px" border="1px solid" borderColor={borderColor} mb="30px">
        <Text fontSize="lg" fontWeight="600" color={textColor} mb="20px">
          Contract Type
        </Text>
        
        <VStack spacing="20px" align="stretch">
          {/* Category Dropdown */}
          <FormControl>
            <FormLabel color={textColor}>Category</FormLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              placeholder="Select Category"
              isDisabled={isEditMode}
            >
              {contractCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.nameHindi})
                </option>
              ))}
            </Select>
          </FormControl>

          {/* Subcategory Dropdown */}
          {selectedCategory && (
            <FormControl>
              <FormLabel color={textColor}>Subcategory</FormLabel>
              <Select
                value={selectedSubcategory}
                onChange={(e) => handleSubcategoryChange(e.target.value)}
                placeholder="Select Subcategory"
                isDisabled={isEditMode}
              >
                {contractCategories
                  .find(cat => cat.id === selectedCategory)
                  ?.subcategories.map(sub => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
              </Select>
            </FormControl>
          )}
        </VStack>
      </Box>

      {/* Dynamic Form */}
      {currentSubcategory && (
        <Box bg={cardBg} p="30px" borderRadius="20px" border="1px solid" borderColor={borderColor}>
          <Text fontSize="lg" fontWeight="600" color={textColor} mb="20px">
            Contract Details
          </Text>

          <Accordion allowMultiple defaultIndex={[0]}>
            {fieldGroups.map((group) => (
              <AccordionItem key={group.key} border="none" mb="10px">
                <AccordionButton
                  bg={accordionBg}
                  borderRadius="12px"
                  _hover={{ bg: accordionHoverBg }}
                  p="15px 20px"
                >
                  <Text flex="1" textAlign="left" fontWeight="600" color={textColor}>
                    {group.name}
                  </Text>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb="20px" pt="20px">
                  <VStack spacing="20px" align="stretch">
                    {group.fields.map((field) => (
                      <FormControl key={field.key} isRequired={field.type !== 'signature' ? field.required : false}>
                        {field.type !== 'signature' && (
                          <FormLabel color={textColor} fontSize="sm" fontWeight="500">
                            {field.label}
                          </FormLabel>
                        )}
                        {renderField(field)}
                      </FormControl>
                    ))}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      )}

      {/* Action Buttons */}
      {currentSubcategory && (
        <Box
          position="sticky"
          bottom="0"
          bg={cardBg}
          p="20px"
          borderRadius="20px"
          border="1px solid"
          borderColor={borderColor}
          mt="30px"
          boxShadow="0 4px 20px rgba(0,0,0,0.1)"
        >
          <Flex justify="space-between" align="center">
            <HStack spacing="15px">
              <Button
                variant="outline"
                onClick={handlePreview}
                colorScheme="blue"
                isDisabled={true}
              >
                Preview Contract
              </Button>
            </HStack>
            
            <HStack spacing="15px">
              <Button variant="ghost" onClick={handleCancel}>
                {isEditMode ? 'Cancel' : 'Reset'}
              </Button>
              <Button colorScheme="blue" onClick={handleSubmit}>
                {isEditMode ? 'Update Contract' : 'Create Contract'}
              </Button>
            </HStack>
          </Flex>
        </Box>
      )}

      {/* Contract Preview Modal */}
      <ContractPreview
        subcategoryId={selectedSubcategory}
        formData={formData}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </Box>
  );
}
