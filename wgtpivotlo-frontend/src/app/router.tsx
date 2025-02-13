import { Navbar } from '@/components/navbar';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import { Login } from './routes/auth/login';
import { Register } from './routes/auth/register';
// import { Landing } from '../components/Landing';
import { QuestionaireProvider } from '@/features/questionaire/contexts/QuestionaireProvider';
import { Questions } from './routes/questionaire/Questions';
import { Result } from './routes/questionaire/Result';
import { Logout } from './routes/auth/logout';
import PrivateRoute from '@/components/private-route';
import { LearningTimeline } from './routes/Learning-Timeline';
import { UploadResume } from './routes/questionaire/UploadResume';
import { FirstTimeUserDialog } from '@/components/first-time-user-dialog';
import { DownloadResume } from './routes/Resume/DownloadResume';
import { ExploreCareer } from './routes/Explore-Career';
import { Landing } from '@/components/Landing';
import { Dashboard } from './routes/Dashboard';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { BreadcrumbCustom } from '@/components/breadcrumpcustom';
import NotFound from './routes/NotFound';

const QuestionaireLayout = () => (
  <QuestionaireProvider>
    <Outlet />
  </QuestionaireProvider>
);

const CommonLayout = () => (
  <div className="max-w-[1920px] w-full mx-auto px-4 md:px-6 lg:px-8 py-5">
    <main className="md:space-y-5 space-y-3">
      <BreadcrumbCustom />
      <Outlet />
    </main>
  </div>
);

const DashboardLayout = () => (
  <SidebarProvider defaultOpen>
    <AppSidebar />
    <SidebarInset className="bg-inherit">
      <header className="flex h-16 items-center gap-4 border-b px-6">
        <SidebarTrigger />
        <BreadcrumbCustom />
      </header>
      <div className="flex-1">
        <div className="mx-auto w-full max-w-[2000px] p-6">
          <Outlet />
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
);

export const AppRouter = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="auth">
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="logout" element={<Logout />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route element={<CommonLayout />}>
              <Route path="questionaire" element={<QuestionaireLayout />}>
                <Route index element={<UploadResume />} /> {/* Default route for /questionaire */}
                <Route path="upload" element={<UploadResume />} />
                <Route path="questions" element={<Questions />} />
                <Route path="result" element={<Result />} />
                <Route path="*" element={<NotFound />} /> {/* Handle unknown nested routes */}
              </Route>

              <Route path="explore/timeline" element={<LearningTimeline />} />
              <Route path="explore/career" element={<ExploreCareer />} />
              <Route path="resume" element={<DownloadResume />} />
            </Route>
            <Route path="dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} /> {/* Catch-all route */}
        </Routes>
        <FirstTimeUserDialog />
      </div>
    </Router>
  );
};
