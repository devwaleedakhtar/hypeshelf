import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

export default function RecommendationCard({
    rec,
}: {
    rec: Doc<"recommendations">;
}) {
    const deleteRec = useMutation(api.recommendations.deleteRecommendation);
    const toggleStaffPick = useMutation(api.recommendations.toggleStaffPick);
    const { user } = useUser();

    const isOwner = user?.id === rec.userId;
    const isAdmin = user?.publicMetadata?.role === "admin";
    const canDelete = isOwner || isAdmin;

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this?")) {
            await deleteRec({ id: rec._id });
        }
    };

    const handleToggleStaffPick = async () => {
        await toggleStaffPick({ id: rec._id });
    };

    return (
        <div className="bg-zinc-800 p-4 rounded-lg shadow-md border border-zinc-700 hover:border-zinc-500 transition-colors relative group">
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-white truncate break-words max-w-[70%]">
                    <a
                        href={rec.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline hover:text-blue-400"
                    >
                        {rec.title}
                    </a>
                </h3>
                <span className="text-xs bg-zinc-700 text-zinc-300 px-2 py-1 rounded-full uppercase tracking-wider">
                    {rec.genre}
                </span>
            </div>
            <p className="mt-2 text-zinc-400 text-sm line-clamp-3">{rec.blurb}</p>
            <div className="mt-4 flex justify-between items-center text-xs text-zinc-500">
                <span>Added by {rec.userName || "Anonymous"}</span>
                {rec.isStaffPick ? (
                    <span className="text-yellow-500 font-bold flex items-center gap-1">
                        ★ Staff Pick
                    </span>
                ) : (
                    <span></span>
                )}
            </div>

            {/* Admin Actions */}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {isAdmin && (
                    <button
                        onClick={handleToggleStaffPick}
                        className={`${rec.isStaffPick ? "text-yellow-500" : "text-zinc-600 hover:text-yellow-500"} transition-colors`}
                        title="Toggle Staff Pick"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={rec.isStaffPick ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    </button>
                )}
                {canDelete && (
                    <button
                        onClick={handleDelete}
                        className="text-zinc-500 hover:text-red-500"
                        title="Delete"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                    </button>
                )}
            </div>
        </div>
    );
}
