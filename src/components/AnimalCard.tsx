import { motion } from "motion/react";
import { Volume2 } from "lucide-react";
import { Animal } from "../types";

interface AnimalCardProps {
  animal: Animal;
  isPlaying: boolean;
  onPlaySound: () => void;
  id: string;
  key?: string | number;
}

export default function AnimalCard({
  animal,
  isPlaying,
  onPlaySound,
  id,
}: AnimalCardProps) {
  // Map animals to Immersive UI custom border and 3D shadow offsets
  const themeMap: Record<string, { border: string; shadow: string; glow: string; text: string; accent: string; innerBg: string }> = {
    perro: {
      border: "border-[#0EA5E9]",
      shadow: "shadow-[0_16px_0_rgba(14,165,233,0.15)] hover:shadow-[0_20px_0_rgba(14,165,233,0.2)]",
      glow: "shadow-[0_0_20px_rgba(14,165,233,0.3)]",
      text: "text-[#0369A1]",
      accent: "bg-[#0EA5E9] hover:bg-[#0284C7] border-[#0284C7]",
      innerBg: "bg-[#FCD34D]"
    },
    gato: {
      border: "border-[#F97316]",
      shadow: "shadow-[0_16px_0_rgba(249,115,22,0.15)] hover:shadow-[0_20px_0_rgba(249,115,22,0.2)]",
      glow: "shadow-[0_0_20px_rgba(249,115,22,0.3)]",
      text: "text-[#9A3412]",
      accent: "bg-[#F97316] hover:bg-[#EA580C] border-[#EA580C]",
      innerBg: "bg-[#FED7AA]"
    },
    conejo: {
      border: "border-[#EC4899]",
      shadow: "shadow-[0_16px_0_rgba(236,72,153,0.15)] hover:shadow-[0_20px_0_rgba(236,72,153,0.2)]",
      glow: "shadow-[0_0_20px_rgba(236,72,153,0.3)]",
      text: "text-[#9D174D]",
      accent: "bg-[#EC4899] hover:bg-[#DB2777] border-[#DB2777]",
      innerBg: "bg-[#FBCFE8]"
    },
    canario: {
      border: "border-[#EAB308]",
      shadow: "shadow-[0_16px_0_rgba(234,179,8,0.15)] hover:shadow-[0_20px_0_rgba(234,179,8,0.2)]",
      glow: "shadow-[0_0_20px_rgba(234,179,8,0.3)]",
      text: "text-[#854D0E]",
      accent: "bg-[#EAB308] hover:bg-[#CA8A04] border-[#CA8A04]",
      innerBg: "bg-[#FEF08A]"
    },
    tortuga: {
      border: "border-[#22C55E]",
      shadow: "shadow-[0_16px_0_rgba(34,197,94,0.15)] hover:shadow-[0_20px_0_rgba(34,197,94,0.2)]",
      glow: "shadow-[0_0_20px_rgba(34,197,94,0.3)]",
      text: "text-[#166534]",
      accent: "bg-[#22C55E] hover:bg-[#16A34A] border-[#16A34A]",
      innerBg: "bg-[#BBF7D0]"
    },
    pez: {
      border: "border-[#6366F1]",
      shadow: "shadow-[0_16px_0_rgba(99,102,241,0.15)] hover:shadow-[0_20px_0_rgba(99,102,241,0.2)]",
      glow: "shadow-[0_0_20px_rgba(99,102,241,0.3)]",
      text: "text-[#3730A3]",
      accent: "bg-[#6366F1] hover:bg-[#4F46E5] border-[#4F46E5]",
      innerBg: "bg-[#C7D2FE]"
    },
  };

  const style = themeMap[animal.id] || {
    border: "border-[#0EA5E9]",
    shadow: "shadow-[0_16px_0_rgba(14,165,233,0.15)]",
    glow: "shadow-[0_0_20px_rgba(14,165,233,0.3)]",
    text: "text-[#0369A1]",
    accent: "bg-[#0EA5E9]",
    innerBg: "bg-white"
  };

  return (
    <motion.div
      id={id}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`relative flex flex-col overflow-hidden rounded-[48px] border-[6px] ${style.border} ${style.shadow} bg-white/90 backdrop-blur-md p-5 transition-all text-center`}
    >
      {/* Dynamic Sounding/Rippling Wave effect */}
      {isPlaying && (
        <div className="absolute inset-0 bg-white/30 backdrop-blur-2xs z-10 flex items-center justify-center rounded-[42px]">
          <div className="relative flex items-center justify-center">
            <span className="absolute inline-flex h-24 w-24 animate-ping rounded-full bg-current opacity-75 text-pink-400"></span>
            <span className="absolute inline-flex h-16 w-16 animate-ping rounded-full bg-current opacity-75 text-sky-400"></span>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 0.9, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-6xl"
            >
              🎵
            </motion.div>
          </div>
        </div>
      )}

      {/* Main Image Frame with a soft white glow border and custom colored depth card background */}
      <div className={`relative aspect-square w-full overflow-hidden rounded-[32px] ${style.innerBg} p-1.5 shadow-inner`}>
        <img
          src={animal.imageUrl}
          alt={`Real photo of a ${animal.name}`}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover rounded-[28px] transition-transform duration-500 hover:scale-110"
        />
        
        {/* Cute Onomatopoeia Badge */}
        <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-4 py-2 text-md font-black tracking-wide text-gray-800 shadow-md">
          {animal.onomatopoeia}
        </span>
      </div>

      {/* Content Section */}
      <div className="mt-4 flex flex-col flex-grow text-center">
        <h3 className={`text-3xl font-black tracking-tight ${style.text}`}>
          {animal.name}
        </h3>
        <p className="text-sm font-semibold text-slate-500 italic mt-0.5">
          {animal.scientificOrFamilyName}
        </p>
        
        <p className="mt-3 text-[15px] text-slate-600 font-bold leading-relaxed px-1">
          {animal.description}
        </p>

        {/* Action Buttons Footer */}
        <div className="mt-auto pt-5 flex flex-col gap-3">
          {/* Natural Sound Audio Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlaySound();
            }}
            className={`flex items-center justify-center gap-2.5 rounded-2xl py-4 px-4 font-black text-white shadow-md transition-all active:scale-90 cursor-pointer border-b-6 ${style.accent}`}
            style={{ touchAction: "manipulation" }}
            aria-label={`Listen to ${animal.name}'s sound`}
          >
            <Volume2 className="h-5.5 w-5.5 animate-pulse" />
            <span className="text-base tracking-wide">Play Sound</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
