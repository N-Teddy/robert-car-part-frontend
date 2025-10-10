// src/utils/receiptGenerator.ts
import type { OrderResponse } from '../types/response/order';
import { format } from 'date-fns';

// Define the interface properly without the TypeScript error
interface ReceiptOptions {
    companyName?: string;
    companyAddress?: string;
    companyPhone?: string;
    companyEmail?: string;
    companyLogo?: string;
    showBarcode?: boolean;
    currency?: string;
}

export class ReceiptGenerator {
    private defaultOptions: ReceiptOptions = {
        companyName: 'AUTO PARTS STORE',
        companyAddress: '123 Main Street, Douala',
        companyPhone: '+237 6XX XXX XXX',
        companyEmail: 'info@autoparts.cm',
        showBarcode: true,
        currency: 'FCFA',
    };

    constructor(private options: ReceiptOptions = {}) {
        this.options = { ...this.defaultOptions, ...options };
    }

    /**
     * Generate HTML receipt (for display or printing)
     */
    generateHTML(order: OrderResponse): string {
        const subtotal = this.calculateSubtotal(order);
        const discounts = this.calculateDiscounts(order);
        const total = Number(order.totalAmount);

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Receipt - Order #${order.id.slice(0, 8).toUpperCase()}</title>
    <style>
        @page {
            size: 80mm 297mm;
            margin: 0;
        }

        body {
            font-family: 'Courier New', monospace;
            margin: 0;
            padding: 10mm;
            background: white;
            color: black;
            font-size: 12px;
            line-height: 1.4;
        }

        .receipt {
            max-width: 70mm;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            border-bottom: 2px dashed #000;
            padding-bottom: 10px;
            margin-bottom: 10px;
        }

        .company-name {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .company-info {
            font-size: 10px;
            color: #333;
        }

        .title {
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            margin: 10px 0;
        }

        .order-id {
            text-align: center;
            font-size: 11px;
            margin-bottom: 10px;
        }

        .section {
            margin: 10px 0;
            padding: 5px 0;
            border-bottom: 1px solid #ccc;
        }

        .section-title {
            font-weight: bold;
            font-size: 11px;
            margin-bottom: 5px;
        }

        .row {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            margin: 2px 0;
        }

        .item-row {
            margin: 5px 0;
            padding: 3px 0;
        }

        .item-name {
            font-weight: bold;
            font-size: 11px;
        }

        .item-details {
            font-size: 10px;
            color: #555;
            margin-left: 10px;
        }

        .item-price {
            text-align: right;
            font-size: 11px;
        }

        .totals {
            border-top: 2px solid #000;
            margin-top: 10px;
            padding-top: 10px;
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            margin: 3px 0;
        }

        .grand-total {
            font-size: 14px;
            font-weight: bold;
            border-top: 1px solid #000;
            padding-top: 5px;
            margin-top: 5px;
        }

        .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 10px;
            border-top: 2px dashed #000;
            font-size: 10px;
        }

        .barcode {
            margin: 15px auto;
            width: 180px;
            height: 30px;
            background: repeating-linear-gradient(
                90deg,
                #000 0px,
                #000 2px,
                #fff 2px,
                #fff 4px
            );
        }

        .signature-section {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
        }

        .signature-box {
            width: 45%;
            text-align: center;
        }

        .signature-line {
            border-bottom: 1px solid #000;
            margin-bottom: 5px;
            height: 30px;
        }

        .signature-label {
            font-size: 9px;
            color: #555;
        }

        @media print {
            body {
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <div class="receipt">
        <!-- Header -->
        <div class="header">
            <div class="company-name">${this.options.companyName}</div>
            <div class="company-info">
                ${this.options.companyAddress}<br>
                Tel: ${this.options.companyPhone}<br>
                Email: ${this.options.companyEmail}
            </div>
        </div>

        <!-- Title -->
        <div class="title">SALES RECEIPT</div>
        <div class="order-id">#${order.id.slice(0, 8).toUpperCase()}</div>

        <!-- Date & Time -->
        <div class="section">
            <div class="row">
                <span>Date:</span>
                <span>${format(new Date(order.createdAt), 'dd/MM/yyyy')}</span>
            </div>
            <div class="row">
                <span>Time:</span>
                <span>${format(new Date(order.createdAt), 'HH:mm:ss')}</span>
            </div>
        </div>

        <!-- Customer Info -->
        <div class="section">
            <div class="section-title">CUSTOMER:</div>
            <div style="font-size: 11px;">
                ${order.customerName}<br>
                ${order.customerPhone}
                ${order.customerEmail ? `<br>${order.customerEmail}` : ''}
            </div>
        </div>

        <!-- Items -->
        <div class="section">
            <div class="section-title">ITEMS:</div>
            ${order.items
                .map(
                    (item, index) => `
                <div class="item-row">
                    <div class="item-name">${index + 1}. ${item.part.name}</div>
                    <div class="item-details">
                        Part #: ${item.part.partNumber}<br>
                        ${item.quantity} × ${this.formatCurrency(Number(item.unitPrice))}
                        ${Number(item.discount) > 0 ? `<br>Discount: -${this.formatCurrency(Number(item.discount))}` : ''}
                    </div>
                    <div class="item-price">
                        ${this.formatCurrency(Number(item.total))}
                    </div>
                </div>
            `
                )
                .join('')}
        </div>

        <!-- Totals -->
        <div class="totals">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>${this.formatCurrency(subtotal)}</span>
            </div>
            ${
                discounts > 0
                    ? `
                <div class="total-row">
                    <span>Discounts:</span>
                    <span>-${this.formatCurrency(discounts)}</span>
                </div>
            `
                    : ''
            }
            <div class="total-row grand-total">
                <span>TOTAL:</span>
                <span>${this.formatCurrency(total)}</span>
            </div>
        </div>

        <!-- Delivery Method -->
        <div class="section">
            <div class="row">
                <span>Delivery:</span>
                <span>${order.deliveryMethod === 'PICKUP' ? 'STORE PICKUP' : 'SHIPPING'}</span>
            </div>
        </div>

        ${
            order.notes
                ? `
            <!-- Notes -->
            <div class="section">
                <div class="section-title">NOTES:</div>
                <div style="font-size: 10px;">${order.notes}</div>
            </div>
        `
                : ''
        }

        ${
            this.options.showBarcode
                ? `
            <!-- Barcode -->
            <div class="barcode"></div>
            <div style="text-align: center; font-size: 9px;">${order.id}</div>
        `
                : ''
        }

        <!-- Footer -->
        <div class="footer">
            <strong>THANK YOU FOR YOUR PURCHASE!</strong><br>
            Please keep this receipt for your records<br>
            Returns accepted within 7 days with receipt
        </div>

        <!-- Signatures -->
        <div class="signature-section">
            <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">Customer Signature</div>
            </div>
            <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">Authorized Signature</div>
            </div>
        </div>
    </div>
</body>
</html>
        `;
    }

    /**
     * Generate text receipt for thermal printers
     */
    generateText(order: OrderResponse): string {
        const subtotal = this.calculateSubtotal(order);
        const discounts = this.calculateDiscounts(order);
        const total = Number(order.totalAmount);
        const separator = '='.repeat(40);
        const dashedLine = '-'.repeat(40);

        let receipt = '';

        // Header
        receipt += this.centerText(this.options.companyName!, 40) + '\n';
        receipt += this.centerText(this.options.companyAddress!, 40) + '\n';
        receipt += this.centerText(`Tel: ${this.options.companyPhone}`, 40) + '\n';
        receipt += this.centerText(`Email: ${this.options.companyEmail}`, 40) + '\n';
        receipt += separator + '\n';

        // Title
        receipt += this.centerText('SALES RECEIPT', 40) + '\n';
        receipt += this.centerText(`#${order.id.slice(0, 8).toUpperCase()}`, 40) + '\n';
        receipt += dashedLine + '\n';

        // Date & Time
        receipt += `Date: ${format(new Date(order.createdAt), 'dd/MM/yyyy')}`.padEnd(40) + '\n';
        receipt += `Time: ${format(new Date(order.createdAt), 'HH:mm:ss')}`.padEnd(40) + '\n';
        receipt += dashedLine + '\n';

        // Customer
        receipt += 'CUSTOMER:\n';
        receipt += `  ${order.customerName}\n`;
        receipt += `  ${order.customerPhone}\n`;
        if (order.customerEmail) {
            receipt += `  ${order.customerEmail}\n`;
        }
        receipt += dashedLine + '\n';

        // Items
        receipt += 'ITEMS:\n';
        order.items.forEach((item, index) => {
            receipt += `${index + 1}. ${item.part.name}\n`;
            receipt += `   Part #: ${item.part.partNumber}\n`;
            receipt += `   ${item.quantity} x ${this.formatCurrency(Number(item.unitPrice))}`;
            if (Number(item.discount) > 0) {
                receipt += ` - ${this.formatCurrency(Number(item.discount))}`;
            }
            receipt += '\n';
            receipt += `   Total: ${this.formatCurrency(Number(item.total))}\n`;
            receipt += '\n';
        });
        receipt += separator + '\n';

        // Totals
        receipt += `Subtotal:`.padEnd(30) + `${this.formatCurrency(subtotal)}`.padStart(10) + '\n';
        if (discounts > 0) {
            receipt +=
                `Discounts:`.padEnd(30) + `-${this.formatCurrency(discounts)}`.padStart(10) + '\n';
        }
        receipt += separator + '\n';
        receipt += `TOTAL:`.padEnd(30) + `${this.formatCurrency(total)}`.padStart(10) + '\n';
        receipt += separator + '\n';

        // Delivery
        receipt += `Delivery: ${order.deliveryMethod === 'PICKUP' ? 'STORE PICKUP' : 'SHIPPING'}\n`;

        // Notes
        if (order.notes) {
            receipt += dashedLine + '\n';
            receipt += 'NOTES:\n';
            receipt += this.wrapText(order.notes, 40) + '\n';
        }

        // Footer
        receipt += separator + '\n';
        receipt += this.centerText('THANK YOU FOR YOUR PURCHASE!', 40) + '\n';
        receipt += this.centerText('Please keep this receipt', 40) + '\n';
        receipt += this.centerText('Returns accepted within 7 days', 40) + '\n';
        receipt += '\n\n';

        // Signatures
        receipt += '____________________  ____________________\n';
        receipt += 'Customer Signature    Authorized Signature\n';

        return receipt;
    }

    /**
     * Generate PDF receipt using jsPDF
     */
    async generatePDF(order: OrderResponse): Promise<string> {
        try {
            // Dynamically import jsPDF and html2canvas to avoid SSR issues
            const { jsPDF } = await import('jspdf');
            const html2canvas = await import('html2canvas').then((module) => module.default);

            // Create a temporary div to render the HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = this.generateHTML(order);
            tempDiv.style.position = 'absolute';
            tempDiv.style.left = '-9999px';
            tempDiv.style.top = '0';
            tempDiv.style.width = '80mm';
            document.body.appendChild(tempDiv);

            // Convert HTML to canvas
            const canvas = await html2canvas(tempDiv, {
                scale: 2,
                useCORS: true,
                logging: false,
                width: 226, // 80mm in pixels at 96 DPI
                height: tempDiv.scrollHeight,
                windowWidth: 226,
                windowHeight: tempDiv.scrollHeight,
            });

            // Remove temporary div
            document.body.removeChild(tempDiv);

            // Create PDF
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [80, 297], // 80mm width, variable height
            });

            // Add canvas to PDF
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            // Return PDF as base64 string
            return pdf.output('datauristring');
        } catch (error) {
            console.error('Error generating PDF:', error);

            // Fallback: generate a simple text-based PDF
            return this.generateFallbackPDF(order);
        }
    }

