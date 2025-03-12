import CmsLayout from '@/features/admin/components/cms-layout';
import { CourseContent } from './course-content';
import { AdminCourseProvider } from '../context/AdminCourseProvider';

export const CMSCourse = () => {
  return (
    <AdminCourseProvider>
      <CmsLayout tab="courses">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Courses Management</h2>
        </div>
        <CourseContent />
      </CmsLayout>
    </AdminCourseProvider>
  );
};
