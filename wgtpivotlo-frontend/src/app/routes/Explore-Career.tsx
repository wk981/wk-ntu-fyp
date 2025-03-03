import { CareerPreview } from '@/features/careers/components/career-preview';
import { CareerPreviewLoading } from '@/features/careers/components/CareerPreviewLoading';
import { useExploreCareer } from '@/features/careers/hooks/useExploreCareer';
import { usePreference } from '@/features/careers/hooks/usePreference';
import { useNavigate } from 'react-router-dom';

export const ExploreCareer = () => {
  const { data, isLoading: isExploringLoading } = useExploreCareer();
  const navigate = useNavigate();
  const { checkedId, handleHeartButtonClick } = usePreference();

  const onClick = (category: string) => {
    void navigate(category);
  };

  const backButtonOnClick = () => {
    void navigate('explore/career/');
  };

  if (isExploringLoading) {
    return <CareerPreviewLoading />;
  }
  return (
    <div className="container mx-auto md:px-4 ">
      {data && (
        <>
          <CareerPreview
            category={'user'}
            data={data?.user.data}
            onClick={onClick}
            backButtonOnClick={backButtonOnClick}
            checkedId={checkedId}
            handleHeartButtonClick={handleHeartButtonClick}
          />
          <CareerPreview
            category={'career'}
            data={data?.career.data}
            onClick={onClick}
            backButtonOnClick={backButtonOnClick}
            checkedId={checkedId}
            handleHeartButtonClick={handleHeartButtonClick}
          />
        </>
      )}
    </div>
  );
};
