// src/utils/formatCurrency.ts
export function formatCurrency(value: number | string): string {
    const num = typeof value === 'string' ? Number(value) : value;
    if (isNaN(num)) return '0 FCFA';
    return num.toLocaleString('fr-FR') + ' FCFA';
}
