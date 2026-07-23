import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PDFExportOptions {
  title: string;
  filename: string;
  headers: string[];
  data: any[][];
  userInfo?: {
    name: string;
    email: string;
    mobile?: string;
  };
}

export const generatePDF = ({ title, filename, headers, data, userInfo }: PDFExportOptions) => {
  const doc = new jsPDF();
  
  // Title & Header Background
  doc.setFillColor(37, 99, 235); // blue-600
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text(title, 14, 25);
  
  // User Info Block
  if (userInfo) {
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`Prepared for:`, 14, 50);
    doc.setFont(undefined, 'bold');
    doc.text(userInfo.name, 14, 56);
    doc.setFont(undefined, 'normal');
    doc.text(userInfo.email, 14, 62);
    if (userInfo.mobile) {
      doc.text(userInfo.mobile, 14, 68);
    }
  }

  // Date Generated
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, userInfo ? 78 : 50);

  // Table
  autoTable(doc, {
    startY: userInfo ? 85 : 55,
    head: [headers],
    body: data,
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235] }, // blue-600
    styles: { fontSize: 10, cellPadding: 4 },
  });

  doc.save(`${filename}.pdf`);
};
