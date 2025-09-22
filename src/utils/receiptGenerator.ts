// src/utils/receiptGenerator.ts
import type { OrderResponse } from '../types/response/order';
import { format } from 'date-fns';

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
     * Generate HTML receipt
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
            ${order.items.map((item, index) => `
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
            `).join('')}
        </div>

        <!-- Totals -->
        <div class="totals">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>${this.formatCurrency(subtotal)}</span>
            </div>
            ${discounts > 0 ? `
                <div class="total-row">
                    <span>Discounts:</span>
                    <span>-${this.formatCurrency(discounts)}</span>
                </div>
            ` : ''}
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

        ${order.notes ? `
            <!-- Notes -->
            <div class="section">
                <div class="section-title">NOTES:</div>
                <div style="font-size: 10px;">${order.notes}</div>
            </div>
        ` : ''}

        ${this.options.showBarcode ? `
            <!-- Barcode -->
            <div class="barcode"></div>
            <div style="text-align: center; font-size: 9px;">${order.id}</div>
        ` : ''}

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
            receipt += `Discounts:`.padEnd(30) + `-${this.formatCurrency(discounts)}`.padStart(10) + '\n';
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
     * Generate PDF receipt (returns base64 string)
     * Note: This requires a PDF library like jsPDF
     */
    async generatePDF(order: OrderResponse): Promise<string> {
        // This is a placeholder - you would need to implement with a PDF library
        // For now, we'll return the HTML which can be converted to PDF
        const html = this.generateHTML(order);

        // Convert HTML to PDF using a library like jsPDF or puppeteer
        // Return base64 encoded PDF

        return btoa(html); // Placeholder: returns base64 encoded HTML
    }

    /**
     * Helper methods
     */
    private calculateSubtotal(order: OrderResponse): number {
        return order.items.reduce((total, item) => {
            return total + (item.quantity * Number(item.unitPrice));
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

        words.forEach(word => {
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