import React, { useRef, useLayoutEffect, forwardRef, useImperativeHandle } from 'react';

type AutoGrowTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const AutoGrowTextarea = forwardRef<HTMLTextAreaElement, AutoGrowTextareaProps>(
    (props, ref) => {
        const internalTextareaRef = useRef<HTMLTextAreaElement>(null);

        useImperativeHandle(ref, () => internalTextareaRef.current!, []);

        // Adjust height on value change
        useLayoutEffect(() => {
            const textarea = internalTextareaRef.current;
            if (textarea) {
                // Reset height to 0 to force recalculation of scrollHeight, fixing layout bugs
                textarea.style.height = '0px'; 
                const scrollHeight = textarea.scrollHeight;
                textarea.style.height = scrollHeight + 'px';
            }
        }, [props.value]);

        return (
            <textarea
                ref={internalTextareaRef}
                rows={1} // Start with a single row
                {...props}
                style={{ ...props.style, overflowY: 'auto' }} // Show scrollbar when needed
            />
        );
    }
);

AutoGrowTextarea.displayName = 'AutoGrowTextarea';
