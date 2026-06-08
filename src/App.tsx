import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  HelpCircle, 
  Brain, 
  Star, 
  VolumeX,
  Volume1,
  BookOpen
} from "lucide-react";
import { AppTab, Animal, AnimalId } from "./types";
import { ANIMALS } from "./data/animals";
import AnimalCard from "./components/AnimalCard";
import AnimalQuiz from "./components/AnimalQuiz";
import AnimalMemory from "./components/AnimalMemory";
import { playAnimalSynthesizedSound } from "./utils/audioSynth";

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("explore");
  const [activeSoundId, setActiveSoundId] = useState<AnimalId | null>(null);
  const [stars, setStars] = useState<number>(() => {
    const saved = localStorage.getItem("sonidos_animales_stars");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [muteAudio, setMuteAudio] = useState<boolean>(false);

  // Sync stars to localStorage
  const handleScoreUp = () => {
    const newStars = stars + 10;
    setStars(newStars);
    localStorage.setItem("sonidos_animales_stars", newStars.toString());
  };

  const playSoundEffect = (animal: Animal) => {
    if (muteAudio) return;
    setActiveSoundId(animal.id);
    playAnimalSynthesizedSound(animal.id, () => {
      setActiveSoundId(null);
    });
  };

  return (
    <div id="main-panel" className="min-h-screen bg-[#E0F2FE] flex flex-col font-sans relative overflow-x-hidden select-none pb-16">
      
      {/* Immersive UI Glow Backdrops */}
      <div className="absolute inset-0 pointer-events-none opacity-50 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-[#BAE6FD] blur-[150px]"></div>
      </div>

      {/* Floating clouds for extra friendly depth */}
      <div className="absolute top-12 left-[-5%] w-[30%] opacity-25 animate-pulse duration-10000 pointer-events-none">
        <svg viewBox="0 0 100 60" fill="#ffffff" className="w-full h-auto">
          <path d="M 20 40 A 15 15 0 0 1 50 30 A 18 18 0 0 1 85 41 A 15 15 0 0 1 80 55 L 20 55 Z" />
        </svg>
      </div>

      {/* Header Bar */}
      <header id="header-bar" className="w-full max-w-7xl mx-auto px-6 pt-10 pb-4 grid grid-cols-1 md:grid-cols-2 items-center gap-6 z-20">
        {/* Brand & Mascot based on Immersive UI */}
        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          <motion.div 
            animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 0.95, 1] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="bg-[#FCD34D] p-3.5 rounded-[24px] border-4 border-[#0EA5E9] shadow-lg text-4xl"
          >
            🦁
          </motion.div>
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#0369A1] drop-shadow-sm uppercase">
              Animal <span className="text-[#F59E0B]">Sounds</span>
            </h1>
            <p className="text-sm md:text-base font-bold text-[#075985] mt-1 opacity-80">
              Tap a photo to hear your friend make a sound! 🐾
            </p>
          </div>
        </div>

        {/* Global Stats and Sound Controls */}
        <div className="flex items-center justify-center md:justify-end gap-3.5">
          {/* Audio toggle control */}
          <button
            onClick={() => {
              setMuteAudio(!muteAudio);
              if (!muteAudio) {
                window.speechSynthesis.cancel();
              }
            }}
            className={`flex items-center gap-2 rounded-2xl py-3 px-5 font-black shadow-md border-b-4 cursor-pointer transition-all active:scale-95 text-sm ${
              muteAudio
                ? "bg-slate-300 border-slate-500 text-slate-700"
                : "bg-[#F59E0B] hover:bg-amber-600 border-[#D97706] text-white"
            }`}
            style={{ touchAction: "manipulation" }}
            aria-label={muteAudio ? "Unmute sound" : "Mute sound"}
          >
            {muteAudio ? <VolumeX className="h-5 w-5" /> : <Volume1 className="h-5 w-5" />}
            <span>{muteAudio ? "Sound Off" : "Sound On"}</span>
          </button>

          {/* Stars reward board */}
          <div className="flex items-center gap-2 bg-[#FCD34D] text-[#854D0E] font-black px-6 py-3 rounded-2xl shadow-lg border-b-4 border-amber-500">
            <Star className="h-5.5 w-5.5 text-amber-950 fill-amber-700 animate-bounce" />
            <span className="text-md tracking-wide">{stars} Stars!</span>
          </div>
        </div>
      </header>

      {/* Activity Navigation Center (Big friendly Immersive UI tabs) */}
      <nav id="nav-tabs" className="w-full max-w-4xl mx-auto px-4 mt-6 z-20">
        <ul className="flex bg-white/90 backdrop-blur-md rounded-[32px] p-2.5 shadow-xl border-3 border-[#BAE6FD] gap-2">
          
          {/* Tab 1: Explore Animals */}
          <li className="flex-1">
            <button
              onClick={() => {
                setActiveTab("explore");
              }}
              className={`w-full py-4 px-3 sm:px-5 rounded-2xl font-black text-sm sm:text-base flex flex-col sm:flex-row items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "explore"
                  ? "bg-[#0EA5E9] text-white shadow-md shadow-sky-200"
                  : "text-[#0369A1] hover:bg-sky-50"
              }`}
              style={{ touchAction: "manipulation" }}
            >
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
              <span>Explore Sounds</span>
            </button>
          </li>

          {/* Tab 2: Guesser guessing game */}
          <li className="flex-1">
            <button
              onClick={() => {
                setActiveTab("quiz");
              }}
              className={`w-full py-4 px-3 sm:px-5 rounded-2xl font-black text-sm sm:text-base flex flex-col sm:flex-row items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "quiz"
                  ? "bg-[#F97316] text-white shadow-md shadow-orange-200"
                  : "text-[#9A3412] hover:bg-orange-50"
              }`}
              style={{ touchAction: "manipulation" }}
            >
              <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6" />
              <span>Who Am I?</span>
            </button>
          </li>

          {/* Tab 3: Matching games */}
          <li className="flex-1">
            <button
              onClick={() => {
                setActiveTab("memory");
              }}
              className={`w-full py-4 px-3 sm:px-5 rounded-2xl font-black text-sm sm:text-base flex flex-col sm:flex-row items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "memory"
                  ? "bg-[#EC4899] text-white shadow-md shadow-pink-200"
                  : "text-[#9D174D] hover:bg-pink-50"
              }`}
              style={{ touchAction: "manipulation" }}
            >
              <Brain className="h-5 w-5 sm:h-6 sm:w-6" />
              <span>Memory Game</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Container Content */}
      <main id="main-content" className="w-full max-w-7xl mx-auto px-6 mt-10 flex-grow z-25 relative">
        <AnimatePresence mode="wait">
          {activeTab === "explore" && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 pb-10"
            >
              {ANIMALS.map((animal) => (
                <AnimalCard
                  key={animal.id}
                  id={`animal-card-${animal.id}`}
                  animal={animal}
                  isPlaying={activeSoundId === animal.id}
                  onPlaySound={() => {
                    playSoundEffect(animal);
                    handleScoreUp();
                  }}
                />
              ))}
            </motion.div>
          )}

          {activeTab === "quiz" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="pb-10"
            >
              <AnimalQuiz 
                id="animal-quizzes" 
                onScoreUp={handleScoreUp} 
              />
            </motion.div>
          )}

          {activeTab === "memory" && (
            <motion.div
              key="memory"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="pb-10"
            >
              <AnimalMemory 
                id="animal-memory-pair-game" 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Decorative grass/landscape Immersive UI bottom bar */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 z-20 border-t border-[#BAE6FD]/40 mt-auto">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-[#0369A1]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.984 3.984 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd"></path>
            </svg>
          </div>
          <div className="w-48 sm:w-64 h-3 bg-white/50 rounded-full overflow-hidden shadow-inner">
            <motion.div 
              animate={{ width: ["30%", "85%", "55%", "95%", "40%", "70%"] }}
              transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
              className="h-full bg-[#0EA5E9] rounded-full"
            ></motion.div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3.5 bg-white/90 rounded-2xl font-black text-[#0369A1] shadow-md border-2 border-sky-100 flex items-center gap-2 text-sm">
            <span className="w-3.5 h-3.5 bg-green-500 rounded-full animate-ping"></span>
            <span>Ready to Play!</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
