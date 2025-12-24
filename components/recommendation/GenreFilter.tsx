import { motion, LayoutGroup } from "framer-motion";
import { cn } from "@/lib/utils";
import { GENRES_WITH_ALL } from "@/lib/constants";

interface GenreFilterProps {
    selectedGenre: string;
    onSelect: (genre: string) => void;
}

export default function GenreFilter({ selectedGenre, onSelect }: GenreFilterProps) {
    return (
        <div className="flex gap-1 overflow-x-auto pb-4 md:pb-0 max-w-full no-scrollbar p-1">
            <LayoutGroup>
                {GENRES_WITH_ALL.map((g) => {
                    const isSelected = selectedGenre === g;
                    return (
                        <button
                            key={g}
                            onClick={() => onSelect(g)}
                            className={cn(
                                "relative px-4 py-2 rounded-full text-sm font-medium transition-colors shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                                isSelected ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                            )}
                        >
                            {isSelected && (
                                <motion.div
                                    layoutId="genre-pill"
                                    className="absolute inset-0 bg-zinc-800 rounded-full"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{g}</span>
                        </button>
                    );
                })}
            </LayoutGroup>
        </div>
    );
}
