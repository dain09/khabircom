import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

type AutoGrowTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

// Fix: Wrap the component with `forwardRef` to allow parent components to pass a ref.
export const AutoGrowTextarea = forwardRef<HTMLTextAreaElement, AutoGrowTextareaProps>(
    (props, ref) => {
        const internalTextareaRef = useRef<HTMLTextAreaElement>(null);

        // Expose the internal ref to the parent component's ref using useImperativeHandle.
        // This allows parent components (like Chat.tsx) to call methods like .focus() on the textarea.
        useImperativeHandle(ref, () => internalTextareaRef.current!, []);

        // Adjust height on value change
        useEffect(() => {
            const textarea = internalTextareaRef.current;
            if (textarea) {
                textarea.style.height = 'auto'; // Reset height to recalculate
                textarea.style.height = `${textarea.scrollHeight}px`; // Set to content height
            }
        }, [props.value]);

        return (
            <textarea
                ref={internalTextareaRef}
                rows={1} // Start with a single row
                {...props}
                style={{ ...props.style, overflowY: 'hidden' }} // Hide scrollbar
            />
        );
    }
);

// Add a display name for easier debugging in React DevTools.
AutoGrowTextarea.displayName = 'AutoGrowTextarea';
