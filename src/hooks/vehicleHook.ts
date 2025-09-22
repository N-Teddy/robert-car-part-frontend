// src/hooks/vehicleHook.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import type {
    CreateVehicleRequest,
    UpdateVehicleRequest,
    Vehicle,
    VehicleFilterDto,
} from '../types/request/vehicle';
import { vehicleApi } from '../api/vehicleApi';
import type { VehicleMakeStat, VehicleModelStat } from '../types/response/vehicle';

/**
 * Custom hook for managing vehicle-related API calls using React Query.
 */
export const useVehicle = () => {
    // Mutation for creating a vehicle
    const useCreateVehicle = () => {
        return useMutation<Vehicle, Error, CreateVehicleRequest>({
            mutationFn: vehicleApi.create,
        });
    };

    // Query for fetching all vehicles
    const useGetAllVehicles = (filters?: VehicleFilterDto) => {
        return useQuery<{ items: Vehicle[]; meta: any }, Error>({
            queryKey: ['vehicles', 'list', filters],
            queryFn: () => vehicleApi.getAll(filters),
        });
    };

    // Query for fetching a specific vehicle
    const useGetVehicleById = (id: string) => {
        return useQuery<Vehicle, Error>({
            queryKey: ['vehicle', 'detail', id],
            queryFn: () => vehicleApi.getById(id),
            enabled: !!id,
        });
    };

    // Mutation for updating a vehicle
    const useUpdateVehicle = () => {
        return useMutation<Vehicle, Error, { id: string; data: UpdateVehicleRequest }>({
            mutationFn: ({ id, data }) => vehicleApi.update(id, data),
        });
    };

    // Mutation for deleting a vehicle
    const useDeleteVehicle = () => {
        return useMutation<void, Error, string>({
            mutationFn: vehicleApi.delete,
        });
    };

    // Mutation for marking vehicle as parted out
    const useMarkAsPartedOut = () => {
        return useMutation<Vehicle, Error, string>({
            mutationFn: vehicleApi.markAsPartedOut,
        });
    };

    // Query for vehicle statistics summary
    const useGetVehicleStatistics = () => {
        return useQuery<any, Error>({
            queryKey: ['vehicles', 'stats', 'summary'],
            queryFn: vehicleApi.getStatistics,
        });
    };

    // Query for vehicle make/model statistics
    const useGetMakeModelStatistics = () => {
        return useQuery<{ ByMake: VehicleMakeStat[]; ByModel: VehicleModelStat[] }, Error>({
            queryKey: ['vehicles', 'stats', 'make-model'],
            queryFn: vehicleApi.getMakeModelStatistics,
        });
    };

    return {
        useCreateVehicle,
        useGetAllVehicles,
        useGetVehicleById,
        useUpdateVehicle,
        useDeleteVehicle,
        useMarkAsPartedOut,
        useGetVehicleStatistics,
        useGetMakeModelStatistics,
    };
};
