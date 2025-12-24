import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("recommendations").order("desc").take(10);
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