    /**
     * Fallback PDF generation without html2canvas
     */
    private async generateFallbackPDF(order: OrderResponse): Promise<string> {
        try {
            const { jsPDF } = await import('jspdf');

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [80, 297],
            });

            // Set font
            pdf.setFont('helvetica');
            pdf.setFontSize(10);

            let yPosition = 10;

            // Header
            pdf.setFontSize(12);
            pdf.text(this.options.companyName!, 40, yPosition, { align: 'center' });
            yPosition += 5;

            pdf.setFontSize(8);
            pdf.text(this.options.companyAddress!, 40, yPosition, { align: 'center' });
            yPosition += 3;
            pdf.text(`Tel: ${this.options.companyPhone}`, 40, yPosition, { align: 'center' });
            yPosition += 3;
            pdf.text(`Email: ${this.options.companyEmail}`, 40, yPosition, { align: 'center' });
            yPosition += 8;

            // Separator
            pdf.line(5, yPosition, 75, yPosition);
            yPosition += 5;

            // Title
            pdf.setFontSize(10);
            pdf.text('SALES RECEIPT', 40, yPosition, { align: 'center' });
            yPosition += 4;
            pdf.text(`#${order.id.slice(0, 8).toUpperCase()}`, 40, yPosition, { align: 'center' });
            yPosition += 8;

