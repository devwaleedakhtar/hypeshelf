import { Doc } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Trash2, Star, ExternalLink, User } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";
import Dialog from "../ui/Dialog";

export default function RecommendationCard({
    rec,
}: {
    rec: Doc<"recommendations">;
}) {
    const deleteRec = useMutation(api.recommendations.deleteRecommendation);
    const toggleStaffPick = useMutation(api.recommendations.toggleStaffPick);
    const viewer = useQuery(api.users.viewer);
    const { user } = useUser();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

    const isOwner = user?.id === rec.userId;
    const isAdmin = viewer?.isAdmin;
    const canDelete = isOwner || isAdmin;

    const handleDelete = async () => {
        await deleteRec({ id: rec._id });
        setIsDeleteDialogOpen(false);
    };

    const handleToggleStaffPick = async () => {
        try {
            await toggleStaffPick({ id: rec._id });
        } catch (error) {
            console.error("Failed to toggle staff pick:", error);
            setIsErrorDialogOpen(true);
        }
    };

    return (
        <>
            <div className="group relative flex flex-col justify-between h-full bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300">
                <div>
                    <div className="flex justify-between items-start gap-3">
                        <h3 className="font-bold text-lg text-zinc-100 leading-tight">
                            {rec.title}
                        </h3>
                        <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700/50">
                            {rec.genre}
                        </span>
                    </div>

                    <p className="mt-3 text-sm text-zinc-400 leading-relaxed line-clamp-3">
                        {rec.blurb}
                    </p>
                </div>

                <div className="relative mt-5 pt-4 border-t border-zinc-800/50 h-8">
                    <div className="absolute inset-x-0 flex items-center justify-between text-xs text-zinc-500 transition-opacity duration-200 opacity-100 group-hover:opacity-0 pointer-events-none group-hover:pointer-events-none">
                        <div className="flex items-center gap-1.5 overflow-hidden">
                            <div className="bg-zinc-800 p-1 rounded-full">
                                <User size={12} className="text-zinc-400" />
                            </div>
                            <span className="truncate max-w-[100px]">{rec.userName || "Anonymous"}</span>
                        </div>

                        {rec.isStaffPick && (
                            <span className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full font-medium border border-yellow-500/20">
                                <Star size={10} fill="currentColor" />
                                Staff Pick
                            </span>
                        )}
                    </div>

                    <div className="absolute inset-x-0 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                        <a
                            href={rec.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800 text-zinc-300 hover:text-white hover:bg-blue-600 rounded-full transition-colors text-xs font-medium"
                            title="Open Link"
                        >
                            <ExternalLink size={12} />
                            Open
                        </a>

                        {isAdmin && (
                            <Button
                                onClick={handleToggleStaffPick}
                                variant={rec.isStaffPick ? "primary" : "secondary"}
                                size="sm"
                                className={`flex items-center gap-1.5 ${rec.isStaffPick
                                    ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20 shadow-none"
                                    : "bg-zinc-800 text-zinc-300 hover:text-yellow-400 hover:bg-zinc-700 border-transparent shadow-none"
                                    }`}
                                title="Toggle Staff Pick"
                            >
                                <Star size={12} fill={rec.isStaffPick ? "currentColor" : "none"} />
                                {rec.isStaffPick ? "Picked" : "Pick"}
                            </Button>
                        )}

                        {canDelete && (
                            <Button
                                onClick={() => setIsDeleteDialogOpen(true)}
                                variant="danger"
                                size="sm"
                                className="rounded-full px-3 py-1"
                                title="Delete"
                            >
                                <Trash2 size={12} />
                                Delete
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <Dialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                title="Delete Recommendation"
            >
                <p className="text-zinc-400 text-sm mb-6">
                    Are you sure you want to delete <strong className="text-white">"{rec.title}"</strong>?
                    This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                    <Button
                        onClick={() => setIsDeleteDialogOpen(false)}
                        variant="ghost"
                        size="sm"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        variant="danger"
                        size="sm"
                    >
                        Delete
                    </Button>
                </div>
            </Dialog>

            <Dialog
                isOpen={isErrorDialogOpen}
                onClose={() => setIsErrorDialogOpen(false)}
                title="Permission Denied"
            >
                <p className="text-zinc-400 text-sm mb-6">
                    You do not have permission to perform this action. Please check your admin status in the Convex Dashboard.
                </p>
                <div className="flex justify-end">
                    <Button
                        onClick={() => setIsErrorDialogOpen(false)}
                        variant="primary"
                        size="sm"
                    >
                        Okay
                    </Button>
                </div>
            </Dialog>
        </>
    );
}
