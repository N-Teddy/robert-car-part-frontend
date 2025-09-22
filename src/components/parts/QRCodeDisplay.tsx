// src/components/parts/QRCodeDisplay.tsx
import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Download, Printer } from 'lucide-react';

interface QRCodeDisplayProps {
    partId: string;
    name: string;
    price: string;
    createdAt: string;
    size?: number;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
    partId,
    name,
    price,
    createdAt,
    size = 300,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const qrData = JSON.stringify({
                partId,
                name,
                price,
                createdAt,
            });

            QRCode.toCanvas(canvasRef.current, qrData, {
                width: size,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF',
                },
            });
        }
    }, [partId, name, price, createdAt, size]);

    const handleDownload = () => {
        if (canvasRef.current) {
            const url = canvasRef.current.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = url;
            link.download = `part_${partId}_qr.png`;
            link.click();
        }
    };

    const handlePrint = () => {
        if (canvasRef.current) {
            const url = canvasRef.current.toDataURL('image/png');
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>QR Code - ${name}</title>
                            <style>
                                body {
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    height: 100vh;
                                    margin: 0;
                                    flex-direction: column;
                                }
                                h3 { margin-bottom: 20px; }
                            </style>
                        </head>
                        <body>
                            <h3>${name} - #${partId.slice(0, 8)}</h3>
                            <img src="${url}" />
                        </body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.print();
            }
        }
    };

    return (
        <div className="flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <canvas ref={canvasRef} className="border-2 border-gray-300 rounded-lg" />
            <div className="mt-3 flex space-x-2">
                <button
                    onClick={handleDownload}
                    className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 flex items-center"
                >
                    <Download size={14} className="mr-1" />
                    Download
                </button>
                <button
                    onClick={handlePrint}
                    className="px-3 py-1.5 bg-gray-600 text-white text-xs rounded-lg hover:bg-gray-700 flex items-center"
                >
                    <Printer size={14} className="mr-1" />
                    Print
                </button>
            </div>
        </div>
    );
};
