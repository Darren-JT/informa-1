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

  // TIP REPORTS: Reports about existing criminals in the database
  tipReports: defineTable({
    userId: v.optional(v.id("users")), // allow anonymous
    personId: v.id("persons"), // must reference existing criminal
    locationId: v.id("locations"), // where the tip occurred
    details: v.string(), // tip details about the criminal
    timeOfSighting: v.optional(v.number()), // when they were seen
    createdAt: v.number(),
  })
    .index("by_person", ["personId"])
    .index("by_location", ["locationId"])
    .index("by_user", ["userId"]),

  // INCIDENT REPORTS: New crime reports where no existing criminal is known
  incidentReports: defineTable({
    userId: v.optional(v.id("users")), // allow anonymous reporting
    
    // Required Information
    description: v.string(), // "Who, What, When, Where and How Do You Know"
    offenseType: v.string(), // dropdown selection
    cityState: v.string(), // "City, State"
    
    // Location Information
    address: v.optional(v.string()), // "Address of Incident"
    county: v.optional(v.string()), // "County"
    nearestIntersection: v.optional(v.string()), // "Nearest Intersection"
    neighborhood: v.optional(v.string()), // "Neighborhood or subdivision"
    directions: v.optional(v.string()), // "Additional directions or landmarks"
    locationId: v.optional(v.id("locations")), // linked location if coordinates available
    
    // Additional Information
    howDidYouHear: v.optional(v.string()), // "How did you hear about our program?"
    newsStoryLinks: v.optional(v.string()), // "Copy/paste URL if available"
    additionalInfo: v.optional(v.string()), // "Any other relevant information"
    
    // Report Categories (checkboxes)
    categories: v.array(v.union(
      v.literal("school_related_bullying"),
      v.literal("abuse"),
      v.literal("wanted_fugitive"),
      v.literal("weapons"),
      v.literal("drugs")
    )),
    
    // File Attachments
    attachments: v.array(v.id("_storage")), // uploaded files (images, videos, audio, documents)
    
    // System Fields
    status: v.union(
      v.literal("pending"),
      v.literal("under_investigation"),
      v.literal("resolved"),
      v.literal("closed")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_priority", ["priority"])
    .index("by_offense_type", ["offenseType"])
    .index("by_city_state", ["cityState"])
    .index("by_categories", ["categories"]),
});