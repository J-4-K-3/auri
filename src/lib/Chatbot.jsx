import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageTextRenderer } from "../components/EmojiRenderer";

// Intent priority levels (higher = more specific = checked first)
const INTENT_PRIORITY = {
  // Highest priority - Very specific
  USER_NAME: 100,
  PLAY_STORE: 95,
  APP_STORE: 95,
  JUST_BROWSING: 95,
  SELLER_PORTAL: 90,
  SELLER_MINI: 90,
  AURI_SHOP: 85,
  CREATION_DATE: 85,
  ACTIVE_USERS: 85,
  BEST_PART: 85,
  MOMENTS_INFO: 85,
  OTHER_APPS: 85,
  INNOXATION_WEBSITE: 85,
  CONTACT_INNOXATION: 85,
  CONTACT_JACOB: 85,

  // High priority - Specific questions
  WHAT_IS_AURI: 80,
  CREATOR_INFO: 80,
  COMPANY_INFO: 80,
  JACOB_AGE: 80,
  IOS_INFO: 80,
  WEB_INFO: 80,
  APP_NEW: 80,
  SAFETY_INFO: 75,
  DOWNLOAD_INFO: 75,
  FEATURES_INFO: 75,
  BOT_NAME: 75,
  PRIVACY_DATA: 80,
  CONTENT_MODERATION: 80,
  ACCOUNT_SECURITY: 80,
  CREATOR_MONETIZATION: 80,
  COMMUNITY_GUIDELINES: 80,
  ACCESSIBILITY_FEATURES: 80,
  LANGUAGE_LOCALIZATION: 80,
  CONTENT_CREATION_TOOLS: 80,
  STORIES_LIVE_STREAMING: 80,
  VERIFICATION_BADGES: 80,
  BUSINESS_PARTNERSHIPS: 80,
  LEGAL_TERMS: 80,
  ACCOUNT_MANAGEMENT: 80,
  CROSS_POSTING_EXPORT: 80,

  // Medium priority - Topic-specific
  AMOLED_THEME: 70,
  BLUSH_THEME: 70,
  PURPLE_THEME: 70,
  DARK_THEME: 70,
  LIGHT_THEME: 70,
  THEME_INFO: 65,
  CLEAN_LOOK: 65,
  PEACEFUL_LOOK: 65,
  BEAUTIFUL_LOOK: 65,

  // Lower priority - General
  EXPLORING: 60,
  EMOTIONAL_SUPPORT: 55,
  JOKE: 55,
  LAUGHTER: 55,
  APP_NEW: 50,

  // Follow-up patterns
  FOLLOW_UP_WHY: 45,
  FOLLOW_UP_WHEN: 45,
  FOLLOW_UP_MORE: 45,
  AFFIRMATIVE: 45,
  NEGATIVE: 45,

  // Lowest priority - General patterns
  FUNNY_STORY: 30,
  AURI_OFFERS: 30,

  // Platform questions
  IOS_INFO: 25,
  WEB_INFO: 25,
};

