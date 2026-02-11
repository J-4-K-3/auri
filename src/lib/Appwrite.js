// appwrite.js
import {
  Client,
  Account,
  Databases,
  Storage,
  ID,
  Permission,
  Role,
  Query,
} from "appwrite";

export const appwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
};

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const IDs = ID;

export const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

// APPWRITE_DATABASE_ID Tables IDs
export const COLLECTION_USERS_ID = import.meta.env
  .VITE_APPWRITE_COLLECTION_USERS_ID;
export const COLLECTION_REVIEWS_ID = import.meta.env
  .VITE_APPWRITE_COLLECTION_REVIEWS_ID;
export const COLLECTION_INCENTIVE_ID = import.meta.env
  .VITE_APPWRITE_COLLECTION_INCENTIVE_ID;
export const COLLECTION_TRACKER_ID = import.meta.env
  .VITE_APPWRITE_COLLECTION_TRACKER_ID;
export const COLLECTION_COMMUNITY_MESSAGES_ID = import.meta.env
  .VITE_APPWRITE_COLLECTION_COMMUNITY_MESSAGES_ID;
export const COLLECTION_REPLIES_ID = import.meta.env
  .VITE_APPWRITE_COLLECTION_REPLIES_ID;

// ============================================
// SANITIZATION HELPERS (ported from mobile)
// ============================================

const sanitizeString = (value, maxLength, fallback = "") => {
  if (typeof value !== "string") {
    const cleanedFallback = typeof fallback === "string" ? fallback.trim() : "";
    return maxLength ? cleanedFallback.slice(0, maxLength) : cleanedFallback;
  }

  const trimmed = value.trim();
  if (!trimmed && fallback) {
    return sanitizeString(fallback, maxLength);
  }

  return maxLength ? trimmed.slice(0, maxLength) : trimmed;
};

const formatAppwriteError = (error, fallbackMessage) => {
  const message = error?.response?.message || error?.message || fallbackMessage;
  return message || "Something went wrong. Please try again.";
};

// ============================================
// SESSION STORAGE (localStorage)
// ============================================

const SESSION_KEY = "auri_session";
const REVIEWS_CACHE_KEY = "auri_reviews_cache";
const LAST_SYNC_KEY = "auri_last_sync";

/**
 * Save session to localStorage
 */
export const saveSession = (user) => {
  try {
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        user,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.error("Error saving session:", error);
  }
};

/**
 * Get saved session from localStorage
 */
export const getStoredSession = () => {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error retrieving session:", error);
    return null;
  }
};

/**
 * Clear stored session
 */
export const clearStoredSession = () => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error("Error clearing session:", error);
  }
};

/**
 * Save reviews cache to localStorage
 */
export const saveReviewsCache = (reviews) => {
  try {
    localStorage.setItem(REVIEWS_CACHE_KEY, JSON.stringify(reviews));
    localStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
  } catch (error) {
    console.error("Error saving reviews cache:", error);
  }
};

/**
 * Get cached reviews from localStorage
 */
export const getReviewsCache = () => {
  try {
    const cached = localStorage.getItem(REVIEWS_CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  } catch (error) {
    console.error("Error retrieving reviews cache:", error);
    return [];
  }
};

/**
 * Get last sync timestamp
 */
export const getLastSyncTime = () => {
  try {
    const lastSync = localStorage.getItem(LAST_SYNC_KEY);
    return lastSync ? parseInt(lastSync) : 0;
  } catch (error) {
    console.error("Error retrieving last sync time:", error);
    return 0;
  }
};

// ============================================
// REVIEWS API
// ============================================

/**
 * Fetch all reviews from the reviews collection
 * Sorted by createdAt (newest first)
 */
export const fetchReviews = async () => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      COLLECTION_REVIEWS_ID,
      [Query.orderDesc("createdAt")]
    );
    console.log(
      "Fetched reviews:",
      response.documents?.map((r) => ({
        id: r.$id,
        userId: r.userId,
        verified: r.verified,
        username: r.username,
      }))
    );
    return response.documents || [];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

/**
 * Submit a new review to Appwrite
 * @param {Object} reviewData - { username, rating, message, userId, appVersion }
 * userId should be a clean Appwrite $id (36 chars max, alphanumeric + . - _)
 */
export const submitReview = async (reviewData) => {
  try {
    // userId must be the Appwrite $id, which is already validated (36 chars max, alphanumeric + . - _)
    // If userId is not provided, pass empty string (guest submission)
    const userId = reviewData.userId || "";

    const payload = {
      username: sanitizeString(reviewData.username, 255, "Guest"),
      rating: parseInt(reviewData.rating) || 5,
      message: sanitizeString(reviewData.message, 500),
      userId: userId, // Already validated upstream
      appVersion: reviewData.appVersion || "2.0",
      verified: !!userId, // true only if userId is non-empty
      reported: false,
      createdAt: new Date().toISOString(),
    };

    const response = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      COLLECTION_REVIEWS_ID,
      ID.unique(),
      payload
    );
    return response;
  } catch (error) {
    console.error("Error submitting review:", error);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    throw new Error(
      error.message || "Failed to submit review. Check Appwrite permissions."
    );
  }
};

