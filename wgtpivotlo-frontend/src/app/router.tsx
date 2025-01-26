import { Navbar } from '@/components/navbar';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import { Login } from './routes/auth/login';
import { Register } from './routes/auth/register';
import { Landing } from './routes/Landing';
import { QuestionaireProvider } from '@/features/questionaire/contexts/QuestionaireProvider';
import { Questions } from './routes/questionaire/Questions';
import { Result } from './routes/questionaire/Result';
import { Logout } from './routes/auth/logout';
import PrivateRoute from '@/components/private-route';
import { LearningTimeline } from './routes/Learning-Timeline';
import { UploadResume } from './routes/questionaire/UploadResume';
import { FirstTimeUserDialog } from '@/components/first-time-user-dialog';
import { DownloadResume } from './routes/Resume/DownloadResume';

const QuestionaireLayout = () => (
  <QuestionaireProvider>
    <Outlet />
  </QuestionaireProvider>
);

export const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="auth">
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="logout" element={<Logout />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="questionaire" element={<QuestionaireLayout />}>
            {/* Default route for "questionaire" */}
            <Route path="upload" element={<UploadResume />} />
            {/* Nested routes */}
            <Route path="questions" element={<Questions />} />
            <Route path="result" element={<Result />} />
          </Route>
          <Route path="timeline" element={<LearningTimeline />} />
          <Route path="resume" element={<DownloadResume />}/>
        </Route>
      </Routes>
      <FirstTimeUserDialog />
    </Router>
  );
};
