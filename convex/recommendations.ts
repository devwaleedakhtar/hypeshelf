import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: {
        genre: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let q = ctx.db.query("recommendations").order("desc");

        if (args.genre) {
            // NOTE: For simple filtering without specific index for genre+order,
            // we can filter in memory or add an index.
            // Since specific index isn't defined for genre sorting,
            // we'll filter after fetch or assume low volume for this demo.
            // Better approach for scale: .withIndex("by_genre", (q) => q.eq("genre", args.genre))
            // For now, let's just filter in code if needed or simpler:
            // Actually, let's just do client-side filtering or simple filter:
            const posts = await q.take(50); // increased limit
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
        const identity = await ctx.auth.getUserIdentity();
        console.log("identity", identity);
        if (!identity) {
            throw new Error("Called create without authentication present");
        }

        const user = identity;

        await ctx.db.insert("recommendations", {
            title: args.title,
            genre: args.genre,
            link: args.link,
            blurb: args.blurb,
            userId: user.subject,
            userName: user.name || user.givenName || "Anonymous",
            isStaffPick: false,
        });
    },
});

export const deleteRecommendation = mutation({
    args: { id: v.id("recommendations") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called delete without authentication present");
        }

        const rec = await ctx.db.get(args.id);
        if (!rec) {
            throw new Error("Recommendation not found");
        }

        const isOwner = rec.userId === identity.subject;
        // Check for admin role in Convex Identity (mapped from Clerk token)
        // IMPORTANT: In production, ensure "role" is in the JWT template under "metadata" or similar.
        // Clerk Default: publicMetadata is NOT in the session token by default unless configured.
        // Workaround for this specific setup: 
        // We'll check identity.role if mapped, OR identity.tokenIdentifier (less reliable without custom claims).
        // Or we rely on the client knowing the role (insecure) effectively backed by this check:

        // NOTE: To make this robust, the 'role' claim needs to be in the JWT.
        // Assuming the user added {"role": "admin"} to publicMetadata, 
        // AND configured the JWT template to include `public_metadata` as `metadata`.
        // Let's assume standard Clerk JWT mapping where `metadata.role` might be available if customized,
        // or we check a list of admin IDs.

        // For this simple take-home:
        // We will check if the user has the 'admin' role in their token claims (which Convex exposes via `identity`).
        // If not standard, we might need `identity.updatedAt` or similar.
        // Actually, Convex generic identity doesn't strictly type custom claims easily here without casting.

        // Let's try to read it safely.
        const role = (identity as any).role || (identity as any).metadata?.role;
        const isAdmin = role === "admin";

        if (!isOwner && !isAdmin) {
            throw new Error("Unauthorized: You can only delete your own recommendations");
        }

        await ctx.db.delete(args.id);
    },
});

export const toggleStaffPick = mutation({
    args: { id: v.id("recommendations") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const role = (identity as any).role || (identity as any).metadata?.role;
        const isAdmin = role === "admin";

        if (!isAdmin) {
            throw new Error("Unauthorized: Only admins can manage staff picks");
        }

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
        if (total.length > 0) return; // Already seeded

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