/**
 * Update an existing review
 * @param {string} reviewId - The review document ID
 * @param {Object} updateData - { rating, message } fields to update
 */
export const updateReview = async (reviewId, updateData, currentUser) => {
  try {
    // Guests cannot edit reviews
    if (!currentUser || !currentUser.$id) {
      throw new Error("You must be logged in to edit reviews.");
    }

    // First, fetch the review to verify ownership
    const review = await databases.getDocument(
      APPWRITE_DATABASE_ID,
      COLLECTION_REVIEWS_ID,
      reviewId
    );

    // Check ownership: only the review owner can edit
    if (review.userId !== currentUser.$id) {
      throw new Error("You can only edit your own reviews.");
    }

    const payload = {
      rating: parseInt(updateData.rating),
      message: updateData.message,
    };

    const response = await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      COLLECTION_REVIEWS_ID,
      reviewId,
      payload
    );
    return response;
  } catch (error) {
    console.error("Error updating review:", error);
    throw new Error(error.message || "Failed to update review.");
  }
};

/**
 * Delete a review
 * @param {string} reviewId - The review document ID
 * @param {object} currentUser - The current logged-in user
 */
export const deleteReview = async (reviewId, currentUser) => {
  try {
    // Guests cannot delete reviews
    if (!currentUser || !currentUser.$id) {
      throw new Error("You must be logged in to delete reviews.");
    }

    // First, fetch the review to verify ownership
    const review = await databases.getDocument(
      APPWRITE_DATABASE_ID,
      COLLECTION_REVIEWS_ID,
      reviewId
    );

    // Check ownership: only the review owner can delete
    if (review.userId !== currentUser.$id) {
      throw new Error("You can only delete your own reviews.");
    }

    await databases.deleteDocument(
      APPWRITE_DATABASE_ID,
      COLLECTION_REVIEWS_ID,
      reviewId
    );
  } catch (error) {
    console.error("Error deleting review:", error);
    throw new Error(error.message || "Failed to delete review.");
  }
};

// ============================================
// AUTH API (mirroring mobile auth service)
// ============================================

/**
 * Get current logged-in user
 */
export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    return null;
  }
};

/**
 * Sign up with email and password
 */
export const signupWithEmail = async (email, password, name = "Auri User") => {
  const normalizedEmail = sanitizeString(email, 320);
  const normalizedName = sanitizeString(name, 255, "Auri User");
  try {
    return await account.create(
      IDs.unique(),
      normalizedEmail,
      password,
      normalizedName
    );
  } catch (error) {
    throw new Error(formatAppwriteError(error, "Unable to create account."));
  }
};

/**
 * Safe login: Check if already logged in with matching email, else create session
 * Mirrors mobile safeLogin behavior
 */
