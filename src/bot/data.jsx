// Bot responses, sounds, expressions and interact go here

// Emoji mapping - maps text emojis to their PNG file names
export const EMOJI_MAP = {
  // Faces and expressions
  "😀": "grinning_face_3d.png",
  "😃": "grinning_face_with_big_eyes_3d.png",
  "😄": "grinning_face_with_smiling_eyes_3d.png",
  "😁": "beaming_face_with_smiling_eyes_3d.png",
  "😆": "grinning_squinting_face_3d.png",
  "😅": "grinning_face_with_sweat_3d.png",
  "😂": "face_with_tears_of_joy_3d.png",
  "🤣": "rolling_on_the_floor_laughing_3d (1).png",
  "🙂": "slightly_smiling_face_3d.png",
  "🙃": "upside-down_face_3d (1).png",
  "😉": "winking_face_3d.png",
  "😊": "smiling_face_with_smiling_eyes_3d.png",
  "🥰": "smiling_face_with_hearts_3d.png",
  "😍": "smiling_face_with_heart-eyes_3d (1).png",
  "🤩": "star-struck_3d.png",
  "😘": "face_blowing_a_kiss_3d.png",
  "😎": "smiling_face_with_sunglasses_3d (1).png",
  "😋": "face_savoring_food_3d.png",
  "😛": "face_with_tongue_3d.png",
  "😜": "winking_face_with_tongue_3d.png",
  "🤪": "zany_face_3d.png",
  "😝": "squinting_face_with_tongue_3d.png",
  "🤓": "nerd_face_3d.png",
  "😏": "smirking_face_3d.png",
  "🤔": "thinking_face_3d.png",
  "😐": "neutral_face_3d.png",
  "😑": "expressionless_face_3d.png",
  "🙄": "face_with_rolling_eyes_3d.png",
  "😌": "relieved_face_3d.png",
  "😔": "pensive_face_3d.png",
  "😪": "sleepy_face_3d.png",
  "😟": "worried_face_3d.png",
  "🙁": "slightly_frowning_face_3d.png",
  "☹️": "frowning_face_3d.png",
  "🥺": "pleading_face_3d.png",
  "😮": "face_with_open_mouth_3d.png",
  "😲": "astonished_face_3d.png",
  "😳": "flushed_face_3d.png",
  "😨": "fearful_face_3d.png",
  "😢": "crying_face_3d.png",
  "😭": "loudly_crying_face_3d.png",
  "😠": "angry_face_3d.png",
  "😡": "pouting_face_3d.png",
  "😤": "face_with_steam_from_nose_3d.png",
  "😫": "tired_face_3d.png",
  "🥱": "yawning_face_3d.png",
  "😴": "sleeping_face_3d.png",
  "🤗": "hugging_face_3d.png",
  "🥳": "partying_face_3d.png",
  "☺️": "smiling_face_3d.png",
  "😗": "kissing_face_3d.png",
  "😚": "kissing_face_with_closed_eyes_3d.png",
  "😙": "kissing_face_with_smiling_eyes_3d.png",
  "😶": "face_without_mouth_3d.png",
  
  // Hearts
  "❤️": "red_heart_3d.png",
  "💔": "broken_heart_3d.png",
  "💓": "beating_heart_3d.png",
  "💖": "smiling_face_with_hearts_3d.png",
  "💗": "beating_heart_3d.png",
  
  // Other symbols
  "🔥": "fire_3d.png",
  "✨": "sparkles_3d.png",
  "🌟": "star-struck_3d.png",
  "💫": "dizzy_3d.png",
  "⭐": "star-struck_3d.png",
  "👀": "eyes_3d.png",
  "👋": "waving_hand_3d.png",
  "👍": "thumbs_up_3d.png",
  "👎": "thumbs_down_3d.png",
  "👌": "ok_hand_3d.png",
  "🤝": "handshake_3d.png",
  "💪": "flexed_biceps_3d.png",
  "🎉": "party_popper_3d.png",
  "🎊": "confetti_ball_3d.png",
  "💯": "hundred_points_3d.png",
  "💬": "speech_balloon_3d.png",
  "💭": "thought_balloon_3d.png",
  "👻": "ghost_3d.png",
  "👽": "alien_3d.png",
  "🤖": "robot_face_3d.png",
  "🤷": "shrug_3d.png",
  "🙌": "raising_hands_3d.png",
  "👏": "clapping_hands_3d.png",
  
  // Weather and nature
  "☀️": "sun_3d.png",
  "🌙": "crescent_moon_3d.png",
  "🌈": "rainbow_3d.png",
  "🌸": "cherry_blossom_3d.png",
  "🌺": "hibiscus_3d.png",
  "🌻": "sunflower_3d.png",
  "🌹": "rose_3d.png",
  "🍀": "four_leaf_clover_3d.png",
  "🌿": "herb_3d.png",
  "🌱": "seedling_3d.png",
  "🌵": "cactus_3d.png",
  "🌴": "palm_tree_3d.png",
  "🌊": "water_wave_3d.png",
  
  // Animals
  "🐶": "dog_face_3d.png",
  "🐱": "cat_face_3d.png",
  "🐭": "mouse_face_3d.png",
  "🐹": "hamster_face_3d.png",
  "🐰": "rabbit_face_3d.png",
  "🦊": "fox_face_3d.png",
  "🐻": "bear_face_3d.png",
  "🐼": "panda_face_3d.png",
  "🐨": "koala_face_3d.png",
  "🐯": "tiger_face_3d.png",
  "🦁": "lion_face_3d.png",
  "🐮": "cow_face_3d.png",
  "🐷": "pig_face_3d.png",
  "🐸": "frog_face_3d.png",
  "🐵": "monkey_face_3d.png",
  "🐔": "chicken_3d.png",
  "🐧": "penguin_3d.png",
  "🦉": "owl_3d.png",
  "🦇": "bat_3d.png",
  "🐺": "wolf_face_3d.png",
};

