import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
    maxWidth?: string;
}

export default function Dialog({
    isOpen,
    onClose,
    title,
    children,
    className,
    maxWidth = "max-w-md",
}: DialogProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (typeof document === "undefined") return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity"
                        aria-hidden="true"
                    />

                    {/* Dialog Panel */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                            className={cn(
                                "relative w-full bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden",
                                maxWidth,
                                className
                            )}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="dialog-title"
                        >
                            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50">
                                <h2 id="dialog-title" className="text-lg font-semibold text-white">
                                    {title}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
                                    aria-label="Close"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-6">{children}</div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
