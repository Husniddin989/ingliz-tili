export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generateQuizQuestions = (words, count = 10, mode = 'en-uz') => {
  if (words.length < 4) {
    throw new Error('Need at least 4 words to generate quiz');
  }

  const shuffledWords = shuffleArray(words);
  const selectedWords = shuffledWords.slice(0, Math.min(count, words.length));

  return selectedWords.map((word) => {
    const wrongAnswers = words
      .filter(w => w.id !== word.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    let question, correctAnswer, options;

    if (mode === 'en-uz') {
      question = word.english;
      correctAnswer = word.uzbek;
      options = shuffleArray([
        word.uzbek,
        ...wrongAnswers.map(w => w.uzbek)
      ]);
    } else {
      question = word.uzbek;
      correctAnswer = word.english;
      options = shuffleArray([
        word.english,
        ...wrongAnswers.map(w => w.english)
      ]);
    }

    return {
      id: word.id,
      question,
      correctAnswer,
      options,
      category: word.category,
      example: word.example,
      exampleTranslation: word.exampleTranslation
    };
  });
};

export const checkAnswer = (userAnswer, correctAnswer) => {
  return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
};

export const calculateScore = (answers, questions) => {
  let correct = 0;
  let wrong = 0;
  const results = [];

  questions.forEach((question, index) => {
    const isCorrect = checkAnswer(answers[index], question.correctAnswer);
    if (isCorrect) {
      correct++;
    } else {
      wrong++;
    }

    results.push({
      question: question.question,
      userAnswer: answers[index],
      correctAnswer: question.correctAnswer,
      isCorrect,
      category: question.category,
      example: question.example
    });
  });

  return {
    correct,
    wrong,
    total: questions.length,
    percentage: Math.round((correct / questions.length) * 100),
    results
  };
};

export const getWordsByCategory = (words, category) => {
  return words.filter(word => word.category === category);
};

export const getCategories = (words) => {
  const categories = words.map(word => word.category);
  return [...new Set(categories)];
};