            // Date & Time
            pdf.text(`Date: ${format(new Date(order.createdAt), 'dd/MM/yyyy')}`, 5, yPosition);
            yPosition += 4;
            pdf.text(`Time: ${format(new Date(order.createdAt), 'HH:mm:ss')}`, 5, yPosition);
            yPosition += 8;

            // Customer
            pdf.setFont(undefined, 'bold');
            pdf.text('CUSTOMER:', 5, yPosition);
            pdf.setFont(undefined, 'normal');
            yPosition += 4;
            pdf.text(order.customerName, 5, yPosition);
            yPosition += 4;
            pdf.text(order.customerPhone, 5, yPosition);
            if (order.customerEmail) {
                yPosition += 4;
                pdf.text(order.customerEmail, 5, yPosition);
            }
            yPosition += 8;

            // Items
            pdf.setFont(undefined, 'bold');
            pdf.text('ITEMS:', 5, yPosition);
            pdf.setFont(undefined, 'normal');
            yPosition += 6;

            order.items.forEach((item, index) => {
                if (yPosition > 250) {
                    pdf.addPage();
                    yPosition = 10;
                }

                pdf.text(`${index + 1}. ${item.part.name}`, 5, yPosition);
                yPosition += 4;
                pdf.text(`   Part #: ${item.part.partNumber}`, 5, yPosition);
                yPosition += 4;
                pdf.text(
                    `   ${item.quantity} x ${this.formatCurrency(Number(item.unitPrice))}`,
                    5,
                    yPosition
                );
                if (Number(item.discount) > 0) {
                    yPosition += 4;
                    pdf.text(
                        `   Discount: -${this.formatCurrency(Number(item.discount))}`,
                        5,
                        yPosition
                    );
                }
                yPosition += 4;
                pdf.text(`   Total: ${this.formatCurrency(Number(item.total))}`, 5, yPosition);
                yPosition += 6;
            });

