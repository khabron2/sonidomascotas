import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, RotateCcw, Sparkles, Award } from "lucide-react";
import { Animal, AnimalId } from "../types";
import { ANIMALS } from "../data/animals";
import { playAnimalSynthesizedSound } from "../utils/audioSynth";

interface MemoryCard {
  uniqueId: string;
  animalId: AnimalId;
  imageUrl: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface AnimalMemoryProps {
  id: string;
}

export default function AnimalMemory({ id }: AnimalMemoryProps) {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [matches, setMatches] = useState<number>(0);
  const [isWon, setIsWon] = useState<boolean>(false);

  // Initialize and shuffle deck of 12 cards (6 pairs)
  const initializeDeck = () => {
    const deck: MemoryCard[] = [];
    
    ANIMALS.forEach((animal) => {
      // Create pair for each animal
      const card1: MemoryCard = {
        uniqueId: `${animal.id}-1`,
        animalId: animal.id,
        imageUrl: animal.imageUrl,
        name: animal.name,
        isFlipped: false,
        isMatched: false,
      };
      
      const card2: MemoryCard = {
        uniqueId: `${animal.id}-2`,
        animalId: animal.id,
        imageUrl: animal.imageUrl,
        name: animal.name,
        isFlipped: false,
        isMatched: false,
      };

      deck.push(card1, card2);
    });

    // Shuffle deck
    const shuffledDeck = deck.sort(() => 0.5 - Math.random());
    setCards(shuffledDeck);
    setSelectedCards([]);
    setMoves(0);
    setMatches(0);
    setIsWon(false);
  };

  useEffect(() => {
    initializeDeck();
  }, []);

  const handleCardClick = (currentIndex: number) => {
    // If already flipped, matched, or we already have 2 flipped cards in action, ignore
    if (
      cards[currentIndex].isFlipped ||
      cards[currentIndex].isMatched ||
      selectedCards.length >= 2
    ) {
      return;
    }

    // Flip card
    const updatedCards = [...cards];
    updatedCards[currentIndex].isFlipped = true;
    setCards(updatedCards);

    const nextSelection = [...selectedCards, currentIndex];
    setSelectedCards(nextSelection);

    // Check match if 2 cards are selected
    if (nextSelection.length === 2) {
      setMoves((prev) => prev + 1);
      const [firstIndex, secondIndex] = nextSelection;

      if (updatedCards[firstIndex].animalId === updatedCards[secondIndex].animalId) {
        // MATCH!
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstIndex].isMatched = true;
          matchedCards[secondIndex].isMatched = true;
          setCards(matchedCards);
          setSelectedCards([]);
          setMatches((prev) => prev + 1);

          // Play successful animal sound!
          playAnimalSynthesizedSound(matchedCards[firstIndex].animalId);

          // Check Win Condition
          if (matchedCards.filter((c) => !c.isMatched).length === 0) {
            setIsWon(true);
          }
        }, 300);
      } else {
        // NO MATCH! Flip them back over after delay
        setTimeout(() => {
          const flippedBackCards = [...cards];
          flippedBackCards[firstIndex].isFlipped = false;
          flippedBackCards[secondIndex].isFlipped = false;
          setCards(flippedBackCards);
          setSelectedCards([]);
        }, 900);
      }
    }
  };

  return (
    <div id={id} className="w-full max-w-4xl mx-auto flex flex-col items-center">
      
      {/* HUD Info */}
      <div className="w-full flex items-center justify-between bg-white/80 backdrop-blur-md rounded-2xl py-3 px-6 shadow-sm border border-pink-100 mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="text-pink-500 fill-pink-400 h-6 w-6" />
          <span className="text-lg font-black text-pink-900">
            Pairs Found: <span className="text-pink-600 text-xl">{matches} of 6</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-black text-gray-500 uppercase bg-gray-100 px-3 py-1 rounded-full">
            Moves: {moves}
          </span>
          <button
            onClick={initializeDeck}
            className="flex items-center gap-1 text-xs font-black text-pink-700 bg-pink-100 hover:bg-pink-200 border-2 border-pink-300 py-1.5 px-3.5 rounded-full shadow-xs cursor-pointer transition-all active:scale-95"
            style={{ touchAction: "manipulation" }}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {cards.length === 0 ? null : (
        <AnimatePresence>
          {isWon ? (
            /* Celebration Screen */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full bg-white rounded-3xl border-4 border-pink-300 p-8 shadow-xl text-center flex flex-col items-center relative overflow-hidden"
            >
              {/* Rain and star sparks effect */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400-300"></div>
              
              <div className="relative flex items-center justify-center mb-6">
                <span className="absolute inline-flex h-24 w-24 animate-ping rounded-full bg-pink-300 opacity-75"></span>
                <div className="relative bg-pink-100 p-5 rounded-full border-3 border-pink-300 text-pink-600">
                  <Award className="h-16 w-16 animate-bounce" />
                </div>
              </div>

              <h2 className="text-4xl font-black text-pink-900 tracking-tight">
                YOU ARE A CHAMPION! 🎉
              </h2>
              <p className="text-lg font-semibold text-gray-600 mt-2 max-w-md">
                You found all animal pairs in <span className="text-pink-600 font-extrabold">{moves}</span> moves. Your memory is fantastic! 🌟
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={initializeDeck}
                className="mt-8 flex items-center gap-2.5 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-black py-4 px-8 text-lg border-b-6 border-pink-700 shadow-md transition-all cursor-pointer"
                style={{ touchAction: "manipulation" }}
              >
                <RotateCcw className="h-5 w-5" />
                <span>Play Again?</span>
              </motion.button>
            </motion.div>
          ) : (
            /* Standard Grid Deck */
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 w-full">
              {cards.map((card, idx) => {
                const isOpen = card.isFlipped || card.isMatched;

                return (
                  <div
                    key={card.uniqueId}
                    className="aspect-square relative w-full cursor-pointer perspective"
                    onClick={() => handleCardClick(idx)}
                  >
                    <motion.div
                      animate={{ rotateY: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="w-full h-full relative preserve-3d"
                    >
                      {/* CARD BACK DESIGN */}
                      <div
                        className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 border-4 border-white shadow-md flex items-center justify-center backface-hidden"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <div className="text-center">
                          <span className="text-3xl sm:text-4xl block animate-pulse">🐾</span>
                          <span className="text-xs sm:text-sm font-black tracking-wider text-pink-100 uppercase block mt-1">
                            Tap!
                          </span>
                        </div>
                      </div>

                      {/* CARD FRONT DESIGN */}
                      <div
                        className="absolute inset-0 w-full h-full rounded-2xl bg-white border-4 border-pink-300 shadow-md overflow-hidden flex flex-col justify-between backface-hidden"
                        style={{
                          transform: "rotateY(180deg)",
                          backfaceVisibility: "hidden",
                        }}
                      >
                        <div className="h-[75%] w-full overflow-hidden bg-slate-50 border-b-2 border-pink-100">
                          <img
                            src={card.imageUrl}
                            alt={card.name}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="h-[25%] flex items-center justify-center bg-pink-50 p-1">
                          <span className="text-sm font-extrabold text-pink-900 leading-none truncate">
                            {card.name}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
