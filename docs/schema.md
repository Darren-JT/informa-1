#database schemas 

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    // Store a password hash in production.
    password: v.string(),
    createdAt: v.number(),
  }).index("by_username", ["username"]),

  locations: defineTable({
    coordinates: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    policeNumber: v.optional(v.string()),
    createdAt: v.number(),
  }),

  persons: defineTable({
    name: v.string(),
    imageStorageId: v.id("_storage"),
    alias: v.optional(v.string()),
    crime: v.optional(v.string()),
    // Location object with ids to the locations table
    location: v.object({
      official_location: v.optional(v.id("locations")),
      last_sighted: v.optional(v.id("locations")),
      // zero or more frequent locations
      frequents: v.array(v.id("locations")),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_name", ["name"]),

  tips: defineTable({
    userId: v.optional(v.id("users")), // allow anonymous
    personId: v.id("persons"),
    locationId: v.id("locations"),
    details: v.string(),
    timeOfSighting: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_person", ["personId"])
    .index("by_location", ["locationId"])
    .index("by_user", ["userId"]),
});