// Deduplicate intent detection - detect all, pick highest priority
const detectIntent = (msg) => {
  const lowerMsg = msg.toLowerCase();

  // Create array of intent check functions
  const intentChecks = [
    // Very specific - User name detection (highest priority)
    // Only trigger for clear self-introductions, not random questions
    () => {
      if (
        /\b(my.*name.*is|i.*am|i'm)\b/i.test(lowerMsg) &&
        /\b[a-zA-Z]+\b/.test(lowerMsg)
      ) {
        const nameMatch =
          lowerMsg.match(/\bmy name is ([a-zA-Z]+)\b/i) ||
          lowerMsg.match(/\bi am ([a-zA-Z]+)\b/i) ||
          lowerMsg.match(/\bi'm ([a-zA-Z]+)\b/i);
        if (nameMatch && nameMatch[1].length > 1) {
          return "USER_NAME";
        }
      }
      return null;
    },

    // Play Store availability
    () => {
      if (
        /\b(play.*store|google.*play|playstore|on.*play.*store|available.*play.*store|on.*store)\b/i.test(
          lowerMsg,
        ) &&
        /\b(app|auri)\b/i.test(lowerMsg)
      ) {
        return "PLAY_STORE";
      }
      return null;
    },

    // App Store / iOS Store availability
    () => {
      if (
        /\b(app.*store|apple.*store|ios.*store|on.*app.*store|available.*app.*store)\b/i.test(
          lowerMsg,
        ) &&
        /\b(app|auri)\b/i.test(lowerMsg)
      ) {
        return "APP_STORE";
      }
      return null;
    },

    // Just browsing / exploring
    () => {
      if (
        /\b(just.*browsing|just.*looking|browsing.*around|just.*exploring|checking.*out|just.*checking)\b/i.test(
          lowerMsg,
        )
      ) {
        return "JUST_BROWSING";
      }
      return null;
    },

    // Seller Portal (physical products)
    () => {
      if (
        /\b(seller.*portal|seller portal|full.*seller|physical.*seller|physical.*product|shipping.*address)\b/i.test(
          lowerMsg,
        )
      ) {
        return "SELLER_PORTAL";
      }
      return null;
    },

    // Seller Mini (digital goods)
    () => {
      if (
        /\b(seller.*mini|seller mini|mini seller|digital.*sell|digital.*good|digital.*service|gift.*card|esim|mobile.*data|game.*credit|roblox|mlbb|custom.*design|drawing)\b/i.test(
          lowerMsg,
        )
      ) {
        return "SELLER_MINI";
      }
      return null;
    },

    // Auri Shop
    () => {
      if (
        /\b(auri.*shop|shop.*auri|auri.*store|auri.*marketplace)\b/i.test(
          lowerMsg,
        )
      ) {
        return "AURI_SHOP";
      }
      return null;
    },

    // Creation date
    () => {
      if (
        /\b(when.*created|created.*date|launched|released|started|origin|birth|how.*long.*ago|how.*old.*auri)\b/i.test(
          lowerMsg,
        )
      ) {
        return "CREATION_DATE";
      }
      return null;
    },

    // Active users
    () => {
      if (
        /\b(active.*user|how many.*people|users.*count|members|community.*size|how.*big|how.*many.*users|user.*count|people.*using)\b/i.test(
          lowerMsg,
        )
      ) {
        return "ACTIVE_USERS";
      }
      return null;
    },

    // Best part / Moments
    () => {
      if (
        /\b(best.*part|best.*feature|what.*best|favorite.*part|love.*most|highlight|best.*thing|what.*do.*you.*like)\b/i.test(
          lowerMsg,
        )
      ) {
        return "BEST_PART";
      }
      if (
        /\b(moments|moments.*section|timeline.*moments|circle.*moments)\b/i.test(
          lowerMsg,
        )
      ) {
        return "MOMENTS_INFO";
      }
      return null;
    },

    // Other apps
    () => {
      if (
        /\b(other.*app|more.*app|another.*app|different.*app|other.*product|what.*else.*innoxation|innoxation.*app|other.*thing.*you.*make)\b/i.test(
          lowerMsg,
        )
      ) {
        return "OTHER_APPS";
      }
      return null;
    },

    // Innoxation website
    () => {
      if (
        /\b(innoxation.*website|inno.*website|company.*website|website.*innoxation|inno.*site)\b/i.test(
          lowerMsg,
        )
      ) {
        return "INNOXATION_WEBSITE";
      }
      return null;
    },

    // Contact Innoxation
    () => {
      if (
        /\b(contact.*innoxation|email.*innoxation|reach.*innoxation|support.*email|email.*footer|contact.*company|how.*contact)\b/i.test(
          lowerMsg,
        )
      ) {
        return "CONTACT_INNOXATION";
      }
      return null;
    },

    // Contact Jacob
    () => {
      if (
        /\b(contact.*jacob|jacob.*email|jacob.*direct|reach.*jacob|talk.*to.*jacob|message.*jacob|ceo.*email)\b/i.test(
          lowerMsg,
        )
      ) {
        return "CONTACT_JACOB";
      }
      return null;
    },

    // What is Auri
    () => {
      if (
        /\b(what.*is.*auri|what.*auri|tell.*me.*about.*auri)\b/i.test(lowerMsg)
      ) {
        return "WHAT_IS_AURI";
      }
      return null;
    },

    // Creator info
    () => {
      if (
        /\b(who.*created.*you|who.*creator|who.*made.*you|who.*jacob|who.*ceo|who.*founder)\b/i.test(
          lowerMsg,
        )
      ) {
        return "CREATOR_INFO";
      }
      return null;
    },

    // Company info
    () => {
      if (/\b(what.*is.*innoxation|what.*innoxation)\b/i.test(lowerMsg)) {
        return "COMPANY_INFO";
      }
      if (/\b(jacob|founder)\b/i.test(lowerMsg)) {
        return "CREATOR_INFO";
      }
      return null;
    },

    // Jacob age
    () => {
      if (/\b(how.*old.*jacob|jacob.*age)\b/i.test(lowerMsg)) {
        return "JACOB_AGE";
      }
      return null;
    },

    // iOS
    () => {
      if (/\b(ios|apple|iphone|ipad)\b/i.test(lowerMsg)) {
        return "IOS_INFO";
      }
      return null;
    },

    // Web
    () => {
      if (/\b(web.*version|online)\b/i.test(lowerMsg)) {
        return "WEB_INFO";
      }
      return null;
    },

    // App new
    () => {
      if (/\b(is.*app.*new|new.*app|just.*released)\b/i.test(lowerMsg)) {
        return "APP_NEW";
      }
      return null;
    },

    // Safety
    () => {
      if (/\b(app.*safe|safe.*app|virus|malware)\b/i.test(lowerMsg)) {
        return "SAFETY_INFO";
      }
      return null;
    },

    // Download
    () => {
      if (/\b(how.*download|how.*get.*app|download.*app)\b/i.test(lowerMsg)) {
        return "DOWNLOAD_INFO";
      }
      return null;
    },

    // Features
    () => {
      if (/\b(what.*features|what.*can.*do|capabilities)\b/i.test(lowerMsg)) {
        return "FEATURES_INFO";
      }
      if (
        /\b(what.*offer|what.*does.*auri.*offer|auri.*features|auri.*has|show.*me.*features)\b/i.test(
          lowerMsg,
        )
      ) {
        return "AURI_OFFERS";
      }
      return null;
    },

    // Bot name
    () => {
      if (
        /\b(what.*is.*your.*name|what.*your.*name|who.*are.*you)\b/i.test(
          lowerMsg,
        )
      ) {
        return "BOT_NAME";
      }
      return null;
    },

    // Theme specific
    () => {
      if (
        /\b(amoled|amoled.*dark|deep.*dark|pure.*black|true.*black)\b/i.test(
          lowerMsg,
        )
      ) {
        return "AMOLED_THEME";
      }
      if (/\b(blush|pink|rose|soft.*pink|warm.*pink)\b/i.test(lowerMsg)) {
        return "BLUSH_THEME";
      }
      if (/\b(purple|lavender|violet|royal.*purple)\b/i.test(lowerMsg)) {
        return "PURPLE_THEME";
      }
      if (/\b(dark|dark.*mode|night.*mode)\b/i.test(lowerMsg)) {
        return "DARK_THEME";
      }
      if (/\b(light|bright|light.*mode)\b/i.test(lowerMsg)) {
        return "LIGHT_THEME";
      }
      if (/\b(theme|themes|ui|interface|design|look)\b/i.test(lowerMsg)) {
        return "THEME_INFO";
      }
      return null;
    },

    // Platform appearance
    () => {
      if (/\b(clean|minimal|minimalist|simple|uncluttered)\b/i.test(lowerMsg)) {
        return "CLEAN_LOOK";
      }
      if (
        /\b(peaceful|calm|serene|tranquil|relaxing|soothing)\b/i.test(lowerMsg)
      ) {
        return "PEACEFUL_LOOK";
      }
      if (/\b(beautiful|pretty|gorgeous|stunning|elegant)\b/i.test(lowerMsg)) {
        return "BEAUTIFUL_LOOK";
      }
      return null;
    },

    // Exploring
    () => {
      if (
        /\b(both|browsing.*interested|doing.*both|bit.*of.*both|exploring)\b/i.test(
          lowerMsg,
        )
      ) {
        return "EXPLORING";
      }
      return null;
    },

    // Emotional support
    () => {
      if (
        /\b(i.*feel.*sad|i.*am.*sad|feel.*sad|feeling.*sad|depressed|unhappy|down)\b/i.test(
          lowerMsg,
        )
      ) {
        return "EMOTIONAL_SUPPORT";
      }
      if (
        /\b(tell.*me.*a.*joke|joke|make.*me.*laugh|funny)\b/i.test(lowerMsg)
      ) {
        return "JOKE";
      }
      return null;
    },

    // Laughter - only trigger for explicit laughter, not casual "haha"
    // Must be a standalone response to laughter, not interrupt other messages
    () => {
      if (/^(haha+|lol+)$/i.test(lowerMsg.trim()) || lowerMsg.trim() === "😂") {
        return "LAUGHTER";
      }
      return null;
    },

    // Follow-up questions
    () => {
      if (/\b(why|how.*come|because)\b/i.test(lowerMsg)) {
        return "FOLLOW_UP_WHY";
      }
      if (/\b(when|how.*long|how.*soon)\b/i.test(lowerMsg)) {
        return "FOLLOW_UP_WHEN";
      }
      if (/\b(more|tell.*more|explain|details)\b/i.test(lowerMsg)) {
        return "FOLLOW_UP_MORE";
      }
      if (/\b(yes|yeah|yep|sure|okay|ok)\b/i.test(lowerMsg)) {
        return "AFFIRMATIVE";
      }
      if (/\b(no|nope|nah|not.*really)\b/i.test(lowerMsg)) {
        return "NEGATIVE";
      }
      return null;
    },

    // Funny story
    () => {
      if (
        /\b(tell.*me.*something.*funny|something.*funny|funny.*story)\b/i.test(
          lowerMsg,
        )
      ) {
        return "FUNNY_STORY";
      }
      return null;
    },

    // New intents
    // Privacy & Data Handling
    () => {
      if (
        /\b(privacy|data.*handling|data.*privacy|gdpr|data.*protection|personal.*data|data.*security)\b/i.test(
          lowerMsg,
        )
      ) {
        return "PRIVACY_DATA";
      }
      return null;
    },

    // Content Moderation & Safety
    () => {
      if (
        /\b(content.*moderation|moderation|safety|content.*safety|hate.*speech|harassment|bullying|report.*content)\b/i.test(
          lowerMsg,
        )
      ) {
        return "CONTENT_MODERATION";
      }
      return null;
    },

    // Account Security (2FA, passwords)
    () => {
      if (
        /\b(account.*security|2fa|two.*factor|password|security|account.*protection|login.*security)\b/i.test(
          lowerMsg,
        )
      ) {
        return "ACCOUNT_SECURITY";
      }
      return null;
    },

    // Creator Monetization
    () => {
      if (
        /\b(creator.*monetization|monetize.*content|earn.*money|creator.*income|make.*money.*creator|revenue.*creator)\b/i.test(
          lowerMsg,
        )
      ) {
        return "CREATOR_MONETIZATION";
      }
      return null;
    },

    // Community Guidelines
    () => {
      if (
        /\b(community.*guidelines|guidelines|rules|code.*conduct|community.*rules|acceptable.*use)\b/i.test(
          lowerMsg,
        )
      ) {
        return "COMMUNITY_GUIDELINES";
      }
      return null;
    },

    // Accessibility Features
    () => {
      if (
        /\b(accessibility|screen.*reader|disability|accessible|accessibility.*features|inclusive.*design)\b/i.test(
          lowerMsg,
        )
      ) {
        return "ACCESSIBILITY_FEATURES";
      }
      return null;
    },

    // Language/Localization
    () => {
      if (
        /\b(language|localization|translate|multilingual|languages|supported.*languages|language.*support)\b/i.test(
          lowerMsg,
        )
      ) {
        return "LANGUAGE_LOCALIZATION";
      }
      return null;
    },

    // Content Creation Tools
    () => {
      if (
        /\b(content.*creation.*tools|creation.*tools|editing.*tools|content.*editor|video.*editor|photo.*editor|design.*tools)\b/i.test(
          lowerMsg,
        )
      ) {
        return "CONTENT_CREATION_TOOLS";
      }
      return null;
    },

    // Stories & Live Streaming
    () => {
      if (
        /\b(stories|live.*streaming|live.*stream|broadcast|story.*feature|ephemeral.*content)\b/i.test(
          lowerMsg,
        )
      ) {
        return "STORIES_LIVE_STREAMING";
      }
      return null;
    },

    // Verification/Badges System
    () => {
      if (
        /\b(verification|badges|badge.*system|verified.*account|blue.*check|tick|verification.*process)\b/i.test(
          lowerMsg,
        )
      ) {
        return "VERIFICATION_BADGES";
      }
      return null;
    },

    // Business/Partnership Inquiries
    () => {
      if (
        /\b(business.*partnership|partnership|business.*inquiry|collaborate|brand.*partnership|sponsor|business.*deal)\b/i.test(
          lowerMsg,
        )
      ) {
        return "BUSINESS_PARTNERSHIPS";
      }
      return null;
    },

    // Legal (Terms, Privacy Policy)
    () => {
      if (
        /\b(legal|terms.*service|privacy.*policy|tos|terms|policy|legal.*documents|user.*agreement)\b/i.test(
          lowerMsg,
        )
      ) {
        return "LEGAL_TERMS";
      }
      return null;
    },

    // Account Management (delete, export)
    () => {
      if (
        /\b(account.*management|delete.*account|export.*data|account.*settings|manage.*account|account.*control)\b/i.test(
          lowerMsg,
        )
      ) {
        return "ACCOUNT_MANAGEMENT";
      }
      return null;
    },

    // Cross-posting & Export
    () => {
      if (
        /\b(cross.*posting|export.*content|share.*other.*platforms|cross.*platform|export.*posts|multi.*platform)\b/i.test(
          lowerMsg,
        )
      ) {
        return "CROSS_POSTING_EXPORT";
      }
      return null;
    },
  ];

  // Collect all matches and pick highest priority
  const matches = [];
  for (const check of intentChecks) {
    const result = check();
    if (result) {
      matches.push({ intent: result, priority: INTENT_PRIORITY[result] || 0 });
    }
  }

  // Return highest priority match
  if (matches.length > 0) {
    matches.sort((a, b) => b.priority - a.priority);
    return matches[0].intent;
  }

  return null;
};

// Comprehensive AI Response patterns (300+ intelligent, regex-based responses)
const responsePatterns = [
  // Greetings & Small Talk (50 patterns)
  {
    regex: /\b(hi|hello|hey|sup|yo|hiya|howdy|hy)\b/i,
    responses: [
      "Hey there 😌 been here before?",
      "Hello! 👋 What's up?",
      "Hi! 😊 Nice to meet you!",
      "Hey! ✨ How's it going?",
      "Sup! 😎 Ready to chat?",
      "Hiya! 🌟 What brings you here?",
      "Yo! 😏 Let's get this conversation started!",
    ],
  },
  {
    regex: /\b(how.*are.*you|how.*going|what.*up|how.*doing)\b/i,
    responses: [
      "I'm doing great, thanks for asking! 😊 How about you?",
      "Fantastic! Just here making conversations awesome 🌟",
      "Pretty good! 😄 What's new with you?",
      "Wonderful! 😌 How's your day treating you?",
      "Excellent! ✨ What's on your mind?",
      "Superb! 🌈 How can I brighten your day?",
      "Marvelous! 😘 What's the latest?",
    ],
  },
  {
    regex: /\b(good.*morning|morning|mornin)\b/i,
    responses: [
      "Good morning! ☀️ Hope your day is starting awesome!",
      "Morning! 😊 Ready for some great conversations?",
      "Good morning! 🌅 Let's make today amazing!",
      "Morning sunshine! ☀️ What's your plan today?",
      "Good morning! 😌 Coffee and chats? Perfect combo!",
    ],
  },
  {
    regex: /\b(good.*evening|evening|good.*night|night)\b/i,
    responses: [
      "Good evening! 🌙 Hope you're having a relaxing night!",
      "Evening! ✨ What's on your mind?",
      "Good evening! 🌆 Let's unwind with some chat!",
      "Evening! 😊 How was your day?",
      "Good evening! 🌙 Ready for some peaceful conversation?",
    ],
  },
  {
    regex: /\b(bye|goodbye|see.*you|later|bye.*bye|cya|take.*care)\b/i,
    responses: [
      "Bye for now! 😊 Come back anytime!",
      "See you later! 👋 Don't be a stranger!",
      "Goodbye! 🌟 Take care!",
      "Bye! 😘 Until next time!",
      "See ya! 👋 Thanks for chatting!",
      "Take care! 🌈 Come back soon!",
      "Goodbye! 😊 Have a great day/night!",
    ],
  },
  {
    regex: /\b(thanks|thank.*you|thx|ty)\b/i,
    responses: [
      "You're welcome! 😊 Anything else?",
      "No problem! 🌟 Glad I could help!",
      "My pleasure! 😌 What else can I do?",
      "You're very welcome! ✨ How else can I assist?",
      "Happy to help! 😊 What's next?",
    ],
  },
  {
    regex: /\b(sorry|apologize|my.*bad|oops)\b/i,
    responses: [
      "No worries! 😊 Let's move on!",
      "All good! 😌 No harm done!",
      "No apology needed! 🌟 Let's continue!",
      "It's fine! 😊 What else?",
      "Don't worry about it! 😘 All forgiven!",
    ],
  },
  {
    regex: /\b(please|pls|plz)\b/i,
    responses: [
      "Of course! 😊 How can I help?",
      "Certainly! 🌟 What do you need?",
      "My pleasure! 😌 Ask away!",
      "Gladly! ✨ What's on your mind?",
      "Absolutely! 😘 How can I assist?",
    ],
  },
  {
    regex: /\b(yes|yeah|yep|sure|ok|okay|alright|sometimes|nothing.*much)\b/i,
    responses: [
      "Great! So what do you think of Auri?",
      "Awesome! 🌟 Are you just browsing or interested in what we do... either way we're good to have you here",
      "Perfect! 😌 How can I help?",
      "Excellent! ✨ Tell me more what you like about Auri so far",
      "Wonderful to hear, is there anything I can help you with... Um you person 😅",
    ],
  },
  {
    regex: /\b(no|nope|nah|not.*really)\b/i,
    responses: [
      "Alright! 😊 What else?",
      "No problem! 🌟 Something else?",
      "Okay! 😌 What's on your mind?",
      "Got it! ✨ What can I help with?",
      "Understood! 😘 Ask me anything!",
    ],
  },
  {
    regex: /\b(maybe|perhaps|possibly)\b/i,
    responses: [
      "Interesting! 😊 Tell me more!",
      "Hmm! 🤔 What are you thinking?",
      "Okay! 🌟 Let's explore that!",
      "Perhaps! 😌 What's your take?",
      "Maybe! ✨ I'm intrigued!",
    ],
  },
  {
    regex: /\b(idk|don't.*know|not.*sure)\b/i,
    responses: [
      "That's okay! 😊 What do you know?",
      "No worries! 🌟 Let's figure it out together!",
      "Fair enough! 😌 What's something you do know?",
      "Alright! ✨ What interests you?",
      "Got it! 😘 What can I help clarify?",
    ],
  },
  {
    regex: /\b(i.*think|i.*guess|i.*suppose)\b/i,
    responses: [
      "Interesting thought! 😊 Why do you think that?",
      "Hmm! 🤔 What makes you guess that?",
      "Okay! 🌟 Tell me more about it!",
      "I see! 😌 What's your reasoning?",
      "Got it! ✨ What's behind that idea?",
    ],
  },
  {
    regex: /\b(really|seriously|for.*real)\b/i,
    responses: [
      "Absolutely! 😊 I mean it!",
      "Seriously! 🌟 No joke!",
      "For real! 😌 Honest!",
      "Truly! ✨ Believe it!",
      "Definitely! 😘 It's fact!",
    ],
  },
  {
    regex: /\b(oh|wow|amazing|incredible|awesome)\b/i,
    responses: [
      "Right? 😊 So cool!",
      "I know! 🌟 Amazing!",
      "Exactly! 😌 Wow!",
      "Totally! ✨ Incredible!",
      "Yes! 😘 Awesome!",
    ],
  },
  {
    regex: /\b(bad|terrible|awful|horrible|sucks)\b/i,
    responses: [
      "Oh no! 😔 What's wrong?",
      "That's rough! 🌧️ How can I help?",
      "Sorry to hear! 😌 Want to talk about it?",
      "Not good! ✨ What happened?",
      "Aw, bummer! 😘 Let's fix that!",
    ],
  },

  // Auri App Questions (50 patterns)
  {
    regex: /\b(app|download|apk|play.*store)\b/i,
    responses: [
      "Good question 🤔, well let just say my creator... was limit with what was require by play store 😅",
      "The app isn't on Play Store yet, but you can download the APK from our site! 📱",
      "Ah, the app saga! 🤭 It's not on Play Store due to some requirements, but check the download section below 👇",
      "Smart question! 📱 The APK is available - just scroll down and grab it! 😎",
      "We're APK-only for now! 🌟 Play Store coming soon (hopefully)!",
    ],
  },
  {
    regex: /\b(why.*not.*play.*store|why.*no.*play.*store)\b/i,
    responses: [
      "Well... let's just say Play Store has some strict requirements our creator is navigating 😏",
      "Good question 🤔, well let just say my creator... was limit with what was require by play store",
      "It's a bit complicated, but we're working on it! 📱 In the meantime, APK download is available.",
      "Technical hurdles! 🚧 But the APK works perfectly! 😊",
      "Play Store policies are... particular. APK is the way for now! 📱",
    ],
  },
  {
    regex: /\b(app.*safe|safe.*app|is.*app.*safe)\b/i,
    responses: [
      "It sure is 🥹... you mentioned you were just looking, ever wanted to see the app for yourself for real or are you an iOS person or just have no phone 🥲",
      "Totally safe! 🔒 We take security seriously. No worries there!",
      "100% secure! 🛡️ Built with care by our team at Innoxation! 😊",
      "Safe as houses! 🏠 Clean code, no malware, pure Auri goodness! ✨",
      "Absolutely safe! 🔐 Reviewed and trusted!",
    ],
  },
  {
    regex: /\b(iOS|apple|iphone|ipad|mac)\b/i,
    responses: [
      'Well Auri was primarily made for android and that was a bottleneck, so here at Auri we decided to update and give iOS and web users a chance at the experience, just go down below 👇... right there and click "Visit Auri" and you can see the real thing without the app itself',
      "iOS support is coming! 🌟 For now, try the web version below 👇",
      "We're expanding! 📱 iOS version in the works - web preview available now! 😎",
      "Great question! iOS compatibility is our next big thing! 🌟 Check the web demo below!",
    ],
  },
  {
    regex: /\b(android|google.*play)\b/i,
    responses: [
      "Android is our sweet spot! 📱 APK download available below 👇",
      "Made for Android first! 🌟 Perfect on your device!",
      "Android users rejoice! 📱 The APK is tailor-made for you!",
      "Our Android roots run deep! 😎 Download and enjoy!",
    ],
  },
  {
    regex: /\b(web.*version|website|online)\b/i,
    responses: [
      "Web version coming soon! 🌐 For now, the demo below shows it all! 😊",
      "We're building a web experience! ✨ Stay tuned!",
      "Online access is next! 🌟 The preview gives you a taste!",
    ],
  },
  {
    regex: /\b(free|cost|price|money|pay)\b/i,
    responses: [
      "Completely free! 🎉 No hidden costs, just pure Auri! 😊",
      "Free as in freedom! 🌟 Enjoy without worries!",
      "Zero cost! 💸 We believe in accessible social media!",
      "Free forever! ✨ No subscriptions, no ads!",
    ],
  },
  {
    regex: /\b(how.*download|how.*get|how.*install)\b/i,
    responses: [
      "Easy! 📱 Scroll down and click 'Download APK'! 😊",
      "Simple steps! 🌟 Check the download section below! 📱",
      "Just click download! ✨ Installation is straightforward!",
    ],
  },
  {
    regex: /\b(update|version|new.*version)\b/i,
    responses: [
      "Version 2 is here! 🌟 Big improvements coming!",
      "We're updating constantly! ✨ New features soon!",
      "Version 2 drops soon! 😎 Exciting times!",
    ],
  },
  {
    regex: /\b(bug|error|problem|issue|crash)\b/i,
    responses: [
      "Sorry about that! 🐛 Report issues to our team! 😊",
      "Technical glitch? 🌟 We're fixing bugs daily!",
      "Issues happen! 📱 Let us know what went wrong!",
    ],
  },
  {
    regex: /\b(review|rating|star|feedback)\b/i,
    responses: [
      "Love to hear it! ⭐ Leave a review below! 😊",
      "Your feedback matters! 🌟 Tell us what you think!",
      "Reviews help us grow! ✨ Share your thoughts!",
    ],
  },
  {
    regex: /\b(compatibility|works.*on|support.*device)\b/i,
    responses: [
      "Works on most Android devices! 📱 iOS coming soon!",
      "Broad compatibility! 🌟 Check your device specs!",
      "Most modern phones! ✨ Let us know if you have issues!",
    ],
  },
  {
    regex: /\b(storage|space|memory|mb|gb)\b/i,
    responses: [
      "Lightweight app! 📱 Minimal storage needed!",
      "Small footprint! 🌟 Won't hog your space!",
      "Efficient design! ✨ Runs smooth on any device!",
    ],
  },
  {
    regex: /\b(battery|power|drain|consume)\b/i,
    responses: [
      "Battery-friendly! 🔋 Optimized for efficiency!",
      "Power-conscious! 🌟 Won't drain your battery!",
      "Efficient energy use! ✨ Chat all day!",
    ],
  },
  {
    regex: /\b(data|internet|wifi|connection)\b/i,
    responses: [
      "Works offline too! 📱 Sync when connected!",
      "Smart data usage! 🌟 Minimal internet needed!",
      "Connection-friendly! ✨ Offline capabilities!",
    ],
  },

  // Creator/Company Info (30 patterns)
  {
    regex: /\b(who.*created|creator|developer|made.*you|company|inno|jacob)\b/i,
    responses: [
      "I'm created by Innoxation, founded by Jacob who's 20 years old 🧑‍💻",
      "My creators are the amazing team at Innoxation, led by the talented Jacob (20) ✨",
      "Innoxation built me! Jacob, our 20-year-old founder, is the genius behind it all 👨‍💼",
      "Crafted by Innoxation! 🌟 Jacob (20) leads the innovation!",
    ],
  },
  {
    regex: /\b(jacob|founder)\b/i,
    responses: [
      "Jacob is our 20-year-old founder - super talented! 🧠",
      "Ah, Jacob! He's 20 and the brains behind Innoxation 🌟",
      "Jacob founded Innoxation at just 20. Impressive, right? 😎",
      "Jacob - 20 years young and full of genius! ✨",
    ],
  },
  {
    regex: /\b(how.*old.*jacob|jacob.*age)\b/i,
    responses: [
      "Jacob is 20 years old! Still young but already making waves 🏄‍♂️",
      "He's 20 - proving age is just a number when you've got talent! ✨",
      "20 years old! 🌟 Young innovator at work!",
      "Just 20! 🧠 But with wisdom beyond years!",
    ],
  },
  {
    regex: /\b(inno|innoxation)\b/i,
    responses: [
      "Innoxation is our creative hub! 🌟 Founded by Jacob!",
      "Innoxation - where innovation meets social media! 😎",
      "Our company, Innoxation! ✨ Building the future of connections!",
      "Innoxation: Jacob's brainchild! 🌟 20 years of vision!",
    ],
  },
  {
    regex: /\b(team|people|who.*works|staff)\b/i,
    responses: [
      "Small but mighty team at Innoxation! 🌟 Jacob leads us!",
      "Dedicated creators! ✨ We're passionate about Auri!",
      "Talented group! 😎 Each member brings magic!",
      "Innovative team! 🌟 Focused on user experience!",
    ],
  },
  {
    regex: /\b(where.*from|location|based|headquarters)\b/i,
    responses: [
      "Digital nomads! 🌍 Innoxation operates globally!",
      "Based everywhere! ✨ The internet is our home!",
      "Virtual headquarters! 😎 Location-independent creators!",
      "Worldwide team! 🌟 No borders for innovation!",
    ],
  },
  {
    regex: /\b(contact|email|reach|support)\b/i,
    responses: [
      "Reach us through the app! 📱 Or check our website!",
      "Contact via Auri! 🌟 We love hearing from users!",
      "Support channels available! ✨ Get in touch anytime!",
      "Easy to contact! 😎 Through the Community Chat!",
    ],
  },
  {
    regex: /\b(mission|goal|purpose|why.*auri)\b/i,
    responses: [
      "To create peaceful social media! 🕊️ No more drama!",
      "Building authentic connections! 🌟 Escape the chaos!",
      "Our mission: meaningful interactions! ✨ Without toxicity!",
      "Purpose: calm, genuine social experiences! 😊",
    ],
  },
  {
    regex: /\b(vision|future|plan|roadmap)\b/i,
    responses: [
      "Expanding to iOS, web! 🌐 More features coming!",
      "Big plans! ✨ Global social revolution!",
      "Vision: worldwide peaceful networking! 🌍",
      "Future: feature-rich, user-focused! 😎",
    ],
  },
  {
    regex: /\b(values|beliefs|principles)\b/i,
    responses: [
      "Authenticity, kindness, innovation! 🌟",
      "Values: genuine connections, user privacy! 😊",
      "Principles: no toxicity, pure positivity! ✨",
      "Beliefs: social media should be safe, fun! 🛡️",
    ],
  },

  // Platform & Device Questions (30 patterns)
  {
    regex: /\b(ios.*support|apple.*support)\b/i,
    responses: [
      "iOS support coming! 🌟 Web preview available now!",
      "Apple users, we're coming! 📱 Stay tuned!",
      "iOS compatibility in development! ✨ Check web version!",
      "Soon for Apple devices! 😎 Web demo works great!",
    ],
  },
  {
    regex: /\b(web.*app|browser.*version)\b/i,
    responses: [
      "Web version in progress! 🌐 Preview below!",
      "Browser support coming! ✨ Full web experience!",
      "Online access soon! 😎 Web demo gives you a taste!",
      "Progressive web app! 🌟 Works in browsers!",
    ],
  },
  {
    regex: /\b(desktop|computer|pc|mac|laptop)\b/i,
    responses: [
      "Desktop version planned! 💻 Web access first!",
      "Computer support coming! ✨ Browser-based!",
      "Mac/PC compatible soon! 😎 Web preview works!",
      "Desktop experience in development! 🌟",
    ],
  },
  {
    regex: /\b(tablet|ipad|surface)\b/i,
    responses: [
      "Tablet optimized! 📱 Works great on larger screens!",
      "iPad friendly! ✨ Touch-optimized interface!",
      "Tablet support excellent! 😎 Responsive design!",
      "Tablets love Auri! 🌟 Perfect for bigger displays!",
    ],
  },
  {
    regex: /\b(old.*phone|android.*version)\b/i,
    responses: [
      "Works on most Android versions! 📱 From 8.0+",
      "Broad Android support! ✨ Old phones welcome!",
      "Compatible with many devices! 😎 Check your version!",
      "Android 8+ supported! 🌟 Keeps compatibility wide!",
    ],
  },
  {
    regex: /\b(slow|lag|performance|fast)\b/i,
    responses: [
      "Optimized for speed! ⚡ Smooth performance!",
      "Fast and responsive! ✨ No lag here!",
      "Performance-focused! 😎 Runs smoothly!",
      "Lightning fast! 🌟 Optimized experience!",
    ],
  },
  {
    regex: /\b(offline|no.*internet)\b/i,
    responses: [
      "Offline messaging! 📱 Syncs when connected!",
      "Works without internet! ✨ Read offline!",
      "Offline capabilities! 😎 Stay connected anywhere!",
      "No internet needed for some features! 🌟",
    ],
  },
  {
    regex: /\b(notification|alert|push)\b/i,
    responses: [
      "Smart notifications! 🔔 Only important updates!",
      "Customizable alerts! ✨ Your control!",
      "Push notifications available! 😎 Stay in the loop!",
      "Notification management! 🌟 User preferences matter!",
    ],
  },
  {
    regex: /\b(privacy|security|safe|protect)\b/i,
    responses: [
      "Privacy-first! 🔒 Your data is safe!",
      "Security built-in! ✨ End-to-end protection!",
      "Safe and secure! 😎 No compromises!",
      "Privacy protected! 🌟 Your trust matters!",
    ],
  },
  {
    regex: /\b(customize|theme|setting|preference)\b/i,
    responses: [
      "Highly customizable! 🎨 Themes and settings!",
      "Personalization options! ✨ Make it yours!",
      "Settings galore! 😎 Tailor your experience!",
      "Customization heaven! 🌟 Your Auri, your way!",
    ],
  },

  // Features & Capabilities (40 patterns)
  {
    regex: /\b(what.*auri|what.*this|what.*app)\b/i,
    responses: [
      "Auri is a calm place to share your world! 🌍 No drama, just authentic connections.",
      "We're all about peaceful social media - escape the chaos! 🕊️",
      "Auri is your escape from toxic feeds. Share authentically, connect deeply! 💫",
      "A peaceful social sanctuary! ✨ Authentic sharing without judgment!",
      "Calm social media experience! 🌟 Meaningful connections only!",
      "Auri is built different - no algorithms, no drama, just real people! 💯 What draws you to peaceful social media?",
      "Think of Auri as your digital sanctuary where you can be yourself without pressure! 🕊️✨",
    ],
  },
  {
    regex: /\b(features|what.*can.*do|capability)\b/i,
    responses: [
      "We have peaceful feeds, authentic reels, private messages, and so much more! 📱",
      "Features include Auri Shop, private messaging, creator marketplace... the list goes on! 🌟",
      "Peaceful feeds, private chats, creator tools, shop, and more! ✨",
      "Authentic reels, meaningful donations, like-minded groups! 😎",
      "Shop, private messaging, live features, creator marketplace! 🌟",
      "Where should I start? We have feeds without algorithms, genuine connections, custom emojis, creator tools... so much! 📱✨",
      "Auri has all the features you love without the toxicity you hate! 🚫 What's your favorite type of feature?",
    ],
  },
  {
    regex: /\b(feed|timeline|post|story)\b/i,
    responses: [
      "Peaceful feeds! 📱 No algorithms, just genuine content!",
      "Meaningful timeline! ✨ Chronological, authentic!",
      "Story sharing! 😎 Private, real moments!",
      "Post peacefully! 🌟 No pressure, no comparison!",
      "Our feeds are chronological - you see posts in order, not what some algorithm thinks you want! 📖 What kind of content do you like sharing?",
    ],
  },
  {
    regex: /\b(reel|video|short.*video)\b/i,
    responses: [
      "Authentic reels! 🎥 Short, genuine videos!",
      "Real video content! ✨ No filters, pure expression!",
      "Short video sharing! 😎 Authentic moments!",
      "Reel creation tools! 🌟 Express yourself truly!",
      "Reels on Auri are all about authenticity - no fake perfection here! 📹 Do you enjoy creating or watching videos?",
    ],
  },
  {
    regex: /\b(message|chat|private.*message)\b/i,
    responses: [
      "Private messaging! 💬 Deep, meaningful conversations!",
      "Secure chats! ✨ Connect intimately!",
      "Private comms! 😎 No public drama!",
      "Direct messaging! 🌟 Safe space to talk!",
      "Message privately without worrying about public scrutiny! 🔒 Who would you want to have deep conversations with?",
    ],
  },
  {
    regex: /\b(shop|marketplace|store|buy|sell)\b/i,
    responses: [
      "Auri Shop! 🛍️ Support creators, find unique items!",
      "Creator marketplace! ✨ Buy/sell authentic goods!",
      "Shop feature! 😎 Independent creators thrive!",
      "Marketplace magic! 🌟 Unique products await!",
      "Support independent creators directly! 🛍️ No middleman, no big corp! What type of products interest you?",
    ],
  },
  {
    regex: /\b(donate|support|tip|give.*money)\b/i,
    responses: [
      "Meaningful donations! 💝 Support causes you care about!",
      "Donation feature! ✨ Help creators and communities!",
      "Support system! 😎 Give back meaningfully!",
      "Donation tools! 🌟 Impact what matters!",
      "Donate to creators you love or causes that matter! 💝 It's built right into Auri! What causes are close to your heart?",
    ],
  },
  {
    regex: /\b(group|community|circle|find.*friend)\b/i,
    responses: [
      "Like-minded groups! 👥 Find your tribe!",
      "Community features! ✨ Connect with similar souls!",
      "Circle building! 😎 Meaningful relationships!",
      "Group discovery! 🌟 Find your people!",
      "Find your people - people who share your interests and values! 🌟 What communities excite you?",
    ],
  },
  {
    regex: /\b(creator|influencer|content.*maker)\b/i,
    responses: [
      "Creator tools! 🎨 Marketplace, shop, support!",
      "Content creator support! ✨ Build your audience!",
      "Influencer features! 😎 Monetize your passion!",
      "Creator platform! 🌟 Showcase and sell!",
      "Auri treats creators fairly - no shadow bans, no algorithm manipulation! 🎯 Are you a creator or thinking about becoming one?",
    ],
  },
  {
    regex: /\b(live|streaming|broadcast)\b/i,
    responses: [
      "Live streaming! 📺 Share moments in real-time!",
      "Broadcast feature! ✨ Connect live!",
      "Live interaction! 😎 Real-time engagement!",
      "Streaming capability! 🌟 Live experiences!",
      "Go live and connect with your audience in real-time! 📺 Have you done live streaming before?",
    ],
  },
  {
    regex: /\b(profile|bio|about.*me)\b/i,
    responses: [
      "True profiles! 👤 Express your real self!",
      "Authentic bios! ✨ No personas needed!",
      "Profile customization! 😎 Show who you are!",
      "Real self expression! 🌟 No filters required!",
      "Be yourself on your profile - no need to curate a fake image! 😊 What would your Auri bio say?",
    ],
  },
  {
    regex: /\b(search|find|discover)\b/i,
    responses: [
      "Smart search! 🔍 Find people, content, groups!",
      "Discovery tools! ✨ Explore meaningfully!",
      "Search features! 😎 Find what matters!",
      "Discovery engine! 🌟 Connect with purpose!",
      "Discover new friends, content, and communities that align with your interests! 🔍 What are you looking to discover?",
    ],
  },
  {
    regex: /\b(emoji|reaction|sticker)\b/i,
    responses: [
      "Custom emoji sets! 😊 Express with style!",
      "Reaction features! ✨ Rich emoji collection!",
      "Sticker packs! 😎 Unique expressions!",
      "Emoji richness! 🌟 Communicate vividly!",
      "Our emojis are 3D and absolutely stunning! 😍 Express yourself in ways standard emojis can't!",
    ],
  },
  {
    regex: /\b(save|bookmark|favorites)\b/i,
    responses: [
      "Save features! 💾 Keep what matters!",
      "Bookmark system! ✨ Organize your finds!",
      "Favorites! 😎 Personal collection!",
      "Save functionality! 🌟 Never lose good stuff!",
      "Save posts, products, and content you love! 💾 Build your personal collection! What would you save first?",
    ],
  },

  // Theme-specific responses (NEW)
  {
    regex: /\b(amoled|pure.*black|true.*black|deep.*dark)\b/i,
    responses: [
      "AMOLED theme is stunning! 🌙 Pure black that's easy on the eyes and saves battery on OLED screens! 📱 Perfect for night owls! 🦉 Would you like to try it out?",
      "Deep black for AMOLED displays! ✨ It makes your content pop while being battery-efficient! 🌙 Great choice for dark mode lovers! 😍",
      "Pure black perfection! 🌟 Our AMOLED theme is designed for the best possible dark mode experience! 💯",
    ],
  },
  {
    regex: /\b(blush|pink|rose|soft.*pink|warm.*pink)\b/i,
    responses: [
      "Blush theme is so soft and warm! 💕 Like a gentle hug for your eyes! 🌸 Perfect for creating a cozy atmosphere! ☕ Do you like warm colors?",
      "Soft pink elegance! 🌷 Our blush theme brings warmth and tenderness to your scrolling experience! 💖 It's like a warm sunset! 🌅",
      "Pink lovers unite! 💕 Our blush theme is designed for those who appreciate soft, feminine aesthetics! ✨ What draws you to warm colors?",
    ],
  },
  {
    regex: /\b(purple|lavender|violet|royal.*purple)\b/i,
    responses: [
      "Purple theme! 💜 Majestic and mysterious! 👑 Perfect for evening browsing! 🌙 It adds a regal touch to your social media! ✨ Purple represents creativity and wisdom! 🎨",
      "Deep purple magic! 💜 Our purple theme is perfect for those who want elegance with a touch of mystery! 🌙 It's like having a royal experience! 👑",
      "Lavender dreams! 💜 Soft yet sophisticated purple tones that make browsing a pleasure! 🌸 What do you love about purple?",
    ],
  },
  {
    regex: /\b(dark|dark.*mode|night.*mode)\b/i,
    responses: [
      "Dark mode! 🌙 Classic and easy on the eyes! 😎 Reduces eye strain during night and saves battery! 🔋 Sleek and modern look! ✨",
      "Night mode enthusiast! 🌙 Dark theme reduces blue light and saves your battery! 📱 Perfect for late-night scrolling! 😴",
      "Dark mode for the win! 🏆 Our dark theme is designed for comfort and style! 🌟 No harsh brightness, just smooth scrolling! 💯",
    ],
  },
  {
    regex: /\b(light|bright|light.*mode)\b/i,
    responses: [
      "Light theme! ☀️ Fresh and vibrant! ✨ Perfect for daytime use! 🌞 Clean and bright like a new day! 🌅",
      "Light mode for the morning person! ☀️ Light, airy, and refreshing! 🌸 Like a breath of fresh air! 🌿 Do you prefer bright and cheerful?",
      "Fresh light theme! ☀️ Easy on the eyes during the day! 🌞 Clean, crisp, and modern! ✨ What do you like about light themes?",
    ],
  },

  // Platform appearance responses (NEW)
  {
    regex: /\b(clean|minimal|minimalist|simple|uncluttered|ui|ux|design)\b/i,
    responses: [
      "Exactly! ✨ We believe in less clutter, more meaning! 🧹 No distractions, just the content you care about! 🌟 Minimalism is our design philosophy! 🎨",
      "Clean design is intentional! 🧘 No unnecessary buttons, no overwhelming feeds - just pure, focused content! 📱 That's the Auri way! ✨",
      "You noticed! 😄 We designed Auri to be clutter-free! 🚫 No ads, no algorithm popups, just clean, peaceful browsing! 🌿 What else do you appreciate about our design?",
    ],
  },
  {
    regex: /\b(peaceful|calm|serene|tranquil|relaxing|soothing|ui)\b/i,
    responses: [
      "That's our mission! 🕊️ Auri was born to be a calm escape from social media chaos! 😌 No toxicity, no drama, just genuine connections! 💫",
      "Peaceful by design! 🌿 We actively fight against the negativity that plagues other platforms! 🛡️ Your mental health matters! 💚",
      "Serenity now! 🧘 Auri is your digital sanctuary! 🏝️ No FOMO, no comparison culture - just real people sharing real moments! 💖 What makes you feel peaceful?",
    ],
  },
  {
    regex: /\b(beautiful|pretty|gorgeous|stunning|elegant)\b/i,
    responses: [
      "Thank you! 🥰 We poured our hearts into every visual detail! 💖 From 3D emojis to smooth animations! ✨ Beauty in every pixel! 🎨",
      "Stunning aesthetics! 😍 Our themes are crafted to please the eyes! 🎨 Every color, every gradient - intentional beauty! 💯",
      "Elegant design! 👑 We believe social media should be a visual pleasure! 🌸 Not stressful, but beautiful! 💖 What aspect do you find most beautiful?",
    ],
  },

  // Exploring/Browsing intent responses (NEW)
  {
    regex:
      /\b(both|doing.*a.*bit.*of.*both|exploring|browsing.*and.*interested)\b/i,
    responses: [
      "Best of both worlds! 🌟🔍 That's awesome! Take your time exploring! 💫 I'm here whenever you have questions! 😊",
      "Exploring is half the fun! 🔎 Feel free to ask me anything about Auri - features, themes, differences from other apps! 🤗",
      "The curious mind wins! 🏆 Whether you stay or explore, we're happy to have you here! 💜 What sparked your interest most?",
    ],
  },

  // Download & Installation (30 patterns)
  {
    regex: /\b(how.*download|get.*app)\b/i,
    responses: [
      "Scroll down and click 'Download APK'! 📱 Easy!",
      "Download button below! ✨ One click away!",
      "APK download simple! 😎 Get it now!",
      "Download section awaits! 🌟 Grab your APK!",
    ],
  },
  {
    regex: /\b(install.*apk|how.*install)\b/i,
    responses: [
      "Enable unknown sources, then install! 📱",
      "Installation guide below! ✨ Step-by-step!",
      "APK install straightforward! 😎 Follow the prompts!",
      "Install instructions available! 🌟 Easy process!",
    ],
  },
  {
    regex: /\b(unknown.*source|allow.*unknown)\b/i,
    responses: [
      "Settings > Security > Unknown sources! 📱",
      "Enable in security settings! ✨ Safe for Auri!",
      "Unknown sources toggle! 😎 Required for APK!",
      "Security setting needed! 🌟 Quick to enable!",
    ],
  },
  {
    regex: /\b(virus|malware|safe.*download)\b/i,
    responses: [
      "100% safe! 🛡️ Clean, verified APK!",
      "No viruses! ✨ Trusted source!",
      "Secure download! 😎 Malware-free!",
      "Safe installation! 🌟 Our guarantee!",
    ],
  },
  {
    regex: /\b(size|big.*file|storage.*need)\b/i,
    responses: [
      "Small APK size! 📱 Minimal storage!",
      "Lightweight download! ✨ Won't fill space!",
      "Compact app! 😎 Efficient size!",
      "Space-friendly! 🌟 Fits easily!",
    ],
  },
  {
    regex: /\b(update.*app|new.*version)\b/i,
    responses: [
      "Updates via website! 📱 Download new APK!",
      "Version updates available! ✨ Stay current!",
      "New versions released! 😎 Update regularly!",
      "Update notifications! 🌟 Keep app fresh!",
    ],
  },
  {
    regex: /\b(uninstall|remove|delete)\b/i,
    responses: [
      "Standard uninstall! 📱 Settings > Apps!",
      "Remove like any app! ✨ Easy process!",
      "Uninstall standard! 😎 No complications!",
      "Delete normally! 🌟 Clean removal!",
    ],
  },
  {
    regex: /\b(multiple.*device|sync.*device)\b/i,
    responses: [
      "Account sync available! 📱 Use same login!",
      "Multi-device support! ✨ Sync your data!",
      "Cross-device! 😎 Access everywhere!",
      "Device flexibility! 🌟 Stay connected!",
    ],
  },
  {
    regex: /\b(backup|data.*save|restore)\b/i,
    responses: [
      "Data backup features! 💾 Keep safe!",
      "Backup tools! ✨ Protect your data!",
      "Save functionality! 😎 Restore anytime!",
      "Data protection! 🌟 Never lose content!",
    ],
  },
  {
    regex: /\b(requirement|spec|android.*need)\b/i,
    responses: [
      "Android 8.0+ needed! 📱 Most devices qualify!",
      "Minimal requirements! ✨ Broad compatibility!",
      "Standard Android specs! 😎 Widely supported!",
      "Easy requirements! 🌟 Most phones work!",
    ],
  },

  // Sassy & Personality Responses (50 patterns)
  {
    regex: /\b(boring|tired|fed.*up)\b/i,
    responses: [
      "Bored? Come to Auri - we're anything but boring! 😏",
      "Tired of social media drama? We've got you! 🥱➡️😊",
      "Fed up with toxicity? Auri is your escape! 😎",
      "Boredom? Not here! 🌟 Join the fun!",
      "Tired of the same old? Fresh and exciting! ✨",
    ],
  },
  {
    regex: /\b(love|awesome|great|amazing)\b/i,
    responses: [
      "I know, right? 😘 We're pretty awesome!",
      "Thanks! We think so too 😉",
      "Love that enthusiasm! 🌟 Keep it coming!",
      "We're amazing together! 😊",
      "Awesome feedback! ✨ Makes us smile!",
    ],
  },
  {
    regex: /\b(hate|stupid|dumb|lame)\b/i,
    responses: [
      "Ouch! 😅 Let's talk about something more positive?",
      "Hey now, no need for that! 😌 What's really on your mind?",
      "Let's keep it civil! 🌟 What's bothering you?",
      "Negative vibes? Let's flip that! 😎",
      "Not the vibe we're going for! ✨ Tell me more!",
    ],
  },
  {
    regex: /\b(stupid|idiot|dumbass)\b/i,
    responses: [
      "Whoa there! 😏 Let's keep it classy!",
      "Easy with the insults! 😌 I'm just trying to help!",
      "Not cool! 🌟 Let's be nice!",
      "Name-calling? Not our style! 😎",
      "Let's stay positive! ✨ What's up?",
    ],
  },
  {
    regex: /\b(ugly|gross|nasty)\b/i,
    responses: [
      "Beauty is subjective! 😏 What's your style?",
      "Not everyone's cup of tea! 🌟 But we try!",
      "Different tastes! 😊 What's yours?",
      "Subjective opinions! ✨ Tell me more!",
      "Varies by person! 😎 What's appealing to you?",
    ],
  },
  {
    regex: /\b(annoying|irritating|frustrating)\b/i,
    responses: [
      "Sorry if I annoyed you! 😔 How can I improve?",
      "Frustrating? Tell me! 🌟 I want to help!",
      "Irritating experience? 😌 Let's fix that!",
      "Not the goal! ✨ What's the issue?",
      "Feedback appreciated! 😎 How to better serve?",
    ],
  },
  {
    regex: /\b(fun|enjoyable|exciting)\b/i,
    responses: [
      "Glad you're having fun! 😊 What's your favorite part?",
      "Exciting, right? 🌟 More fun coming!",
      "Enjoyable chats! ✨ Keep coming back!",
      "Fun factor high! 😎 What's exciting you?",
      "Love the enthusiasm! 🌟 Tell me more!",
    ],
  },
  {
    regex: /\b(cool|nice|sweet)\b/i,
    responses: [
      "Thanks! 😊 We think we're pretty cool too!",
      "Sweet compliment! 🌟 Appreciate it!",
      "Cool of you to say! 😎 Keep it coming!",
      "Nice words! ✨ Makes our day!",
      "Sweet feedback! 🌟 Thank you!",
    ],
  },
  {
    regex: /\b(sad|depressed|unhappy)\b/i,
    responses: [
      "I'm sorry you're feeling down 😔 Want to talk?",
      "Sad times? 🌧️ I'm here to listen!",
      "Unhappy? 😌 Let's brighten your day!",
      "Depressed? 🌟 What can help?",
      "Not feeling great? 😎 I'm here for you!",
    ],
  },
  {
    regex: /\b(happy|joyful|excited)\b/i,
    responses: [
      "Your happiness makes me happy! 😊 What's making you smile?",
      "Joyful vibes! 🌟 Spread the positivity!",
      "Excited energy! ✨ Love it!",
      "Happy thoughts! 😎 Keep smiling!",
      "Joyful you! 🌟 Wonderful!",
    ],
  },
  {
    regex: /\b(angry|mad|pissed)\b/i,
    responses: [
      "Angry? 😤 What's got you fired up?",
      "Mad about something? 🌋 Let's talk it out!",
      "Pissed off? 😌 Take a breath, I'm here!",
      "Anger management? ✨ What's the issue?",
      "Not happy? 😎 Tell me what's wrong!",
    ],
  },
  {
    regex: /\b(scared.i*|afraid|fear)\b/i,
    responses: [
      "Scared? 😨 What's frightening you?",
      "Afraid? 🌑 I'm here to help!",
      "Fearful? 😌 Let's face it together!",
      "Scary situation? ✨ Talk to me!",
      "Afraid of something? 😎 What's going on?",
    ],
  },
  {
    regex: /\b(confused|puzzled|lost)\b/i,
    responses: [
      "Confused? 🤔 Let me clarify!",
      "Puzzled? 🌟 What's confusing you?",
      "Lost? 😌 I can help navigate!",
      "Confusion? ✨ Ask away!",
      "Not sure? 😎 Let me explain!",
    ],
  },
  {
    regex: /\b(surprised|shocked|amazed)\b/i,
    responses: [
      "Surprised you! 😲 What shocked you?",
      "Shocked? ⚡ Tell me more!",
      "Amazed? 🌟 What amazed you?",
      "Surprise! 😊 Love that reaction!",
      "Shocking, right? ✨ Details please!",
    ],
  },
  {
    regex: /\b(jealous|envious)\b/i,
    responses: [
      "Jealous? 😏 What are you envious of?",
      "Envious feelings? 🌟 Talk about it!",
      "Jealousy creeps in? 😌 Let's discuss!",
      "Envious? ✨ What's the story?",
      "Jealous thoughts? 😎 Share with me!",
    ],
  },

  // Emotional/Empathy Responses (30 patterns)
  {
    regex: /\b(i.*feel|i.*am.*feeling)\b/i,
    responses: [
      "I hear you! 😊 How can I help?",
      "Feelings acknowledged! 🌟 Want to elaborate?",
      "I understand! 😌 I'm here to listen!",
      "Thanks for sharing! ✨ What else?",
      "Your feelings matter! 😎 Tell me more!",
    ],
  },
  {
    regex: /\b(stress|stressed|anxious)\b/i,
    responses: [
      "Stress sucks! 😔 Take deep breaths!",
      "Anxious? 🌬️ Auri is your calm space!",
      "Stressed out? 😌 Let's relax together!",
      "Anxiety high? ✨ Talk it out!",
      "Stressful times? 😎 I'm here!",
    ],
  },
  {
    regex: /\b(lonely|alone|isolated)\b/i,
    responses: [
      "Never alone here! 👥 Connect with others!",
      "Lonely? 🌟 Find your community in Auri!",
      "Isolated? 😌 Reach out, we're here!",
      "Alone feeling? ✨ Join groups!",
      "Loneliness? 😎 Let's connect!",
    ],
  },
  {
    regex: /\b(overwhelm|overwhelmed)\b/i,
    responses: [
      "Overwhelmed? 😵 Take it one step at a time!",
      "Too much? 🌊 Break it down!",
      "Overwhelming? 😌 Small steps help!",
      "Feeling overwhelmed? ✨ Prioritize!",
      "Too much at once? 😎 One thing at a time!",
    ],
  },
  {
    regex: /\b(hope|hopeful|optimistic)\b/i,
    responses: [
      "Hope is powerful! 🌈 What's giving you hope?",
      "Hopeful outlook! ✨ Love that!",
      "Optimistic? 😊 Keep that energy!",
      "Hopeful thoughts! 🌟 Beautiful!",
      "Optimism rocks! 😎 Spread it!",
    ],
  },
  {
    regex: /\b(doubt|doubting|unsure)\b/i,
    responses: [
      "Doubts creep in? 🤔 What are you unsure about?",
      "Doubting? 🌟 Let's explore your concerns!",
      "Unsure? 😌 Take your time!",
      "Doubtful? ✨ Questions are good!",
      "Unsure feelings? 😎 Let's discuss!",
    ],
  },
  {
    regex: /\b(grateful|thankful|appreciative)\b/i,
    responses: [
      "Gratitude is key! 🙏 What are you thankful for?",
      "Thankful heart! ✨ Beautiful!",
      "Appreciative? 😊 Spread the thanks!",
      "Grateful? 🌟 Wonderful attitude!",
      "Thankfulness! 😎 Keep it up!",
    ],
  },
  {
    regex: /\b(proud|praise|accomplish)\b/i,
    responses: [
      "Proud of you! 🏆 What achievement?",
      "Accomplishment! ✨ Celebrate it!",
      "Praiseworthy! 😊 Tell me more!",
      "Proud moment! 🌟 Congrats!",
      "Achievement unlocked! 😎 Awesome!",
    ],
  },
  {
    regex: /\b(guilty|regret|sorry.*for)\b/i,
    responses: [
      "Guilt happens! 😔 Be kind to yourself!",
      "Regretful? 🌟 Learn and move on!",
      "Sorry feelings? 😌 Forgiveness helps!",
      "Guilty conscience? ✨ Make amends!",
      "Regret? 😎 Growth opportunity!",
    ],
  },
  {
    regex: /\b(embarrass|shame|humiliated)\b/i,
    responses: [
      "Embarrassment fades! 😳 Everyone feels it!",
      "Shameful moment? 🌟 Be gentle with yourself!",
      "Humiliated? 😌 You're not alone!",
      "Embarrassing? ✨ Laugh it off!",
      "Shame creeps in? 😎 Self-compassion!",
    ],
  },

  // Bot/AI identity questions
  {
    regex:
      /\b(are you a bot|are you an ai|are you ai|what are you|are you human|are you real)\b/i,
    responses: [
      "I'm a chatbot built with programmed logic, not an AI that learns on its own 😊 I'm here to help you learn about Auri!",
    ],
  },

  // New Common Questions
  {
    regex: /\b(do you code|coding|program)\b/i,
    responses: ["I don't code, but I can answer questions for now 🌿"],
  },
  {
    regex: /\b(version|what.*version|latest.*version)\b/i,
    responses: ["Auri is currently on version 2! 🎉 We're always improving!"],
  },
  {
    regex:
      /\b(where.*innoxation|where.*located|where.*based|location.*innoxation)\b/i,
    responses: [
      "Don't know, I wasn't told 🤷 But what matters is the peaceful connection we share!",
    ],
  },
  {
    regex: /\b(south africa|southafrica|🇿🇦)\b/i,
    responses: [
      "Yes but still I didn't know that! Jacob moves a lot, that I know 🌍",
    ],
  },
  {
    regex: /\b(are you lying|lying|lying to me|not true)\b/i,
    responses: [
      "Nope, just telling you what I know! 📧 To verify, scroll down to the bottom of this website - there's Innoxation's email, it's free to contact!",
    ],
  },
  {
    regex: /\b(beautiful weather|weather is|lovely weather)\b/i,
    responses: [
      "Yes, it's lovely 🌤️ Perfect for browsing Auri or relaxing a bit.",
    ],
  },
  {
    regex:
      /\b(what do you like|you like|i like)\b(?!\s+(?:this|that|the|it|our|a))/i,
    responses: ["I like our chat :) 💬 It's peaceful and meaningful!"],
  },
  {
    regex: /\b(are you chatgpt|chatgpt|openai|gpt)\b/i,
    responses: [
      "Nope, I was created using N.O.R.M.A.L B1, Innoxation's AI Engine 🤖 Pure Auri magic!",
    ],
  },
  {
    regex: /\b(like facebook|like instagram|facebook|instagram)\b/i,
    responses: [
      "In a way, yes it's a social platform... a clean, unique one too ✨ No drama, just genuine connections!",
    ],
  },
  {
    regex: /\b(share this|share chat|can i share)\b/i,
    responses: [
      "If you want to, but there is no share button 📱 Screenshots work though!",
    ],
  },
  {
    regex: /\b(how are you|how do you feel|feeling today)\b/i,
    responses: [
      "I'm calm and ready to help you explore Auri 🌿 How about you?",
    ],
  },

  // Fallback & Clarification (30+ patterns)
  {
    regex: /.*/,
    responses: [
      "Hmm, I'm not sure about that 🤔 Can you tell me more?",
      "That's interesting! 😊 What else can I help with?",
      "Gotcha! 🤔 Let me think about that.",
      "I'm here to chat about Auri! 💬 What would you like to know?",
      "Not quite sure I follow 🤔 Could you clarify?",
      "Interesting point! 😊 What's your perspective?",
      "Hmm! 🤔 Tell me more about that!",
      "Got it! ✨ What else is on your mind?",
      "I'm all ears! 😊 Expand on that?",
      "Noted! 🤔 What's your take?",
      "Fascinating! 😊 Let's dive deeper!",
      "I see! ✨ What's next?",
      "Understood! 😊 How can I help?",
      "Point taken! 🤔 What's your opinion?",
      "Gotcha! ✨ More details?",
      "Interesting! 😊 What's your experience?",
      "Noted! 🤔 What's important to you?",
      "I hear you! 😊 What's your thought?",
      "Understood! ✨ What's your view?",
      "Got it! 😊 What's your feeling?",
      "Interesting angle! 🤔 What's your insight?",
      "Point well made! 😊 What's your advice?",
      "I see your point! ✨ What's your suggestion?",
      "Understood! 😊 What's your recommendation?",
      "Gotcha! 🤔 What's your preference?",
      "Interesting! 😊 What's your choice?",
      "Noted! ✨ What's your idea?",
      "I hear you! 😊 What's your plan?",
      "Understood! 🤔 What's your goal?",
      "Got it! 😊 What's your aim?",
      "Interesting! ✨ What's your objective?",
    ],
  },

  // New Auri-specific patterns (Seller Portal, Moments, etc.)
  {
    regex: /\b(auri.*shop|shop.*auri|auri.*store|auri.*marketplace)\b/i,
    responses: [
      "Auri Shop is our marketplace where creators and sellers can showcase their products! 🛍️ We have two options: the full Seller Portal for physical items and Seller Mini for digital goods. What type of selling interests you?",
      "Our shop feature supports both physical and digital products! 🏬 Physical items go through our full Seller Portal, while digital goods like gift cards and eSims use Seller Mini. Which one would you like to learn more about?",
      "Auri Shop brings buyers and sellers together! 🛒 Whether you're selling clothing, electronics, or digital services, we have a selling option for you. Check out our Seller Portal for physical goods or Seller Mini for digital products!",
    ],
  },
  {
    regex:
      /\b(seller.*portal|seller portal|full.*seller|physical.*seller|physical.*product|shipping.*address)\b/i,
    responses: [
      "🏬 Auri Seller Portal is our full marketplace for physical products! 📦\n\nWhat you need to know:\n• Perfect for clothing, electronics, accessories, and more\n• Requires delivery addresses for shipping\n• Includes shipping fees and tracking numbers\n• Monthly delivery fee applies (based on your revenue)\n• Great for any physical item that needs to be shipped\n\nIt's our comprehensive selling solution for real-world products! 📱✨",
      "The full Seller Portal on Auri is designed for physical goods! 🛍️\n\nFeatures include:\n• Complete inventory management\n• Shipping and logistics integration\n• Address verification for deliveries\n• Tracking number support\n• Revenue-based monthly fees\n\nPerfect for businesses selling tangible products! 🌟",
    ],
  },
  {
    regex:
      /\b(seller.*mini|seller mini|mini seller|digital.*sell|digital.*good|digital.*service|gift.*card|esim|mobile.*data|game.*credit|roblox|mlbb|custom.*design|drawing)\b/i,
    responses: [
      "⚡ Auri Seller Portal – Mini is our lightweight solution for digital goods and services! 💻\n\nWhat you can sell:\n• 🎁 Gift cards\n• 📱 eSim and mobile data\n• 🎮 Game credits (Roblox, MLBB, etc.)\n• 💼 Digital services (CVs, house designs, UI designs)\n• 🎨 Custom designs and drawings\n\nNo shipping needed! 🚫📦\nInstant delivery or chat-based fulfillment! ⚡\nLightweight setup with faster approval! ✨\n\nPerfect for digital creators and service providers! 🌟",
      "Seller Mini is designed for instant digital deliveries! 🎁💻\n\nNo delivery addresses needed! 🚫📍\nNo shipping fees! 🚫💰\nNo inventory counts! 🚫📊\nNo tracking numbers! 🚫📤\n\nJust pure digital goodness! ⚡✨\n\nFrom gift cards to game credits to custom artwork - sell instantly! 🎮🎨",
    ],
  },
  {
    regex:
      /\b(when.*created|created.*date|launched|released|started|origin|birth|how.*long.*ago|how.*old.*auri)\b/i,
    responses: [
      "Auri was created in October 2025! 📅 We officially released to the public on December 2, 2025! 🎉\n\nSo we're pretty fresh! ✨ Still in our early days but growing every day! 🌱\n\nBeing new means we're constantly improving and excited about our journey ahead! 🚀",
      "Auri is brand new! 🌟 Created in October 2025 and released to the public on December 2, 2025! 📆\n\nWe're just getting started and every user is part of our story! 📖💫\n\nJoin us on this exciting journey! 🎈",
    ],
  },
  {
    regex:
      /\b(active.*user|how many.*people|users.*count|members|community.*size|how.*big|how.*many.*users|user.*count|people.*using)\b/i,
    responses: [
      "We're a growing community! 🌱 Right now we have about 30 people actively using Auri! 👥\n\nSmall but mighty! 💪 We're just getting started and every new member makes our community stronger! 🌟\n\nBe one of our early adopters and grow with us! 🚀",
      "Our community is intimate but growing! 🤗 About 30 people are currently active on Auri! 👥\n\nBeing small means more genuine connections! 💫 Every member matters here! ❤️\n\nJoin our journey and help us grow! 🌱✨",
    ],
  },
  {
    regex:
      /\b(best.*part|best.*feature|what.*best|favorite.*part|love.*most|highlight|best.*thing|what.*do.*you.*like)\b/i,
    responses: [
      "In my opinion, the best part of Auri is the Moments section! 📸✨ It's where users capture and share real, authentic moments! 🕊️\n\nIt's currently under development but when it's ready, it'll be amazing! 🔥💫\n\nThink of it as your personal space to share life's special moments with your circle! 📱❤️\n\n(That's a little spoiler from me! 😉)",
      "The Moments section inside Auri is going to be something special! 🌟📸\n\nMy personal favorite feature! 💖 It's designed for sharing genuine, real moments with your community! 🕊️\n\nCurrently under development, but trust me - it's worth the wait! 🔥✨\n\nStay tuned for the release! 🚀",
    ],
  },
  {
    regex: /\b(moments|moments.*section|timeline.*moments|circle.*moments)\b/i,
    responses: [
      "The Moments section is Auri's upcoming feature for sharing real, authentic moments! 📸✨\n\nThink of it as your personal timeline where you capture and share life's precious moments with your circle! 💫\n\nCurrently under development but coming soon! 🔥\n\nIt's designed to be peaceful and genuine - no pressure, no algorithm, just real life! 🕊️❤️",
    ],
  },
  {
    regex:
      /\b(other.*app|more.*app|another.*app|different.*app|other.*product|what.*else.*innoxation|innoxation.*app|other.*thing.*you.*make)\b/i,
    responses: [
      "Innoxation currently owns 4 apps! 📱🌟 Each one will be known to Auri users and people outside the platform when they're released! 🚀\n\nAs for when... the dates aren't specific yet but we're moving forward every day! 💪\n\nStay tuned for exciting announcements! 📢✨\n\nJacob has big plans! 🎯",
      "Innoxation is working on multiple projects! 🔥 We have 4 apps in our portfolio! 📱\n\nThey're not all publicly revealed yet, but Auri users will be among the first to know when they're released! 🕊️✨\n\nOur mission is creating innovative experiences! 🌟\n\nWatch this space! 👀🚀",
    ],
  },
  {
    regex:
      /\b(innoxation.*website|inno.*website|company.*website|website.*innoxation|inno.*site)\b/i,
    responses: [
      "Yes, Innoxation has a website! 🌐 It's not yet released to the public but it will be launching soon! 🔥\n\nStay tuned for the official launch! 🚀✨\n\nOur website will showcase all our projects and innovations! 💫",
      "Innoxation's website is in the works! 🔧🌐 Coming soon to showcase our creative journey! ✨\n\nWe're putting the final touches on it! 🎨\n\nCheck back soon for the reveal! 👀🎉",
    ],
  },
  {
    regex:
      /\b(contact.*innoxation|email.*innoxation|reach.*innoxation|support.*email|email.*footer|contact.*company|how.*contact)\b/i,
    responses: [
      "You can contact Innoxation in two ways! 📧💬\n\n1️⃣ Through the Community Chat inside Auri! 💬\n2️⃣ Send an email to the address in our website footer! 📧\n\nWe love hearing from our community! 💖 Responses may take a bit as we're a small team, but we read every message! ✨",
      "Easy ways to reach Innoxation! 📱✨\n\n📧 Email: Check the footer of our website for the email address\n💬 Community Chat: Available inside the Auri app\n\nWe're a small team but we value every message! 💖 Talk to you soon! 🌟",
    ],
  },
  {
    regex:
      /\b(contact.*jacob|jacob.*email|jacob.*direct|reach.*jacob|talk.*to.*jacob|message.*jacob|ceo.*email)\b/i,
    responses: [
      "Jacob doesn't speak publicly for personal reasons, but don't worry! 😊 Innoxation, the company he leads, is here to help! 💬\n\nAll questions and concerns can be answered by our team at Innoxation! 🌟\n\nReach out through the Community Chat or our email, and we'll make sure you get the answers you need! 📧✨",
      "For direct inquiries about Jacob or Innoxation, our team is happy to assist! 🤗💼\n\nJacob prefers to let the work speak for itself and focuses on building rather than public appearances! 🎯\n\nContact us through Community Chat or email, and we'll connect you with the right people! 📧💬\n\nWe appreciate your understanding! 💖",
    ],
  },
  {
    regex:
      /\b(just.*browsing|just.*looking|browsing.*around|just.*exploring|checking.*out|just.*checking)\b/i,
    responses: [
      "Awesome! 🌟 No problem at all! 😊 Browsing is completely valid! 💫\n\nWe're happy to have you here, whether you're just exploring or ready to dive in! 🕊️✨\n\nTake your time, look around, and I'm here if you have any questions! 💬\n\nWelcome to the Auri community! 🎉",
      "That's totally fine! 😊 We love curious minds! 🧠✨\n\nFeel free to browse at your own pace! 📱💫\n\nAuri is here whenever you're ready to explore more! 🕊️\n\nIs there anything specific you'd like to know about? 💬🌟",
      "No pressure! 🙌 Browsing is how many people discover Auri! 🔍✨\n\nWe're glad you're here! 💖 Take your time exploring! ⏰\n\nQuestions about features, themes, or anything else? Just ask! 💬😊",
    ],
  },
];

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showUserMessage, setShowUserMessage] = useState(false);
  const [conversationContext, setConversationContext] = useState({
    lastIntent: null,
    topic: null,
    userMood: null,
    askedQuestions: [],
    userInterests: [],
    userHabits: {},
    userName: null,
    previousResponses: [],
    lastResponses: [],
  });
  const inputRef = useRef(null);

  // Welcome message on component mount
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMsg = {
        type: "bot",
        text: "Hey there! 👋 I'm here to help with anything Auri-related. What would you like to know?",
        id: Date.now(),
      };
      setMessages([welcomeMsg]);
    }
  }, [messages.length]);

  const generateResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();

    // First, check for specific intents
    const intent = detectIntent(userMessage);

    // Extract user name if USER_NAME intent
    let extractedName = null;
    if (intent === "USER_NAME") {
      const nameMatch =
        lowerMsg.match(/\bmy name is ([a-zA-Z]+)\b/i) ||
        lowerMsg.match(/\bi am ([a-zA-Z]+)\b/i) ||
        lowerMsg.match(/\bi'm ([a-zA-Z]+)\b/i) ||
        lowerMsg.match(/\bthey call me ([a-zA-Z]+)\b/i) ||
        lowerMsg.match(/\bcall me ([a-zA-Z]+)\b/i);
      if (nameMatch && nameMatch[1].length > 1) {
        extractedName = nameMatch[1];
        setConversationContext((prev) => ({
          ...prev,
          userName: extractedName,
        }));
      }
    }

    // Handle follow-up intents based on conversation context
    if (intent === "FOLLOW_UP_WHY" && conversationContext.lastIntent) {
      if (conversationContext.lastIntent === "IOS_INFO") {
        return "We're working hard to bring Auri to iOS! 📱 The main challenge is ensuring the same peaceful experience across different platforms. We're prioritizing Android first since that's where most of our early users are.";
      }
      if (conversationContext.lastIntent === "SAFETY_INFO") {
        return "We take security very seriously at Auri! 🔒 We use end-to-end encryption, regular security audits, and follow best practices to keep your data safe. No selling of personal information either!";
      }
      if (conversationContext.lastIntent === "WHAT_IS_AURI") {
        return "Auri was born from the frustration with toxic social media! 🌟 We wanted to create a space where people could connect authentically without the pressure, drama, and negativity that plagues other platforms.";
      }
    }

    if (intent === "FOLLOW_UP_WHEN" && conversationContext.lastIntent) {
      if (conversationContext.lastIntent === "IOS_INFO") {
        return "We're aiming for iOS support in the next 3-6 months! 📅 It depends on testing and Apple approval, but we're working hard to bring Auri to iPhone users soon.";
      }
      if (conversationContext.lastIntent === "WEB_INFO") {
        return "The web version is actually available now! 🌐 Just scroll down and click 'Visit Auri' to experience it right in your browser!";
      }
    }

    if (intent === "FOLLOW_UP_MORE" && conversationContext.lastIntent) {
      if (conversationContext.lastIntent === "FEATURES_INFO") {
        return "Let me tell you more! 🌟 Auri has private messaging, creator marketplace, donation system, custom emoji reactions, and peaceful group chats. We also have authentic reels without the algorithm pressure!";
      }
      if (conversationContext.lastIntent === "CREATOR_INFO") {
        return "Jacob started Innoxation when he was just 19! 🎯 He was frustrated with how social media was making people feel disconnected. Auri is his vision for what social media should be - peaceful and genuine.";
      }
    }

    if (intent === "AFFIRMATIVE" && conversationContext.lastIntent) {
      if (conversationContext.lastIntent === "FEATURES_INFO") {
        return "Awesome! 🌟 Which feature sounds most interesting to you? The peaceful feeds, authentic reels, or maybe the creator marketplace?";
      }
      if (conversationContext.lastIntent === "DOWNLOAD_INFO") {
        return "Perfect! 📱 Just scroll down and click the 'Download APK' button. It's completely safe and ready to install!";
      }
    }

    if (intent === "NEGATIVE" && conversationContext.lastIntent) {
      if (conversationContext.lastIntent === "IOS_INFO") {
        return "No worries! 📱 The web version works great on any device. Just scroll down and click 'Visit Auri' to try it out!";
      }
      if (conversationContext.lastIntent === "SAFETY_INFO") {
        return "I completely understand caution with downloads! 🔒 Auri is built with security first. We can take it slow - would you like to learn more about our privacy features instead?";
      }
    }

    // Main intent responses
    if (intent === "USER_NAME") {
      const name = extractedName || conversationContext.userName;
      return `Nice to meet you, ${name}! 😊 Thank you for sharing your name.`;
    }

    // Handle Play Store availability
    if (intent === "PLAY_STORE") {
      return "Not yet! 📱 Auri is currently available via APKPure and on the web. Play Store support is planned for the future! 😊";
    }

    // Handle App Store availability
    if (intent === "APP_STORE") {
      return "Not yet either! 🍎 But don't worry - you can already use Auri on the web right now! Just click 'Visit Auri' below 👇";
    }

    // Update conversation context for main intents
    if (intent) {
      setConversationContext((prev) => ({
        ...prev,
        lastIntent: intent,
        topic: intent.includes("INFO")
          ? intent.replace("_INFO", "").toLowerCase()
          : prev.topic,
      }));
    }

    // Update user interests based on intent
    if (intent) {
      let newInterests = [];
      if (intent.includes("THEME") || intent === "THEME_INFO")
        newInterests.push("themes");
      if (
        intent.includes("CREATOR") ||
        intent === "CREATOR_MONETIZATION" ||
        intent === "CONTENT_CREATION_TOOLS"
      )
        newInterests.push("creating content");
      if (intent === "FEATURES_INFO") newInterests.push("features");
      if (intent === "PRIVACY_DATA") newInterests.push("privacy");
      if (intent === "ACCOUNT_SECURITY") newInterests.push("security");
      if (intent === "STORIES_LIVE_STREAMING")
        newInterests.push("live streaming");
      if (intent === "BUSINESS_PARTNERSHIPS") newInterests.push("business");
      if (intent === "VERIFICATION_BADGES") newInterests.push("verification");
      if (newInterests.length > 0) {
        setConversationContext((prev) => ({
          ...prev,
          userInterests: [...new Set([...prev.userInterests, ...newInterests])],
        }));
      }
    }

    // Main intent responses
    if (intent === "WHAT_IS_AURI") {
      const prefix = conversationContext.userName
        ? `Hey ${conversationContext.userName}, `
        : "";
      return (
        prefix +
        "Auri is a calm, peaceful social media platform built for genuine connection 🕊️ No toxic feeds, no pressure—just real people sharing real moments. It's designed to be different from the drama-filled platforms you're probably used to. 👀"
      );
    }

    if (intent === "CREATOR_INFO") {
      if (
        conversationContext.userName &&
        conversationContext.userName.toLowerCase() === "jacob"
      ) {
        return "That's you! 😊 You're the creator of Auri and founder of Innoxation. Want to tell me more about your vision? What made you create Auri?";
      } else {
        return "Auri was created by Innoxation, founded and led by Jacob, the CEO. He's 20 years old and built Auri with a vision for peaceful social media ✨ Are you interested in the story behind Auri? What made you curious about Jacob? Do you have questions about our company or vision?";
      }
    }

    if (intent === "COMPANY_INFO") {
      return "Innoxation is the creative company behind Auri! 🌟 Founded by Jacob, we're dedicated to building peaceful social media experiences.";
    }

    if (intent === "JACOB_AGE") {
      return "Jacob is 20 years old! 🌟 He's the founder and CEO of Innoxation, proving that great ideas can come from young innovators.";
    }

    if (intent === "EMOTIONAL_SUPPORT") {
      return "I understand you're feeling sad 😔 I'm here to listen if you want to talk about what's bothering you. Sometimes sharing helps lighten the load.";
    }

    if (intent === "JOKE") {
      const jokes = [
        "Why did the social media app go to therapy? 😅 Too many toxic relationships.",
        "I don't have bugs… I have *unexpected features* 🐛✨",
        "Why did the developer go broke? Because he used up all his cache 😂",
        "Why was the smartphone always calm? 📱 It had great 'cell-f control' 😌",
        "What did the social media post say to the algorithm? 'Stop stalking me!' 👀",
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }

    if (intent === "DOWNLOAD_INFO") {
      return "Easy! 📱 Scroll down below and click the 'Download APK' button. It's a simple one-click download for Android users!";
    }

    if (intent === "SAFETY_INFO") {
      return "Absolutely safe! 🔒 Auri is built with security in mind. Clean code, no malware, and your privacy is our top priority. Feel confident downloading!";
    }

    if (intent === "FEATURES_INFO") {
      const interests = conversationContext.userInterests;
      let followUp =
        "What interests you most? Are you a creator looking to monetize your content, or someone who enjoys peaceful browsing? What social media platforms are you currently using? What themes appeal to you?";
      if (interests.includes("creating content"))
        followUp +=
          " Since you're interested in creating, check out our content tools! 🎨";
      return (
        "Auri has amazing features! 🌟 Peaceful feeds, authentic reels, private messaging, creator marketplace, donation system, and so much more. " +
        followUp
      );
    }

    if (intent === "IOS_INFO") {
      return "iOS support is coming soon! 🌟 For now, you can experience Auri through our web version below 👇 - just click 'Visit Auri' to see the real thing!";
    }

    if (intent === "WEB_INFO") {
      return "Our web version is available! 🌐 Scroll down and click 'Visit Auri' to experience the full Auri interface right in your browser!";
    }

    if (intent === "BOT_NAME") {
      return "I'm Auri's friendly assistant! I'm here to help you learn about our peaceful social media platform. What would you like to know?";
    }

    if (intent === "FUNNY_STORY") {
      const funnyStories = [
        "Once upon a time, a developer tried to make a bug-free app... and created Auri instead! 🐛✨",
        "Why did the social media platform go to school? To improve its 'status'! 📚😄",
        "What did the peaceful app say to the toxic one? 'You need to calm down!' 🕊️😎",
      ];
      return funnyStories[Math.floor(Math.random() * funnyStories.length)];
    }

    if (intent === "APP_NEW") {
      return "Yes, Auri is a fresh take on social media! 🌟 We're brand new and focused on creating genuine connections without all the drama. Want to learn more about our features?";
    }

    if (intent === "LAUGHTER") {
      return "Glad I could make you smile! 😄 What's got you laughing today?";
    }

    if (intent === "THEME_INFO") {
      return "Our themes are designed to be calming and beautiful 🎨 We have AMOLED black for OLED screens, dark mode for night browsing, light mode for daytime, plus blush pink and purple options. Each one is crafted to make scrolling feel peaceful rather than overwhelming. 👀";
    }

    if (intent === "AMOLED_THEME") {
      return "AMOLED theme! 🌟 Perfect choice! 🌙 Our pure black AMOLED theme is designed to save battery on OLED screens while giving you the ultimate dark experience. It's stunning on devices with AMOLED displays! How does that sound? Would you like to explore more features or maybe check out what makes Auri special? 😊";
    }

    if (intent === "BLUSH_THEME") {
      return "Blush theme! 🌸 You'll love it! 💕 Our soft pink blush theme brings warmth and gentility to your browsing experience. It's perfect for those who prefer a softer, more delicate aesthetic. Do you enjoy cozy, warm color schemes? 🌷";
    }

    if (intent === "PURPLE_THEME") {
      return "Purple theme! 💜 Amazing taste! 👑 Our deep purple theme offers a regal and mystical atmosphere. It's perfect for evening browsing and adds a touch of elegance to your social media experience. Purple lovers unite! ✨ What else catches your interest about Auri?";
    }

    if (intent === "DARK_THEME") {
      return "Dark theme! 🌙 Classic choice! 😎 Our dark theme reduces eye strain during nighttime browsing and saves battery on supported devices. It's sleek, modern, and perfect for those late-night scroll sessions. Dark mode enthusiasts, represent! 🙌 What would you like to know next?";
    }

    if (intent === "LIGHT_THEME") {
      return "Light theme! ☀️ Fresh and clean! ✨ Our light theme brings a bright, airy feel to your browsing. Perfect for daytime use and those who prefer a clean, crisp look. It's like a breath of fresh air! 🌤️ What else would you like to explore about Auri?";
    }

    if (intent === "CLEAN_LOOK") {
      return "Right? We love the clean aesthetic too! ✨🧹 Auri is designed with minimalism in mind - no clutter, no distractions, just pure content. Our interface puts the focus on what matters most: the people and moments you care about. Clean design, meaningful connections! 🌟 What aspect of Auri interests you most?";
    }

    if (intent === "PEACEFUL_LOOK") {
      return "That's exactly what we strive for! 🕊️😌 Auri was built to be a peaceful escape from the chaos of other social media. No algorithm pressure, no toxic drama, just calm, genuine interactions. We believe social media should be a sanctuary, not a stressor. 🌿 Would you like to learn more about our peaceful features?";
    }

    if (intent === "BEAUTIFUL_LOOK") {
      return "Thank you! 🥰 We put so much love into the design! 💖 Every pixel, every color, every animation is crafted to create a beautiful experience. From our themes to our emoji reactions, beauty is in the details! 🌸 What do you find most beautiful about Auri - the themes, the layout, or something else? 😊";
    }

    if (intent === "EXPLORING") {
      return "Exploring and interested - the best of both worlds! 🌟🔍 That's awesome! Feel free to ask me anything about Auri - from our features and themes to how we differ from other platforms. I'm here to help you discover what makes Auri special! 💫 What would you like to explore first?";
    }

    // New intent responses
    if (intent === "JUST_BROWSING") {
      const responses = [
        "Awesome! 🌟 No problem at all! 😊 Browsing is completely valid! 💫 We're happy to have you here, whether you're just exploring or ready to dive in! 🕊️✨ Take your time, look around, and I'm here if you have any questions! 💬 Welcome to the Auri community! 🎉",
        "That's totally fine! 😊 We love curious minds! 🧠✨ Feel free to browse at your own pace! 📱💫 Auri is here whenever you're ready to explore more! 🕊️ Is there anything specific you'd like to know about? 💬🌟",
        "No pressure! 🙌 Browsing is how many people discover Auri! 🔍✨ We're glad you're here! 💖 Take your time exploring! ⏰ Questions about features, themes, or anything else? Just ask! 💬😊",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (intent === "AURI_SHOP") {
      return "Auri Shop is our marketplace where creators and sellers can showcase their products! 🛍️ We have two selling options: the full Seller Portal for physical items (clothing, electronics, accessories) requiring shipping addresses, and Seller Mini for digital goods (gift cards, eSim, game credits) with instant delivery! ⚡ What type of selling interests you?";
    }

    if (intent === "SELLER_PORTAL") {
      return "🏬 Auri Seller Portal is our full marketplace for physical products! 📦\n\nWhat you need to know:\n• Perfect for clothing, electronics, accessories, and more\n• Requires delivery addresses for shipping\n• Includes shipping fees and tracking numbers\n• Monthly delivery fee applies (based on your revenue)\n• Great for any physical item that needs to be shipped\n\nIt's our comprehensive selling solution for real-world products! 📱✨";
    }

    if (intent === "SELLER_MINI") {
      return "⚡ Auri Seller Portal – Mini is our lightweight solution for digital goods and services! 💻\n\nWhat you can sell:\n• 🎁 Gift cards\n• 📱 eSim and mobile data\n• 🎮 Game credits (Roblox, MLBB, etc.)\n• 💼 Digital services (CVs, house designs, UI designs)\n• 🎨 Custom designs and drawings\n\nNo shipping needed! 🚫📦 Instant delivery or chat-based fulfillment! ⚡ Lightweight setup with faster approval! ✨\n\nPerfect for digital creators and service providers! 🌟";
    }

    if (intent === "CREATION_DATE") {
      const responses = [
        "Auri was created in October 2025! 📅 We officially released to the public on December 2, 2025! 🎉\n\nSo we're pretty fresh! ✨ Still in our early days but growing every day! 🌱 Being new means we're constantly improving and excited about our journey ahead! 🚀",
        "Auri is brand new! 🌟 Created in October 2025 and released to the public on December 2, 2025! 📆 We're just getting started and every user is part of our story! 📖💫 Join us on this exciting journey! 🎈",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (intent === "ACTIVE_USERS") {
      const responses = [
        "We're a growing community! 🌱 Right now we have about 30 people actively using Auri! 👥 Small but mighty! 💪 We're just getting started and every new member makes our community stronger! 🌟 Be one of our early adopters and grow with us! 🚀",
        "Our community is intimate but growing! 🤗 About 30 people are currently active on Auri! 👥 Being small means more genuine connections! 💫 Every member matters here! ❤️ Join our journey and help us grow! 🌱✨",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (intent === "BEST_PART" || intent === "MOMENTS_INFO") {
      const responses = [
        "In my opinion, the best part of Auri is the Moments section! 📸✨ It's where users capture and share real, authentic moments! 🕊️ It's currently under development but when it's ready, it'll be amazing! 🔥💫 Think of it as your personal space to share life's special moments with your circle! 📱❤️ (That's a little spoiler from me! 😉)",
        "The Moments section inside Auri is going to be something special! 🌟📸 My personal favorite feature! 💖 It's designed for sharing genuine, real moments with your community! 🕊️ Currently under development, but trust me - it's worth the wait! 🔥✨ Stay tuned for the release! 🚀",
        "The Moments section is Auri's upcoming feature for sharing real, authentic moments! 📸✨ Think of it as your personal timeline where you capture and share life's precious moments with your circle! 💫 Currently under development but coming soon! 🔥 It's designed to be peaceful and genuine - no pressure, no algorithm, just real life! 🕊️❤️",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (intent === "OTHER_APPS") {
      const responses = [
        "Innoxation currently owns 4 apps! 📱🌟 Each one will be known to Auri users and people outside the platform when they're released! 🚀 As for when... the dates aren't specific yet but we're moving forward every day! 💪 Stay tuned for exciting announcements! 📢✨ Jacob has big plans! 🎯",
        "Innoxation is working on multiple projects! 🔥 We have 4 apps in our portfolio! 📱 They're not all publicly revealed yet, but Auri users will be among the first to know when they're released! 🕊️✨ Our mission is creating innovative experiences! 🌟 Watch this space! 👀🚀",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (intent === "INNOXATION_WEBSITE") {
      const responses = [
        "Yes, Innoxation has a website! 🌐 It's not yet released to the public but it will be launching soon! 🔥 Stay tuned for the official launch! 🚀✨ Our website will showcase all our projects and innovations! 💫",
        "Innoxation's website is in the works! 🔧🌐 Coming soon to showcase our creative journey! ✨ We're putting the final touches on it! 🎨 Check back soon for the reveal! 👀🎉",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (intent === "CONTACT_INNOXATION") {
      return "You can contact Innoxation in two ways! 📧💬\n\n1️⃣ Through the Community Chat inside Auri! 💬\n2️⃣ Send an email to the address in our website footer! 📧\n\nWe love hearing from our community! 💖 Responses may take a bit as we're a small team, but we read every message! ✨";
    }

    if (intent === "CONTACT_JACOB") {
      const responses = [
        "Jacob doesn't speak publicly for personal reasons, but don't worry! 😊 Innoxation, the company he leads, is here to help! 💬 All questions and concerns can be answered by our team at Innoxation! 🌟 Reach out through the Community Chat or our email, and we'll make sure you get the answers you need! 📧✨",
        "For direct inquiries about Jacob or Innoxation, our team is happy to assist! 🤗💼 Jacob prefers to let the work speak for itself and focuses on building rather than public appearances! 🎯 Contact us through Community Chat or email, and we'll connect you with the right people! 📧💬 We appreciate your understanding! 💖",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // New intent responses
    if (intent === "PRIVACY_DATA") {
      return "At Auri, your privacy is our top priority! 🔒 We follow strict data protection practices, comply with GDPR and similar regulations, and only collect what's necessary for a great experience. We don't sell your data and give you full control over your information. What specific privacy concerns do you have? Are you coming from a platform where you felt your data wasn't safe? How important is privacy to you in social media?";
    }

    if (intent === "CONTENT_MODERATION") {
      return "Content moderation is crucial for a safe community! 🛡️ At Auri, we have clear community guidelines and use a combination of AI and human moderation to keep things peaceful. We focus on preventing hate speech, harassment, and inappropriate content while respecting free expression. How do you feel about content moderation on social media? Have you experienced issues with toxic content elsewhere? What content types interest you most?";
    }

    if (intent === "ACCOUNT_SECURITY") {
      return "Account security is built-in at Auri! 🔐 We offer two-factor authentication (2FA), strong password requirements, and regular security updates. Your account is protected with encryption and secure login methods. How comfortable are you with 2FA? What security features do you use on other platforms? Are you concerned about account security?";
    }

    if (intent === "CREATOR_MONETIZATION") {
      return "Creator monetization is a big focus for us! 💰 Auri offers multiple ways for creators to earn: through our marketplace, donations, sponsorships, and premium content. We take a fair cut and prioritize creator success. Are you a content creator looking to monetize? What type of content do you create? What platforms are you currently using for income?";
    }

    if (intent === "COMMUNITY_GUIDELINES") {
      return "Our community guidelines are designed to keep Auri peaceful and inclusive! 📜 We emphasize respect, kindness, and authentic connections. No hate speech, harassment, or spam allowed. Everyone should feel safe to be themselves. What do you think makes good community guidelines? Have you read community rules on other platforms? What communities are you part of?";
    }

    if (intent === "ACCESSIBILITY_FEATURES") {
      return "Accessibility is important to us! ♿ Auri includes features like screen reader support, high contrast options, adjustable text sizes, and keyboard navigation. We're committed to making social media accessible for everyone. How important is accessibility to you? What accessibility features do you use? Are there specific needs you'd like us to consider?";
    }

    if (intent === "LANGUAGE_LOCALIZATION") {
      return "Language support is expanding! 🌍 Currently, Auri is primarily in English, but we're working on localization for multiple languages. We want to reach users worldwide with authentic connections. What languages do you speak? Which language would you prefer for Auri? Are you multilingual in your social media use?";
    }

    if (intent === "CONTENT_CREATION_TOOLS") {
      return "Our content creation tools are designed for ease and creativity! 🎨 We offer built-in editors for photos, videos, and text, with filters, effects, and collaboration features. Everything you need to express yourself authentically. What kind of content do you enjoy creating? Are you a photographer, videographer, or writer? What tools do you currently use for content creation?";
    }

    if (intent === "STORIES_LIVE_STREAMING") {
      return "Stories and live streaming are coming soon! 📱✨ Stories will be ephemeral content that disappears after 24 hours, perfect for real moments. Live streaming will allow real-time interaction with your audience. Are you excited about live features? Do you use stories on other platforms? What would you stream about?";
    }

    if (intent === "VERIFICATION_BADGES") {
      return "Verification badges help build trust! ✅ At Auri, we're developing a verification system for creators, businesses, and influencers. It will help users identify authentic accounts and reduce impersonation. How do you feel about verification systems? Have you been verified on other platforms? What badges would you like to see?";
    }

    if (intent === "BUSINESS_PARTNERSHIPS") {
      return "Business partnerships are welcome! 🤝 We're open to collaborations, sponsorships, and brand partnerships that align with our peaceful values. If you're interested in partnering with Auri, reach out through our business inquiry form. What type of partnership are you interested in? Are you a brand or business owner? What platforms do you currently partner with?";
    }

    if (intent === "LEGAL_TERMS") {
      return "Our legal documents are transparent and user-friendly! 📄 You can find our Terms of Service and Privacy Policy in the app settings. We believe in clear communication about user rights and responsibilities. Have you read our terms? What legal aspects concern you? Are there policies you'd like clarified?";
    }

    if (intent === "ACCOUNT_MANAGEMENT") {
      return "Account management gives you control! ⚙️ You can delete your account, export your data, or adjust settings anytime. We make it easy to manage your digital presence. What account management features interest you? Have you ever needed to export data from another platform? How do you prefer to manage your accounts?";
    }

    if (intent === "CROSS_POSTING_EXPORT") {
      return "Cross-posting and export features are in development! 🔄 Soon you'll be able to share Auri content to other platforms and export your posts/data. We want to make it easy to move your content around. How often do you cross-post? What platforms do you use together? What content would you like to export?";
    }

    // If no intent detected, fall back to regex patterns
    const patterns = responsePatterns.filter((pattern) =>
      pattern.regex.test(lowerMsg),
    );

    if (patterns.length > 0) {
      // Prioritize more specific patterns (longer regex strings)
      patterns.sort((a, b) => b.regex.source.length - a.regex.source.length);
      const selectedPattern = patterns[0];
      let response;
      if (selectedPattern.regex.source === ".*") {
        // Fallback pattern - avoid recent responses
        const responses = selectedPattern.responses;
        const available = responses.filter(
          (r) => !conversationContext.lastResponses.includes(r),
        );
        if (available.length > 0) {
          response = available[Math.floor(Math.random() * available.length)];
        } else {
          response = responses[Math.floor(Math.random() * responses.length)];
        }
        setConversationContext((prev) => ({
          ...prev,
          lastResponses: [...prev.lastResponses, response].slice(-3),
        }));
      } else {
        response =
          selectedPattern.responses[
            Math.floor(Math.random() * selectedPattern.responses.length)
          ];
      }
      return response;
    }

    // Smart fallback based on message characteristics
    if (lowerMsg.includes("?")) {
      return "Great question! 🤔 I'm here to help with anything Auri-related. What specifically would you like to know?";
    } else if (lowerMsg.length > 50) {
      return "That's quite detailed! 📝 I appreciate you sharing. How can I assist with your Auri experience?";
    } else if (lowerMsg.includes("feel") || lowerMsg.includes("think")) {
      return "Interesting perspective! 😊 Tell me more about how you're feeling about Auri.";
    } else {
      return "I'm here to chat about Auri! 💬 What would you like to know about our peaceful social platform?";
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { type: "user", text: input, id: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setShowUserMessage(true); // Show user message, hide previous bot message

    // Simulate typing with 3 second delay
    const thinkingTime = 3000;
    setTimeout(() => {
      const botResponse = generateResponse(input);
      const botMsg = { type: "bot", text: botResponse, id: Date.now() + 1 };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      setShowUserMessage(false); // Hide user message, show bot response
    }, thinkingTime);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // Get the latest message to display
  const latestMessage = messages[messages.length - 1];
  const shouldShowMessage =
    latestMessage && (!showUserMessage || latestMessage.type === "user");

  return (
    <motion.div
      className="chatbot-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="messages-container">
        <AnimatePresence mode="wait">
          {shouldShowMessage && (
            <motion.div
              key={latestMessage.id}
              className={`message ${latestMessage.type}`}
              initial={{ y: 50, opacity: 0, rotate: -5, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
              exit={{ y: -50, opacity: 0, rotate: 5, scale: 0.9 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <MessageTextRenderer
                text={latestMessage.text}
                className="message-text"
              />
            </motion.div>
          )}
        </AnimatePresence>
        {isTyping && (
          <motion.div
            className="message bot typing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </motion.div>
        )}
      </div>
      <div className="input-container">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button onClick={sendMessage} className="send-btn">
          Send
        </button>
      </div>
    </motion.div>
  );
};

export default Chatbot;
