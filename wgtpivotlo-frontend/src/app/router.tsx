import { Navbar } from '@/components/navbar';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import { Login } from './routes/auth/login';
import { Register } from './routes/auth/register';
import { QuestionaireProvider } from '@/features/questionaire/contexts/QuestionaireProvider';
import { Questions } from './routes/questionaire/Questions';
import { Result } from './routes/questionaire/Result';
import { Logout } from './routes/auth/logout';
import { PrivateRoute } from '@/components/private-route';
import { LearningTimeline } from './routes/Learning-Timeline';
import { UploadResume } from './routes/questionaire/UploadResume';
import { FirstTimeUserDialog } from '@/components/first-time-user-dialog';
import { DownloadResume } from './routes/Resume/DownloadResume';
import { ExploreCareer } from './routes/Explore-Career';
import { BreadcrumbCustom } from '@/components/breadcrumpcustom';
import NotFound from './routes/NotFound';
import { CourseHistory } from './routes/Dashboard/CourseHistory';
import { Home } from './routes/Home';
import { EditAccountProvider } from '@/features/auth/provider/EditAccountSettingsProvider';
import { Security } from './routes/Settings/Security';
import { AccountSettings } from './routes/Settings';
import { ExploreCareerCategory } from './routes/Explore-Career-Category';
import { ResultCategory } from './routes/questionaire/Result-Category';
import { CMSCareer } from '@/features/admin/components/CMSCareer';
import { CMSCourse } from '@/features/admin/components/CMSCourse';
import { ProtectedRoute } from '@/components/protected-route';
import { RedirectRoute } from '@/components/redirect-route';

const QuestionaireLayout = () => (
  <QuestionaireProvider>
    <Outlet />
  </QuestionaireProvider>
);

const SettingsLayoutWrapper = () => (
  <EditAccountProvider>
    <Outlet />
  </EditAccountProvider>
);

const CommonLayout = () => (
  <div className="max-w-[1920px] w-full mx-auto px-4 md:px-6 lg:px-8 py-5">
    <main className="md:space-y-5 space-y-3">
      <BreadcrumbCustom />
      <Outlet />
    </main>
  </div>
);

export const AppRouter = () => {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="auth">
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="logout" element={<Logout />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route element={<CommonLayout />}>
              <Route element={<RedirectRoute />}>
                <Route path="questionaire" element={<QuestionaireLayout />}>
                  <Route index element={<UploadResume />} /> {/* Default route for /questionaire */}
                  <Route path="upload" element={<UploadResume />} />
                  <Route path="questions" element={<Questions />} />
                  <Route path="result" element={<Result />} />
                  <Route path="result/:category" element={<ResultCategory />} />
                  <Route path="*" element={<NotFound />} /> {/* Handle unknown nested routes */}
                </Route>

                <Route path="explore/timeline" element={<LearningTimeline />} />
                <Route path="explore/career" element={<ExploreCareer />} />
                <Route path="explore/career/:category" element={<ExploreCareerCategory />} />
                <Route path="resume" element={<DownloadResume />} />
                <Route path="history" element={<CourseHistory />} />
              </Route>
              <Route path="settings" element={<SettingsLayoutWrapper />}>
                <Route index element={<AccountSettings />} />
                <Route path="security" element={<Security />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
                <Route path="admin">
                  <Route path="careers" element={<CMSCareer />} />
                  <Route path="courses" element={<CMSCourse />} />
                </Route>
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} /> {/* Catch-all route */}
        </Routes>
        <FirstTimeUserDialog />
      </div>
    </Router>
  );
};
