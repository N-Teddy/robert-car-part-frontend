// src/components/ui/Select.tsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    placeholder?: string;
    'aria-label'?: string;
}

interface SelectTriggerProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    'aria-label'?: string;
}

interface SelectContentProps {
    children: React.ReactNode;
    className?: string;
}

interface SelectItemProps {
    value: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

interface SelectValueProps {
    children?: React.ReactNode;
    placeholder?: string;
}

// Type guards to check if a React element is a specific component
const isSelectContent = (
    element: React.ReactNode
): element is React.ReactElement<SelectContentProps> => {
    return React.isValidElement(element) && (element.type as any).displayName === 'SelectContent';
};

const isSelectItem = (element: React.ReactNode): element is React.ReactElement<SelectItemProps> => {
    return React.isValidElement(element) && (element.type as any).displayName === 'SelectItem';
};

// Add display names to components for easier identification
export const Select: React.FC<SelectProps> & { displayName: string } = ({
    value,
    onValueChange,
    children,
    className = '',
    disabled = false,
    placeholder = 'Select...',
    'aria-label': ariaLabel,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    // Find the selected item's display value
    const findSelectedLabel = () => {
        if (!value) return placeholder;

        // Find SelectContent component
        const contentElement = React.Children.toArray(children).find(isSelectContent);

        if (contentElement && React.isValidElement(contentElement)) {
            // Find SelectItem children within SelectContent
            const items = React.Children.toArray(contentElement.props.children).filter(
                isSelectItem
            );

            const selectedItem = items.find(
                (item: React.ReactElement<SelectItemProps>) => item.props.value === value
            );

            return selectedItem ? selectedItem.props.children : placeholder;
        }

        return placeholder;
    };

    const handleItemClick = (itemValue: string) => {
        onValueChange?.(itemValue);
        setIsOpen(false);
    };

    const handleTriggerClick = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={selectRef}>
            <SelectTrigger
                onClick={handleTriggerClick}
                aria-label={ariaLabel}
                className={disabled ? 'opacity-50 cursor-not-allowed' : ''}
            >
                <SelectValue placeholder={placeholder}>{findSelectedLabel()}</SelectValue>
                <ChevronDown
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </SelectTrigger>

            {isOpen && (
                <SelectContent>
                    {React.Children.map(children, (child) => {
                        if (isSelectContent(child)) {
                            return React.cloneElement(child, {
                                children: React.Children.map(child.props.children, (item) => {
                                    if (isSelectItem(item)) {
                                        return React.cloneElement(item, {
                                            onClick: () => handleItemClick(item.props.value),
                                            className: `${
                                                item.props.value === value
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : ''
                                            } ${item.props.className || ''}`,
                                        });
                                    }
                                    return item;
                                }),
                            });
                        }
                        return child;
                    })}
                </SelectContent>
            )}
        </div>
    );
};
Select.displayName = 'Select';

export const SelectTrigger: React.FC<SelectTriggerProps> & { displayName: string } = ({
    children,
    className = '',
    onClick,
    'aria-label': ariaLabel,
}) => {
    return (
        <button
            className={`flex items-center justify-between w-full rounded border border-gray-300 px-3 py-2 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            onClick={onClick}
            aria-label={ariaLabel}
            type="button"
        >
            {children}
        </button>
    );
};
SelectTrigger.displayName = 'SelectTrigger';

export const SelectValue: React.FC<SelectValueProps> & { displayName: string } = ({
    children,
    placeholder = 'Select...',
}) => {
    return <span className="truncate">{children || placeholder}</span>;
};
SelectValue.displayName = 'SelectValue';

export const SelectContent: React.FC<SelectContentProps> & { displayName: string } = ({
    children,
    className = '',
}) => {
    return (
        <div
            className={`absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto ${className}`}
        >
            <div className="py-1">{children}</div>
        </div>
    );
};
SelectContent.displayName = 'SelectContent';

export const SelectItem: React.FC<SelectItemProps> & { displayName: string } = ({
    value,
    children,
    className = '',
    onClick,
    ...props
}) => {
    return (
        <div
            className={`px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
};
SelectItem.displayName = 'SelectItem';

// Additional component for simple select usage (without the complex structure)
interface SimpleSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    children: React.ReactNode;
    className?: string;
}

export const SimpleSelect: React.FC<SimpleSelectProps> = ({
    children,
    className = '',
    ...props
}) => {
    return (
        <select
            className={`w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
        >
            {children}
        </select>
    );
};

export const SimpleSelectItem: React.FC<React.OptionHTMLAttributes<HTMLOptionElement>> = (
    props
) => {
    return <option {...props} />;
};
