import { Navbar } from '@/components/navbar'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Login } from './routes/auth/Login'
import { Register } from './routes/auth/Register'
import { Landing } from './routes/Landing'

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
        {/* <Route path='questionaire'>
            <Route path='home' element = {}/>
        </Route> */}
      </Routes>
    </Router>
  )
}
