// src/components/orders/QRScannerModal.tsx
import React, { useEffect, useRef, useState } from 'react';
import { X, Camera, AlertCircle, CheckCircle } from 'lucide-react';
import QrScanner from 'qr-scanner';

interface QRScannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onScan: (data: string) => void;
    stayOpen?: boolean;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
    isOpen,
    onClose,
    onScan,
    stayOpen = false,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [scanning, setScanning] = useState(false);
    const [lastScanned, setLastScanned] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const scannerRef = useRef<QrScanner | null>(null);

    useEffect(() => {
        if (isOpen && videoRef.current) {
            const qrScanner = new QrScanner(
                videoRef.current,
                (result) => {
                    // Prevent duplicate scans of the same code
                    if (result.data !== lastScanned) {
                        setLastScanned(result.data);
                        setShowSuccess(true);
                        onScan(result.data);

                        // Show success feedback
                        setTimeout(() => {
                            setShowSuccess(false);
                            if (!stayOpen) {
                                qrScanner.stop();
                                onClose();
                            }
                        }, 1500);
                    }
                },
                {
                    returnDetailedScanResult: true,
                    highlightScanRegion: true,
                    highlightCodeOutline: true,
                }
            );

            scannerRef.current = qrScanner;
            qrScanner.start().then(() => {
                setScanning(true);
                setError(null);
            }).catch((err) => {
                setError('Camera access denied or not available');
                console.error(err);
            });

            return () => {
                qrScanner.stop();
                qrScanner.destroy();
            };
        }
    }, [isOpen, onScan, stayOpen, lastScanned, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                                <Camera className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    Scan Part QR Code
                                </h2>
                                <p className="text-sm text-white/80 mt-0.5">
                                    {stayOpen ? 'Scan multiple parts' : 'Position QR code in frame'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Scanner Area */}
                <div className="relative bg-black aspect-square">
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                    />

                    {/* Success Overlay */}
                    {showSuccess && (
                        <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-sm">
                            <div className="bg-white rounded-full p-4 shadow-lg">
                                <CheckCircle className="w-12 h-12 text-green-500" />
                            </div>
                        </div>
                    )}

                    {!scanning && !error && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                                <p className="text-white">Initializing camera...</p>
                            </div>
                        </div>
                    )}

                    {/* Scan Guide */}
                    {scanning && !showSuccess && (
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-64 h-64 border-2 border-white/50 rounded-lg">
                                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-4 bg-red-50 border-t border-red-200">
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    </div>
                )}

                {/* Instructions */}
                <div className="p-4 bg-gray-50">
                    <p className="text-sm text-gray-600 text-center">
                        {stayOpen
                            ? 'Scanner will stay open for multiple scans. Click X to close.'
                            : 'Hold the QR code steady within the camera view'}
                    </p>
                    {lastScanned && stayOpen && (
                        <p className="text-xs text-green-600 text-center mt-2">
                            Last scanned: Part added to order
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};