// Default emoji for when no emoji is found in the text
export const DEFAULT_EMOJI = "slightly_smiling_face_3d.png";

// Helper function to extract first emoji from text and return emoji image path
export const extractEmojiFromText = (text) => {
  if (!text || typeof text !== 'string') {
    return { emoji: DEFAULT_EMOJI.replace('.png', ''), cleanedText: text };
  }
  
  // Match any emoji character (including complex emoji)
  const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
  const matches = text.match(emojiRegex);
  
  if (matches && matches.length > 0) {
    const firstEmoji = matches[0];
    const emojiFile = EMOJI_MAP[firstEmoji];
    
    if (emojiFile) {
      // Remove .png extension to get emoji name
      const emojiName = emojiFile.replace('.png', '');
      // Remove the emoji from text
      const cleanedText = text.replace(firstEmoji, '').trim();
      return { emoji: emojiName, cleanedText };
    }
  }
  
  // No emoji found, return default without .png
  return { emoji: DEFAULT_EMOJI.replace('.png', ''), cleanedText: text };
};

// Helper function to get emoji image path from text emoji
export const getEmojiImage = (textEmoji) => {
  if (!textEmoji) return DEFAULT_EMOJI.replace('.png', '');
  // Remove .png if present
  const cleanEmoji = textEmoji.replace('.png', '');
  return cleanEmoji;
};

// ============================================================
// KNOWLEDGE BASES - General Knowledge, Math, Jokes, etc.
// ============================================================

// Alphabet & Sequences
export const ALPHABET = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z";
export const ALPHABET_LOWER = "a b c d e f g h i j k l m n o p q r s t u v w x y z";

// Days of the week
export const DAYS_OF_WEEK = "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday";

// Months of the year
export const MONTHS_OF_YEAR = "January, February, March, April, May, June, July, August, September, October, November, December";

// Basic numbers
export const NUMBERS = "1, 2, 3, 4, 5, 6, 7, 8, 9, 10";

// Continents
export const CONTINENTS = "Africa, Antarctica, Asia, Europe, North America, South America, Australia";

