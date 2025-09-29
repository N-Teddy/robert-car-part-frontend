// src/components/parts/PartDeleteModal.tsx
import React from 'react';
import { AlertTriangle, X, Trash2, Package } from 'lucide-react';
import type { Part } from '../../types/request/part';
import { formatCurrency } from '../../utils/formatCurrency';

interface PartDeleteModalProps {
    isOpen: boolean;
    part: Part | null;
    onClose: () => void;
    onConfirm: () => void;
}

export const PartDeleteModal: React.FC<PartDeleteModalProps> = ({
    isOpen,
    part,
    onClose,
    onConfirm,
}) => {
    if (!isOpen || !part) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden bg-white rounded-lg shadow-xl">
                {/* Header */}
                <div className="px-6 py-6 bg-red-50">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                        <div className="flex-1 ml-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Confirm Delete Part
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                                This action cannot be undone. Please confirm your decision.
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="ml-4 text-gray-400 hover:text-gray-500"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                    <div className="p-4 rounded-lg bg-gray-50">
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                {part.images && part.images.length > 0 ? (
                                    <img
                                        src={part.images[0].url}
                                        alt={part.name}
                                        className="object-cover w-16 h-16 rounded-lg"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-lg">
                                        <Package className="w-8 h-8 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900">{part.name}</p>
                                <p className="text-sm text-gray-600">Part #: {part.partNumber}</p>
                                <p className="mt-1 text-xs text-gray-500">
                                    Stock: {part.quantity} units • {formatCurrency(part.price)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 mt-4 border rounded-lg bg-amber-50 border-amber-200">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertTriangle className="w-5 h-5 text-amber-600" />
                            </div>
                            <div className="ml-3">
                                <h4 className="text-sm font-medium text-amber-800">Warning</h4>
                                <div className="mt-1 text-sm text-amber-700">
                                    <p>Deleting this part will:</p>
                                    <ul className="mt-1 list-disc list-inside">
                                        <li>Remove all part information</li>
                                        <li>Delete all associated images</li>
                                        <li>Remove from inventory tracking</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end px-6 py-4 space-x-3 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                    >
                        <Trash2 className="inline w-4 h-4 mr-1" />
                        Delete Part
                    </button>
                </div>
            </div>
        </div>
    );
};
