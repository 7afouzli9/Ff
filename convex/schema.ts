import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  players: defineTable({
    userId: v.id("users"),
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
    rotation: v.number(),
    health: v.number(),
    isAlive: v.boolean(),
    gameId: v.string(),
  }).index("by_game", ["gameId"]),
  
  bullets: defineTable({
    playerId: v.id("players"),
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
    velocity: v.object({
      x: v.number(),
      y: v.number(),
    }),
    gameId: v.string(),
  }).index("by_game", ["gameId"]),

  games: defineTable({
    status: v.string(),
    playerCount: v.number(),
    startTime: v.number(),
  }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
