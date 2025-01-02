import { Navbar } from '@/components/navbar'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from 'react-router-dom'
import { Login } from './routes/auth/Login'
import { Register } from './routes/auth/Register'
import { Landing } from './routes/Landing'
import { QuestionaireProvider } from '@/features/questionaire/contexts/QuestionaireProvider'
import { Questions } from './routes/questionaire/Questions'
import { Result } from './routes/questionaire/Result'

const QuestionaireLayout = () => (
  <QuestionaireProvider>
    <Outlet />
  </QuestionaireProvider>
)

export const AppRouter = () => {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="auth">
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="questionaire" element={<QuestionaireLayout />}>
          <Route index element={<Questions />} />
          <Route path="result" element={<Result />} />
        </Route>
      </Routes>
    </Router>
  )
}
