// Preview-specific Appwrite configuration and functions
import { appwriteConfig } from '../lib/Appwrite';

// For preview purposes, we'll use mock data and local storage
// In a real implementation, this would connect to the actual Appwrite backend

const PREVIEW_STORAGE_KEY = 'preview_auth';

// Mock user data for demo purposes
const MOCK_USERS = [
  {
    $id: 'preview_user_1',
    email: 'you@auri.app',
    name: 'Preview User',
    createdAt: new Date().toISOString(),
    emailVerification: true
  }
];

// Appwrite client configuration
const mockClient = {
  config: appwriteConfig,
  
  // Mock session management
  async getCurrentUser() {
    try {
      const stored = localStorage.getItem(PREVIEW_STORAGE_KEY);
      if (stored) {
        const userData = JSON.parse(stored);
        return userData;
      }
      return null;
    } catch (error) {
      console.error('Error retrieving user:', error);
      return null;
    }
  },

  async createEmailPasswordSession(email, password) {
    // Mock login - accept the default credentials
    if (email === 'you@auri.app' && password === 'AuriPass1') {
      const mockUser = MOCK_USERS[0];
      localStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(mockUser));
      return { user: mockUser };
    }
    
    // For any other credentials, create a mock user
    const mockUser = {
      $id: `preview_user_${Date.now()}`,
      email: email,
      name: email.split('@')[0],
      createdAt: new Date().toISOString(),
      emailVerification: true
    };
    
    localStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(mockUser));
    return { user: mockUser };
  },

  async deleteSessions() {
    localStorage.removeItem(PREVIEW_STORAGE_KEY);
  },

  async createAccount(email, password, name = 'Auri User') {
    // Mock account creation
    const mockUser = {
      $id: `preview_user_${Date.now()}`,
      email: email,
      name: name,
      createdAt: new Date().toISOString(),
      emailVerification: false
    };
    
    localStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(mockUser));
    return mockUser;
  },

  async updateName(name) {
    const stored = localStorage.getItem(PREVIEW_STORAGE_KEY);
    if (stored) {
      const userData = JSON.parse(stored);
      userData.name = name;
      localStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(userData));
      return userData;
    }
    throw new Error('No user session');
  }
};

// Export the mock client
export default mockClient;

// Auth functions
export const safeLogin = async (email, password) => {
  const client = mockClient;
  const session = await client.createEmailPasswordSession(email, password);
  return session.user;
};

export const signupWithEmail = async (email, password, name = 'Auri User') => {
  const client = mockClient;
  return await client.createAccount(email, password, name);
};

export const getCurrentUser = async () => {
  return await mockClient.getCurrentUser();
};

export const logoutCurrent = async () => {
  await mockClient.deleteSessions();
};

// Mock databases for reviews and user profiles
export const mockDatabases = {
  async createDocument(databaseId, collectionId, documentId, data) {
    // Mock document creation
    const mockDoc = {
      $id: documentId,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Store in localStorage for preview
    const storageKey = `preview_${collectionId}`;
    const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
    existing.push(mockDoc);
    localStorage.setItem(storageKey, JSON.stringify(existing));
    
    return mockDoc;
  },

  async listDocuments(databaseId, collectionId, queries = []) {
    const storageKey = `preview_${collectionId}`;
    const documents = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Simple sorting for createdAt
    if (queries.some(q => q.includes('orderDesc'))) {
      documents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    return { documents };
  },

  async getDocument(databaseId, collectionId, documentId) {
    const storageKey = `preview_${collectionId}`;
    const documents = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const doc = documents.find(d => d.$id === documentId);
    if (!doc) throw new Error('Document not found');
    return doc;
  },

  async updateDocument(databaseId, collectionId, documentId, data) {
    const storageKey = `preview_${collectionId}`;
    const documents = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const index = documents.findIndex(d => d.$id === documentId);
    if (index === -1) throw new Error('Document not found');
    
    documents[index] = {
      ...documents[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(storageKey, JSON.stringify(documents));
    return documents[index];
  },

  async deleteDocument(databaseId, collectionId, documentId) {
    const storageKey = `preview_${collectionId}`;
    const documents = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const filtered = documents.filter(d => d.$id !== documentId);
    localStorage.setItem(storageKey, JSON.stringify(filtered));
  }
};

// Export mock databases
export { mockDatabases as databases };

// Mock storage for avatar uploads
export const mockStorage = {
  async createFile(bucketId, fileId, file, permissions = []) {
    // Mock file upload - just return a mock file object
    const mockFile = {
      $id: fileId,
      bucketId,
      name: file.name || `file_${Date.now()}`,
      sizeOriginal: file.size || 0,
      mimeType: file.type || 'image/jpeg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return mockFile;
  },

  getFileView(bucketId, fileId) {
    // Return a mock URL for file viewing
    return `https://mock-storage.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/view`;
  }
};

export { mockStorage as storage };

// Export IDs for compatibility
export const IDs = {
  unique: () => `preview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
};

// Mock permission and role classes
export const Permission = {
  read: (role) => ({ action: 'read', role }),
  update: (role) => ({ action: 'update', role }),
  delete: (role) => ({ action: 'delete', role })
};

export const Role = {
  any: () => ({ type: 'any' }),
  user: (userId) => ({ type: 'user', userId })
};

// Mock Query class
export const Query = {
  orderDesc: (field) => `orderDesc(${field})`,
  orderAsc: (field) => `orderAsc(${field})`
};

// Export environment variables for compatibility
export const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'preview_database';
export const COLLECTION_USERS_ID = import.meta.env.VITE_APPWRITE_COLLECTION_USERS_ID || 'preview_users';
export const COLLECTION_REVIEWS_ID = import.meta.env.VITE_APPWRITE_COLLECTION_REVIEWS_ID || 'preview_reviews';
export const COLLECTION_TRACKER_ID = import.meta.env.VITE_APPWRITE_COLLECTION_TRACKER_ID || 'preview_tracker';
export const APPWRITE_BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID || 'preview_avatars';
