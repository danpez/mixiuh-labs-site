"use client";

import React, { useEffect, useRef } from "react";

export type AmbientSimulationMode =
  | "ai-ecosystem"
  | "neural-packets"
  | "voxel-rain"
  | "off";

export interface PixelProceduralAmbientBgProps {
  mode?: AmbientSimulationMode;
  opacity?: number;
  className?: string;
}

interface PixelAgent {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  accent: string;
  name: string;
  state: "patrol" | "chat" | "build" | "scan";
  timer: number;
  frame: number;
  partnerIdx: number | null;
}

interface DataPacket {
  x: number;
  y: number;
  tx: number;
  ty: number;
  progress: number;
  color: string;
}

interface PixelSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
}

interface GridStructure {
  gx: number;
  gy: number;
  color: string;
  life: number;
  kind: "beacon" | "node" | "chip";
}

const AGENT_ARCHETYPES = [
  { name: "CARBON", color: "#00E5FF", accent: "#FFD100" },
  { name: "ARGON", color: "#A855F7", accent: "#00E5FF" },
  { name: "OPUS", color: "#FF3355", accent: "#FFD100" },
  { name: "SONNET", color: "#38BDF8", accent: "#10B981" },
  { name: "HAIKU", color: "#10B981", accent: "#FFD100" },
  { name: "MIXIUH", color: "#FFD100", accent: "#00E5FF" },
];

