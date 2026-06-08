import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, Sparkles, AlertCircle, RotateCcw, Star, CheckCircle } from "lucide-react";
import { Animal, AnimalId, QuizQuestion } from "../types";
import { ANIMALS } from "../data/animals";
import { playAnimalSynthesizedSound, speakAnimalNameAndSound } from "../utils/audioSynth";

interface AnimalQuizProps {
  onScoreUp: () => void;
  id: string;
}

export default function AnimalQuiz({ onScoreUp, id }: AnimalQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<AnimalId | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  // Generate a random question
  const generateNewQuestion = () => {
    // Pick a random animal
    const correctAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    
    // Pick 2 other random unique animals
    const remaining = ANIMALS.filter((a) => a.id !== correctAnimal.id);
    const shuffledRemaining = [...remaining].sort(() => 0.5 - Math.random());
    const distractors = shuffledRemaining.slice(0, 2);

    // Merge options and shuffle
    const options = [correctAnimal.id, ...distractors.map((d) => d.id)].sort(
      () => 0.5 - Math.random()
    );

    setCurrentQuestion({
      correctAnimalId: correctAnimal.id,
      options,
      playedSound: false,
    });
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsAnswerCorrect(null);
  };

  useEffect(() => {
    generateNewQuestion();
  }, []);

  // Play the sound of the correct animal
  const handlePlaySound = () => {
    if (!currentQuestion) return;
    setIsSynthesizing(true);
    playAnimalSynthesizedSound(currentQuestion.correctAnimalId, () => {
      setIsSynthesizing(false);
    });
  };

  // Play TTS clue of correct animal
  const handlePlayClue = () => {
    if (!currentQuestion) return;
    const animal = ANIMALS.find((a) => a.id === currentQuestion.correctAnimalId);
    if (!animal) return;
    
    setIsSynthesizing(true);
    const clueText = `Who am I? ${animal.description}`;
    
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(clueText);
      utterance.lang = "en-US";
      utterance.rate = 0.95;
      utterance.pitch = 1.35; // Cute high pitch voice
      utterance.onend = () => setIsSynthesizing(false);
      utterance.onerror = () => setIsSynthesizing(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsSynthesizing(false), 2000);
    }
  };

  // Automatically play sound when question compiles
  useEffect(() => {
    if (currentQuestion) {
      const timer = setTimeout(() => {
        handlePlaySound();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentQuestion?.correctAnimalId]);

  const handleSelectAnswer = (animalId: AnimalId) => {
    if (isAnswered) return;

    setSelectedAnswer(animalId);
    setIsAnswered(true);

    const isCorrect = animalId === currentQuestion?.correctAnimalId;
    setIsAnswerCorrect(isCorrect);

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }
      onScoreUp();
      
      // Celebrate with audio name
      const correctAnimal = ANIMALS.find((a) => a.id === animalId)!;
      speakAnimalNameAndSound(correctAnimal.name, correctAnimal.onomatopoeia);
    } else {
      setStreak(0);
      // Gentle alert sound in English
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance("Close! Try another one!");
        utterance.lang = "en-US";
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  if (!currentQuestion) return null;

  const correctAnimal = ANIMALS.find((a) => a.id === currentQuestion.correctAnimalId)!;

  return (
    <div id={id} className="w-full max-w-4xl mx-auto flex flex-col items-center">
      
      {/* Score and Streak Dashboard */}
      <div className="w-full flex items-center justify-between bg-white/80 backdrop-blur-md rounded-2xl py-3 px-6 shadow-sm border border-orange-100 mb-6">
        <div className="flex items-center gap-2">
          <Star className="text-yellow-500 fill-yellow-400 h-6 w-6 animate-spin-slow" />
          <span className="text-lg font-black text-amber-900">
            Current Streak: <span className="text-amber-500 text-xl">{streak}</span> ⭐
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-yellow-100 rounded-full py-1 px-4 text-xs font-black text-amber-800">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Best Streak: {bestStreak}</span>
        </div>
      </div>

      {/* Main Guessing Arena Card */}
      <div className="w-full bg-white rounded-3xl border-4 border-amber-300 p-6 md:p-8 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
        
        {/* Dynamic Wave background decorative */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-yellow-300 via-pink-400 to-sky-400"></div>

        <motion.div
          key={currentQuestion.correctAnimalId}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full flex flex-col items-center"
        >
          <span className="rounded-full bg-amber-100 text-amber-800 px-4 py-1.5 text-xs font-extrabold tracking-wide uppercase mb-3">
            Guessing Game!
          </span>
          <h2 className="text-4xl font-black text-gray-800 tracking-tight mb-2">
            Who makes this sound?
          </h2>
          <p className="text-gray-500 font-semibold mb-6 max-w-md">
            Press the big blue button to listen, then tap the correct animal below.
          </p>

          {/* Large Speaker & Play Action Area */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.93 }}
              onClick={handlePlaySound}
              disabled={isSynthesizing}
              className={`relative flex items-center gap-3 rounded-3xl px-8 py-5 text-xl font-black text-white shadow-xl transition-all cursor-pointer ${
                isSynthesizing 
                  ? "bg-slate-400 border-b-6 border-slate-600 scale-95" 
                  : "bg-sky-500 hover:bg-sky-600 border-b-6 border-sky-700 hover:shadow-sky-200"
              }`}
              style={{ touchAction: "manipulation" }}
            >
              <Volume2 className={`h-8 w-8 ${isSynthesizing ? "animate-pulse" : ""}`} />
              <span>Listen to Sound</span>
              {isSynthesizing && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-pink-500"></span>
                </span>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlayClue}
              disabled={isSynthesizing}
              className="flex items-center gap-2 rounded-2xl bg-teal-100 hover:bg-teal-200 text-teal-800 border-3 border-teal-300 font-extrabold py-3.5 px-6 shadow-sm transition-all text-sm cursor-pointer"
              style={{ touchAction: "manipulation" }}
            >
              <Sparkles className="h-5 w-5 text-teal-500" />
              <span>Get Clue (Voice)</span>
            </motion.button>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
            {currentQuestion.options.map((optionId) => {
              const animal = ANIMALS.find((a) => a.id === optionId)!;
              const isThisSelected = selectedAnswer === optionId;
              const isCorrectTarget = optionId === currentQuestion.correctAnimalId;

              let cardStyle = "bg-white border-gray-200 hover:border-amber-400 hover:shadow-md";
              
              if (isAnswered) {
                if (isThisSelected) {
                  cardStyle = isCorrectTarget 
                    ? "bg-emerald-50 border-emerald-500 ring-4 ring-emerald-200 scale-102" 
                    : "bg-rose-50 border-rose-500 opacity-70 scale-98";
                } else if (isCorrectTarget) {
                  // highlight correct answer after failure
                  cardStyle = "bg-emerald-50 border-emerald-400 ring-4 ring-emerald-100";
                } else {
                  cardStyle = "opacity-40 scale-95 border-gray-100";
                }
              }

              return (
                <motion.button
                  key={optionId}
                  disabled={isAnswered}
                  onClick={() => handleSelectAnswer(optionId)}
                  whileHover={!isAnswered ? { y: -5, scale: 1.03 } : {}}
                  whileTap={!isAnswered ? { scale: 0.97 } : {}}
                  className={`flex flex-col items-center p-4 rounded-2xl border-4 text-center transition-all cursor-pointer ${cardStyle}`}
                  style={{ touchAction: "manipulation" }}
                >
                  <div className="relative w-full aspect-square rounded-xl bg-gray-50 overflow-hidden mb-3 border-2 border-gray-100">
                    <img
                      src={animal.imageUrl}
                      alt={animal.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                    {isAnswered && isThisSelected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        {isCorrectTarget ? (
                          <span className="text-5xl">🎉</span>
                        ) : (
                          <span className="text-4xl text-rose-500 font-bold bg-white/95 rounded-full px-3 py-1 shadow">Oops</span>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-2xl font-black text-gray-800">
                    {animal.name}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Feedback & Celebrate Panel */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="mt-8 flex flex-col items-center"
              >
                {isAnswerCorrect ? (
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: 2 }}
                      className="bg-emerald-100 text-emerald-800 font-extrabold text-2xl py-3 px-8 rounded-full shadow-md border-3 border-emerald-300 flex items-center gap-2.5 mb-4"
                    >
                      <CheckCircle className="h-7 w-7 text-emerald-600 fill-emerald-100" />
                      <span>GREAT JOB! 🎉 It's the {correctAnimal.name}!</span>
                    </motion.div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="bg-amber-100 text-amber-800 font-extrabold text-lg py-3 px-6 rounded-full shadow-md border-3 border-amber-300 flex items-center gap-2 mb-4">
                      <AlertCircle className="h-6 w-6 text-amber-600" />
                      <span>Almost! It's the {correctAnimal.name}! Try again!</span>
                    </div>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={generateNewQuestion}
                  className="mt-4 flex items-center gap-2 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black py-4 px-8 text-lg border-b-6 border-orange-700 shadow-md transition-all cursor-pointer"
                  style={{ touchAction: "manipulation" }}
                >
                  <RotateCcw className="h-5 w-5" />
                  <span>Next Question</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
