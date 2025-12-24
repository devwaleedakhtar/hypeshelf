import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Plus } from "lucide-react";
import { GENRES } from "@/lib/constants";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import Dialog from "../ui/Dialog";

export default function CreateRecommendation() {
    const [isOpen, setIsOpen] = useState(false);
    const create = useMutation(api.recommendations.create);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        genre: "Action",
        link: "",
        blurb: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await create(formData);
        setIsSubmitting(false);
        setIsOpen(false);
        setFormData({ title: "", genre: "Action", link: "", blurb: "" });
    };

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className="rounded-full shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5"
            >
                <Plus size={18} strokeWidth={2.5} />
                <span>Add Recommendation</span>
            </Button>

            <Dialog
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Add Recommendation"
                maxWidth="max-w-lg"
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Title"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="What are you hyped about?"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                                Genre
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.genre}
                                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                                    className="w-full appearance-none bg-zinc-950/50 border border-zinc-700/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                >
                                    {GENRES.map((g) => (
                                        <option key={g} value={g}>
                                            {g}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                            </div>
                        </div>

                        <Input
                            label="Link"
                            type="url"
                            required
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            placeholder="https://..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                            Blurb
                        </label>
                        <textarea
                            required
                            value={formData.blurb}
                            onChange={(e) => setFormData({ ...formData, blurb: e.target.value })}
                            maxLength={140}
                            rows={3}
                            className="w-full bg-zinc-950/50 border border-zinc-700/50 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
                            placeholder="Why is it worth checking out?"
                        />
                        <div className="flex justify-end mt-1">
                            <span className={`text-xs ${formData.blurb.length > 120 ? "text-yellow-500" : "text-zinc-600"}`}>
                                {formData.blurb.length}/140
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                        >
                            Post It
                        </Button>
                    </div>
                </form>
            </Dialog>
        </>
    );
}
