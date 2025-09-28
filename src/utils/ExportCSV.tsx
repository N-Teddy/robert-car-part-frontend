// src/utils/ExportCSV.tsx
import React from 'react';

interface ExportCSVProps {
    data: any[];
    filename: string;
    children: React.ReactNode;
}

export const ExportCSV: React.FC<ExportCSVProps> = ({ data, filename, children }) => {
    const handleExport = () => {
        if (!data || data.length === 0) return;
        const csvRows = [];
        const headers = Object.keys(data[0]);
        csvRows.push(headers.join(','));
        for (const row of data) {
            const values = headers.map((header) => {
                const escaped = ('' + row[header]).replace(/"/g, '""');
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
