import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const joinGame = mutation({
  args: {
    gameId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("players", {
      userId,
      position: { x: Math.random() * 1000, y: Math.random() * 1000 },
      rotation: 0,
      health: 100,
      isAlive: true,
      gameId: args.gameId,
    });
  },
});

export const updatePlayer = mutation({
  args: {
    playerId: v.id("players"),
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
    rotation: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.playerId, {
      position: args.position,
      rotation: args.rotation,
    });
  },
});

export const shoot = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("bullets", {
      playerId: args.playerId,
      position: args.position,
      velocity: args.velocity,
      gameId: args.gameId,
    });
  },
});

export const getGameState = query({
  args: {
    gameId: v.string(),
  },
  handler: async (ctx, args) => {
    const players = await ctx.db
      .query("players")
      .withIndex("by_game", (q) => q.eq("gameId", args.gameId))
      .collect();
    
    const bullets = await ctx.db
      .query("bullets")
      .withIndex("by_game", (q) => q.eq("gameId", args.gameId))
      .collect();

    return { players, bullets };
  },
});
