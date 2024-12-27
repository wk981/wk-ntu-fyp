import { Navbar } from '@/components/navbar'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Login } from './routes/auth/Login'
import { Register } from './routes/auth/Register'
import { Landing } from './routes/Landing'
import { QuestionaireProvider } from '@/features/questionaire/contexts/QuestionaireProvider'
import { Questions } from './routes/questionaire/Questions'

export const AppRouter = () => {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <QuestionaireProvider>
              <Landing />
            </QuestionaireProvider>
          }
        />
        <Route path="auth">
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="questionaire" element={<Questions />} />
      </Routes>
    </Router>
  )
}
