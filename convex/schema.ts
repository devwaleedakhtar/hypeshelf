import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    recommendations: defineTable({
        title: v.string(),
        genre: v.string(),
        link: v.string(),
        blurb: v.string(),
        userId: v.string(),
        userName: v.optional(v.string()),
        isStaffPick: v.optional(v.boolean()),
    })
        .index("by_user", ["userId"])
        .index("by_staff_pick", ["isStaffPick"]),

    users: defineTable({
        tokenIdentifier: v.string(),
        name: v.string(),
        role: v.optional(v.string()),
    }).index("by_token", ["tokenIdentifier"]),
});
