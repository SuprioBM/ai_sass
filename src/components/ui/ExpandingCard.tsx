import React, {useState} from "react";
import { motion } from "framer-motion";
import { Eye, Brain, Heart, Zap } from "lucide-react";

interface ExpandingCardProps {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  isActive: boolean;
  onHover: (id: string) => void;
  onLeave: () => void;
  color?: string; // Tailwind color, e.g., 'blue', 'rose'
}

const cards = [
  {
    id: "vision",
    title: "Vision",
    description: "AI's visual reasoning and pattern recognition",
    icon: <Eye />,
    color: "blue",
  },
  {
    id: "memory",
    title: "Memory",
    description: "Store, recall, and evaluate previous tasks",
    icon: <Brain />,
    color: "violet",
  },
  {
    id: "emotion",
    title: "Emotion",
    description: "Simulated empathy and user intent mapping",
    icon: <Heart />,
    color: "rose",
  },
  {
    id: "logic",
    title: "Logic",
    description: "Agent decision trees and rational flow",
    icon: <Zap />,
    color: "emerald",
  },
];
  

export function ExpandingCard({
  id,
  title,
  description,
  icon,
  isActive,
  onHover,
  onLeave,
  color = "blue",
}: ExpandingCardProps) {
  const colorRGB: Record<string, string> = {
    blue: "59,130,246",
    rose: "244,63,94",
    emerald: "5,150,105",
    violet: "139,92,246",
  };

  return (
    <motion.div
      onMouseEnter={() => onHover(id)}
      onMouseLeave={onLeave}
      className={`relative h-80 rounded-xl cursor-pointer overflow-hidden border transition-all duration-300 ease-in-out ${
        isActive ? "w-[400px]" : "w-[80px]"
      }`}
      animate={{
        opacity: isActive ? 1 : 0.6,
        scale: isActive ? 1.02 : 1, // optional polish
      }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`h-full w-full p-4 flex flex-col justify-center bg-gradient-to-br from-black to-black border-${color}-400 border-2 shadow shadow-${color}-500/30`}
        style={{
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex flex-col items-center gap-2">
          {icon && <div className={`text-${color}-400`}>{icon}</div>}
          <h3 className="text-white text-sm font-semibold">{title}</h3>
        </div>

        <motion.p
          className="text-sm text-gray-300 mt-4 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: isActive ? 1 : 0,
            y: isActive ? 0 : 10,
          }}
          transition={{ duration: 0.3 }}
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
}


export function ExpandingCardRow() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="flex w-full space-y-3 justify-center">
      {cards.map((card) => (
        <ExpandingCard
          key={card.id}
          {...card}
          isActive={active === card.id}
          onHover={setActive}
          onLeave={() => setActive(null)}
        />
      ))}
    </div>
  );
}