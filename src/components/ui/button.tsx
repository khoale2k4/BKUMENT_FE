import clsx from "clsx";
import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline'; 
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={clsx(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-12 w-full px-4 py-2 cursor-pointer",
                    variant === 'primary' && "bg-[#3F5D38] text-white hover:bg-[#2d4228]",
                    variant === 'outline' && "border border-gray-300 bg-white hover:bg-gray-50 text-black",
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button };