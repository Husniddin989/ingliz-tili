const STORAGE_KEYS = {
  WORDS: 'ingliz_tili_words',
  PROGRESS: 'ingliz_tili_progress'
};

export const getWords = () => {
  try {
    const words = localStorage.getItem(STORAGE_KEYS.WORDS);
    return words ? JSON.parse(words) : null;
  } catch (error) {
    console.error('Error reading words from localStorage:', error);
    return null;
  }
};

export const saveWords = (words) => {
  try {
    localStorage.setItem(STORAGE_KEYS.WORDS, JSON.stringify(words));
    return true;
  } catch (error) {
    console.error('Error saving words to localStorage:', error);
    return false;
  }
};

export const addWord = (word) => {
  const words = getWords() || [];
  const newWord = {
    ...word,
    id: crypto.randomUUID(),
    dateAdded: new Date().toISOString(),
    timesReviewed: 0,
    isUnknown: false
  };
  words.push(newWord);
  saveWords(words);
  return newWord;
};

export const updateWord = (wordId, updates) => {
  const words = getWords() || [];
  const index = words.findIndex(w => w.id === wordId);
  if (index !== -1) {
    words[index] = { ...words[index], ...updates };
    saveWords(words);
    return words[index];
  }
  return null;
};

export const deleteWord = (wordId) => {
  const words = getWords() || [];
  const filteredWords = words.filter(w => w.id !== wordId);
  saveWords(filteredWords);
  return true;
};

export const markAsUnknown = (wordId, isUnknown) => {
  return updateWord(wordId, { isUnknown });
};

export const incrementReviewCount = (wordId) => {
  const words = getWords() || [];
  const word = words.find(w => w.id === wordId);
  if (word) {
    return updateWord(wordId, { timesReviewed: word.timesReviewed + 1 });
  }
  return null;
};

export const getProgress = () => {
  try {
    const progress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return progress ? JSON.parse(progress) : {
      totalWords: 0,
      knownWords: 0,
      unknownWords: 0,
      quizzesTaken: 0,
      lastStudied: null
    };
  } catch (error) {
    console.error('Error reading progress from localStorage:', error);
    return null;
  }
};

export const saveProgress = (progress) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
    return true;
  } catch (error) {
    console.error('Error saving progress to localStorage:', error);
    return false;
  }
};

export const updateProgress = (updates) => {
  const progress = getProgress();
  const newProgress = {
    ...progress,
    ...updates,
    lastStudied: new Date().toISOString()
  };
  saveProgress(newProgress);
  return newProgress;
};

export const clearAllData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.WORDS);
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};
