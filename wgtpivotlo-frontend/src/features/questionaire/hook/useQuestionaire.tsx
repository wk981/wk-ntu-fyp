import { useContext } from 'react';
import { QuestionaireContext } from '../contexts/QuestionaireProvider';

export const useQuestionaire = () => {
  const context = useContext(QuestionaireContext);

  if (!context) {
    throw new Error('useQuestionaire must be used within a AuthProvider');
  }
  return context;
};
