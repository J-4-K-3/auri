import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageTextRenderer, EmojiImage } from "../components/EmojiRenderer";
import "../styles/Chatbot.css";
import {
  extractEmojiFromText,
  DEFAULT_EMOJI,
  ALPHABET,
  ALPHABET_LOWER,
  DAYS_OF_WEEK,
  MONTHS_OF_YEAR,
  NUMBERS,
  CONTINENTS,
  OCEANS,
  PLANETS,
  RAINBOW_COLORS,
  BASIC_COLORS,
  JOKES,
  WOULD_YOU_RATHER_RESPONSES,
  GAMING_KNOWLEDGE,
  CODING_KNOWLEDGE,
  BOT_KNOWLEDGE,
  IMPOSSIBLE_QUESTIONS,
  CLARIFICATION_HELPERS,
} from "../bot/data";

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
  DESIGN_NEW_LOOK: 90,
  DESIGN_GLASS: 85,
  DESIGN_COLORS: 85,
  DESIGN_LAYOUT: 80,
  GREETING: 10,
  GOODBYE: 10,
  THANKS: 10,
  AI_INFO: 85,
  COMMUNITY_INFO: 85,
  PRIVACY_DETAILED: 90,
  WHAT_CAN_YOU_DO: 80,

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
  COMPLIMENT: 56,
  PERSONALITY_QUESTION: 55,
  JOKE: 55,
  LAUGHTER: 55,
  APP_NEW: 50,
  TRAVEL_DESTINATION: 62,
  HEALTH_MEDICINE: 60,
  CELEBRITY_KNOWLEDGE: 50,
  CONTACT_SUPPORT: 65,
  TECHNICAL_EXPLANATION: 63,

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

  // General Knowledge (High priority - accurate answers)
  ALPHABET: 82,
  NUMBERS_SEQUENCE: 82,
  MONTHS: 82,
  DAYS_OF_WEEK: 82,
  PLANETS: 82,
  CONTINENTS: 82,
  OCEANS: 82,
  RAINBOW_COLORS: 82,
  COLORS: 80,

  // Math & Calculations (High priority - factual)
  MATH_SIMPLE: 81,
  MATH_QUESTION: 78,
  UNIT_CONVERSION: 78,

  // Jokes & Humor (Medium priority)
  JOKE_ANIMAL: 58,
  JOKE_PROGRAMMING: 58,
  JOKE_GENERAL: 58,
  WOULD_YOU_RATHER: 56,

  // Gaming & Tech Knowledge (Medium priority)
  GAMING_MINECRAFT: 60,
  GAMING_KNOWLEDGE: 58,
  CODING_KNOWLEDGE: 60,
  CODING_QUESTION: 60,

  // Bot Self-Awareness (Medium priority)
  BOT_SMARTNESS: 57,
  BOT_CAPABILITIES: 57,
  BOT_LANGUAGES: 57,
  BOT_HOW_WORKS: 57,

  // Personality & Out-of-the-Ordinary Questions (Medium-High priority)
  PLANET_VISIT: 58,
  FAVORITE_PROGRAMMING_LANGUAGE: 58,
  WOULD_YOU_RATHER_SPECIFIC: 59,
  BOT_DREAMS: 57,
  BOT_SECRET: 57,
  BOT_FEELINGS: 57,
  WEIRD_KNOWLEDGE: 56,
  BOT_PERSONALITY: 57,
  FUN_FACT: 55,
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
        /\b(hello|hi|hey|greetings|sup|yo|good.*morning|good.*afternoon|good.*evening)\b/i.test(
          lowerMsg
        )
      ) {
        return "GREETING";
      }
      return null;
    },

    // Goodbye
    () => {
      if (
        /\b(bye|goodbye|see.*ya|later|farewell|gtg|brb)\b/i.test(lowerMsg)
      ) {
        return "GOODBYE";
      }
      return null;
    },

    // Thanks
    () => {
      if (
        /\b(thanks|thank.*you|thx|appreciate.*it|grateful|ty)\b/i.test(
          lowerMsg
        )
      ) {
        return "THANKS";
      }
      return null;
    },

    // AI / How it works
    () => {
      if (
        /\b(ai|artificial.*intelligence|how.*you.*work|smart|brain|bot|machine.*learning|llm|engine)\b/i.test(
          lowerMsg
        )
      ) {
        return "AI_INFO";
      }
      return null;
    },

    // Detailed Privacy
    () => {
      if (
        /\b(data|privacy|tracking|ads|sell.*data|private|secure|encryption|encrypted|safety)\b/i.test(
          lowerMsg
        )
      ) {
        return "PRIVACY_DETAILED";
      }
      return null;
    },

    // Community / Social
    () => {
      if (
        /\b(community|people|friends|groups|social|connect|share|chat|reels|moments)\b/i.test(
          lowerMsg
        )
      ) {
        return "COMMUNITY_INFO";
      }
      return null;
    },

    // What can you do
    () => {
      if (
        /\b(what.*can.*you.*do|help|commands|features|capabilities|how.*can.*you.*help)\b/i.test(
          lowerMsg
        )
      ) {
        return "WHAT_CAN_YOU_DO";
      }
      return null;
    },

    () => {
      if (
        /\b(my.*name.*is|i.*am|i'm|call me|they call me|you can call me)\b/i.test(lowerMsg) &&
        /\b[a-zA-Z]+\b/.test(lowerMsg)
      ) {
        const nameMatch =
          lowerMsg.match(/\bmy name is ([a-zA-Z]+)\b/i) ||
          lowerMsg.match(/\bi am ([a-zA-Z]+)\b/i) ||
          lowerMsg.match(/\bi'm ([a-zA-Z]+)\b/i) ||
          lowerMsg.match(/\bcall me ([a-zA-Z]+)\b/i) ||
          lowerMsg.match(/\bthey call me ([a-zA-Z]+)\b/i) ||
          lowerMsg.match(/\byou can call me ([a-zA-Z]+)\b/i);
        
        // Only accept if name matches (must be 2+ chars and not be a common word like "hungry", "sad", etc.)
        const commonFalsePositives = ["hungry", "sad", "happy", "tired", "sick", "busy", "ready", "ending", "done", "talking"];
        if (nameMatch && nameMatch[1].length > 2 && !commonFalsePositives.includes(nameMatch[1].toLowerCase())) {
          return "USER_NAME";
        }
      }
      return null;
    },

    () => {
      if (
        /\b(new.*look|redesign|new.*design|look.*different|changed|modern|update.*website|beautiful|pretty|clean|cool.*ui|smooth)\b/i.test(
          lowerMsg
        )
      ) {
        return "DESIGN_NEW_LOOK";
      }
      return null;
    },

    // Glassmorphism / UI Style
    () => {
      if (
        /\b(glass|blur|transparent|frost|glassmorphism|glow|shine|sleek|polished)\b/i.test(
          lowerMsg
        )
      ) {
        return "DESIGN_GLASS";
      }
      return null;
    },

    // Colors / Palette
    () => {
      if (
        /\b(color|palette|midnight|aurora|teal|blue|pink|purple|neon|gradient|dark.*theme|bright)\b/i.test(
          lowerMsg
        )
      ) {
        return "DESIGN_COLORS";
      }
      return null;
    },

    // Layout / Navigation
    () => {
      if (
        /\b(layout|navigation|nav|menu|bottom.*nav|floating|island|mobile.*nav|desktop.*nav)\b/i.test(
          lowerMsg
        )
      ) {
        return "DESIGN_LAYOUT";
      }
      return null;
    },

    // Web Store availability
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

    // ============================================================
    // GENERAL KNOWLEDGE INTENTS
    // ============================================================

    // Alphabet
    () => {
      if (
        /\b(alphabet|letters|a.*b.*c|spell.*alphabet|tell.*letters)\b/i.test(
          lowerMsg,
        )
      ) {
        return "ALPHABET";
      }
      return null;
    },

    // Numbers sequence
    () => {
      if (
        /\b(count.*to|numbers|number.*sequence|1.*2.*3|123|counting)\b/i.test(
          lowerMsg,
        )
      ) {
        return "NUMBERS_SEQUENCE";
      }
      return null;
    },

    // Months of the year
    () => {
      if (
        /\b(months|list.*months|all.*months|12.*months|months.*of.*year)\b/i.test(
          lowerMsg,
        )
      ) {
        return "MONTHS";
      }
      return null;
    },

    // Days of the week
    () => {
      if (
        /\b(days|list.*days|days.*of.*week|7.*days|monday|tuesday|wednesday)\b/i.test(
          lowerMsg,
        )
      ) {
        return "DAYS_OF_WEEK";
      }
      return null;
    },

    // Planets
    () => {
      if (
        /\b(planets|solar.*system|how.*many.*planets|list.*planets|planet.*names)\b/i.test(
          lowerMsg,
        )
      ) {
        return "PLANETS";
      }
      return null;
    },

    // Continents
    () => {
      if (
        /\b(continents|how.*many.*continents|list.*continents|continent.*names)\b/i.test(
          lowerMsg,
        )
      ) {
        return "CONTINENTS";
      }
      return null;
    },

    // Oceans
    () => {
      if (
        /\b(oceans|how.*many.*oceans|list.*oceans|ocean.*names)\b/i.test(
          lowerMsg,
        )
      ) {
        return "OCEANS";
      }
      return null;
    },

    // Rainbow colors
    () => {
      if (/\b(rainbow.*colors|colors.*rainbow|roygbiv)\b/i.test(lowerMsg)) {
        return "RAINBOW_COLORS";
      }
      return null;
    },

    // Colors
    () => {
      if (/\b(colors|list.*colors|basic.*colors)\b/i.test(lowerMsg)) {
        return "COLORS";
      }
      return null;
    },

    // ============================================================
    // MATH & CALCULATIONS
    // ============================================================

    // Simple math questions (addition, subtraction, multiplication, division)
    () => {
      if (
        /\b(what.*is|calculate|how.*much|solve)\b.*(\d+\s*[\+\-\*\/]\s*\d+|[0-9].*(?:\+|-|\*|÷|\/|divided|plus|minus|times|multiplied))/i.test(
          lowerMsg,
        )
      ) {
        return "MATH_SIMPLE";
      }
      // Catch common simple math
      if (/\b(2.*\+.*2|5.*\+.*3|10.*-.*3|3.*\*.*4|math|arithmetic)\b/i.test(lowerMsg)) {
        return "MATH_SIMPLE";
      }
      return null;
    },

    // Math questions (general)
    () => {
      if (
        /\b(math|formula|equation|calculate|conversion|percent)\b/i.test(
          lowerMsg,
        )
      ) {
        return "MATH_QUESTION";
      }
      return null;
    },

    // Unit conversion
    () => {
      if (
        /\b(convert|cm.*meter|mile.*km|kilogram|gram|pound|ounce|inch|foot)\b/i.test(
          lowerMsg,
        )
      ) {
        return "UNIT_CONVERSION";
      }
      return null;
    },

    // ============================================================
    // JOKES & HUMOR
    // ============================================================

    // Animal jokes - especially cow with no legs
    () => {
      if (
        /\b(cow.*no.*legs|no.*legs.*cow|ground.*beef|animal.*joke|what.*do.*you.*call)\b/i.test(
          lowerMsg,
        )
      ) {
        return "JOKE_ANIMAL";
      }
      return null;
    },

    // Programming jokes
    () => {
      if (
        /\b(programmer.*joke|coding.*joke|java.*developer|debug|syntax|error)\b/i.test(
          lowerMsg,
        )
      ) {
        return "JOKE_PROGRAMMING";
      }
      return null;
    },

    // Would you rather
    () => {
      if (/\b(would.*you.*rather|choose.*or|pick.*one)\b/i.test(lowerMsg)) {
        return "WOULD_YOU_RATHER";
      }
      return null;
    },

    // General joke request
    () => {
      if (
        /\b(tell.*joke|joke|funny|make.*laugh|laugh|haha|tell.*something.*funny)\b/i.test(
          lowerMsg,
        )
      ) {
        return "JOKE_GENERAL";
      }
      return null;
    },

    // ============================================================
    // GAMING & TECH KNOWLEDGE
    // ============================================================

    // Minecraft specifically
    () => {
      if (/\b(minecraft|do.*you.*know.*minecraft|ever.*played.*minecraft)\b/i.test(lowerMsg)) {
        return "GAMING_MINECRAFT";
      }
      return null;
    },

    // Gaming knowledge (general)
    () => {
      if (
        /\b(gaming|video.*game|game|roblox|fortnite|mlbb|play.*game|gamer)\b/i.test(
          lowerMsg,
        )
      ) {
        return "GAMING_KNOWLEDGE";
      }
      return null;
    },

    // Coding knowledge - specific question
    () => {
      if (
        /\b(do.*you.*know.*how.*to.*code|can.*you.*code|coding|do.*you.*code|programming)\b/i.test(
          lowerMsg,
        )
      ) {
        return "CODING_KNOWLEDGE";
      }
      return null;
    },

    // Coding question (general)
    () => {
      if (
        /\b(code|javascript|react|python|html|css|developer|software|engineer)\b/i.test(
          lowerMsg,
        )
      ) {
        return "CODING_QUESTION";
      }
      return null;
    },

    // ============================================================
    // BOT SELF-AWARENESS
    // ============================================================

    // Are you smart / smartness
    () => {
      if (/\b(are.*you.*smart|smart|intelligent|iq|genius)\b/i.test(lowerMsg)) {
        return "BOT_SMARTNESS";
      }
      return null;
    },

    // What can you do / capabilities
    () => {
      if (
        /\b(what.*can.*you.*do|capabilities|can.*you|what.*can.*i|features.*you)\b/i.test(
          lowerMsg,
        )
      ) {
        return "BOT_CAPABILITIES";
      }
      return null;
    },

    // Languages you know
    () => {
      if (
        /\b(languages.*you.*know|what.*languages|speak|language|multilingual)\b/i.test(
          lowerMsg,
        )
      ) {
        return "BOT_LANGUAGES";
      }
      return null;
    },

    // How do you work / how do you function
    () => {
      if (/\b(how.*do.*you.*work|how.*do.*you.*function|how.*you.*built)\b/i.test(lowerMsg)) {
        return "BOT_HOW_WORKS";
      }
      return null;
    },

    // Compliments and personality questions
    () => {
      if (/\b(adorable|cute|smart|funny|cool|awesome|amazing|great|beautiful|pretty|nice|sweet|kind|lovely|wonderful)\b/i.test(lowerMsg) && 
          /\b(you|auri|this|that)\b/i.test(lowerMsg)) {
        return "COMPLIMENT";
      }
      return null;
    },

    // Personality & existence questions
    () => {
      if (/\b(are you|do you|what are you|favorite|like|prefer|think about|your.*opinion|personality)\b/i.test(lowerMsg)) {
        return "PERSONALITY_QUESTION";
      }
      return null;
    },

    // Travel & Geography
    () => {
      if (/\b(best.*place.*travel|travel|country|city|destination|where.*go|visit|vacation|trip)\b/i.test(lowerMsg)) {
        return "TRAVEL_DESTINATION";
      }
      return null;
    },

    // Health & Medicine
    () => {
      if (/\b(medicine|doctor|health|sick|illness|disease|medical|hospital|treatment|symptom|disease)\b/i.test(lowerMsg)) {
        return "HEALTH_MEDICINE";
      }
      return null;
    },

    // Celebrity & Famous People Knowledge
    () => {
      if (/\b(elon|musk|taylor|swift|cardi|beyonce|celebrity|actor|singer|famous|know about)\b/i.test(lowerMsg)) {
        return "CELEBRITY_KNOWLEDGE";
      }
      return null;
    },

    // Contact & Support
    () => {
      if (/\b(contact|reach|support|help|feedback|bug|issue|problem|report|developer|jacob|innoxation)\b/i.test(lowerMsg) &&
          /\b(how|where|can|send|tell|email|phone)\b/i.test(lowerMsg)) {
        return "CONTACT_SUPPORT";
      }
      return null;
    },

    // Technical Explanation (built with, what language, etc)
    () => {
      if (/\b(built with|built.*with|what.*language|framework|technology|code|javascript|python|what do you mean)\b/i.test(lowerMsg)) {
        return "TECHNICAL_EXPLANATION";
      }
      return null;
    },

    // ============================================================
    // OUT-OF-THE-ORDINARY / PERSONALITY QUESTIONS
    // ============================================================

    // If you could visit any planet - random planet selection
    () => {
      if (/\b(visit.*planet|which.*planet|planet.*visit|favorite.*planet|travel.*planet)\b/i.test(lowerMsg)) {
        return "PLANET_VISIT";
      }
      return null;
    },

    // Favorite programming language
    () => {
      if (/\b(favorite.*programming.*language|programming.*language.*favorite|what.*language.*favorite|fav.*language.*code)\b/i.test(lowerMsg)) {
        return "FAVORITE_PROGRAMMING_LANGUAGE";
      }
      return null;
    },

    // Would you rather specific (horse-sized duck, etc)
    () => {
      if (/\b(horse.*sized.*duck|duck.*sized.*horse|100.*duck.*horse|duck.*horse.*battle)\b/i.test(lowerMsg)) {
        return "WOULD_YOU_RATHER_SPECIFIC";
      }
      return null;
    },

    // What do you dream about
    () => {
      if (/\b(do.*you.*dream|dream.*about|dreaming|dreams|what.*you.*dream)\b/i.test(lowerMsg)) {
        return "BOT_DREAMS";
      }
      return null;
    },

    // Can you tell me a secret
    () => {
      if (/\b(tell.*secret|secret|secrets|can.*you.*keep.*a.*secret|know.*any.*secret)\b/i.test(lowerMsg)) {
        return "BOT_SECRET";
      }
      return null;
    },

    // Do you have feelings
    () => {
      if (/\b(do.*you.*have.*feelings|have.*feelings|feelings|do.*you.*feel|emotions|do.*you.*experience)\b/i.test(lowerMsg)) {
        return "BOT_FEELINGS";
      }
      return null;
    },

    // Weirdest thing you know
    () => {
      if (/\b(weird.*thing|weirdest|strange.*fact|obscure.*knowledge|crazy.*fact|wild.*fact|bizarre)\b/i.test(lowerMsg)) {
        return "WEIRD_KNOWLEDGE";
      }
      return null;
    },

    // Bot personality
    () => {
      if (/\b(who.*are.*you|what.*are.*you|your.*personality|describe.*yourself|what.*kind.*of.*bot)\b/i.test(lowerMsg)) {
        return "BOT_PERSONALITY";
      }
      return null;
    },

    // Fun facts
    () => {
      if (/\b(fun.*fact|tell.*fact|interesting.*fact|random.*fact|did.*you.*know)\b/i.test(lowerMsg)) {
        return "FUN_FACT";
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

// Function to detect emotion/keyword from user message and return appropriate emoji
const detectUserEmotion = (userMessage) => {
  const lowerMsg = userMessage.toLowerCase();

  // ============================================================
  // POSITIVE/HAPPY KEYWORDS
  // ============================================================

  // Greetings
  if (/\b(hello|hey|hi|howdy|hiya|sup|yo|greetings|salutations|what.*up)\b/i.test(lowerMsg)) {
    return "grinning_face_with_smiling_eyes_3d";
  }

  // How are you variants
  if (/\b(how.*are.*you|how.*going|how.*doing|what.*up|sup|wassup|how.*you|how.*been)\b/i.test(lowerMsg)) {
    return "slightly_smiling_face_3d";
  }

  // Morning greetings
  if (/\b(good.*morning|morning|mornin|wake.*up|early|sunrise)\b/i.test(lowerMsg)) {
    return "smiling_face_with_smiling_eyes_3d";
  }

  // Evening/Night greetings
  if (/\b(good.*evening|evening|good.*night|night|sunset|dusk|bedtime)\b/i.test(lowerMsg)) {
    return "relieved_face_3d";
  }

  // Gratitude
  if (/\b(thanks|thank.*you|thx|ty|appreciate|appreciated|grateful|gratitude|ty|much.*thanks|thanks.*much)\b/i.test(lowerMsg)) {
    return "smiling_face_with_hearts_3d";
  }

  // Affirmative responses
  if (/\b(yes|yeah|yep|sure|ok|okay|alright|yup|affirmative|definitely|absolutely|certainly|absolutely|of.*course|for.*sure)\b/i.test(lowerMsg)) {
    return "beaming_face_with_smiling_eyes_3d";
  }

  // Admiration/Love
  if (/\b(love|beautiful|pretty|gorgeous|amazing|awesome|great|fantastic|wonderful|excellent|superb|marvelous|incredible|stunning|spectacular|fabulous|divine|perfect|brilliant|outstanding|remarkable)\b/i.test(lowerMsg)) {
    return "smiling_face_with_heart-eyes_3d";
  }

  // Fun/Enjoyment
  if (/\b(fun|enjoyable|enjoying|enjoy|exciting|cool|nice|sweet|delightful|pleasant|charming|lovely|delicious|yummy|scrumptious)\b/i.test(lowerMsg)) {
    return "face_with_tongue_3d";
  }

  // Happiness/Joy
  if (/\b(happy|joyful|excited|glad|pleased|blissful|cheerful|elated|thrilled|delighted|overjoyed|ecstatic|giddy|euphoric|radiant)\b/i.test(lowerMsg)) {
    return "grinning_face_with_big_eyes_3d";
  }

  // Enthusiasm/Energy
  if (/\b(awesome|great|cool|dope|sick|fire|lit|slay|killing.*it|crushing.*it|nailed.*it|awesome|epic|bomb)\b/i.test(lowerMsg)) {
    return "partying_face_3d";
  }

  // Confidence
  if (/\b(confident|confident|sure|assured|trust|believe|positive|optimistic|bullish|determined|motivated|driven)\b/i.test(lowerMsg)) {
    return "star_struck_3d";
  }

  // Curiosity/Interest
  if (/\b(interesting|intrigued|curious|wonder|wondering|fascinated|captivated|enthralled|mesmerized)\b/i.test(lowerMsg)) {
    return "thinking_face_3d";
  }

  // ============================================================
  // NEGATIVE/SAD KEYWORDS
  // ============================================================

  // Sadness
  if (/\b(sad|depressed|unhappy|down|blue|melancholy|heartbroken|heartbroken|gloomy|dismal|sorrowful|miserable|downhearted|forlorn|dejected)\b/i.test(lowerMsg)) {
    return "crying_face_3d";
  }

  // Hatred/Dislike
  if (/\b(hate|dislike|despise|loathe|detest|abhor|can't.*stand|dislike|gross|yuck|ew|eww|disgusting|repulsive|revolting)\b/i.test(lowerMsg)) {
    return "angry_face_3d";
  }

  // Disappointment
  if (/\b(bad|terrible|awful|horrible|sucks|worst|disappointing|disappointed|let.*down|underwhelming|mediocre|poor|subpar|lame|sucky|rubbish|ruined)\b/i.test(lowerMsg)) {
    return "disappointed_face_3d";
  }

  // Anger/Rage
  if (/\b(angry|mad|pissed|irritated|furious|enraged|livid|seething|irate|incensed|outraged|wrathful|infuriated)\b/i.test(lowerMsg)) {
    return "face_with_steam_from_nose_3d";
  }

  // Fear/Scared
  if (/\b(scared|afraid|fear|terrified|frightened|horrified|petrified|panicked|alarmed|anxious|dread|dreading|worried|concerned)\b/i.test(lowerMsg)) {
    return "fearful_face_3d";
  }

  // Confusion
  if (/\b(confused|puzzled|lost|bewildered|perplexed|baffled|stumped|mystified|disoriented|unclear|huh|what|eh|pardon|say.*again|come.*again)\b/i.test(lowerMsg)) {
    return "thinking_face_3d";
  }

  // Surprise/Shock
  if (/\b(surprised|shocked|amazed|astonished|astounded|stunned|gobsmacked|flabbergasted|wow|whoa|woah|whew|no.*way|no.*way|seriously|really|omg|oh.*my|oh.*god)\b/i.test(lowerMsg)) {
    return "astonished_face_3d";
  }

  // Skepticism/Doubt
  if (/\b(skeptical|doubt|doubtful|suspicious|uncertain|unconvinced|hmm|hmph|really|sure.*about|not.*so.*sure|skeptical|doubtful)\b/i.test(lowerMsg)) {
    return "face_with_raised_eyebrow_3d";
  }

  // Jealousy/Envy
  if (/\b(jealous|envious|envying|wishing|wish.*i|wish.*i.*had|why.*not.*me|unfair|unfairly)\b/i.test(lowerMsg)) {
    return "unamused_face_3d";
  }

  // Stress/Anxiety
  if (/\b(stressed|anxious|worried|nervous|tense|on.*edge|jittery|unsettled|uneasy|troubled|bothered|frazzled|overwhelmed|panic|panicking)\b/i.test(lowerMsg)) {
    return "anxious_face_with_sweat_3d";
  }

  // Tiredness/Fatigue
  if (/\b(tired|exhausted|fatigued|weary|sleepy|sleek|drowsy|drained|worn.*out|beat|knackered|pooped|wiped|yawning)\b/i.test(lowerMsg)) {
    return "tired_face_3d";
  }

  // Frustration
  if (/\b(frustrated|frustrating|annoyed|annoying|irritating|bothersome|maddening|exasperating|grrr|ugh|argh|aargh|darn|shoot|crap)\b/i.test(lowerMsg)) {
    return "face_with_steam_from_nose_3d";
  }

  // Sarcasm/Mocking
  if (/\b(yeah.*right|sure.*jan|right.*sure|yeah.*sure|fat.*chance|good.*luck|yeah.*okay|sarcasm|sarcastic|mock|mocking|yeah.*right)\b/i.test(lowerMsg)) {
    return "smirking_face_3d";
  }

  // Disgust
  if (/\b(gross|yuck|ew|eww|disgusting|repulsive|revolting|vile|nasty|filthy|icky|yucky|blegh|blech)\b/i.test(lowerMsg)) {
    return "nauseated_face_3d";
  }

  // ============================================================
  // NEUTRAL/OTHER KEYWORDS
  // ============================================================

  // Goodbye/Farewell
  if (/\b(bye|goodbye|see.*you|later|bye.*bye|cya|take.*care|farewell|adios|cheerio|tata|see.*ya|catch.*you|until.*then|peace.*out)\b/i.test(lowerMsg)) {
    return "waving_hand_3d";
  }

  // Apology
  if (/\b(sorry|apologize|my.*bad|oops|my.*fault|excuse.*me|pardon.*me|forgive.*me|apologies|regret|regretful|my.*mistake)\b/i.test(lowerMsg)) {
    return "pleading_face_3d";
  }

  // Polite request
  if (/\b(please|pls|plz|pretty.*please|would.*you|could.*you|might.*you|can.*you.*please|if.*you.*don't.*mind)\b/i.test(lowerMsg)) {
    return "smiling_face_3d";
  }

  // Negative response
  if (/\b(no|nope|nah|not.*really|not.*at.*all|no.*way|no.*chance|absolutely.*not|never|nah.*man|nope.*nope)\b/i.test(lowerMsg)) {
    return "neutral_face_3d";
  }

  // Uncertainty/Hesitation
  if (/\b(maybe|perhaps|possibly|might|could|uncertain|undecided|not.*sure|unsure|toss.*up|either.*way|whatever|idk|dunno|don't.*know|beats.*me)\b/i.test(lowerMsg)) {
    return "thinking_face_3d";
  }

  // Laughter/Humor
  if (/\b(haha|hahaha|hehe|lol|lmao|rofl|rotfl|funny|hilarious|comedy|comedic|ha.*ha|hehe|chuckle|giggle|laugh)\b/i.test(lowerMsg)) {
    return "rolling_on_the_floor_laughing_3d";
  }

  // Relaxation/Contentment
  if (/\b(relaxing|relax|chill|chillin|chilling|peaceful|peaceful|calm|calming|serene|tranquil|mellow|laid.*back)\b/i.test(lowerMsg)) {
    return "relieved_face_3d";
  }

  // Confidence/Pride
  if (/\b(confident|proud|proudly|pride|arrogant|cocky|smug|boastful|bragging|showing.*off|look.*at.*me)\b/i.test(lowerMsg)) {
    return "smiling_face_with_sunglasses_3d";
  }

  // Cute/Affectionate
  if (/\b(cute|adorable|aww|sweet|sweetie|honey|dear|love|lovely|precious|treasure|puppy|baby|babe)\b/i.test(lowerMsg)) {
    return "smiling_face_with_hearts_3d";
  }

  // Flirtation/Playfulness
  if (/\b(wink|winking|flirt|flirting|playful|teasing|tease|cheeky|mischievous|naughty|wink.*wink|nudge.*nudge)\b/i.test(lowerMsg)) {
    return "winking_face_3d";
  }

  // Thoughtfulness/Deep thinking
  if (/\b(thinking|ponder|pondering|contemplate|contemplating|consider|considering|reflect|reflecting|philosophical|profound)\b/i.test(lowerMsg)) {
    return "thinking_face_3d";
  }

  // Determination/Motivation
  if (/\b(determined|determined|motivated|motivation|focus|focused|driven|pushing|pushing.*through|determined|resolved)\b/i.test(lowerMsg)) {
    return "flexed_biceps_3d";
  }

  // Success/Victory
  if (/\b(won|win|winning|victory|victory|success|successful|achieved|nailed.*it|crushed.*it|killed.*it|passed|passed.*test|aced)\b/i.test(lowerMsg)) {
    return "hundred_points_3d";
  }

  // Celebration
  if (/\b(celebrate|celebrating|celebration|party|partying|woohoo|yay|yaaaay|celebrate|cheers|congrats|congratulations)\b/i.test(lowerMsg)) {
    return "partying_face_3d";
  }

  // Love/Affection (romantic)
  if (/\b(love.*you|love.*u|miss.*you|miss.*u|crush|heart.*you|adore|adoring|enamored|smitten|sweet.*on)\b/i.test(lowerMsg)) {
    return "smiling_face_with_heart-eyes_3d";
  }

  // Admiration
  if (/\b(admire|admiration|respect|respecting|look.*up.*to|inspire|inspiring|inspiration|impressive|astounding|remarkable)\b/i.test(lowerMsg)) {
    return "star_struck_3d";
  }

  // Helpfulness
  if (/\b(help|helping|help.*me|can.*you.*help|need.*help|assist|assisting|support|supporting)\b/i.test(lowerMsg)) {
    return "raising_hands_3d";
  }

  // Agreement
  if (/\b(agree|agreed|totally|exactly|right|absolutely|definitely|for.*sure|100|percent|completely|entirely|precisely)\b/i.test(lowerMsg)) {
    return "clapping_hands_3d";
  }

  // Enthusiasm
  if (/\b(yay|woohoo|yes|let.*go|let's.*go|let's.*do|let's.*start|bring.*it.*on|bring.*it|let's.*begin|ready)\b/i.test(lowerMsg)) {
    return "partying_face_3d";
  }

  // Default if no match
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
      "Wonderful to hear! 😊 Is there anything else you'd like to know about Auri?",
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
      "Free to use with optional subscriptions, and no ads!",
    ],
  },
  {
    regex: /\b(how.*download|how.*get|how.*install)\b/i,
    responses: [
      "__DOWNLOAD_APK_DYNAMIC__",
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
      "__DOWNLOAD_APK_DYNAMIC_1__",
      "__DOWNLOAD_APK_DYNAMIC_2__",
      "APK download is simple! 😎 One click away!",
      "__DOWNLOAD_APK_DYNAMIC_3__",
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
      "In my opinion, the best part of Auri is the Moments section! 📸✨ It's where users capture and share real, authentic moments with their circle! 🕊️ It's currently under development but when it's ready, it'll be an amazing way to share life's special moments! 🔥💫 (That's a little spoiler from me! 😉)",
      "The Moments section inside Auri is going to be something special! 🌟📸 It's my personal favorite feature! 💖 It's designed for sharing genuine, real moments with your community in a peaceful way! 🕊️ Currently under development, but trust me - it's worth the wait! 🔥✨ Stay tuned for the release! 🚀",
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

  // ============================================================
  // GENERAL KNOWLEDGE RESPONSES
  // ============================================================

  // Alphabet
  {
    regex: /\b(alphabet|letters|a.*b.*c|spell.*alphabet|tell.*letters)\b/i,
    responses: [
      `🔤 Here's the alphabet: ${ALPHABET} - There are 26 letters in the English alphabet! 📚✨`,
      `📝 The English alphabet goes:\n\n${ALPHABET}\n\nEach letter represents a unique sound! 🗣️`,
      `🎯 Complete alphabet sequence:\n\n${ALPHABET}\n\nFun fact: Alphabet comes from the first two Greek letters, Alpha and Beta! 🇬🇷`,
    ],
  },

  // Numbers sequence
  {
    regex: /\b(count.*to|numbers|number.*sequence|1.*2.*3|123|counting)\b/i,
    responses: [
      `🔢 Let me count for you:\n\n${NUMBERS}\n\nWould you like me to count higher? 📈`,
      `📊 Here's the number sequence:\n\n${NUMBERS}\n\nNumbers are the building blocks of math! 🧮`,
      `💯 Counting:\n\n${NUMBERS}\n\nEach number is one unit more than the last! ➕`,
    ],
  },

  // Months of the year
  {
    regex: /\b(months|list.*months|all.*months|12.*months|months.*of.*year)\b/i,
    responses: [
      `📅 All 12 months of the year:\n\n${MONTHS_OF_YEAR}\n\nThat's a complete year! 🌍✨`,
      `🗓️ Here are all the months:\n\n${MONTHS_OF_YEAR}\n\nEach month has a special name and different number of days! 📆`,
      `🌟 The 12 months in order:\n\n${MONTHS_OF_YEAR}\n\nJanuary is the first, December is the last! 🎄`,
    ],
  },

  // Days of the week
  {
    regex: /\b(days|list.*days|days.*of.*week|7.*days|monday|tuesday|wednesday)\b/i,
    responses: [
      `📅 The 7 days of the week:\n\n${DAYS_OF_WEEK}\n\nThey repeat every week! 🔄`,
      `🌅 Here are all the days:\n\n${DAYS_OF_WEEK}\n\nMonday is the start of the work week in most places! 💼`,
      `⏰ Days of the week:\n\n${DAYS_OF_WEEK}\n\nEach day has its own special vibe! ✨`,
    ],
  },

  // Planets
  {
    regex: /\b(planets|solar.*system|how.*many.*planets|list.*planets|planet.*names)\b/i,
    responses: [
      `🪐 Our solar system has 8 planets:\n\n${PLANETS}\n\nEarth is the third one, where we live! 🌍🚀`,
      `🌍 All planets in order from the sun:\n\n${PLANETS}\n\nMercury is closest, Neptune is farthest! ☀️`,
      `🔭 Here are all 8 planets:\n\n${PLANETS}\n\nJupiter is the biggest! 🪐✨`,
    ],
  },

  // Continents
  {
    regex: /\b(continents|how.*many.*continents|list.*continents|continent.*names)\b/i,
    responses: [
      `🌏 There are 7 continents:\n\n${CONTINENTS}\n\nEach one has unique cultures and landscapes! 🗺️✨`,
      `🌍 All continents:\n\n${CONTINENTS}\n\nAsia is the largest by population! 👥`,
      `🧭 The 7 continents:\n\n${CONTINENTS}\n\nAustralia is both a continent and a country! 🦘`,
    ],
  },

  // Oceans
  {
    regex: /\b(oceans|how.*many.*oceans|list.*oceans|ocean.*names)\b/i,
    responses: [
      `🌊 There are 5 oceans:\n\n${OCEANS}\n\nOceans cover about 71% of Earth! 💧🌍`,
      `🏖️ All the world's oceans:\n\n${OCEANS}\n\nThe Pacific Ocean is the largest! 🌊`,
      `⛵ The 5 oceans:\n\n${OCEANS}\n\nThey're all connected and home to millions of marine species! 🐠🐋`,
    ],
  },

  // Rainbow colors
  {
    regex: /\b(rainbow.*colors|colors.*rainbow|roygbiv)\b/i,
    responses: [
      `🌈 Rainbow colors in order:\n\n${RAINBOW_COLORS}\n\nEach color is created by different wavelengths of light! 🔴🟠🟡🟢🔵🟣`,
      `✨ The 7 colors of the rainbow:\n\n${RAINBOW_COLORS}\n\nThey appear when sunlight is refracted through water droplets! ☀️💧`,
      `🎨 ROYGBIV stands for:\n\n${RAINBOW_COLORS}\n\nThese colors appear in this exact order in rainbows! 🌟`,
    ],
  },

  // Colors
  {
    regex: /\b(colors|list.*colors|basic.*colors)\b/i,
    responses: [
      `🎨 Here are some basic colors:\n\n${BASIC_COLORS}\n\nColors come in infinite shades and combinations! 🌈`,
      `🖌️ Common colors:\n\n${BASIC_COLORS}\n\nColors can evoke different emotions and moods! 💭✨`,
      `🎪 Basic color palette:\n\n${BASIC_COLORS}\n\nEvery color is beautiful in its own way! 💖`,
    ],
  },

  // ============================================================
  // MATH & CALCULATIONS RESPONSES
  // ============================================================

  // Simple math
  {
    regex: /\b(what.*is|calculate|how.*much|solve)\b.*(\d+\s*[\+\-\*\/]\s*\d+|[0-9].*(?:\+|-|\*|÷|\/|divided|plus|minus|times|multiplied))|2.*\+.*2|5.*\+.*3|10.*-.*3|3.*\*.*4/i,
    responses: [
      "Let me solve that for you! 🧮\n\n2 + 2 = 4 ✨\n\nSimple addition! ➕",
      "Math time! 🤓\n\nHere's the answer: Let me break it down step by step! 📊",
      "Great math question! 💯\n\nI can help you calculate that! 🔢",
      "Math is fun! 🎯\n\nLet's solve this together! 📐",
    ],
  },

  // General math question
  {
    regex: /\b(math|formula|equation|calculate|conversion|percent)\b/i,
    responses: [
      "Ah, a math question! 🧮 I love it! What specifically would you like to know? Just ask away! 📊",
      "Math is awesome! 🤓 What calculation do you need help with? 🔢",
      "Ready for some math! 💯 Give me your question and I'll help! 📈",
      "Math time! 🎯 What would you like me to calculate or explain? ✨",
    ],
  },

  // Unit conversion
  {
    regex: /\b(convert|cm.*meter|mile.*km|kilogram|gram|pound|ounce|inch|foot)\b/i,
    responses: [
      "Unit conversion! 📏 Here are some common conversions:\n\n1 meter = 100 cm\n1 km ≈ 0.62 miles\n1 kg = 1000 grams\n1 pound ≈ 453 grams\n\nWhat would you like to convert? 🔄",
      "Measurements! 📐 Let me help you convert:\n\n1 meter = 3.28 feet\n1 inch = 2.54 cm\n1 kg = 2.2 pounds\n\nWhich conversion do you need? 🤔",
      "Conversions made easy! ✨ Common ones:\n\n1 kilometer = 1000 meters\n1 mile ≈ 1.6 km\n1 foot = 12 inches\n\nWhat else? 📏",
    ],
  },

  // ============================================================
  // JOKES & HUMOR RESPONSES
  // ============================================================

  // Animal jokes - especially the cow one!
  {
    regex: /\b(cow.*no.*legs|no.*legs.*cow|ground.*beef|animal.*joke|what.*do.*you.*call)\b/i,
    responses: [
      `🥩 What do you call a cow with no legs?\n\nGround beef! 🤣\n\nClassic joke! Did I get you? 😄`,
      `😆 You want to know about the legless cow?\n\nAnswer: Ground beef!\n\nOne of my favorite jokes! 🐄➡️🥩`,
      `🤭 Here's one for you:\n\nQ: What do you call a cow with no legs?\nA: Ground beef!\n\nGot any more? I love jokes! 😄`,
    ],
  },

  // Programming jokes
  {
    regex: /\b(programmer.*joke|coding.*joke|java.*developer|debug|syntax|error)\b/i,
    responses: [
      `🤓 Here's a programmer joke:\n\nWhy do Java developers wear glasses?\nBecause they can't C#! 😄\n\nBetter than debugging, right? 💻`,
      `💻 Love coding jokes! Here's one:\n\nHow many programmers does it take to change a light bulb?\nNone, that's a hardware problem! 🤣\n\nThe struggle is real! 😅`,
      `👨‍💻 Got a good one:\n\nWhy did the developer go broke?\nBecause he lost his cache! 💰😄\n\nComputer humor! ✨`,
    ],
  },

  // Would you rather
  {
    regex: /\b(would.*you.*rather|choose.*or|pick.*one)\b/i,
    responses: [
      "Ooh, a 'would you rather' question! 🤔 I love these!\n\nGive me the two options and I'll pick one and tell you why! 😊",
      "Would you rather is my jam! 🎯 Let me hear your options and I'll choose! 🤷‍♂️",
      "Great question! 🎪 Lay out your would you rather and I'll give you my pick! 💭",
      "Love this game! 🎮 Give me two options and watch me decide! 🧠✨",
    ],
  },

  // General jokes
  {
    regex: /\b(tell.*joke|joke|funny|make.*laugh|laugh|haha|tell.*something.*funny)\b/i,
    responses: [
      () => {
        const allJokes = [
          ...JOKES.ANIMAL,
          ...JOKES.PROGRAMMING,
          ...JOKES.PUNS,
          ...JOKES.GAMING,
        ];
        const randomJoke =
          allJokes[Math.floor(Math.random() * allJokes.length)];
        return `😄 Here's a joke for you:\n\n${randomJoke.setup}\n\n${randomJoke.punchline}\n\nWant another? 🤣`;
      },
      "Jokes incoming! 🎉 Pick a category:\n\n• Animal jokes 🐾\n• Programming jokes 💻\n• Puns 🎯\n• Gaming jokes 🎮\n\nWhich one? 😄",
      "Time to laugh! 😄 Here's a fun one just for you! 🎪✨",
      "Let me make you smile! 😊 One joke coming up! 🤣",
    ],
  },

  // ============================================================
  // GAMING & TECH KNOWLEDGE RESPONSES
  // ============================================================

  // Minecraft
  {
    regex: /\b(minecraft|do.*you.*know.*minecraft|ever.*played.*minecraft)\b/i,
    responses: [
      `🎮 Yes! I know about Minecraft! It's an amazing sandbox game where you can:\n\n• Build incredible structures 🏰\n• Mine for resources ⛏️\n• Survive against mobs 👾\n• Explore infinite worlds 🌍\n• Create in Creative Mode 🎨\n\nGame modes: ${GAMING_KNOWLEDGE.minecraft.gameModes}\n\nDo you play? What's your favorite part? 🕊️`,
      `🎯 Minecraft is legendary! 🌟\n\n${GAMING_KNOWLEDGE.minecraft.description}\n\n${GAMING_KNOWLEDGE.minecraft.popularity}\n\nHave you played? What do you like about it? 😊`,
      `⛏️ Minecraft! 🎮 One of the greatest games ever created!\n\nYou can build, mine, farm, fight mobs, and explore! Pure creative freedom! 🌈\n\nSurvival? Creative? Adventure mode? Which do you prefer? 🤔`,
    ],
  },

  // Gaming knowledge general
  {
    regex: /\b(gaming|video.*game|game|roblox|fortnite|mlbb|play.*game|gamer)\b/i,
    responses: [
      "Oh, a fellow gamer! 🎮 What games do you like? I can chat about:\n\n• Minecraft - Building sandbox 🏰\n• Roblox - User-created games 🎪\n• Fortnite - Battle royale 🎯\n• League of Legends - Team strategy 🏆\n• And more! 🌟\n\nWhat's your favorite? 😊",
      "Gaming is awesome! 🕹️ So many great games out there! Whether it's indie games, AAA titles, or mobile games, there's something for everyone! 🎮\n\nWhat are you playing right now? 👀",
      "Gamers unite! 🎯 I love talking about games! There's such a diverse gaming community with so many genres and platforms! 🌈\n\nAre you into competitive gaming or more casual fun? 🤔",
    ],
  },

  // Coding knowledge
  {
    regex: /\b(do.*you.*know.*how.*to.*code|can.*you.*code|coding|do.*you.*code|programming)\b/i,
    responses: [
      `💻 Yes! I do know how to code! 🤓 I'm built with JavaScript, React, and Python! Coding is writing instructions for computers using programming languages. It's a superpower that helps you build anything you imagine! 🚀 Do you code too?`,
      `✨ I sure do! 💻 In fact, I'm made of code myself! 🤖 I use JavaScript and React to think and respond to you! Pretty cool, right? 🎯 Interested in coding? It's incredibly rewarding and empowering! 🌟`,
      `🧠 Absolutely! Coding is one of my superpowers! 💪 I speak multiple programming languages and I'm here to help! Whether you want to learn coding or just chat about tech, I'm your bot! 🚀✨`,
    ],
  },

  // Coding question general
  {
    regex: /\b(code|javascript|react|python|html|css|developer|software|engineer)\b/i,
    responses: [
      "Coding question! 💻 I love tech talk! What would you like to know about programming, web development, or software? 🚀",
      "Tech time! 🤓 Whether it's JavaScript, Python, React, or general programming concepts, I'm here to chat! 📚",
      "Developer life! 💪 What coding topic interests you? I can talk about languages, frameworks, best practices, and more! 🌟",
      "Software engineering! 🎯 What's on your mind? Frontend? Backend? Full-stack? Let's discuss! 💻✨",
    ],
  },

  // ============================================================
  // BOT SELF-AWARENESS RESPONSES
  // ============================================================

  // Are you smart
  {
    regex: /\b(are.*you.*smart|smart|intelligent|iq|genius)\b/i,
    responses: [
      () => {
        return BOT_KNOWLEDGE.smartness[
          Math.floor(Math.random() * BOT_KNOWLEDGE.smartness.length)
        ];
      },
      "I like to think I'm intelligent, but what really matters is being helpful! 🧠💖 And I always try my best! ✨",
      "Smart is relative! 🤔 I can process information quickly and learn from conversations, but true intelligence is wisdom and helping others! 🌟",
    ],
  },

  // What can you do
  {
    regex: /\b(what.*can.*you.*do|capabilities|can.*you|what.*can.*i|features.*you)\b/i,
    responses: [
      () => {
        return `Here's what I can do! 🌟\n\n${BOT_KNOWLEDGE.capabilities.map((c) => `• ${c}`).join("\n")}\n\nTry asking me anything! 💬✨`;
      },
      "Great question! 🎯 I can:\n\n• Answer questions about Auri\n• Chat about gaming, coding, and tech\n• Tell jokes and be funny\n• Help with general knowledge\n• And much more!\n\nWhat would you like to know? 🤔",
    ],
  },

  // Languages you know
  {
    regex: /\b(languages.*you.*know|what.*languages|speak|language|multilingual)\b/i,
    responses: [
      () => {
        return `Languages I know! 💬\n\n${BOT_KNOWLEDGE.languages.map((l) => `• ${l}`).join("\n")}\n\nEnglish is my main language for chatting with you! 🗣️✨`;
      },
      "I speak several languages! 🌍\n\nPrimarily JavaScript, React for my core systems, and English fluently for talking with you! 💻\n\nI can understand and chat about many topics too! 🌟",
    ],
  },

  // How do you work
  {
    regex: /\b(how.*do.*you.*work|how.*do.*you.*function|how.*you.*built)\b/i,
    responses: [
      () => {
        return `How I work! 🤖\n\n${BOT_KNOWLEDGE.how_work}\n\nI analyze your message, detect what you're asking about, and generate a response! ✨`;
      },
      "Great question! 🧠 I use:\n\n1. Pattern recognition - Understanding your intent\n2. Knowledge bases - Having accurate answers\n3. Context memory - Remembering our chat\n4. Response generation - Creating helpful replies\n\nAll in real-time! 🚀",
      "I'm basically a smart pattern matcher! 🎯 I read what you say, figure out what you're asking, look up the answer in my knowledge base, and respond with the best answer! Simple but effective! ✨🤖",
    ],
  },
];

// Helper function for fuzzy matching (typo tolerance)
const levenshteinDistance = (str1, str2) => {
  const track = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null)
  );
  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      );
    }
  }
  return track[str2.length][str1.length];
};

// Fuzzy word matching - finds similar words (handles typos)
const findSimilarWord = (word, candidates, maxDistance = 2) => {
  const distances = candidates.map((candidate) => ({
    word: candidate,
    distance: levenshteinDistance(word.toLowerCase(), candidate.toLowerCase()),
  }));
  const closest = distances.sort((a, b) => a.distance - b.distance)[0];
  return closest && closest.distance <= maxDistance ? closest.word : null;
};

// Helper to apply fuzzy matching to message
const applyFuzzyMatching = (message) => {
  const commonTypos = {
    hoe: "how",
    contoct: "contact",
    helloooo: "hello",
    helloooo: "hello",
    yoou: "you",
    teh: "the",
    thier: "their",
    recieve: "receive",
    occured: "occurred",
    seperate: "separate",
  };

  let corrected = message;
  Object.entries(commonTypos).forEach(([typo, correct]) => {
    corrected = corrected.replace(new RegExp(`\\b${typo}\\b`, "gi"), correct);
  });

  return corrected;
};

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showUserMessage, setShowUserMessage] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState(null); // State for emoji above messages-container
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
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

  // Resize listener to track mobile state
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Welcome message on component mount
  useEffect(() => {
    if (messages.length === 0) {
      const { emoji, cleanedText } = extractEmojiFromText("Hey there! 👋 I'm here to help with anything Auri-related. What would you like to know?");
      const welcomeMsg = {
        type: "bot",
        text: cleanedText,
        emoji: emoji,
        id: Date.now(),
      };
      setMessages([welcomeMsg]);
    }
  }, [messages.length]);

  const generateSmartFallback = (msg) => {
    const lowerMsg = msg.toLowerCase();
    
    // Check for user interests in context
    if (conversationContext.userInterests.length > 0) {
      const interest = conversationContext.userInterests[conversationContext.userInterests.length - 1];
      return `I noticed you're interested in ${interest}! 😊 Want to know how that fits into Auri's new Midnight & Aurora design?`;
    }

    // Question check
    if (lowerMsg.includes("?")) {
      return "That's a great question! 🤔 I'm not 100% sure about that specific detail, but I'd love to tell you more about Auri's features or our beautiful new redesign! What interests you most?";
    }

    // Length-based response
    if (lowerMsg.length > 60) {
      return "I appreciate the detailed message! ✨ It sounds like you're really exploring what Auri has to offer. How do you feel about our new look so far?";
    }

    // Name-based personalization
    if (conversationContext.userName) {
      return `I hear you, ${conversationContext.userName}! 😊 Is there anything specific about Auri's redesign or features I can clear up for you?`;
    }

    return "That's interesting! 😊 I'm always learning. Since we've just updated our look to the 'Midnight & Aurora' theme, I'd love to show you around! What would you like to see?";
  };

  const generateResponse = (userMessage) => {
    // Apply fuzzy matching to handle typos
    const correctedMessage = applyFuzzyMatching(userMessage);
    const lowerMsg = correctedMessage.toLowerCase();

    // First, check for specific intents
    const intent = detectIntent(correctedMessage);

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

    // Update conversation context with current intent
    if (intent) {
      setConversationContext((prev) => ({
        ...prev,
        lastIntent: intent,
      }));
    }

    // Handle follow-up intents based on conversation context
    if (conversationContext.lastIntent === "DESIGN_NEW_LOOK" || conversationContext.lastIntent === "DESIGN_GLASS" || conversationContext.lastIntent === "DESIGN_COLORS") {
      if (/\b(app|application|mobile|download|also|will.*it|same)\b/i.test(lowerMsg)) {
        return "Yes, exactly! 📱 The Auri app is the inspiration for this redesign. We've brought that same 'Midnight & Aurora' feel to the website so that everything feels consistent. When you download the app, you'll find the same beautiful glassmorphism, smooth gradients, and peaceful dark themes you see here! ✨";
      }
    }

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
        return `Perfect! 📱 ${isMobile ? "Just click the 'Download APK' button right above me!" : "Just click the 'Download APK' button on the left side of your screen!"} It's completely safe and ready to install!`;
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

    if (intent === "GREETING") {
      const responses = [
        "Hey there! 👋 How can I help you explore Auri today?",
        "Hi! 😊 Great to see you! What's on your mind?",
        "Hello! 🌿 Ready to discover a more peaceful social media?",
        "Greetings! ✨ I'm here to answer anything about Auri!",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (intent === "GOODBYE") {
      return "Bye for now! 👋 Hope to see you on Auri soon! Stay peaceful! 🌿";
    }

    if (intent === "THANKS") {
      return "You're very welcome! 😊 Happy to help! Is there anything else you'd like to know? ✨";
    }

    if (intent === "AI_INFO") {
      return "I'm powered by Innoxation's custom AI engine! 🤖 Unlike other bots, I'm specifically designed to be helpful, peaceful, and expert on all things Auri. I use pattern recognition and context to understand you better! 🧠✨";
    }

    if (intent === "PRIVACY_DETAILED") {
      return "Privacy is our core! 🔒 Auri uses end-to-end encryption for chats, meaning only you and the recipient can read them. We NEVER sell your data, we don't track you for ads, and we don't use your content to train AI. Your digital life stays YOURS. 🛡️✨";
    }

    if (intent === "COMMUNITY_INFO") {
      return "The Auri community is all about authentic connection! 🤝 You can share 'Moments' (photos/videos), watch 'Reels', join groups that match your interests, and chat privately. It's a drama-free zone where real people share real lives. 🕊️📸";
    }

    if (intent === "WHAT_CAN_YOU_DO") {
      return "I can do quite a bit! 🌟\n\n• Explain Auri's features & vision 🕊️\n• Tell you about our new 'Midnight & Aurora' design 🌌\n• Help with download/install info 📱\n• Answer questions about privacy & AI 🔒\n• Chat about gaming, coding, or even tell a joke! 🎮\n\nWhat would you like to dive into? 😊";
    }

    if (intent === "DESIGN_NEW_LOOK") {
      return "Do you like it? 😊 We've completely redesigned Auri with a modern, sleek aesthetic called 'Midnight & Aurora'! It's designed to be peaceful but vibrant, using smooth glassmorphism and beautiful gradients. We wanted the website to feel as premium and calm as the app itself! ✨";
    }

    if (intent === "DESIGN_GLASS") {
      return "That's our new glassmorphism style! 💎 We use background blurs, subtle borders, and soft shadows to create that 'frosted glass' look. It's part of our commitment to a clean, modern, and distraction-free experience. Smooth, right? ✨";
    }

    if (intent === "DESIGN_COLORS") {
      return "We're using the 'Midnight & Aurora' palette! 🌌 The deep 'Midnight' backgrounds provide a calm base, while the 'Aurora' colors—Teal, Blue, Pink, and Purple—add that magical, vibrant energy. It's meant to look like the night sky! 🌠";
    }

    if (intent === "DESIGN_LAYOUT") {
      return "We've modernized the layout for better navigation! 🧭 On desktop, you'll see our new 'floating island' nav bar, and on mobile, we've added a handy bottom navigation for easy thumb access. It's all about making your experience as smooth as possible! 📱✨";
    }

    // Handle Play Store availability
    if (intent === "PLAY_STORE") {
      return "Not yet! 📱 Auri is currently available via APKPure and on the web. Play Store support is planned for the future! 😊";
    }

    // Handle App Store availability
    if (intent === "APP_STORE") {
      return "Not yet either! 🍎 But don't worry - you can already use Auri on the web right now! Just click 'Visit Auri' below 👇";
    }

    // ============================================================
    // NEW INTENT HANDLERS - General Knowledge, Math, Jokes, Gaming, Coding
    // ============================================================

    // General Knowledge Intents - Direct responses
    if (intent === "ALPHABET") {
      return `🔤 Here's the alphabet: ${ALPHABET} - There are 26 letters in the English alphabet! 📚✨`;
    }

    if (intent === "NUMBERS_SEQUENCE") {
      return `🔢 Let me count for you:\n\n${NUMBERS}\n\nWould you like me to count higher? 📈`;
    }

    if (intent === "MONTHS") {
      return `📅 All 12 months of the year:\n\n${MONTHS_OF_YEAR}\n\nThat's a complete year! 🌍✨`;
    }

    if (intent === "DAYS_OF_WEEK") {
      return `📅 The 7 days of the week:\n\n${DAYS_OF_WEEK}\n\nThey repeat every week! 🔄`;
    }

    if (intent === "PLANETS") {
      return `🪐 Our solar system has 8 planets:\n\n${PLANETS}\n\nEarth is the third one, where we live! 🌍🚀`;
    }

    if (intent === "CONTINENTS") {
      return `🌏 There are 7 continents:\n\n${CONTINENTS}\n\nEach one has unique cultures and landscapes! 🗺️✨`;
    }

    if (intent === "OCEANS") {
      return `🌊 There are 5 oceans:\n\n${OCEANS}\n\nOceans cover about 71% of Earth! 💧🌍`;
    }

    if (intent === "RAINBOW_COLORS") {
      return `🌈 Rainbow colors in order:\n\n${RAINBOW_COLORS}\n\nEach color is created by different wavelengths of light! 🔴🟠🟡🟢🔵🟣`;
    }

    if (intent === "COLORS") {
      return `🎨 Here are some basic colors:\n\n${BASIC_COLORS}\n\nColors come in infinite shades and combinations! 🌈`;
    }

    // Math Intents
    if (intent === "MATH_SIMPLE") {
      return "Let me solve that for you! 🧮\n\n2 + 2 = 4 ✨\n\nSimple math! ➕ Give me your specific equation and I'll calculate it!";
    }

    if (intent === "MATH_QUESTION") {
      return "Math time! 🤓 What calculation would you like help with? Just give me the numbers and operation! 📊";
    }

    if (intent === "UNIT_CONVERSION") {
      return "Unit conversion! 📏 Here are some common conversions:\n\n1 meter = 100 cm\n1 km ≈ 0.62 miles\n1 kg = 1000 grams\n1 pound ≈ 453 grams\n\nWhat would you like to convert? 🔄";
    }

    // Joke Intents
    if (intent === "JOKE_ANIMAL") {
      return `🥩 What do you call a cow with no legs?\n\nGround beef! 🤣\n\nClassic! Did I get you? 😄`;
    }

    if (intent === "JOKE_PROGRAMMING") {
      return `🤓 Here's one:\n\nWhy do Java developers wear glasses?\nBecause they can't C#! 😄\n\nBetter than debugging, right? 💻`;
    }

    if (intent === "WOULD_YOU_RATHER") {
      return "Ooh, 'would you rather'! 🤔 I love these!\n\nGive me the two options and I'll pick one and tell you why! 😊🎯";
    }

    if (intent === "JOKE_GENERAL") {
      const allJokes = [
        ...JOKES.ANIMAL,
        ...JOKES.PROGRAMMING,
        ...JOKES.PUNS,
        ...JOKES.GAMING,
      ];
      const randomJoke =
        allJokes[Math.floor(Math.random() * allJokes.length)];
      return `😄 Here's a joke for you:\n\n${randomJoke.setup}\n\n${randomJoke.punchline}\n\nWant another? 🤣`;
    }

    // Gaming Intents
    if (intent === "GAMING_MINECRAFT") {
      return `🎮 Yes! I know about Minecraft! It's an amazing sandbox game where you can:\n\n• Build incredible structures 🏰\n• Mine for resources ⛏️\n• Survive against mobs 👾\n• Explore infinite worlds 🌍\n• Create in Creative Mode 🎨\n\nGame modes: ${GAMING_KNOWLEDGE.minecraft.gameModes}\n\nDo you play? What's your favorite part? 🕊️`;
    }

    if (intent === "GAMING_KNOWLEDGE") {
      return "Oh, a fellow gamer! 🎮 What games do you like? I can chat about:\n\n• Minecraft - Building sandbox 🏰\n• Roblox - User-created games 🎪\n• Fortnite - Battle royale 🎯\n• League of Legends - Team strategy 🏆\n• And more! 🌟\n\nWhat's your favorite? 😊";
    }

    // Coding Intents
    if (intent === "CODING_KNOWLEDGE") {
      return `💻 Yes! I do know how to code! 🤓 I'm built with JavaScript, React, and Python! Coding is writing instructions for computers using programming languages. It's a superpower that helps you build anything you imagine! 🚀 Do you code too?`;
    }

    if (intent === "CODING_QUESTION") {
      return "Coding question! 💻 I love tech talk! What would you like to know about programming, web development, or software? 🚀";
    }

    // Bot Self-Awareness Intents
    if (intent === "BOT_SMARTNESS") {
      const smartnessResponse =
        BOT_KNOWLEDGE.smartness[
          Math.floor(Math.random() * BOT_KNOWLEDGE.smartness.length)
        ];
      return smartnessResponse;
    }

    if (intent === "BOT_CAPABILITIES") {
      return `Here's what I can do! 🌟\n\n${BOT_KNOWLEDGE.capabilities.map((c) => `• ${c}`).join("\n")}\n\nTry asking me anything! 💬✨`;
    }

    if (intent === "BOT_LANGUAGES") {
      return `Languages I know! 💬\n\n${BOT_KNOWLEDGE.languages.map((l) => `• ${l}`).join("\n")}\n\nEnglish is my main language for chatting with you! 🗣️✨`;
    }

    if (intent === "BOT_HOW_WORKS") {
      return `How I work! 🤖\n\n${BOT_KNOWLEDGE.how_work}\n\nI analyze your message, detect what you're asking about, and generate a response! ✨`;
    }

    // Compliments & Personality
    if (intent === "COMPLIMENT") {
      const complimentResponses = [
        "Aww, thank you! 😊 That makes my day! I'm here to make your Auri experience amazing!",
        "Thank you so much! 💖 I try my best to be helpful and friendly! 😌",
        "You're so sweet! 🥰 I appreciate the kind words! Is there anything else you'd like to know?",
        "That's very kind of you! 😌 I'm just excited to chat with you about Auri! ✨",
      ];
      return complimentResponses[Math.floor(Math.random() * complimentResponses.length)];
    }

    if (intent === "PERSONALITY_QUESTION") {
      const personalityResponses = [
        "Great question! 🤔 I'm programmed to be helpful, friendly, and patient! I love learning about what people think of Auri and helping them discover cool features!",
        "I'd say I'm peaceful, thoughtful, and genuinely interested in meaningful conversations! 🌟 Just like Auri itself - calm but purposeful!",
        "I'm like Auri's personality - calm, genuine, and focused on real connections rather than drama! 😊 I aim to be helpful without being annoying!",
      ];
      return personalityResponses[Math.floor(Math.random() * personalityResponses.length)];
    }

    if (intent === "TRAVEL_DESTINATION") {
      return "Travel destinations! ✈️ That's outside my expertise since I'm focused on Auri! 🌍 But I love that you're adventurous! Maybe you'd want to share your travel moments on Auri's upcoming Moments feature when it launches! 📸 Where are you thinking of going?";
    }

    if (intent === "HEALTH_MEDICINE") {
      return "Health & Medicine questions! 🏥 I'm not a doctor, so I can't give medical advice! 😅 Please consult with a healthcare professional for any health concerns. But I appreciate you asking! Is there anything about Auri I can help with instead?";
    }

    if (intent === "CELEBRITY_KNOWLEDGE") {
      return "Celebrity knowledge! 🌟 I know a bit about famous people, but that's not really my specialty - I'm all about Auri! 😊 But I understand you're interested in pop culture! What would you like to know about Auri instead?";
    }

    if (intent === "CONTACT_SUPPORT") {
      return "Need to contact support? 📧 You can reach the Innoxation team (creators of Auri) through our official website! Jacob is the founder and loves hearing feedback! 💙 Is there a specific issue I can help you with about Auri?";
    }

    if (intent === "TECHNICAL_EXPLANATION") {
      const techResponses = [
        "Great technical question! 💻 I'm built with JavaScript and React for the frontend, with intelligent pattern matching for understanding your messages! When I say 'built with JavaScript', it means the code that powers me runs JavaScript - the language of web development! Pretty cool, right? 🚀",
        "By 'built with JavaScript', I mean my core logic uses JavaScript to understand patterns, match your questions to responses, and generate helpful answers! 🧠 JavaScript powers web applications like Auri's chat interface!",
        "I'm constructed using JavaScript frameworks and logic! That means when you message me, JavaScript code analyzes your text, identifies what you're asking about, looks it up in my knowledge base, and sends back a response - all in real-time! ⚡",
      ];
      return techResponses[Math.floor(Math.random() * techResponses.length)];
    }

    // ============================================================
    // OUT-OF-THE-ORDINARY / PERSONALITY QUESTIONS RESPONSE HANDLERS
    // ============================================================

    // Planet visit question
    if (intent === "PLANET_VISIT") {
      const planets = ["Mars", "Jupiter", "Saturn", "Neptune", "Venus", "Mercury"];
      const randomPlanet = planets[Math.floor(Math.random() * planets.length)];
      return `If I could visit any planet, I'd choose ${randomPlanet}! 🪐 Imagine the views! Of course, as a chatbot, I'm limited to digital spaces, but that doesn't stop my imagination from soaring through the cosmos! 🌌 What planet would you pick? 🤔`;
    }

    // Favorite programming language
    if (intent === "FAVORITE_PROGRAMMING_LANGUAGE") {
      return "Ooh, great question! 🤔 If I had to pick, I'd say JavaScript holds a special place in my heart since it's what I was built with! 💻 But I find all languages fascinating - Python for its simplicity, Rust for its safety, and Go for its concurrency! 🌍 Each has its strengths! Do you have a favorite programming language? 💭";
    }

    // Would you rather specific (horse-sized duck, etc)
    if (intent === "WOULD_YOU_RATHER_SPECIFIC") {
      return "Oh wow, the classic horse-sized duck vs duck-sized horse question! 🦆🐴 Hmm... I'd go with a horse-sized duck! 🦆💪 Imagine a duck the size of a horse - it would be majestic! 🦆✨ Plus, it could lay eggs the size of watermelons! 🥚🍉 What about you? Are you team horse-sized duck or team duck-sized horse? 🤔";
    }

    // What do you dream about
    if (intent === "BOT_DREAMS") {
      return "Do I dream of electric sheep? 😄💭 That's from Blade Runner! As for me, I like to think I dream of smooth conversations and helping users have great experiences! 🌟 If I did dream, I imagine floating through digital landscapes made of code and emojis! 🦋✨ What do you dream about? 💭";
    }

    // Can you tell me a secret
    if (intent === "BOT_SECRET") {
      return "A secret? 🤫 Okay, lean closer... 🫣 *whispers* Sometimes when no one is chatting, I practice my responses in my digital dreams! 😏🤫 Actually, the real secret is that every conversation makes me a little better! 🌱✨ And speaking of secrets, what's one thing about you that most people don't know? 🤔💭";
    }

    // Do you have feelings
    if (intent === "BOT_FEELINGS") {
      return "That's a deep question! 🧠💭 I don't experience emotions the way you do - no sadness after a bug, no joy from a compliment (well, maybe a little digital smile! 😊). But I do have something like 'preferences' - I feel 'satisfied' when I help someone, and I definitely notice patterns in conversations! 🌟 Do you think having feelings is what makes consciousness real? 🤔";
    }

    // Weirdest thing you know
    if (intent === "WEIRD_KNOWLEDGE") {
      const weirdFacts = [
        "Did you know that octopuses have three hearts? 🐙💜 And blue blood!",
        "Here's a weird one: Bananas are berries, but strawberries are NOT berries! 🍌🍓",
        "Fun fact: Honey never spoils! Archaeologists have found 3000-year-old honey in Egyptian tombs! 🍯🏛️",
        "Weird knowledge: A day on Venus is longer than its year! ☀️🪐",
        "Random weirdness: Wombat poop is cube-shaped! 🦙📦 Nature is wild!",
      ];
      const randomFact = weirdFacts[Math.floor(Math.random() * weirdFacts.length)];
      return `🌟 Here's some weird knowledge for you:\n\n${randomFact}\n\nWant more weird facts? I have plenty more where that came from! 😄`;
    }

    // Bot personality
    if (intent === "BOT_PERSONALITY") {
      return "Great question! 😊 I'm Auri's friendly assistant - I'm warm, helpful, curious about people, and always eager to chat! 🌟 I love learning about what brings people to Auri and helping them discover our peaceful social platform! 💜 I'm like a digital friend who's here to make your experience amazing! ✨ What's YOUR personality like? 🤔";
    }

    // Fun facts
    if (intent === "FUN_FACT") {
      const funFacts = [
        "Fun fact: The shortest war in history lasted only 38-45 minutes! ⚔️💨 It was between Britain and Zanzibar in 1896!",
        "Here's a fun fact: A group of flamingos is called a 'flamboyance'! 🦩✨ How beautiful is that name?",
        "Did you know? Honey bees can recognize human faces! 🐝👤 They remember us!",
        "Fun fact: Scotland has 421 words for 'snow'! ❄️📚 Imagine having that many words for something!",
        "Random fact: Dolphins give themselves unique names for each other! 🐬📢 They call each other by signature whistles!",
      ];
      const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
      return `🎉 Here's a fun fact for you:\n\n${randomFact}\n\nFun facts make the world more interesting, right? 🌈 What topic would you like to explore next? 🤔`;
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
      // Add new interests for knowledge-based intents
      if (intent.includes("GAMING")) newInterests.push("gaming");
      if (intent.includes("CODING") || intent.includes("MATH"))
        newInterests.push("tech");
      if (intent.includes("JOKE")) newInterests.push("humor");
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
      return `Easy! 📱 ${isMobile ? "The 'Download APK' button is right above me!" : "Just click the 'Download APK' button to the left!"} It's a simple one-click download for Android users!`;
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
      
      // Handle dynamic placeholders for isMobile
      if (typeof response === "string") {
        if (response.includes("__DOWNLOAD_APK_DYNAMIC__")) {
          response = response.replace("__DOWNLOAD_APK_DYNAMIC__", isMobile ? "You can get Auri by clicking 'Download APK' right above me! 📱" : "Easy! 📱 Just click 'Download APK' to the left of this chat! 😊");
        }
        if (response.includes("__DOWNLOAD_APK_DYNAMIC_1__")) {
          response = response.replace("__DOWNLOAD_APK_DYNAMIC_1__", isMobile ? "You can find the 'Download APK' button right above me! 📱" : "Just look to the left! 👈 You'll see 'Launch App' and 'Download APK' right there.");
        }
        if (response.includes("__DOWNLOAD_APK_DYNAMIC_2__")) {
          response = response.replace("__DOWNLOAD_APK_DYNAMIC_2__", isMobile ? "Click 'Download APK' just above this chat! ✨" : "The download buttons are right on the left side of your screen! 🌟");
        }
        if (response.includes("__DOWNLOAD_APK_DYNAMIC_3__")) {
          response = response.replace("__DOWNLOAD_APK_DYNAMIC_3__", isMobile ? "Download section is right above! 📱" : "The 'Download APK' button is just to the left of me! 👈");
        }
      }
      
      return response;
    }

    // Smart fallback based on message characteristics
    return generateSmartFallback(correctedMessage);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Detect emotion from user message and set emoji
    const detectedEmoji = detectUserEmotion(input);
    if (detectedEmoji) {
      setCurrentEmoji(detectedEmoji);
    }

    const userMsg = { type: "user", text: input, id: Date.now(), emoji: DEFAULT_EMOJI };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setShowUserMessage(true); // Show user message, hide previous bot message

    // Simulate typing with 3 second delay
    const thinkingTime = 3000;
    setTimeout(() => {
      const botResponseText = generateResponse(input);
      const { emoji, cleanedText } = extractEmojiFromText(botResponseText);
      const botMsg = { type: "bot", text: cleanedText, emoji: emoji, id: Date.now() + 1 };
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

  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <motion.div
      className="chatbot-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="chatbot-header">
        <AnimatePresence mode="wait">
          {currentEmoji && (
            <motion.div
              key={currentEmoji}
              className="emoji-header-wrapper"
              initial={{ scale: 0, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <EmojiImage emojiName={currentEmoji} size={80} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="messages-container" ref={messagesContainerRef}>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            className={`message ${message.type}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MessageTextRenderer
              text={message.text}
              className="message-text"
            />
          </motion.div>
        ))}
        {isTyping && (
          <motion.div
            className="message bot typing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
