import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    recommendations: defineTable({
        title: v.string(),
        genre: v.string(),
        link: v.string(),
        blurb: v.string(),
        userId: v.string(), // Clerk Subject ID
        userName: v.optional(v.string()),
        isStaffPick: v.optional(v.boolean()),
    })
        .index("by_user", ["userId"])
        .index("by_staff_pick", ["isStaffPick"]),
});
