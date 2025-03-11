import { useParams } from 'react-router-dom';
import { CMSCareer } from '../../../features/admin/components/CMSCareer';
import { CMSCourse } from '@/features/admin/components/CMSCourse';

export const CMS = () => {
  const { category } = useParams();
  console.log(category);
  return <>{category && <CMSLayoutFactory category={category} />}</>;
};

type CMSLayoutFactoryProps = {
  category: string;
};

const CMSLayoutFactory = ({ category }: CMSLayoutFactoryProps) => {
  switch (category) {
    case 'careers':
      return <CMSCareer />;
    case 'courses':
      return <CMSCourse />;
    case 'skills':
      return <CMSCareer />;
  }
};
