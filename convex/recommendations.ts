import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireViewer, requireAdmin } from "./authUtils";

export const get = query({
    args: {
        genre: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let q = ctx.db.query("recommendations").order("desc");

        if (args.genre) {
            const posts = await q.take(50);
            if (args.genre) {
                return posts.filter((p) => p.genre === args.genre);
            }
            return posts;
        }

        return await q.take(20);
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        genre: v.string(),
        link: v.string(),
        blurb: v.string(),
    },
    handler: async (ctx, args) => {
        const viewer = await requireViewer(ctx);

        await ctx.db.insert("recommendations", {
            title: args.title,
            genre: args.genre,
            link: args.link,
            blurb: args.blurb,
            userId: viewer.subject,
            userName: viewer.name || viewer.givenName || "Anonymous",
            isStaffPick: false,
        });
    },
});

export const deleteRecommendation = mutation({
    args: { id: v.id("recommendations") },
    handler: async (ctx, args) => {
        const viewer = await requireViewer(ctx);

        const rec = await ctx.db.get(args.id);
        if (!rec) {
            throw new Error("Recommendation not found");
        }

        const isOwner = rec.userId === viewer.subject;
        const isAdmin = viewer.isAdmin;

        if (!isOwner && !isAdmin) {
            throw new Error("Unauthorized: You can only delete your own recommendations");
        }

        await ctx.db.delete(args.id);
    },
});

export const toggleStaffPick = mutation({
    args: { id: v.id("recommendations") },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);

        const rec = await ctx.db.get(args.id);
        if (!rec) {
            throw new Error("Recommendation not found");
        }

        await ctx.db.patch(args.id, { isStaffPick: !rec.isStaffPick });
    },
});

export const seed = mutation({
    args: {},
    handler: async (ctx) => {
        const total = await ctx.db.query("recommendations").collect();
        if (total.length > 0) return;

        const seedData = [
            {
                title: "Inception",
                genre: "Sci-Fi",
                link: "https://www.imdb.com/title/tt1375666/",
                blurb: "A thief who steals corporate secrets through the use of dream-sharing technology.",
                userId: "system",
                userName: "HypeShelf Team",
                isStaffPick: true,
            },
            {
                title: "The Grand Budapest Hotel",
                genre: "Comedy",
                link: "https://www.imdb.com/title/tt2278388/",
                blurb: "A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy.",
                userId: "system",
                userName: "HypeShelf Team",
                isStaffPick: true,
            },
            {
                title: "Spider-Man: Into the Spider-Verse",
                genre: "Animation",
                link: "https://www.imdb.com/title/tt4633694/",
                blurb: "Teen Miles Morales becomes the Spider-Man of his universe, and must join with five spider-powered individuals from other dimensions.",
                userId: "system",
                userName: "HypeShelf Team",
                isStaffPick: false,
            },
        ];

        for (const item of seedData) {
            await ctx.db.insert("recommendations", item);
        }
    },
});
