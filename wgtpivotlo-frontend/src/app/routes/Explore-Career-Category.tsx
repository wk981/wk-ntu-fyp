import { CareerCategory } from '@/features/careers/components/career-category';
import { useNavigate, useParams } from 'react-router-dom';

export const ExploreCareerCategory = () => {
  const navigate = useNavigate();
  const { category } = useParams<{ category?: string }>();
  return (
    <>{category && <CareerCategory category={category} backButtonOnClick={() => void navigate('/explore/career')} />}</>
  );
};
