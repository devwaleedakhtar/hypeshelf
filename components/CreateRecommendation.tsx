"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

const GENRES = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Animation", "Documentary", "Other"];

export default function CreateRecommendation() {
    const [isOpen, setIsOpen] = useState(false);
    const create = useMutation(api.recommendations.create);
    const { user } = useUser();

    const [formData, setFormData] = useState({
        title: "",
        genre: "Action",
        link: "",
        blurb: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await create(formData);
        setIsOpen(false);
        setFormData({ title: "", genre: "Action", link: "", blurb: "" });
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-full transition-colors shadow-lg shadow-blue-900/20"
            >
                Add Recommendation
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
                <h2 className="text-2xl font-bold mb-4 text-white">Add Recommendation</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            placeholder="Movie or Show Title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Genre</label>
                        <select
                            value={formData.genre}
                            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        >
                            {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Link</label>
                        <input
                            type="url"
                            required
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            placeholder="https://imdb.com/..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Blurb</label>
                        <textarea
                            required
                            value={formData.blurb}
                            onChange={(e) => setFormData({ ...formData, blurb: e.target.value })}
                            maxLength={140}
                            rows={3}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            placeholder="Why is it good? (Short & sweet)"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded transition-colors"
                        >
                            Post It
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
