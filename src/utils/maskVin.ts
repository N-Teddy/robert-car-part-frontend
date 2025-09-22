// src/utils/maskVIN.ts
export function maskVIN(vin: string): string {
    if (vin.length <= 6) return vin;
    return vin.slice(0, 3) + '***' + vin.slice(-3);
}