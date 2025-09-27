export interface PartImage {
    id: string;
    url: string;
    publicId: string;
    format: string;
}

export interface Part {
    id: string;
    name: string;
    description: string;
    price: string; // Stored as string in response
    quantity: number;
    condition: string | null;
    partNumber: string;
    vehicleId: string;
    categoryId: string;
    createdAt: string;
    updatedAt: string;
    qrCodeUrl: string;
    images: PartImage[];
}

export interface CreatePartRequest {
    images?: File[] | Blob[];
    name: string;
    description: string;
    price: number; // Sent as number in request
    quantity: number;
    condition?: string | null;
    partNumber: string;
    vehicleId: string;
    categoryId: string;
}

export type UpdatePartRequest = Partial<CreatePartRequest>;

export interface PartFilterDto {
    name?: string;
    partNumber?: string;
    vehicleId?: string;
    categoryId?: string;
    condition?: string;
    minPrice?: number;
    maxPrice?: number;
    minQuantity?: number;
    maxQuantity?: number;
    lowStock?: boolean;
    outOfStock?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
}


// src/types/request/part.ts
export interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    vin?: string;
}

export interface Category {
    id: string;
    name: string;
    description?: string;
}

export interface PartImage {
    id: string;
    url: string;
    publicId: string;
    format: string;
}

export interface Part {
    id: string;
    name: string;
    description: string;
    price: string;
    quantity: number;
    condition: string | null;
    partNumber: string;
    vehicleId: string;
    categoryId: string;
    vehicle?: Vehicle; // Optional nested object
    category?: Category; // Optional nested object
    createdAt: string;
    updatedAt: string;
    qrCodeUrl: string;
    images: PartImage[];
}
