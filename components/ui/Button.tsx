import React, { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
        const variants = {
            primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20",
            secondary: "bg-zinc-800 hover:bg-zinc-700 text-zinc-100",
            ghost: "bg-transparent hover:bg-zinc-800/50 text-zinc-400 hover:text-white",
            danger: "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20",
            outline: "bg-transparent border border-zinc-700 hover:bg-zinc-800 text-zinc-300",
        };

        const sizes = {
            sm: "px-3 py-1.5 text-xs",
            md: "px-5 py-2.5 text-sm",
            lg: "px-6 py-3 text-base",
        };

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    "flex items-center justify-center gap-2 font-medium rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {isLoading && (
                    <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                )}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";
