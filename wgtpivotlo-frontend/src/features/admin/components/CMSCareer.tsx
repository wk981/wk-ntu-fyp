import { CareerContent } from '@/features/admin/components/career-content';
import CmsLayout from '@/features/admin/components/cms-layout';
import { AdminCareerProvider } from '../context/AdminCareerProvider';

export const CMSCareer = () => {
  return (
    <AdminCareerProvider>
      <CmsLayout tab="careers">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Careers Management</h2>
        </div>
        <CareerContent />
      </CmsLayout>
    </AdminCareerProvider>
  );
};
