import { CareerContent } from '@/features/admin/components/career-content';
import CmsLayout from '@/features/admin/components/cms-layout';

export const CMSCareer = () => {
  return (
    <CmsLayout>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Careers Management</h2>
      </div>
      <CareerContent />
    </CmsLayout>
  );
};
