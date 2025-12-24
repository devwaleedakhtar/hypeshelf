import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Film } from "lucide-react";
import RecommendationCard from "./RecommendationCard";

interface RecommendationFeedProps {
    selectedGenre: string;
    onClearFilter: () => void;
}

export default function RecommendationFeed({ selectedGenre, onClearFilter }: RecommendationFeedProps) {
    const queryArgs = selectedGenre === "All" ? {} : { genre: selectedGenre };
    const recommendations = useQuery(api.recommendations.get, queryArgs);

    if (recommendations === undefined) {
        return (
            <div className="flex justify-center p-20">
                <div className="relative">
                    <div className="h-12 w-12 rounded-full border-2 border-zinc-800 border-t-blue-500 animate-spin"></div>
                </div>
            </div>
        );
    }

    if (recommendations.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20"
            >
                <div className="bg-zinc-900 p-4 rounded-full mb-4">
                    <Film size={32} className="text-zinc-600" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-300 mb-2">No recommendations yet</h3>
                <p className="text-zinc-500 max-w-xs mx-auto mb-6">
                    Be the first to add a recommendation for {selectedGenre !== "All" ? <span className="text-blue-400">{selectedGenre}</span> : "this genre"}.
                </p>
                {selectedGenre !== "All" && (
                    <button
                        onClick={onClearFilter}
                        className="text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                    >
                        Clear filters
                    </button>
                )}
            </motion.div>
        );
    }

    return (
        <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            <AnimatePresence mode="popLayout">
                {recommendations.map((rec) => (
                    <motion.div
                        layout
                        key={rec._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", duration: 0.5 }}
                    >
                        <RecommendationCard rec={rec} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    );
}
