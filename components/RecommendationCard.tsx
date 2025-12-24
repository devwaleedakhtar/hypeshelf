import { Doc } from "@/convex/_generated/dataModel";

export default function RecommendationCard({
    rec,
}: {
    rec: Doc<"recommendations">;
}) {
    return (
        <div className="bg-zinc-800 p-4 rounded-lg shadow-md border border-zinc-700 hover:border-zinc-500 transition-colors">
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
                {rec.isStaffPick && (
                    <span className="text-yellow-500 font-bold flex items-center gap-1">
                        ★ Staff Pick
                    </span>
                )}
            </div>
        </div>
    );
}
