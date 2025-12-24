import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getViewer } from "./authUtils";

export const viewer = query({
    args: {},
    handler: async (ctx) => {
        return await getViewer(ctx);
    },
});

export const store = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (user !== null) {
            if (user.name !== identity.name) {
                await ctx.db.patch(user._id, { name: identity.name || "Anonymous" });
            }
            return user._id;
        }

        return await ctx.db.insert("users", {
            tokenIdentifier: identity.tokenIdentifier,
            name: identity.name || identity.givenName || "Anonymous",
            role: "user",
        });
    },
});

export const setAdmin = mutation({
    args: { userId: v.id("users"), role: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.userId, { role: args.role });
    }
});
