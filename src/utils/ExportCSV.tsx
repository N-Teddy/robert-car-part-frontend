// src/utils/ExportCSV.tsx
import React from 'react';

type Row = Record<string, unknown>;

interface ExportCSVProps {
    data: Row[];
    filename: string;
    children: React.ReactNode;
}

export const ExportCSV: React.FC<ExportCSVProps> = ({ data, filename, children }) => {
    const handleExport = () => {
        if (!data || data.length === 0) return;
        const csvRows: string[] = [];
        const headers = Object.keys(data[0]);
        csvRows.push(headers.join(','));
        for (const row of data) {
            const values = headers.map((header) => {
                const value = row[header];
                const normalized =
                    value === null || value === undefined
                        ? ''
                        : typeof value === 'object'
                          ? JSON.stringify(value)
                          : String(value);
                const escaped = normalized.replace(/"/g, '""');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        }
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <span
            onClick={handleExport}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleExport();
                }
            }}
        >
            {children}
        </span>
    );
};
