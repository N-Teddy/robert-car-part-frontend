// Image interface
export interface VehicleImage {
    id: string;
    url: string;
    publicId: string;
    format: string;
}

// Base Vehicle interface
export interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    vin: string;
    description: string;
    purchasePrice: string; // Stored as string in response
    purchaseDate: string; // YYYY-MM-DD format
    auctionName?: string;
    isPartedOut: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    images: VehicleImage[];
}

// Request types
export interface CreateVehicleRequest {
    images?: File[] | Blob[] | any[];
    make: string;
    model: string;
    year: number;
    vin: string;
    description: string;
    purchasePrice: number; // Sent as number in request
    purchaseDate: string; // YYYY-MM-DD format
    auctionName?: string;
    isPartedOut?: boolean;
}

export type UpdateVehicleRequest = Partial<CreateVehicleRequest>;

export interface VehicleFilterDto {
    make?: string;
    model?: string;
    year?: number;
    vin?: string;
    isPartedOut?: boolean;
    isActive?: boolean;
    minYear?: number;
    maxYear?: number;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
}
