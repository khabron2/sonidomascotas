export enum AnimalId {
  PERRO = "perro",
  GATO = "gato",
  CONEJO = "conejo",
  CANARIO = "canario",
  TORTUGA = "tortuga",
  PEZ = "pez"
}

export interface Animal {
  id: AnimalId;
  name: string; // e.g., "Perro"
  scientificOrFamilyName: string; // e.g., "Canino" or "Mascota leal"
  onomatopoeia: string; // e.g., "¡Guau, guau!"
  description: string; // Toddler friendly info
  imageUrl: string;
  bgColor: string; // Tailwind class like "bg-amber-100" or similar
  borderColor: string; // Tailwind border class
  textColor: string; // Text color class
  accentColor: string; // Button bg class
  funFact: string; // Toddler fact
}

export interface QuizQuestion {
  correctAnimalId: AnimalId;
  options: AnimalId[];
  playedSound: boolean;
}

export type AppTab = "explore" | "quiz" | "memory";
