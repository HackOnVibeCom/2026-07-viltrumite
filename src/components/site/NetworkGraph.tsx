import { useEffect, useRef } from "react";

type Node = {
  x: number; y: number; vx: number; vy: number;
  r: number; hue: number; label?: string; core?: boolean;
};

export function NetworkGraph({ dense = false, className = "" }: { dense?: boolean; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const count = dense ? 26 : 16;
    const nodes: Node[] = [];
    // core node
    nodes.push({ x: w / 2, y: h / 2, vx: 0, vy: 0, r: 10, hue: 260, core: true, label: "Your App" });
    const labels = ["Study", "Budget", "Pomodoro", "Flash", "Resume", "Notes", "Habit", "Focus", "Zen", "Mint", "Track", "Learn"];
    for (let i = 1; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = Math.min(w, h) * (0.25 + Math.random() * 0.2);
      nodes.push({
        x: w / 2 + Math.cos(angle) * radius,
        y: h / 2 + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 3 + Math.random() * 3,
        hue: Math.random() > 0.5 ? 260 : 175,
        label: labels[i % labels.length],
      });
    }

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - r.left;
      mouseRef.current.y = e.clientY - r.top;
      mouseRef.current.active = true;
    };
    const onLeave = () => (mouseRef.current.active = false);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    const linkDist = dense ? 180 : 220;

    const tick = () => {
      ctx.clearRect(0, 0, w, h);

      // background radial glow
      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) / 1.4);
      grad.addColorStop(0, "rgba(108, 92, 231, 0.18)");
      grad.addColorStop(0.5, "rgba(0, 212, 184, 0.05)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // update
      for (const n of nodes) {
        if (n.core) continue;
        n.x += n.vx; n.y += n.vy;
        if (n.x < 20 || n.x > w - 20) n.vx *= -1;
        if (n.y < 20 || n.y > h - 20) n.vy *= -1;

        if (mouseRef.current.active) {
          const dx = n.x - mouseRef.current.x;
          const dy = n.y - mouseRef.current.y;
          const d = Math.hypot(dx, dy);
          if (d < 140) {
            n.x += (dx / d) * 0.6;
            n.y += (dy / d) * 0.6;
          }
        }
      }

      // links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < linkDist) {
            const alpha = (1 - d / linkDist) * 0.55;
            const hue = (a.hue + b.hue) / 2;
            ctx.strokeStyle = `hsla(${hue}, 80%, 65%, ${alpha})`;
            ctx.lineWidth = a.core || b.core ? 1.1 : 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (const n of nodes) {
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 6);
        glow.addColorStop(0, `hsla(${n.hue}, 90%, 70%, ${n.core ? 0.9 : 0.55})`);
        glow.addColorStop(1, "hsla(0,0%,0%,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = n.core ? "#ffffff" : `hsl(${n.hue}, 90%, 75%)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [dense]);

  return <canvas ref={canvasRef} className={className} />;
}
