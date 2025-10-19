import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TableRow } from '@mui/material';
import React, { forwardRef } from 'react';

interface SortableTableRowProps {
    id: string | number;
    children: React.ReactNode;

}

export const SortableTableRow = forwardRef<HTMLTableRowElement, SortableTableRowProps>(
    ({ id, children }, ref) => {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging,
        } = useSortable({
            id,
            data: {
                type: 'row'
            }
        });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
            opacity: isDragging ? 0.5 : 1,
        };

        return (
            <TableRow
                ref={setNodeRef}
                style={style}
            >
                {React.Children.map(children, (child, index) => {
                    if (index === 0) {
                        const childElement = child as React.ReactElement;
                        return React.cloneElement(childElement, {
                            children: React.cloneElement(childElement.props.children, {
                                ...childElement.props.children.props,
                                ...attributes,
                                ...listeners,
                                'data-handle': true
                            })
                        });
                    }
                    return child;
                })}
            </TableRow>
        );
    }
);