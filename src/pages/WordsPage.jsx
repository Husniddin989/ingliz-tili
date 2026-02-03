import { useState, useMemo } from 'react';
import { useWords } from '../context/WordContext';
import WordCard from '../components/WordCard';

const WordsPage = () => {
  const { words, addWord } = useWords();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [newWord, setNewWord] = useState({
    english: '',
    uzbek: '',
    category: 'level1',
    example: '',
    exampleTranslation: ''
  });

  const WORDS_PER_PAGE = 100;

  const filteredWords = useMemo(() => {
    return words.filter(word => {
      const matchesSearch =
        word.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.uzbek.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || word.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [words, searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredWords.length / WORDS_PER_PAGE);
  const startIndex = (currentPage - 1) * WORDS_PER_PAGE;
  const endIndex = startIndex + WORDS_PER_PAGE;
  const currentWords = filteredWords.slice(startIndex, endIndex);

  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const categories = useMemo(() => {
    const cats = [...new Set(words.map(w => w.category))];
    return cats.sort();
  }, [words]);

  const handleAddWord = (e) => {
    e.preventDefault();
    if (newWord.english && newWord.uzbek) {
      addWord(newWord);
      setNewWord({
        english: '',
        uzbek: '',
        category: 'level1',
        example: '',
        exampleTranslation: ''
      });
      setShowAddForm(false);
    }
  };

  const categoryIcons = {
    level1: '📘',
    level2: '📗',
    level3: '📙',
    level4: '📕'
  };

  const categoryLabels = {
    level1: 'Daraja 1',
    level2: 'Daraja 2',
    level3: 'Daraja 3',
    level4: 'Daraja 4'
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            📚 So'zlar ro'yxati
          </h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {showAddForm ? '✗ Yopish' : "+ So'z qo'shish"}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddWord} className="bg-indigo-50 rounded-lg p-4 mb-4 space-y-3">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ingliz tilida *
                </label>
                <input
                  type="text"
                  required
                  value={newWord.english}
                  onChange={(e) => setNewWord({ ...newWord, english: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Masalan: hello"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  O'zbek tilida *
                </label>
                <input
                  type="text"
                  required
                  value={newWord.uzbek}
                  onChange={(e) => setNewWord({ ...newWord, uzbek: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Masalan: salom"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Daraja
                </label>
                <select
                  value={newWord.category}
                  onChange={(e) => setNewWord({ ...newWord, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="level1">📘 Daraja 1</option>
                  <option value="level2">📗 Daraja 2</option>
                  <option value="level3">📙 Daraja 3</option>
                  <option value="level4">📕 Daraja 4</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Misol (ingliz tili)
                </label>
                <input
                  type="text"
                  value={newWord.example}
                  onChange={(e) => setNewWord({ ...newWord, example: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Misol jumla"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Misol tarjimasi (o'zbek tili)
                </label>
                <input
                  type="text"
                  value={newWord.exampleTranslation}
                  onChange={(e) => setNewWord({ ...newWord, exampleTranslation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Misol tarjimasi"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              So'z qo'shish
            </button>
          </form>
        )}

        <div className="mb-4">
          <input
            type="text"
            placeholder="So'z qidirish... (ingliz yoki o'zbek tilinda)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Hammasi ({words.length})
          </button>
          {categories.map((category) => {
            const count = words.filter(w => w.category === category).length;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {categoryIcons[category]} {categoryLabels[category]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-center text-gray-600">
        {filteredWords.length} ta so'z topildi
        {totalPages > 1 && (
          <span className="ml-2">
            (Sahifa {currentPage} / {totalPages})
          </span>
        )}
      </div>

      {currentWords.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentWords.map((word) => (
              <WordCard key={word.id} word={word} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 px-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`w-full sm:w-auto px-4 sm:px-6 py-3 rounded-lg font-medium transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800'
                }`}
              >
                ← Oldingi
              </button>

              <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto max-w-full pb-2 sm:pb-0">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg font-medium transition-colors flex-shrink-0 ${
                        currentPage === pageNum
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`w-full sm:w-auto px-4 sm:px-6 py-3 rounded-lg font-medium transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800'
                }`}
              >
                Keyingi →
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😔</div>
          <p className="text-xl text-gray-600">
            Hech qanday so'z topilmadi
          </p>
        </div>
      )}
    </div>
  );
};

export default WordsPage;
