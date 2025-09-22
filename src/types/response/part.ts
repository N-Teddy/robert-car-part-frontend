import type { Part } from '../request/part';

// Response types
export interface SinglePartResponse {
    message: string;
    data: Part;
}

export interface PartListResponse {
    message: string;
    data: {
        items: Part[];
        meta: ResponseMeta;
    };
}

// Stats types
export interface PartStatsSummary {
    totalParts: number;
    lowStockParts: number;
    outOfStockParts: number;
    totalValue: number;
}

export interface PartStatsSummaryResponse {
    message: string;
    data: PartStatsSummary;
}

export interface CategoryStats {
    categoryName: string;
    count: string;
    totalValue: string;
}

export interface CategoryStatsResponse {
    message: string;
    data: CategoryStats[];
}

export interface LowStockPartsResponse {
    message: string;
    data: Part[];
}

// Reusable meta interface
export interface ResponseMeta {
    total: number;
    page: string;
    limit: string;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