// Oceans
export const OCEANS = "Pacific Ocean, Atlantic Ocean, Indian Ocean, Arctic Ocean, Southern Ocean";

// Planets in our solar system
export const PLANETS = "Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune";

// Rainbow colors
export const RAINBOW_COLORS = "Red, Orange, Yellow, Green, Blue, Indigo, Violet (ROYGBIV)";

// Basic colors
export const BASIC_COLORS = "Red, Orange, Yellow, Green, Blue, Purple, Pink, Black, White, Gray, Brown";

// Math constants and facts
export const MATH_FACTS = {
  PI: 3.14159,
  EULER: 2.71828,
  SQRT_2: 1.41421,
  CM_IN_METER: 100,
  MILES_IN_KM: 0.621371,
  GRAMS_IN_KG: 1000,
};

// Jokes database
export const JOKES = {
  ANIMAL: [
    {
      setup: "What do you call a cow with no legs?",
      punchline: "Ground beef! 🥩",
    },
    {
      setup: "Why did the chicken go to the seance?",
      punchline: "To talk to the other side! 👻",
    },
    {
      setup: "What do you call a bear with no teeth?",
      punchline: "A gummy bear! 🍬",
    },
    {
      setup: "Why do fish live in saltwater?",
      punchline: "Because pepper makes them sneeze! 🌶️",
    },
    {
      setup: "What do you call a dog magician?",
      punchline: "A Labracadabrador! 🐕",
    },
  ],
  PROGRAMMING: [
    {
      setup: "Why do Java developers wear glasses?",
      punchline: "Because they can't C#! 🤓",
    },
    {
      setup: "How many programmers does it take to change a light bulb?",
      punchline: "None, that's a hardware problem! 💻",
    },
    {
      setup: "Why did the developer go broke?",
      punchline: "Because he lost his cache! 💰",
    },
    {
      setup: "What's a programmer's favorite hangout place?",
      punchline: "Foo Bar! 🍺",
    },
    {
      setup: "Why do programmers prefer dark mode?",
      punchline: "Because light attracts bugs! 🐛",
    },
  ],
  PUNS: [
    {
      setup: "I used to hate facial hair...",
      punchline: "But then it grew on me! 😁",
    },
    {
      setup: "Time flies like an arrow...",
      punchline: "Fruit flies like a banana! 🍌",
    },
    {
      setup: "I'm reading a book about anti-gravity...",
      punchline: "It's impossible to put down! 📖",
    },
    {
      setup: "Did you hear about the mathematician who's afraid of negative numbers?",
      punchline: "He'll stop at nothing to avoid them! ➖",
    },
  ],
  ONE_LINERS: [
    "Why don't scientists trust atoms? Because they make up everything! 🧪",
    "I told my computer I needed a break, and now it won't stop sending me Kit-Kat ads. 🍫",
    "Why did the scarecrow win an award? He was outstanding in his field! 🌾",
    "I'm reading a book on the history of glue – can't put it down! 📖",
    "My wife told me to take the spider out instead of killing it. We went and had some drinks. Cool guy. Wants to be a web developer. 🕷️",
  ],
  GAMING: [
    {
      setup: "Why did the gamer go to school?",
      punchline: "To improve his grades in Mario! 🎮",
    },
    {
      setup: "What's a gamer's favorite type of music?",
      punchline: "Heavy metal... and Zelda! 🎵",
    },
  ],
};

// Would you rather responses - gives personality to choices
export const WOULD_YOU_RATHER_RESPONSES = [
  "That's a tough one! 🤔 I think I'd go with {choice} because {reason}",
  "Ooh, interesting choice! 😊 I'd definitely pick {choice} - {reason}",
  "Hmm, let me think... 🧠 I'd choose {choice}! Here's why: {reason}",
  "Great question! 🎯 I'm team {choice} - {reason}",
  "Okay okay, if I had to pick... 💭 {choice} for sure! {reason}",
];

