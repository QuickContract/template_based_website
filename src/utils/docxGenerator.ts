import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

export interface DOCXData {
  subcategoryId: string;
  formData: Record<string, any>;
  template: string;
}

export const generateDOCX = async (data: DOCXData): Promise<Uint8Array> => {
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

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: "Builder Agreement",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 400,
              before: 400
            }
          }),
          ...paragraphs.map(paragraph => 
            new Paragraph({
              children: [
                new TextRun({
                  text: paragraph,
                  size: 24, // 12pt
                  font: "Noto Sans Devanagari"
                })
              ],
              spacing: {
                after: 200,
                before: 0
              }
            })
          )
        ]
      }
    ]
  });

  return new Uint8Array(await Packer.toBuffer(doc));
};

export const downloadDOCX = (docxBuffer: Uint8Array, filename: string) => {
  const blob = new Blob([docxBuffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
