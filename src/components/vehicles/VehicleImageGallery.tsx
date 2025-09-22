// src/components/vehicles/VehicleImageGallery.tsx
import React, { useState } from 'react';

interface VehicleImage {
    id: string;
    url: string;
    alt?: string;
}

interface VehicleImageGalleryProps {
    images: VehicleImage[];
}

export const VehicleImageGallery: React.FC<VehicleImageGalleryProps> = ({ images }) => {
    const [zoomIndex, setZoomIndex] = useState<number | null>(null);

    if (images.length === 0) {
        return <p className="text-gray-500">No images available.</p>;
    }

    const openZoom = (index: number) => {
        setZoomIndex(index);
    };

    const closeZoom = () => {
        setZoomIndex(null);
    };

    const prevImage = () => {
        if (zoomIndex === null) return;
        setZoomIndex((zoomIndex - 1 + images.length) % images.length);
    };

    const nextImage = () => {
        if (zoomIndex === null) return;
        setZoomIndex((zoomIndex + 1) % images.length);
    };

    return (
        <>
            {/* Thumbnails */}
            <div className="flex flex-wrap gap-3">
                {images.map((img, idx) => (
                    <button
                        key={img.id}
                        onClick={() => openZoom(idx)}
                        className="w-24 h-24 rounded overflow-hidden border focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label={`View image ${idx + 1}`}
                    >
                        <img
                            src={img.url}
                            alt={img.alt || `Vehicle image ${idx + 1}`}
                            className="object-cover w-full h-full"
                            loading="lazy"
                        />
                    </button>
                ))}
            </div>

            {/* Zoom Modal */}
            {zoomIndex !== null && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                    onClick={closeZoom}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Vehicle image zoom view"
                >
                    <div
                        className="relative max-w-4xl max-h-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={images[zoomIndex].url}
                            alt={images[zoomIndex].alt || `Vehicle image ${zoomIndex + 1}`}
                            className="max-w-full max-h-[80vh] rounded"
                        />
                        {/* Close button */}
                        <button
                            onClick={closeZoom}
                            className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-75 focus:outline-none"
                            aria-label="Close zoom view"
                        >
                            ×
                        </button>
                        {/* Navigation */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 focus:outline-none"
                                    aria-label="Previous image"
                                >
                                    ‹
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 focus:outline-none"
                                    aria-label="Next image"
                                >
                                    ›
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