export function PixelProceduralAmbientBg({
  mode = "ai-ecosystem",
  opacity = 0.32,
  className = "",
}: PixelProceduralAmbientBgProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (mode === "off") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = { x: -9999, y: -9999, active: false };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleClick = (e: MouseEvent) => {
      // Spawn subtle pixel sparks & attract nearest agent
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI * 2 * i) / 10;
        const speed = 1.2 + Math.random() * 2.2;
        sparks.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: i % 2 === 0 ? "#FFD100" : "#00E5FF",
          life: 0,
          maxLife: 28 + Math.floor(Math.random() * 14),
        });
      }
      // Drop a temporary grid node at click position
      const gx = Math.round(e.clientX / 48) * 48;
      const gy = Math.round(e.clientY / 48) * 48;
      if (structures.length < 18) {
        structures.push({
          gx,
          gy,
          color: "#FFD100",
          life: 420,
          kind: "beacon",
        });
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("click", handleClick, { passive: true });

    // Initialize autonomous pixel AI agents
    const agentCount = Math.min(12, Math.max(6, Math.floor(width / 190)));
    const agents: PixelAgent[] = Array.from({ length: agentCount }).map(
      (_, i) => {
        const arch = AGENT_ARCHETYPES[i % AGENT_ARCHETYPES.length];
        const dir = (Math.floor(Math.random() * 4) * Math.PI) / 2;
        return {
          x: 80 + Math.random() * Math.max(200, width - 160),
          y: 80 + Math.random() * Math.max(200, height - 160),
          vx: Math.cos(dir) * 0.65,
          vy: Math.sin(dir) * 0.65,
          color: arch.color,
          accent: arch.accent,
          name: arch.name,
          state: "patrol",
          timer: 90 + Math.floor(Math.random() * 140),
          frame: i * 7,
          partnerIdx: null,
        };
      }
    );

    const packets: DataPacket[] = [];
    const sparks: PixelSpark[] = [];
    const structures: GridStructure[] = [
      { gx: 144, gy: 192, color: "#00E5FF", life: 900, kind: "node" },
      {
        gx: Math.floor((width * 0.8) / 48) * 48,
        gy: 240,
        color: "#FFD100",
        life: 900,
        kind: "beacon",
      },
      {
        gx: Math.floor((width * 0.2) / 48) * 48,
        gy: Math.floor((height * 0.75) / 48) * 48,
        color: "#10B981",
        life: 900,
        kind: "chip",
      },
    ];

    // Helper: draw a crisp 5x5 pixel-art micro-bot (scaled by pixelSize = 3)
    const drawPixelBot = (a: PixelAgent, tick: number) => {
      const px = Math.round(a.x / 3) * 3;
      const py = Math.round(a.y / 3) * 3;
      const s = 3; // 3px per virtual pixel -> 15x15px sprite
      const bob = Math.floor(tick / 18 + a.frame) % 2 === 0 ? 0 : -s;

      // Shadow on floor
      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      ctx.fillRect(px - 2 * s, py + 3 * s, 5 * s, s);

      // Antenna
      ctx.fillStyle = a.accent;
      ctx.fillRect(px, py - 3 * s + bob, s, s);

      // Chassis
      ctx.fillStyle = a.color;
      ctx.fillRect(px - 2 * s, py - 2 * s + bob, 5 * s, 4 * s);

      // Visor
      ctx.fillStyle = "#090B10";
      ctx.fillRect(px - s, py - s + bob, 3 * s, 2 * s);

      // Eyes
      ctx.fillStyle = "#F5F2EB";
      ctx.fillRect(px - s, py - s + bob, s, s);
      ctx.fillRect(px + s, py - s + bob, s, s);

      // Feet (animated walking step)
      const step = Math.floor(tick / 10 + a.frame) % 2;
      ctx.fillStyle = a.accent;
      ctx.fillRect(px - 2 * s, py + 2 * s + (step === 0 ? 0 : -s), s, s);
      ctx.fillRect(px + 2 * s, py + 2 * s + (step === 1 ? 0 : -s), s, s);

      // State bubble above bot when chatting / building / scanning
      if (a.state === "chat") {
        // Pixel speech bubble [..]
        ctx.fillStyle = "#090B10";
        ctx.fillRect(px - 2 * s, py - 6 * s + bob, 5 * s, 2 * s);
        ctx.fillStyle = a.accent;
        ctx.fillRect(
          px - s + ((Math.floor(tick / 8) % 3) * s),
          py - 5 * s + bob,
          s,
          s
        );
      } else if (a.state === "build") {
        // Tiny spinning pixel wrench/cube
        ctx.fillStyle = "#FFD100";
        ctx.fillRect(px - s, py - 5 * s + bob, 2 * s, 2 * s);
      } else if (a.state === "scan") {
        // Expanding pixel radar ring
        const r = ((tick % 32) / 32) * 28;
        ctx.strokeStyle = a.color;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(
          Math.round(px - r),
          Math.round(py - r),
          Math.round(r * 2),
          Math.round(r * 2)
        );
      }
    };

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      if (mode === "voxel-rain") {
        // Subtle 8-bit falling pixel blocks
        for (let i = 0; i < agents.length * 2; i++) {
          const rx = ((i * 137 + tick * 0.4) % width);
          const ry = ((i * 293 + tick * (1.1 + (i % 3) * 0.4)) % height);
          const gx = Math.round(rx / 6) * 6;
          const gy = Math.round(ry / 6) * 6;
          ctx.fillStyle = i % 3 === 0 ? "#FFD100" : "#00E5FF";
          ctx.fillRect(gx, gy, 6, 6);
          ctx.fillStyle = "rgba(0, 229, 255, 0.25)";
          ctx.fillRect(gx, gy - 12, 6, 6);
        }
        animId = requestAnimationFrame(render);
        return;
      }

      // 1. Draw Grid Structures (Micro-nodes built by the AI bots)
      for (let i = structures.length - 1; i >= 0; i--) {
        const st = structures[i];
        st.life--;
        if (st.life <= 0) {
          structures.splice(i, 1);
          continue;
        }
        const pulse = Math.floor(tick / 20) % 2 === 0;
        ctx.fillStyle = "#090B10";
        ctx.fillRect(st.gx - 9, st.gy - 9, 18, 18);
        ctx.strokeStyle = st.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(st.gx - 9, st.gy - 9, 18, 18);
        ctx.fillStyle = pulse ? st.color : "#F5F2EB";
        ctx.fillRect(st.gx - 3, st.gy - 3, 6, 6);
      }

      // 2. Update & Draw Data Packets traveling between agents/structures
      for (let i = packets.length - 1; i >= 0; i--) {
        const pk = packets[i];
        pk.progress += 0.025;
        if (pk.progress >= 1) {
          packets.splice(i, 1);
          continue;
        }
        // Manhattan L-shaped routing for authentic circuit-board feel
        let cx = pk.x;
        let cy = pk.y;
        if (pk.progress < 0.5) {
          cx = pk.x + (pk.tx - pk.x) * (pk.progress * 2);
          cy = pk.y;
        } else {
          cx = pk.tx;
          cy = pk.y + (pk.ty - pk.y) * ((pk.progress - 0.5) * 2);
        }
        const rx = Math.round(cx / 3) * 3;
        const ry = Math.round(cy / 3) * 3;
        ctx.fillStyle = pk.color;
        ctx.fillRect(rx - 2, ry - 2, 5, 5);
      }

      // 3. Update & Draw Autonomous Pixel AI Agents
      if (mode === "ai-ecosystem" || mode === "neural-packets") {
        for (let i = 0; i < agents.length; i++) {
          const a = agents[i];
          a.timer--;

          // Check distance to mouse cursor (gentle curiosity / radar scan)
          const dmx = mouse.x - a.x;
          const dmy = mouse.y - a.y;
          const distMouse = Math.hypot(dmx, dmy);
          if (mouse.active && distMouse < 130 && a.state === "patrol") {
            a.state = "scan";
            a.timer = 45;
          }

          if (a.state === "patrol") {
            a.x += a.vx;
            a.y += a.vy;

            // Bounce cleanly off screen edges
            if (a.x < 40 || a.x > width - 40) a.vx *= -1;
            if (a.y < 60 || a.y > height - 40) a.vy *= -1;

            // Snap direction change on timer (orthogonal 90-degree pixel paths)
            if (a.timer <= 0) {
              const r = Math.random();
              if (r < 0.65) {
                const angle = (Math.floor(Math.random() * 4) * Math.PI) / 2;
                const spd = 0.55 + Math.random() * 0.35;
                a.vx = Math.cos(angle) * spd;
                a.vy = Math.sin(angle) * spd;
                a.timer = 90 + Math.floor(Math.random() * 140);
              } else if (r < 0.85 && structures.length < 16) {
                a.state = "build";
                a.timer = 55;
              } else {
                a.state = "scan";
                a.timer = 45;
              }
            }

            // Check if another patrolling agent is nearby -> start AI interaction!
            for (let j = i + 1; j < agents.length; j++) {
              const b = agents[j];
              const d = Math.hypot(b.x - a.x, b.y - a.y);
              if (d < 95 && b.state === "patrol" && Math.random() < 0.02) {
                a.state = "chat";
                b.state = "chat";
                a.timer = 70;
                b.timer = 70;
                a.partnerIdx = j;
                b.partnerIdx = i;
                packets.push({
                  x: a.x,
                  y: a.y,
                  tx: b.x,
                  ty: b.y,
                  progress: 0,
                  color: a.accent,
                });
                break;
              }
            }
          } else if (a.state === "chat") {
            if (a.timer === 35 && a.partnerIdx !== null) {
              const partner = agents[a.partnerIdx];
              if (partner) {
                packets.push({
                  x: a.x,
                  y: a.y,
                  tx: partner.x,
                  ty: partner.y,
                  progress: 0,
                  color: a.color,
                });
              }
            }
            if (a.timer <= 0) {
              a.state = "patrol";
              a.partnerIdx = null;
              const angle = (Math.floor(Math.random() * 4) * Math.PI) / 2;
              a.vx = Math.cos(angle) * 0.7;
              a.vy = Math.sin(angle) * 0.7;
              a.timer = 110;
            }
          } else if (a.state === "build") {
            if (a.timer === 10 && structures.length < 16) {
              const gx = Math.round(a.x / 48) * 48;
              const gy = Math.round(a.y / 48) * 48;
              structures.push({
                gx,
                gy,
                color: a.color,
                life: 500,
                kind: "node",
              });
            }
            if (a.timer <= 0) {
              a.state = "patrol";
              a.timer = 100;
            }
          } else if (a.state === "scan") {
            if (a.timer === 20 && structures.length > 0) {
              const target =
                structures[Math.floor(Math.random() * structures.length)];
              packets.push({
                x: a.x,
                y: a.y,
                tx: target.gx,
                ty: target.gy,
                progress: 0,
                color: a.color,
              });
            }
            if (a.timer <= 0) {
              a.state = "patrol";
              a.timer = 100;
            }
          }

          if (mode === "ai-ecosystem") {
            drawPixelBot(a, tick);
          }
        }
      }

      // 4. Update & Draw Click Pixel Sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        sp.life++;
        if (sp.life >= sp.maxLife) {
          sparks.splice(i, 1);
          continue;
        }
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vy += 0.08; // gravity
        const sx = Math.round(sp.x / 3) * 3;
        const sy = Math.round(sp.y / 3) * 3;
        ctx.fillStyle = sp.color;
        ctx.fillRect(sx, sy, 4, 4);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, [mode]);

  if (mode === "off") return null;

  return (
    <canvas
      ref={canvasRef}
      style={{ opacity }}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
}
