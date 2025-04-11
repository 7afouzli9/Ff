import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerId, setPlayerId] = useState<Id<"players"> | null>(null);
  const [gameId] = useState("game1"); // For simplicity, using a fixed game ID

  const joinGame = useMutation(api.game.joinGame);
  const updatePlayer = useMutation(api.game.updatePlayer);
  const shoot = useMutation(api.game.shoot);
  const gameState = useQuery(api.game.getGameState, { gameId });

  useEffect(() => {
    async function init() {
      const id = await joinGame({ gameId });
      setPlayerId(id);
    }
    init();
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !playerId || !gameState) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Clear canvas
    ctx.fillStyle = "#264653";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw players
    gameState.players.forEach((player) => {
      ctx.fillStyle = player._id === playerId ? "#e76f51" : "#2a9d8f";
      ctx.beginPath();
      ctx.arc(player.position.x, player.position.y, 20, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw bullets
    ctx.fillStyle = "#e9c46a";
    gameState.bullets.forEach((bullet) => {
      ctx.beginPath();
      ctx.arc(bullet.position.x, bullet.position.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [gameState, playerId]);

  useEffect(() => {
    if (!playerId) return;

    const handleMovement = (e: KeyboardEvent) => {
      if (!playerId) return;
      
      const player = gameState?.players.find(p => p._id === playerId);
      if (!player) return;

      const speed = 5;
      const newPosition = { ...player.position };

      switch (e.key) {
        case "ArrowUp":
          newPosition.y -= speed;
          break;
        case "ArrowDown":
          newPosition.y += speed;
          break;
        case "ArrowLeft":
          newPosition.x -= speed;
          break;
        case "ArrowRight":
          newPosition.x += speed;
          break;
      }

      updatePlayer({
        playerId,
        position: newPosition,
        rotation: player.rotation,
      });
    };

    const handleShoot = (e: MouseEvent) => {
      if (!playerId || !canvasRef.current) return;
      
      const player = gameState?.players.find(p => p._id === playerId);
      if (!player) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const angle = Math.atan2(y - player.position.y, x - player.position.x);
      const velocity = {
        x: Math.cos(angle) * 10,
        y: Math.sin(angle) * 10,
      };

      shoot({
        playerId,
        position: { ...player.position },
        velocity,
        gameId,
      });
    };

    window.addEventListener("keydown", handleMovement);
    window.addEventListener("click", handleShoot);

    return () => {
      window.removeEventListener("keydown", handleMovement);
      window.removeEventListener("click", handleShoot);
    };
  }, [playerId, gameState]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ cursor: "crosshair" }}
    />
  );
}
