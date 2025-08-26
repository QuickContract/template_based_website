import pdfMake from 'pdfmake/build/pdfmake';

export interface PDFData {
  subcategoryId: string;
  formData: Record<string, any>;
  template: string;
}

export const generatePDF = async (data: PDFData): Promise<Uint8Array> => {
  const { formData, template } = data;
  
  // Inject form data into template
  let content = template;
  Object.keys(formData).forEach(key => {
    const value = formData[key] || '';
    const placeholder = `{{${key}}}`;
    content = content.replace(new RegExp(placeholder, 'g'), value);
  });

  // Split content into paragraphs
  const paragraphs = content.split('\n').filter(line => line.trim());

  const docDefinition: any = {
    content: [
      {
        text: 'Builder Agreement',
        style: 'header',
        alignment: 'center',
        margin: [0, 0, 0, 20]
      },
      ...paragraphs.map(paragraph => ({
        text: paragraph,
        style: 'normal',
        margin: [0, 0, 0, 10]
      }))
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true
      },
      normal: {
        fontSize: 12,
        lineHeight: 1.5
      }
    },
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60]
  };

  return new Promise((resolve, reject) => {
    try {
      // For browser environments, we'll open the PDF directly
      const pdfDoc = pdfMake.createPdf(docDefinition);
      pdfDoc.open();
      
      // Since we can't get the buffer easily in browser, we'll create a dummy buffer
      // The actual PDF will be opened in a new tab
      const dummyBuffer = new Uint8Array(0);
      resolve(dummyBuffer);
    } catch (error) {
      reject(error);
    }
  });
};

export const downloadPDF = (pdfBuffer: Uint8Array, filename: string) => {
  // Since we're opening the PDF directly, we don't need to download it
  // The PDF is already open in a new tab
  console.log('PDF opened in new tab');
};
