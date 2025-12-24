import { QueryCtx } from "./_generated/server";

export async function getViewer(ctx: { auth: QueryCtx["auth"]; db: QueryCtx["db"] }) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        return null;
    }

    const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .unique();

    if (!user) {
        return {
            _id: null,
            subject: identity.subject,
            name: identity.name,
            isAdmin: false,
            givenName: identity.givenName
        };
    }

    return { ...user, subject: identity.subject, isAdmin: user.role === "admin", givenName: identity.givenName };
}

export async function requireViewer(ctx: { auth: QueryCtx["auth"]; db: QueryCtx["db"] }) {
    const viewer = await getViewer(ctx);
    if (!viewer || !viewer.subject) {
        throw new Error("Unauthorized: Login required");
    }
    return viewer;
}

export async function requireAdmin(ctx: { auth: QueryCtx["auth"]; db: QueryCtx["db"] }) {
    const viewer = await requireViewer(ctx);
    if (!viewer.isAdmin) {
        throw new Error("Unauthorized: Admin role required");
    }
    return viewer;
}
