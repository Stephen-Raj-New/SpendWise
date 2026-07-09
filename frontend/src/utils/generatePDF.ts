import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PDFExportOptions {
  title: string;
  filename: string;
  headers: string[];
  data: any[][];
}

export const generatePDF = ({ title, filename, headers, data }: PDFExportOptions) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  // Date Generated
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

  // Table
  autoTable(doc, {
    startY: 36,
    head: [headers],
    body: data,
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235] }, // blue-600
    styles: { fontSize: 10, cellPadding: 4 },
  });

  doc.save(`${filename}.pdf`);
};