            // Totals
            const subtotal = this.calculateSubtotal(order);
            const discounts = this.calculateDiscounts(order);
            const total = Number(order.totalAmount);

            pdf.line(5, yPosition, 75, yPosition);
            yPosition += 6;

            pdf.text(`Subtotal: ${this.formatCurrency(subtotal)}`, 40, yPosition, {
                align: 'right',
            });
            yPosition += 4;

            if (discounts > 0) {
                pdf.text(`Discounts: -${this.formatCurrency(discounts)}`, 40, yPosition, {
                    align: 'right',
                });
                yPosition += 4;
            }

            pdf.setFont(undefined, 'bold');
            pdf.text(`TOTAL: ${this.formatCurrency(total)}`, 40, yPosition, { align: 'right' });
            yPosition += 8;

            // Footer
            pdf.setFont(undefined, 'normal');
            pdf.setFontSize(8);
            pdf.text('THANK YOU FOR YOUR PURCHASE!', 40, yPosition, { align: 'center' });
            yPosition += 4;
            pdf.text('Please keep this receipt for your records', 40, yPosition, {
                align: 'center',
            });
            yPosition += 4;
            pdf.text('Returns accepted within 7 days with receipt', 40, yPosition, {
                align: 'center',
            });

            return pdf.output('datauristring');
        } catch (error) {
            console.error('Error in fallback PDF generation:', error);
            throw new Error('Failed to generate PDF');
        }
    }

    /**
     * Download PDF receipt
     */
    async downloadPDF(order: OrderResponse, filename?: string): Promise<void> {
        try {
            const pdfData = await this.generatePDF(order);

            // Create download link
            const link = document.createElement('a');
            link.href = pdfData;
            link.download = filename || `receipt-${order.id.slice(0, 8)}.pdf`;
            link.click();
        } catch (error) {
            console.error('Error downloading PDF:', error);
            throw new Error('Failed to download PDF');
        }
    }

    /**
     * Print receipt
     */
    printReceipt(order: OrderResponse): void {
        const htmlContent = this.generateHTML(order);
        const printWindow = window.open('', '_blank');

        if (printWindow) {
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            printWindow.focus();

            // Wait for content to load before printing
            printWindow.onload = () => {
                printWindow.print();
                // Don't close immediately - let user cancel print
            };
        }
    }

    /**
     * Helper methods
     */
    private calculateSubtotal(order: OrderResponse): number {
        return order.items.reduce((total, item) => {
            return total + item.quantity * Number(item.unitPrice);
        }, 0);
    }

    private calculateDiscounts(order: OrderResponse): number {
        return order.items.reduce((total, item) => {
            return total + Number(item.discount || 0);
        }, 0);
    }

    private formatCurrency(amount: number): string {
        return `${amount.toLocaleString()} ${this.options.currency}`;
    }

    private centerText(text: string, width: number): string {
        const padding = Math.max(0, Math.floor((width - text.length) / 2));
        return ' '.repeat(padding) + text;
    }

    private wrapText(text: string, width: number): string {
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        words.forEach((word) => {
            if ((currentLine + word).length <= width) {
                currentLine += (currentLine ? ' ' : '') + word;
            } else {
                if (currentLine) lines.push(currentLine);
                currentLine = word;
            }
        });

        if (currentLine) lines.push(currentLine);
        return lines.join('\n');
    }
}

// Export singleton instance with default options
export const receiptGenerator = new ReceiptGenerator();
