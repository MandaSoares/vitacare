import { motion } from "framer-motion";

const metrics = [
  { label: "Proteína", current: 0.82, target: 1.0 },
  { label: "Fibras", current: 0.65, target: 1.0 },
  { label: "Vitaminas", current: 0.9, target: 1.0 },
  { label: "Hidratação", current: 0.7, target: 1.0 },
  { label: "Minerais", current: 0.55, target: 1.0 },
  { label: "Calorias", current: 0.78, target: 1.0 },
];

const RadarChart = () => {
  const cx = 140;
  const cy = 140;
  const maxR = 100;
  const sides = metrics.length;

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / sides - Math.PI / 2;
    return {
      x: cx + maxR * value * Math.cos(angle),
      y: cy + maxR * value * Math.sin(angle),
    };
  };

  const targetPath = metrics
    .map((m, i) => {
      const p = getPoint(i, m.target);
      return `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`;
    })
    .join(" ") + " Z";

  const currentPath = metrics
    .map((m, i) => {
      const p = getPoint(i, m.current);
      return `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`;
    })
    .join(" ") + " Z";

  return (
    <div className="relative">
      <svg viewBox="0 0 280 280" className="w-full h-full">
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1.0].map((level) => (
          <polygon
            key={level}
            points={metrics
              .map((_, i) => {
                const p = getPoint(i, level);
                return `${p.x},${p.y}`;
              })
              .join(" ")}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
          />
        ))}

        {/* Axis lines */}
        {metrics.map((_, i) => {
          const p = getPoint(i, 1);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Target area */}
        <motion.path
          d={targetPath}
          fill="hsl(var(--primary) / 0.05)"
          stroke="hsl(var(--primary) / 0.2)"
          strokeWidth="1"
          strokeDasharray="4 4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />

        {/* Current values */}
        <motion.path
          d={currentPath}
          fill="hsl(var(--primary) / 0.15)"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* Data points */}
        {metrics.map((m, i) => {
          const p = getPoint(i, m.current);
          return (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="3"
              fill="hsl(var(--primary))"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 + i * 0.1 }}
            />
          );
        })}

        {/* Labels */}
        {metrics.map((m, i) => {
          const p = getPoint(i, 1.25);
          return (
            <text
              key={i}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground text-[9px]"
            >
              {m.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default RadarChart;
