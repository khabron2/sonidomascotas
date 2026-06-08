import { Animal, AnimalId } from "../types";

// Import the generated photographic assets to ensure Vite builds them correctly
import dogPhoto from "../assets/images/dog_photo_1780915565546.png";
import catPhoto from "../assets/images/cat_photo_1780915581006.png";
import rabbitPhoto from "../assets/images/rabbit_photo_1780915594499.png";
import canaryPhoto from "../assets/images/canary_photo_1780915607766.png";
import turtlePhoto from "../assets/images/turtle_photo_1780915619108.png";
import fishPhoto from "../assets/images/fish_photo_1780915631461.png";

export const ANIMALS: Animal[] = [
  {
    id: AnimalId.PERRO,
    name: "Dog",
    scientificOrFamilyName: "Your loyal friend!",
    onomatopoeia: "Woof, woof!",
    description: "Loves to run, wag its tail happily, and play with the ball.",
    imageUrl: dogPhoto,
    bgColor: "bg-amber-100 hover:bg-amber-250",
    borderColor: "border-amber-400",
    textColor: "text-amber-800",
    accentColor: "bg-amber-500 hover:bg-amber-600",
    funFact: "It communicates with you by wagging its happy tail very fast!"
  },
  {
    id: AnimalId.GATO,
    name: "Cat",
    scientificOrFamilyName: "Very agile and playful!",
    onomatopoeia: "Meow, meow!",
    description: "Likes to sleep in the sun, purr softly, and stretch like a champion.",
    imageUrl: catPhoto,
    bgColor: "bg-violet-100 hover:bg-violet-250",
    borderColor: "border-violet-400",
    textColor: "text-violet-800",
    accentColor: "bg-violet-500 hover:bg-violet-600",
    funFact: "Cats can jump up to six times their own height. Incredible!"
  },
  {
    id: AnimalId.CONEJO,
    name: "Rabbit",
    scientificOrFamilyName: "A fluffy jumper!",
    onomatopoeia: "Squeak, squeak!",
    description: "Has very long ears, a cotton-soft tail, and loves eating delicious carrots.",
    imageUrl: rabbitPhoto,
    bgColor: "bg-pink-100 hover:bg-pink-250",
    borderColor: "border-pink-400",
    textColor: "text-pink-800",
    accentColor: "bg-pink-500 hover:bg-pink-600",
    funFact: "They do a funny jumping dance when they are super happy!"
  },
  {
    id: AnimalId.CANARIO,
    name: "Canary",
    scientificOrFamilyName: "A singer of the forest!",
    onomatopoeia: "Tweet, tweet!",
    description: "Flies from branch to branch singing beautiful melodies with its bright yellow feathers.",
    imageUrl: canaryPhoto,
    bgColor: "bg-yellow-100 hover:bg-yellow-250",
    borderColor: "border-yellow-400",
    textColor: "text-yellow-800",
    accentColor: "bg-yellow-500 hover:bg-yellow-600",
    funFact: "They love to bathe in fresh pools of water and shake their little wings!"
  },
  {
    id: AnimalId.TORTUGA,
    name: "Turtle",
    scientificOrFamilyName: "A patient walker!",
    onomatopoeia: "Munch, munch!",
    description: "Carries its little house on its back, walks slowly, and loves to eat green leaves.",
    imageUrl: turtlePhoto,
    bgColor: "bg-emerald-100 hover:bg-emerald-250",
    borderColor: "border-emerald-400",
    textColor: "text-emerald-800",
    accentColor: "bg-emerald-500 hover:bg-emerald-600",
    funFact: "Its shell is super strong armor that grows along with it!"
  },
  {
    id: AnimalId.PEZ,
    name: "Fish",
    scientificOrFamilyName: "A dancer of the water!",
    onomatopoeia: "Glub, glub!",
    description: "Has shiny scales and puffs its cheeks making cute bubbles underwater.",
    imageUrl: fishPhoto,
    bgColor: "bg-sky-100 hover:bg-sky-250",
    borderColor: "border-sky-400",
    textColor: "text-sky-800",
    accentColor: "bg-sky-500 hover:bg-sky-600",
    funFact: "They keep their eyes always open, even when they are sleeping!"
  }
];
