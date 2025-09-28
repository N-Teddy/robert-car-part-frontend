// src/components/parts/QRScannerModal.tsx
import React, { useEffect, useRef, useState } from 'react';
import { X, Camera, AlertCircle } from 'lucide-react';
import QrScanner from 'qr-scanner';

interface QRScannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onScan: (partId: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose, onScan }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [scanning, setScanning] = useState(false);
    const scannerRef = useRef<QrScanner | null>(null);

    useEffect(() => {
        if (isOpen && videoRef.current) {
            const qrScanner = new QrScanner(
                videoRef.current,
                (result) => {
                    try {
                        const data = JSON.parse(result.data);
                        if (data.partId) {
                            onScan(data.partId);
                            qrScanner.stop();
                        }
                    } catch (e) {
                        setError('Invalid QR code format');
                    }
                },
                {
                    returnDetailedScanResult: true,
                    highlightScanRegion: true,
                    highlightCodeOutline: true,
                }
            );

            scannerRef.current = qrScanner;
            qrScanner
                .start()
                .then(() => {
                    setScanning(true);
                    setError(null);
                })
                .catch((err) => {
                    setError('Camera access denied or not available');
                    console.error(err);
                });

            return () => {
                qrScanner.stop();
                qrScanner.destroy();
            };
        }
    }, [isOpen, onScan]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                                <Camera className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Scan QR Code</h2>
                                <p className="text-sm text-white/80 mt-0.5">
                                    Position the QR code within the frame
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
                    <video ref={videoRef} className="w-full h-full object-cover" />
                    {!scanning && !error && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                                <p className="text-white">Initializing camera...</p>
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
                        Hold the QR code steady within the camera view
                    </p>
                </div>
            </div>
        </div>
    );
};
