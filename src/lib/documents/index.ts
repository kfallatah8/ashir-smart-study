
// Export all document functionality from this central file

// Core document operations
export { 
  uploadDocument,
  getUserDocuments,
  getDocumentById,
  searchDocuments 
} from './core';

// Sharing functionality
export {
  shareDocument,
  getSharedDocuments
} from './sharing';

// Progress tracking
export {
  updateDocumentProgress,
  getDocumentProgress
} from './progress';

// AI tools functionality
export {
  createAIToolTask,
  getAIToolTasks,
  isMindMapResult,
  isFlashcardsResult,
  type AIToolTask,
  type MindMapNode,
  type MindMapEdge,
  type MindMapResult,
  type FlashcardItem
} from './ai-tools';
