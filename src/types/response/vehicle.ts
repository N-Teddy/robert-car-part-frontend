import type { Vehicle } from '../request/vehicle';

export interface SingleVehicleResponse {
    message: string;
    data: Vehicle;
}

export interface VehicleListResponse {
    message: string;
    data: {
        items: Vehicle[];
        meta: ResponseMeta;
    };
}

// Stats types
export interface VehicleMakeStat {
    make: string;
    count: string;
}

export interface VehicleModelStat {
    model: string;
    count: string;
}

export interface VehicleStatsResponse {
    message: string;
    data: {
        ByMake: VehicleMakeStat[];
        ByModel: VehicleModelStat[];
    };
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