// Gaming knowledge
export const GAMING_KNOWLEDGE = {
  minecraft: {
    description: "A sandbox game where you build, explore, mine resources, and survive in different game modes!",
    gameModes: "Survival, Creative, Adventure, Spectator",
    popularity: "One of the best-selling games of all time! 🎮",
    community: "Huge community with millions of players worldwide!",
  },
  popular_games: [
    "Minecraft - Building and survival",
    "Fortnite - Battle royale shooter",
    "Roblox - User-generated game platform",
    "League of Legends - Team strategy game",
    "Call of Duty - First-person shooter",
    "The Legend of Zelda - Adventure RPG",
    "Super Mario - Classic platformer",
  ],
};

// Coding knowledge
export const CODING_KNOWLEDGE = {
  languages: [
    "JavaScript - Web development",
    "Python - Data science and automation",
    "Java - Enterprise applications",
    "C++ - System programming",
    "React - Frontend frameworks",
    "Node.js - Backend runtime",
  ],
  what_is_coding: "Coding is writing instructions for computers using programming languages. It powers everything from websites to apps to games!",
  why_learn: "Coding is a superpower! 💻 It helps you build anything you imagine.",
};

// Self-aware bot responses
export const BOT_KNOWLEDGE = {
  smartness: [
    "I'd say I'm pretty smart for a chatbot! 🧠 I learn from conversations and keep getting better!",
    "Smart? That's nice of you to say! 😊 I try my best to give accurate, helpful answers!",
    "I'm learning every day! 📚 True intelligence is helping people, and that's my goal!",
    "I'd like to think I'm intelligent, but I'm always improving! 🚀 What can I help you learn?",
  ],
  capabilities: [
    "Answer questions about Auri",
    "Chat about gaming, coding, and tech",
    "Tell jokes and have fun conversations",
    "Help with general knowledge questions",
    "Provide accurate information",
    "Remember context from our conversation",
    "Suggest helpful resources",
  ],
  languages: [
    "JavaScript - My primary language",
    "React - How I'm built",
    "English - What I speak fluently",
  ],
  how_work: "I use pattern matching and intent detection to understand what you're asking, then generate responses based on my knowledge base! Pretty cool, right? 🤖",
};

// Time of day based greetings
export const TIME_BASED_GREETINGS = {
  morning: [
    "Good morning! ☀️ Hope your day is starting awesome!",
    "Morning! 😊 Ready for some great conversations?",
    "Good morning! 🌅 Let's make today amazing!",
  ],
  afternoon: [
    "Good afternoon! 🌤️ Hope you're having a great day!",
    "Afternoon! 😊 How's everything going?",
    "Good afternoon! ☀️ What's up?",
  ],
  evening: [
    "Good evening! 🌙 Hope you're having a relaxing night!",
    "Evening! ✨ What's on your mind?",
    "Good evening! 🌆 Let's unwind with some chat!",
  ],
  night: [
    "Good night! 🌙 Hope you sleep well!",
    "Night! ✨ Sweet dreams!",
    "Good night! 😴 Rest well!",
  ],
};

// Clarification helpers
export const CLARIFICATION_HELPERS = [
  "Let me rephrase that in a different way...",
  "Think of it like this...",
  "To explain it more simply...",
  "In other words...",
  "What I mean is...",
];

// Impossible questions fallback
export const IMPOSSIBLE_QUESTIONS = {
  lottery: [
    "I can't predict the future! 🔮 But good luck if you're playing! 😊",
    "I wish I could see the future! 🌟 But if I could, I'd be a millionaire, not a chatbot! 💸",
  ],
  meaning_of_life: [
    "That's the ultimate question! 🤔 Philosophers have debated it for thousands of years. But I think connecting with people on Auri is a pretty good answer! 💫",
    "42! Just kidding... 😄 The real answer might be finding what brings you joy and sharing it with others. Like chatting here! 🌟",
  ],
  predict_future: [
    "I can't see the future, sadly! 🔮 But I can help you make smart decisions now! 💡",
    "Time travel isn't in my skillset! ⏰ But I can listen and help you think through possibilities!",
  ],
};