export const safeLogin = async (email, password) => {
  const normalizedEmail = sanitizeString(email, 320);
  if (!normalizedEmail || !password) {
    throw new Error("Email and password are required.");
  }

  try {
    // Check if already logged in
    const currentUser = await account.get();
    if (
      currentUser &&
      currentUser.email?.toLowerCase() === normalizedEmail.toLowerCase()
    ) {
      return currentUser; // Already logged in with this email
    }
    // Clear existing sessions
    try {
      await account.deleteSession("current");
    } catch {
      // Ignore errors clearing sessions
    }
  } catch (error) {
    // No active session; proceed to login
  }

  // Try primary SDK method for creating email-password session
  try {
    if (typeof account.createEmailPasswordSession === "function") {
      await account.createEmailPasswordSession(normalizedEmail, password);
    } else if (typeof account.createSession === "function") {
      await account.createSession(normalizedEmail, password);
    } else {
      // Fallback to REST API
      const resp = await fetch(
        `${appwriteConfig.endpoint.replace(
          /\/v1\/?$/,
          ""
        )}/v1/account/sessions/email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Appwrite-Project": appwriteConfig.projectId,
          },
          body: JSON.stringify({ email: normalizedEmail, password }),
        }
      );

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || `Login failed with status ${resp.status}`);
      }
    }
  } catch (sessionError) {
    throw new Error(
      formatAppwriteError(
        sessionError,
        "Unable to sign in with those credentials."
      )
    );
  }

  try {
    const user = await account.get();
    saveSession(user);
    return user;
  } catch (getError) {
    throw new Error(
      formatAppwriteError(
        getError,
        "Signed in but unable to load your account."
      )
    );
  }
};

/**
 * Login with email and password (alias for safeLogin)
 */
export const loginUser = async (email, password) => {
  return await safeLogin(email, password);
};

/**
 * Logout: delete all sessions
 */
export const logoutCurrent = async () => {
  try {
    await account.deleteSessions();
  } catch (error) {
    console.error("Logout error:", error);
  }
  clearStoredSession();
};

/**
 * Logout current user (alias)
 */
export const logoutUser = async () => {
  return await logoutCurrent();
};

/**
 * Restore session from localStorage if available
 */
export const restoreSession = async () => {
  try {
    const stored = getStoredSession();
    if (stored && stored.user) {
      // Check if the stored session is still valid
      try {
        const user = await account.get();
        return user;
      } catch {
        // Session expired, but we have offline data
        return stored.user;
      }
    }
    return null;
  } catch (error) {
    console.error("Error restoring session:", error);
    return null;
  }
};

// ============================================
// SANITIZATION HELPERS (for profile creation)
// ============================================

const sanitizeStringArray = (value, maxItems, itemMaxLength) => {
  if (!Array.isArray(value) || maxItems <= 0) {
    return [];
  }

  const unique = [];
  value.forEach((item) => {
    if (typeof item !== "string") {
      return;
    }
    const sanitized = sanitizeString(item, itemMaxLength);
    if (!sanitized) {
      return;
    }
    if (!unique.includes(sanitized)) {
      unique.push(sanitized);
    }
  });

  return unique.slice(0, maxItems);
};

const sanitizeLink = (value, maxLength = 280) => {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  return maxLength ? trimmed.slice(0, maxLength) : trimmed;
};

const sanitizeAge = (value) => {
  const parsed = Number(value);
  if (Number.isFinite(parsed)) {
    const clamped = Math.max(13, Math.min(parsed, 120));
    return Math.round(clamped);
  }
  return undefined;
};

const sanitizeProfilePayload = (userId, profileData = {}) => {
  const email = sanitizeString(profileData.email, 320);
  const name = sanitizeString(profileData.name, 255, "Auri User");
  const bio = sanitizeString(profileData.bio, 150);
  const city = sanitizeString(profileData.city ?? profileData.location, 100);
  const status = sanitizeString(profileData.status, 150);
  const location = sanitizeString(profileData.location, 100);
  const age = sanitizeAge(profileData.age);
  const interests = sanitizeStringArray(profileData.interests, 20, 60);
  const active = profileData.active ?? true;
  const archived = profileData.archived ?? false;

  const payload = {
    userId,
    name,
    email,
    bio,
    city,
    status,
    interests,
    active: Boolean(active),
    archived: Boolean(archived),
  };

  const originalAvatarUri =
    typeof profileData.avatarUri === "string"
      ? profileData.avatarUri.trim()
      : "";
  if (originalAvatarUri) {
    const sanitizedFullAvatar = sanitizeString(
      originalAvatarUri,
      2048,
      String(originalAvatarUri)
    );
    payload.avatarUri = sanitizedFullAvatar || String(originalAvatarUri);
  }

  const incomingLinks = profileData.links;
  if (incomingLinks && typeof incomingLinks === "object") {
    const sanitizedLinks = {};
    const website = sanitizeLink(incomingLinks.website);
    if (website) {
      sanitizedLinks.website = website;
    }
    const donation = sanitizeLink(incomingLinks.donation);
    if (donation) {
      sanitizedLinks.donation = donation;
    }
    const knownLinkKeys = ["website", "donation"].some((key) =>
      Object.prototype.hasOwnProperty.call(incomingLinks, key)
    );
    if (Object.keys(sanitizedLinks).length > 0 || knownLinkKeys) {
      let serialized = "";
      if (Object.keys(sanitizedLinks).length > 0) {
        serialized = JSON.stringify(sanitizedLinks);
        if (serialized.length > 300 && sanitizedLinks.donation) {
          serialized = JSON.stringify({
            donation: sanitizedLinks.donation.slice(0, 260),
          });
        }
        if (serialized.length > 300) {
          serialized = "";
        }
      }
      payload.links = serialized;
    }
  } else if (
    typeof incomingLinks === "string" &&
    incomingLinks.trim().length > 0
  ) {
    // Allow callers to pass sanitized string directly
    payload.links = incomingLinks.trim().slice(0, 300);
  }

  if (typeof location === "string" && location.length) {
    payload.location = location;
  }

  if (typeof age === "number") {
    payload.age = age;
  }

  return payload;
};

/**
 * Safe upsert user profile: Try create with permissions, fallback to update
 * Mirrors mobile safeUpsertUserProfile behavior
 */
export const safeUpsertUserProfile = async (userId, profileData) => {
  if (!userId) {
    throw new Error("Missing user identifier while saving profile.");
  }

  const payload = sanitizeProfilePayload(userId, profileData);
  const creationPermissions = [
    Permission.read(Role.user(userId)), // Only that user can read
    Permission.update(Role.user(userId)), // Only that user can update
    Permission.delete(Role.user(userId)), // Only that user can delete
  ];

  let encounteredUnauthorized = false;
  let createConflict = false;

  const tryUpdateDocument = async (documentId) => {
    if (!documentId) {
      return null;
    }

    try {
      return await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        COLLECTION_USERS_ID,
        documentId,
        payload
      );
    } catch (updateError) {
      const code = updateError?.code ?? updateError?.response?.code;
      if (code === 401 || code === 403) {
        encounteredUnauthorized = true;
        console.warn("safeUpsertUserProfile:update unauthorized", updateError);
        return null;
      }
      if (code === 1008) {
        encounteredUnauthorized = true;
        console.warn(
          "safeUpsertUserProfile:update server error fallback",
          updateError
        );
        return null;
      }
      if (code === 404) {
        return null;
      }

      const message = String(
        updateError?.message ?? updateError?.response?.message ?? ""
      );
      if (message.includes("Permissions must be one of")) {
        console.warn(
          "safeUpsertUserProfile:update permissions fallback",
          updateError
        );
        return null;
      }

      throw new Error(
        formatAppwriteError(updateError, "Unable to update profile.")
      );
    }
  };

  const resolveExistingDocumentId = async () => {
    try {
      const response = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        COLLECTION_USERS_ID,
        [
          Query.equal("userId", userId),
          Query.orderDesc("$updatedAt"),
          Query.limit(1),
        ]
      );

      const candidate = response?.documents?.[0];
      if (candidate?.$id) {
        return candidate.$id;
      }
      if (candidate?.id) {
        return candidate.id;
      }
    } catch (lookupError) {
      console.warn("safeUpsertUserProfile:lookup", lookupError);
    }
    return null;
  };

  const updatedByRequestedId = await tryUpdateDocument(userId);
  if (updatedByRequestedId) {
    return updatedByRequestedId;
  }

  let existingDocumentId = await resolveExistingDocumentId();
  if (existingDocumentId && existingDocumentId !== userId) {
    const updatedByLookup = await tryUpdateDocument(existingDocumentId);
    if (updatedByLookup) {
      return updatedByLookup;
    }
  }

  try {
    return await databases.createDocument(
      APPWRITE_DATABASE_ID,
      COLLECTION_USERS_ID,
      userId,
      payload,
      creationPermissions
    );
  } catch (error) {
    const code = error?.code ?? error?.response?.code;
    const message = String(error?.message ?? error?.response?.message ?? "");
    const isConflict =
      code === 409 ||
      error?.type === "document_already_exists" ||
      /already exists/i.test(message);

    if (isConflict) {
      createConflict = true;
      if (!existingDocumentId) {
        existingDocumentId = await resolveExistingDocumentId();
      }
      const updatedAfterConflict = await tryUpdateDocument(
        existingDocumentId || userId
      );
      if (updatedAfterConflict) {
        return updatedAfterConflict;
      }
      if (encounteredUnauthorized) {
        const fallbackDocId = IDs.unique();
        try {
          return await databases.createDocument(
            APPWRITE_DATABASE_ID,
            COLLECTION_USERS_ID,
            fallbackDocId,
            payload,
            creationPermissions
          );
        } catch (fallbackCreateError) {
          const fallbackCode =
            fallbackCreateError?.code ?? fallbackCreateError?.response?.code;
          if (fallbackCode === 409) {
            throw new Error(
              "We couldn't update your profile because of conflicting records. Please contact support."
            );
          }
          throw new Error(
            formatAppwriteError(
              fallbackCreateError,
              "Unable to finalize profile save. Please retry shortly."
            )
          );
        }
      }
    }

    if (encounteredUnauthorized && !createConflict) {
      throw new Error(
        "We couldn't update this profile yet because of access settings. Please retry after refreshing."
      );
    }

    throw new Error(formatAppwriteError(error, "Unable to save profile."));
  }
};

// ============================================
// COMMUNITY MESSAGES API
// ============================================

/**
 * Fetch community messages from the collection
 * Sorted by createdAt (newest first)
 */
export const fetchCommunityMessages = async () => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      COLLECTION_COMMUNITY_MESSAGES_ID,
      [Query.orderDesc("createdAt")]
    );
    console.log("Fetched community messages:", response.documents?.length || 0);
    return response.documents || [];
  } catch (error) {
    console.error("Error fetching community messages:", error);
    return [];
  }
};

/**
 * Create a new community message
 * @param {Object} messageData - { author, authorId, message, reactions, replyTo }
 */
export const createCommunityMessage = async (messageData) => {
  try {
    const payload = {
      author: sanitizeString(messageData.author, 150, "Anonymous"),
      authorId: sanitizeString(messageData.authorId || "", 200, ""),
      message: sanitizeString(messageData.message, 500),
      reactions: messageData.reactions || 0,
      replyTo: Array.isArray(messageData.replyTo) ? messageData.replyTo : [],
      createdAt: new Date().toISOString(),
    };

    const response = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      COLLECTION_COMMUNITY_MESSAGES_ID,
      ID.unique(),
      payload
    );
    return response;
  } catch (error) {
    console.error("Error creating community message:", error);
    throw new Error(formatAppwriteError(error, "Failed to send message."));
  }
};

/**
 * Add emoji reaction to message
 * @param {string} messageId - The message document ID
 * @param {string} emojiName - The emoji identifier name
 * @param {string} userName - The name of the user adding the reaction
 */
export const addMessageReaction = async (
  messageId,
  emojiName,
  userName = "Anonymous"
) => {
  try {
    console.log("Backend: Adding reaction", { messageId, emojiName, userName });

    // Normalize user name for consistency
    const normalizedUserName = sanitizeString(
      userName,
      150,
      "Anonymous"
    ).trim();
    console.log("Backend: Normalized user name:", normalizedUserName);

    // First get the current message to update reactions
    const message = await databases.getDocument(
      APPWRITE_DATABASE_ID,
      COLLECTION_COMMUNITY_MESSAGES_ID,
      messageId
    );

    console.log("Backend: Current message reactions:", message.reactions);

    // Get current reactions or initialize empty array
    const currentReactions = Array.isArray(message.reactions)
      ? message.reactions
      : [];

    // Parse existing reaction objects from JSON strings
    const parsedReactions = currentReactions.map((reaction) => {
      try {
        const parsed = JSON.parse(reaction);
        // Normalize user names in existing reactions for consistency
        if (parsed.users && Array.isArray(parsed.users)) {
          parsed.users = parsed.users.map((user) =>
            sanitizeString(user, 150, "Anonymous").trim()
          );
        }
        return parsed;
      } catch (e) {
        // Handle legacy string format "userName:emojiName"
        const [user, emoji] = reaction.split(":");
        return {
          emojiName: emoji,
          count: 1,
          users: [sanitizeString(user, 150, "Anonymous").trim()],
        };
      }
    });

    console.log("Backend: Parsed reactions:", parsedReactions);

    // Find existing reaction for this emoji
    const existingReactionIndex = parsedReactions.findIndex(
      (r) => r.emojiName === emojiName
    );

    if (existingReactionIndex !== -1) {
      // Update existing reaction
      const existingReaction = parsedReactions[existingReactionIndex];
      const userExists = existingReaction.users.some(
        (user) => user === normalizedUserName
      );

      console.log("Backend: Existing reaction found, user exists:", userExists);

      if (!userExists) {
        existingReaction.users.push(normalizedUserName);
        existingReaction.count = existingReaction.users.length;
        console.log(
          "Backend: Added user to existing reaction, new count:",
          existingReaction.count
        );
      } else {
        console.log(
          "Backend: User already exists in reaction, no count change"
        );
      }
    } else {
      // Add new reaction
      const newReaction = {
        emojiName,
        count: 1,
        users: [normalizedUserName],
      };
      parsedReactions.push(newReaction);
      console.log("Backend: Added new reaction:", newReaction);
    }

    // Convert back to JSON strings for storage
    const updatedReactions = parsedReactions.map((reaction) =>
      JSON.stringify(reaction)
    );

    console.log("Backend: Updated reactions array:", updatedReactions);

    const response = await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      COLLECTION_COMMUNITY_MESSAGES_ID,
      messageId,
      { reactions: updatedReactions }
    );

    console.log("Backend: Update response:", response);
    return response;
  } catch (error) {
    console.error("Backend: Error adding message reaction:", error);
    throw new Error(formatAppwriteError(error, "Failed to add reaction."));
  }
};

/**
 * Remove emoji reaction from message
 * @param {string} messageId - The message document ID
 * @param {string} emojiName - The emoji identifier name
 * @param {string} userName - The name of the user removing the reaction
 */
export const removeMessageReaction = async (
  messageId,
  emojiName,
  userName = "Anonymous"
) => {
  try {
    // First get the current message to update reactions
    const message = await databases.getDocument(
      APPWRITE_DATABASE_ID,
      COLLECTION_COMMUNITY_MESSAGES_ID,
      messageId
    );

    // Get current reactions or initialize empty array
    const currentReactions = Array.isArray(message.reactions)
      ? message.reactions
      : [];

    // Parse existing reaction objects from JSON strings
    const parsedReactions = currentReactions.map((reaction) => {
      try {
        return JSON.parse(reaction);
      } catch (e) {
        // Handle legacy string format "userName:emojiName"
        const [user, emoji] = reaction.split(":");
        return { emojiName: emoji, count: 1, users: [user] };
      }
    });

    // Find existing reaction for this emoji
    const existingReactionIndex = parsedReactions.findIndex(
      (r) => r.emojiName === emojiName
    );

    if (existingReactionIndex !== -1) {
      const existingReaction = parsedReactions[existingReactionIndex];

      // Remove user from the array
      const userIndex = existingReaction.users.indexOf(userName);
      if (userIndex > -1) {
        existingReaction.users.splice(userIndex, 1);
        existingReaction.count = existingReaction.users.length;

        // Remove emoji entirely if no users left
        if (existingReaction.users.length === 0) {
          parsedReactions.splice(existingReactionIndex, 1);
        }
      }
    }

    // Convert back to JSON strings for storage
    const updatedReactions = parsedReactions.map((reaction) =>
      JSON.stringify(reaction)
    );

    const response = await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      COLLECTION_COMMUNITY_MESSAGES_ID,
      messageId,
      { reactions: updatedReactions }
    );
    return response;
  } catch (error) {
    console.error("Error removing message reaction:", error);
    throw new Error(formatAppwriteError(error, "Failed to remove reaction."));
  }
};

/**
 * Fetch replies for a specific message
 * @param {string} messageId - The parent message ID
 * @returns {Promise<Array>} - Array of reply documents
 */
export const fetchMessageReplies = async (messageId) => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      COLLECTION_REPLIES_ID,
      [Query.equal("messageId", messageId), Query.orderDesc("createdAt")]
    );
    console.log(
      "Fetched replies for message:",
      messageId,
      response.documents?.length || 0
    );
    return response.documents || [];
  } catch (error) {
    console.error("Error fetching message replies:", error);
    return [];
  }
};

/**
 * Add reply to message (using separate replies collection)
 * @param {string} messageId - The parent message ID
 * @param {Object} replyData - { author, authorId, message }
 */
export const addMessageReply = async (messageId, replyData) => {
  try {
    console.log("Backend: Adding reply for message:", messageId, replyData);

    // Create the reply document in the separate replies collection
    const replyPayload = {
      messageId: messageId, // Reference to the parent message
      author: sanitizeString(replyData.author, 150, "Anonymous"),
      authorId: sanitizeString(replyData.authorId || "", 200, ""),
      message: sanitizeString(replyData.message, 500),
      createdAt: new Date().toISOString(),
    };

    console.log("Backend: Reply payload:", replyPayload);

    const response = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      COLLECTION_REPLIES_ID,
      ID.unique(),
      replyPayload
    );

    console.log("Backend: Created reply successfully:", response);
    return response;
  } catch (error) {
    console.error("Backend: Error adding message reply:", error);
    throw new Error(formatAppwriteError(error, "Failed to add reply."));
  }
};

/**
 * Subscribe to real-time updates for community messages
 * @param {Function} callback - Function to handle updates
 * @returns {Object} - Subscription object with unsubscribe method
 */
export const subscribeToCommunityMessages = (callback) => {
  try {
    const subscription = client.subscribe(
      `databases.${APPWRITE_DATABASE_ID}.collections.${COLLECTION_COMMUNITY_MESSAGES_ID}.documents`,
      (response) => {
        console.log("Real-time update:", response);
        callback(response);
      }
    );

    return {
      unsubscribe: () => {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error("Error unsubscribing from community messages:", error);
        }
      },
    };
  } catch (error) {
    console.error("Error subscribing to community messages:", error);
    return {
      unsubscribe: () => {},
    };
  }
};

/**
 * Subscribe to real-time updates for replies collection
 * @param {Function} callback - Function to handle updates
 * @returns {Object} - Subscription object with unsubscribe method
 */
export const subscribeToReplies = (callback) => {
  try {
    const subscription = client.subscribe(
      `databases.${APPWRITE_DATABASE_ID}.collections.${COLLECTION_REPLIES_ID}.documents`,
      (response) => {
        console.log("Replies real-time update:", response);
        callback(response);
      }
    );

    return {
      unsubscribe: () => {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error("Error unsubscribing from replies:", error);
        }
      },
    };
  } catch (error) {
    console.error("Error subscribing to replies:", error);
    return {
      unsubscribe: () => {},
    };
  }
};

// ============================================
// USER NAME MANAGEMENT
// ============================================

const USER_NAME_KEY = "auri_user_name";

/**
 * Get stored user name from localStorage with mobile compatibility
 */
export const getStoredUserName = () => {
  try {
    // Try localStorage first
    const storedName = localStorage.getItem(USER_NAME_KEY);
    if (storedName && storedName.trim()) {
      console.log("Appwrite: Retrieved stored user name:", storedName);
      return storedName;
    }

    // Fallback: try sessionStorage for mobile compatibility
    try {
      const sessionName = sessionStorage.getItem(USER_NAME_KEY);
      if (sessionName && sessionName.trim()) {
        console.log("Appwrite: Retrieved session user name:", sessionName);
        // Sync back to localStorage for consistency
        try {
          localStorage.setItem(USER_NAME_KEY, sessionName);
        } catch (syncError) {
          console.warn("Appwrite: Could not sync to localStorage:", syncError);
        }
        return sessionName;
      }
    } catch (sessionError) {
      console.warn("Appwrite: Session storage not available:", sessionError);
    }

    // Fallback: try to get from user object
    try {
      const user = getCurrentUser();
      if (user && user.name && user.name.trim()) {
        console.log("Appwrite: Using user object name:", user.name);
        const cleanName = user.name.trim();
        // Save for future use
        try {
          localStorage.setItem(USER_NAME_KEY, cleanName);
        } catch (saveError) {
          console.warn("Appwrite: Could not save user name:", saveError);
        }
        return cleanName;
      }
    } catch (userError) {
      console.warn("Appwrite: User object not available:", userError);
    }

    // Mobile-specific fallback: Try cookies if available
    try {
      const cookies = document.cookie.split(';');
      const nameCookie = cookies.find(cookie => cookie.trim().startsWith(`${USER_NAME_KEY}=`));
      if (nameCookie) {
        const cookieName = nameCookie.split('=')[1];
        if (cookieName && cookieName.trim()) {
          console.log("Appwrite: Retrieved user name from cookie:", cookieName);
          const cleanName = cookieName.trim();
          // Save to localStorage for future use
          try {
            localStorage.setItem(USER_NAME_KEY, cleanName);
          } catch (saveError) {
            console.warn("Appwrite: Could not save user name from cookie:", saveError);
          }
          return cleanName;
        }
      }
    } catch (cookieError) {
      console.warn("Appwrite: Cookie access not available:", cookieError);
    }

    console.log("Appwrite: No user name found, returning empty string");
    return "";
  } catch (error) {
    console.error("Error retrieving user name:", error);
    return "";
  }
};

/**
 * Save user name to localStorage
 */
export const saveUserName = (name) => {
  try {
    const sanitizedName = sanitizeString(name, 150, "Anonymous");
    localStorage.setItem(USER_NAME_KEY, sanitizedName);
    return sanitizedName;
  } catch (error) {
    console.error("Error saving user name:", error);
    return "Anonymous";
  }
};

/**
 * Clear stored user name
 */
export const clearUserName = () => {
  try {
    localStorage.removeItem(USER_NAME_KEY);
  } catch (error) {
    console.error("Error clearing user name:", error);
  }
};

export default client;

export { Permission, Role, Query };

// ============================================
// SURVEY FUNCTIONS
// ============================================

const SURVEY_SESSION_KEY = "auri_survey_session";
const SURVEY_RESPONSE_KEY = "auri_survey_response";

/**
 * Get or create a session ID for survey tracking
 */
export const getOrCreateSessionId = async () => {
  try {
    // Check localStorage first
    let sessionId = localStorage.getItem(SURVEY_SESSION_KEY);
    
    if (sessionId) {
      return sessionId;
    }
    
    // Generate new session ID
    sessionId = `survey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(SURVEY_SESSION_KEY, sessionId);
    
    return sessionId;
  } catch (error) {
    console.error("Error getting session ID:", error);
    return `offline_${Date.now()}`;
  }
};

/**
 * Get stored survey response (local fallback)
 */
export const getStoredSurveyResponse = () => {
  try {
    const stored = localStorage.getItem(SURVEY_RESPONSE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error retrieving stored survey response:", error);
    return null;
  }
};

/**
 * Submit survey response to Appwrite
 */
export const submitSurveyResponse = async (surveyData) => {
  try {
    // Only include fields that exist in tracker collection
    const payload = {
      sessionId: surveyData.sessionId || await getOrCreateSessionId(),
      os: surveyData.os || (typeof navigator !== 'undefined' ? navigator.platform : 'Unknown'),
      been_here_before: sanitizeString(surveyData.been_here_before || '', 50),
      created_account: sanitizeString(surveyData.created_account || '', 50),
      not_ready_reason: sanitizeString(surveyData.not_ready_reason || '', 255),
      send_hi: sanitizeString(surveyData.send_hi || '', 50),
      daily_use: sanitizeString(surveyData.daily_use || '', 50),
      best_include: sanitizeString(surveyData.best_include || '', 500),
      why_not_daily: sanitizeString(surveyData.why_not_daily || '', 255),
      community_belong: sanitizeString(surveyData.community_belong || '', 50),
      leave_review: sanitizeString(surveyData.leave_review || '', 50),
      overall_rating: surveyData.overall_rating ? parseInt(surveyData.overall_rating) : null,
      survey_completed: true,
      survey_started_at: surveyData.survey_started_at || new Date().toISOString(),
    };

    console.log('Submitting survey data:', JSON.stringify(payload, null, 2));

    // Try to submit to tracker collection
    try {
      const response = await databases.createDocument(
        APPWRITE_DATABASE_ID,
        COLLECTION_TRACKER_ID,
        payload.sessionId,
        payload
      );
      console.log("Survey submitted successfully:", response);
      return response;
    } catch (collectionError) {
      // If tracker collection doesn't exist or has different schema, create with minimal data
      console.warn("Tracker collection submission failed, trying minimal payload:", collectionError);
      
      // Try creating document with only the fields that exist
      const minimalPayload = {
        sessionId: payload.sessionId,
        os: payload.os,
        survey_completed: true,
        survey_started_at: payload.survey_started_at,
      };
      
      // Add optional fields if they're not empty
      if (payload.been_here_before) minimalPayload.been_here_before = payload.been_here_before;
      if (payload.created_account) minimalPayload.created_account = payload.created_account;
      if (payload.daily_use) minimalPayload.daily_use = payload.daily_use;
      if (payload.overall_rating) minimalPayload.overall_rating = payload.overall_rating;
      
      const minimalResponse = await databases.createDocument(
        APPWRITE_DATABASE_ID,
        COLLECTION_TRACKER_ID,
        payload.sessionId,
        minimalPayload
      );
      
      // Update with remaining fields
      const updatePayload = {};
      if (payload.not_ready_reason) updatePayload.not_ready_reason = payload.not_ready_reason;
      if (payload.send_hi) updatePayload.send_hi = payload.send_hi;
      if (payload.best_include) updatePayload.best_include = payload.best_include;
      if (payload.why_not_daily) updatePayload.why_not_daily = payload.why_not_daily;
      if (payload.community_belong) updatePayload.community_belong = payload.community_belong;
      if (payload.leave_review) updatePayload.leave_review = payload.leave_review;
      
      if (Object.keys(updatePayload).length > 0) {
        await databases.updateDocument(
          APPWRITE_DATABASE_ID,
          COLLECTION_TRACKER_ID,
          payload.sessionId,
          updatePayload
        );
      }
      
      return minimalResponse;
    }
  } catch (error) {
    console.error("Error submitting survey response:", error);
    
    // Save locally as fallback
    try {
      localStorage.setItem(SURVEY_RESPONSE_KEY, JSON.stringify({
        ...surveyData,
        localSavedAt: new Date().toISOString()
      }));
    } catch (localError) {
      console.error("Failed to save survey locally:", localError);
    }
    
    throw error;
  }
};

/**
 * Update existing survey response
 */
export const updateSurveyResponse = async (sessionId, updateData) => {
  try {
    // First check if document exists
    try {
      await databases.getDocument(
        APPWRITE_DATABASE_ID,
        COLLECTION_TRACKER_ID,
        sessionId
      );
    } catch (getError) {
      // Document doesn't exist, create it
      return await submitSurveyResponse({
        ...updateData,
        sessionId
      });
    }

    const payload = {};
    
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && updateData[key] !== null) {
        if (typeof updateData[key] === 'string') {
          payload[key] = sanitizeString(updateData[key], 500);
        } else {
          payload[key] = updateData[key];
        }
      }
    });
    
    const response = await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      COLLECTION_TRACKER_ID,
      sessionId,
      payload
    );
    
    console.log("Survey updated successfully:", response);
    return response;
  } catch (error) {
    console.error("Error updating survey response:", error);
    throw error;
  }
};

/**
 * Check if survey was already completed
 */
export const isSurveyCompleted = () => {
  try {
    const completed = localStorage.getItem('auri_survey_completed');
    return completed === 'true';
  } catch (error) {
    return false;
  }
};

/**
 * Mark survey as completed locally
 */
export const markSurveyCompleted = () => {
  try {
    localStorage.setItem('auri_survey_completed', 'true');
  } catch (error) {
    console.error("Error marking survey as completed:", error);
  }
};

/**
 * Reset survey status (for testing)
 */
export const resetSurveyStatus = () => {
  try {
    localStorage.removeItem('auri_survey_completed');
    localStorage.removeItem('auri_survey_seen');
    localStorage.removeItem(SURVEY_SESSION_KEY);
    localStorage.removeItem(SURVEY_RESPONSE_KEY);
  } catch (error) {
    console.error("Error resetting survey status:", error);
  }
};
