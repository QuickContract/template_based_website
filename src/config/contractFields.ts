export interface ContractField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'signature';
  required: boolean;
  options?: { value: string; label: string }[];
  min?: number;
  placeholder?: string;
  signatureType?: 'upload' | 'digital' | 'both';
}

export interface ContractSubcategory {
  id: string;
  name: string;
  template: string;
  fields: ContractField[];
}

export interface ContractCategory {
  id: string;
  name: string;
  nameHindi: string;
  subcategories: ContractSubcategory[];
}

export const contractCategories: ContractCategory[] = [
  {
    id: 'construction',
    name: 'Construction Contracts',
    nameHindi: 'निर्माण अनुबंध',
    subcategories: [
      {
        id: 'builder-agreement-hindi',
        name: 'Builder Agreement (Hindi Template)',
        template: 'builder-agreement-hindi',
        fields: [
          { key: "contractDate", label: "समझौता तिथि", type: "date", required: true },
          { key: "contractorName", label: "ठेकेदार का नाम", type: "text", required: true },
          { key: "ownerName", label: "मकान मालिक का नाम", type: "text", required: true },
          { key: "projectAddress", label: "परियोजना पता", type: "textarea", required: true },
          { key: "plotOrHouseNumber", label: "प्लॉट/हाउस नंबर", type: "text", required: true },
          { key: "plotAreaSqFt", label: "कुल क्षेत्रफल (वर्ग फुट)", type: "number", required: true, min: 1 },
          { key: "frontageFeet", label: "सामने चौड़ाई (फुट)", type: "number", required: true },
          { key: "depthFeet", label: "गहराई (फुट)", type: "number", required: true },
          { key: "boundaryNorth", label: "उत्तर सीमा", type: "text", required: true },
          { key: "boundarySouth", label: "दक्षिण सीमा", type: "text", required: true },
          { key: "boundaryEast", label: "पूर्व सीमा", type: "text", required: true },
          { key: "boundaryWest", label: "पश्चिम सीमा", type: "text", required: true },
          { key: "totalFloors", label: "मंज़िलों की संख्या", type: "number", required: true },
          { key: "structureType", label: "संरचना प्रकार", type: "select", required: true, options: [{ value: "RCC", label: "RCC" }] },
          { key: "ratePerSqFt", label: "दर (₹/वर्ग फुट)", type: "number", required: true },
          { key: "advanceReceived", label: "एडवांस राशि (₹)", type: "number", required: false },
          { key: "startDate", label: "कार्य आरंभ तिथि", type: "date", required: true },
          { key: "completionDate", label: "समाप्ति तिथि", type: "date", required: true },
          { key: "witness1Name", label: "गवाह 1", type: "text", required: false },
          { key: "witness2Name", label: "गवाह 2", type: "text", required: false },
          { key: "contractorSignature", label: "ठेकेदार के हस्ताक्षर", type: "signature", required: true, signatureType: "both" },
          { key: "ownerSignature", label: "मकान मालिक के हस्ताक्षर", type: "signature", required: true, signatureType: "both" },
          { key: "witness1Signature", label: "गवाह 1 के हस्ताक्षर", type: "signature", required: false, signatureType: "both" },
          { key: "witness2Signature", label: "गवाह 2 के हस्ताक्षर", type: "signature", required: false, signatureType: "both" }
        ]
      }
    ]
  }
];

export const getCategoryById = (id: string) => {
  return contractCategories.find(cat => cat.id === id);
};

export const getSubcategoryById = (categoryId: string, subcategoryId: string) => {
  const category = getCategoryById(categoryId);
  return category?.subcategories.find(sub => sub.id === subcategoryId);
};
