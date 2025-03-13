import { CareerCategory } from '@/features/careers/components/career-category';
import { useQuestionaire } from '@/features/questionaire/hook/useQuestionaire';
import { useNavigate, useParams } from 'react-router-dom';

export const ResultCategory = () => {
  const navigate = useNavigate();
  const { questionaireFormResults } = useQuestionaire();
  const { category } = useParams<{ category?: string }>();
  return (
    <>
      {category && (
        <CareerCategory
          questionaireFormResults={questionaireFormResults}
          category={category}
          backButtonOnClick={() => void navigate('/questionaire/result')}
        />
      )}
    </>
  );
};
