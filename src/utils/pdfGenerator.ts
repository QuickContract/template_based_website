import * as pdfMake from 'pdfmake/build/pdfmake';

// Function to create a font provider that loads fonts from external URLs
const createFontProvider = () => {
  const fontCache: { [key: string]: ArrayBuffer } = {};

  const loadFont = async (url: string): Promise<ArrayBuffer> => {
    if (fontCache[url]) {
      return fontCache[url];
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load font: ${url}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    fontCache[url] = arrayBuffer;
    return arrayBuffer;
  };

  return {
    getNormalFont: () => loadFont('/fonts/NotoSerifDevanagari-Regular.ttf'),
    getBoldFont: () => loadFont('/fonts/NotoSerifDevanagari-Bold.ttf'),
    getItalicsFont: () => loadFont('/fonts/NotoSerifDevanagari-Regular.ttf'),
    getBoldItalicsFont: () => loadFont('/fonts/NotoSerifDevanagari-Bold.ttf'),
  };
};

// Configure pdfmake with external fonts
const configurePDFMake = async () => {
  try {
    const fontProvider = createFontProvider();

    // Create a custom VFS with the font data
    (pdfMake as any).vfs = {
      'NotoSerifDevanagari-Regular.ttf': await fontProvider.getNormalFont(),
      'NotoSerifDevanagari-Bold.ttf': await fontProvider.getBoldFont(),
    };

    // Register the fonts
    (pdfMake as any).fonts = {
      NotoSerif: {
        normal: 'NotoSerifDevanagari-Regular.ttf',
        bold: 'NotoSerifDevanagari-Bold.ttf',
        italics: 'NotoSerifDevanagari-Regular.ttf',
        bolditalics: 'NotoSerifDevanagari-Bold.ttf'
      },
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
      }
    };

    console.log('PDFMake configured successfully with NotoSerifDevanagari fonts');
  } catch (error) {
    console.error('Failed to configure PDFMake:', error);
    // Fallback to default fonts if external fonts fail
    (pdfMake as any).fonts = {
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
      }
    };
  }
};

// Initialize pdfmake configuration
let isPDFMakeConfigured = false;

export const initializePDFMake = async (): Promise<void> => {
  if (isPDFMakeConfigured) return;
  
  await configurePDFMake();
  isPDFMakeConfigured = true;
};

export interface PDFData {
  subcategoryId: string;
  formData: Record<string, any>;
  template: string;
}

// Helper function
const createUnderlinedText = (value: string, placeholder: string) => {
  if (!value || value.trim() === '') {
    return {
      text: '.............................',
      decoration: 'underline',
      decorationStyle: 'dotted'
    };
  }
  
  return {
    text: value,
    decoration: 'underline',
    decorationStyle: 'dotted'
  };
};

// Process template
const processTemplate = (template: string, formData: Record<string, any>) => {
  const lines = template.split('\n');
  const content: any[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.trim() === '') {
      content.push({ text: ' ', margin: [0, 5, 0, 5] });
      continue;
    }
    
    const placeholderRegex = /\{\{([^}]+)\}\}/g;
    const placeholders = line.match(placeholderRegex);
    
    if (placeholders && placeholders.length > 0) {
      const parts: any[] = [];
      let lastIndex = 0;
      let match;
      
      while ((match = placeholderRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          const textBefore = line.substring(lastIndex, match.index);
          parts.push({ text: textBefore });
        }
        
        const placeholder = match[1];
        const value = formData[placeholder] || '';
        parts.push(createUnderlinedText(value, placeholder));
        lastIndex = match.index + match[0].length;
      }
      
      if (lastIndex < line.length) {
        const remainingText = line.substring(lastIndex);
        parts.push({ text: remainingText });
      }
      
      content.push({
        text: parts,
        fontSize: 12,
        margin: [0, 3, 0, 3],
        lineHeight: 1.3
      });
    } else {
      let fontSize = 12;
      let alignment: 'left' | 'center' | 'right' | 'justify' = 'left';
      let margin: [number, number, number, number] = [0, 3, 0, 3];
      let bold = false;
      
      if (line.includes('!! श्री !!') || line.includes('::- निर्माण अनुबंध-पत्र -::')) {
        fontSize = 16;
        alignment = 'center';
        margin = [0, 10, 0, 15];
        bold = true;
      } else if (line.includes('हस्ताक्षर') || line.includes('गवाह')) {
        fontSize = 14;
        margin = [0, 20, 0, 10];
        bold = true;
      } else if (line.startsWith('01.') || line.startsWith('02.') || line.match(/^\d+\./)) {
        margin = [0, 8, 0, 5];
        bold = true;
      }
      
      content.push({
        text: line,
        fontSize,
        alignment,
        margin,
        bold,
        lineHeight: 1.3
      });
    }
  }
  
  return content;
};

export const generatePDF = async (data: PDFData): Promise<Uint8Array> => {
  // Ensure pdfmake is configured first
  await initializePDFMake();
  
  const { formData, template } = data;
  const processedContent = processTemplate(template, formData);

  const docDefinition: any = {
    content: processedContent,
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    defaultStyle: {
      font: 'NotoSerif',  // Changed from NotoSans to NotoSerif
      fontSize: 12,
      lineHeight: 1.3
    },
    styles: {
      header: {
        fontSize: 16,
        bold: true,
        alignment: 'center',
        margin: [0, 10, 0, 15]
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 8, 0, 5]
      },
      signature: {
        fontSize: 12,
        margin: [0, 20, 0, 10]
      }
    }
  };

  return new Promise((resolve, reject) => {
    try {
      const pdfDoc = pdfMake.createPdf(docDefinition);
      pdfDoc.getBlob(async (blob: Blob) => {
        try {
          const arrayBuffer = await blob.arrayBuffer();
          resolve(new Uint8Array(arrayBuffer));
        } catch (error) {
          reject(new Error('Failed to convert blob to array buffer'));
        }
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      reject(error);
    }
  });
};

export const openPDFInNewTab = async (data: PDFData): Promise<void> => {
  // Ensure pdfmake is configured first
  await initializePDFMake();
  
  const { formData, template } = data;
  const processedContent = processTemplate(template, formData);

  const docDefinition: any = {
    content: processedContent,
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    defaultStyle: {
      font: 'NotoSerif',  // Changed from NotoSans to NotoSerif
      fontSize: 12,
      lineHeight: 1.3
    }
  };

  try {
    const pdfDoc = pdfMake.createPdf(docDefinition);
    pdfDoc.open();
  } catch (error) {
    console.error('Failed to open PDF:', error);
    throw error;
  }
};

export const downloadPDF = (pdfBuffer: Uint8Array, filename: string) => {
  const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Optional: Function to check if NotoSerif fonts are available
export const isNotoSerifAvailable = (): boolean => {
  return !!(pdfMake as any).fonts?.NotoSerif;
};

// Initialize when the module is loaded
initializePDFMake().catch(console.error);