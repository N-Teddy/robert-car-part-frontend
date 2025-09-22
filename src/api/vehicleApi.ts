import { apiClient } from '../provider/AxiosClient';
import type {
    CreateVehicleRequest,
    UpdateVehicleRequest,
    Vehicle,
    VehicleFilterDto,
} from '../types/request/vehicle';
import type {
    SingleVehicleResponse,
    VehicleListResponse,
    VehicleMakeStat,
    VehicleModelStat,
    VehicleStatsResponse,
} from '../types/response/vehicle';

// Vehicle API functions
export const vehicleApi = {
    // Create a new vehicle
    create: async (data: CreateVehicleRequest): Promise<Vehicle> => {
        const formData = new FormData();

        // Append fields to form data
        formData.append('make', data.make);
        formData.append('model', data.model);
        formData.append('year', data.year.toString());
        formData.append('vin', data.vin);
        formData.append('description', data.description);
        formData.append('purchasePrice', data.purchasePrice.toString());
        formData.append('purchaseDate', data.purchaseDate);

        if (data.auctionName) formData.append('auctionName', data.auctionName);
        if (data.isPartedOut) formData.append('isPartedOut', data.isPartedOut.toString());

        // Append images if they exist
        if (data.images && data.images.length > 0) {
            data.images.forEach((image) => {
                formData.append('images', image);
            });
        }

        const response = await apiClient.post<SingleVehicleResponse>('/vehicles', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },

    // Get paginated list of vehicles with filters
    getAll: async (filters?: VehicleFilterDto): Promise<{ items: Vehicle[]; meta: any }> => {
        const response = await apiClient.get<VehicleListResponse>('/vehicles', {
            params: filters,
        });
        return response.data.data;
    },

    // Get a specific vehicle
    getById: async (id: string): Promise<Vehicle> => {
        const response = await apiClient.get<SingleVehicleResponse>(`/vehicles/${id}`);
        return response.data.data;
    },

    // Update a vehicle
    update: async (id: string, data: UpdateVehicleRequest): Promise<Vehicle> => {
        const formData = new FormData();

        // Append fields to form data if they exist
        if (data.make) formData.append('make', data.make);
        if (data.model) formData.append('model', data.model);
        if (data.year) formData.append('year', data.year.toString());
        if (data.vin) formData.append('vin', data.vin);
        if (data.description) formData.append('description', data.description);
        if (data.purchasePrice) formData.append('purchasePrice', data.purchasePrice.toString());
        if (data.purchaseDate) formData.append('purchaseDate', data.purchaseDate);
        if (data.auctionName) formData.append('auctionName', data.auctionName);
        if (data.isPartedOut !== undefined)
            formData.append('isPartedOut', data.isPartedOut.toString());

        // Append images if they exist
        if (data.images && data.images.length > 0) {
            data.images.forEach((image) => {
                formData.append('images', image);
            });
        }

        const response = await apiClient.patch<SingleVehicleResponse>(`/vehicles/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },

    // Delete a vehicle
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/vehicles/${id}`);
    },

    // Mark vehicle as parted out
    markAsPartedOut: async (id: string): Promise<Vehicle> => {
        const response = await apiClient.post<SingleVehicleResponse>(`/vehicles/${id}/part-out`);
        return response.data.data;
    },

    // Get vehicle statistics summary
    getStatistics: async (): Promise<any> => {
        const response = await apiClient.get('/vehicles/stats/summary');
        return response.data.data;
    },

    // Get vehicle statistics by make and model
    getMakeModelStatistics: async (): Promise<{
        ByMake: VehicleMakeStat[];
        ByModel: VehicleModelStat[];
    }> => {
        const response = await apiClient.get<VehicleStatsResponse>('/vehicles/stats/make-model');
        return response.data.data;
    },
};
