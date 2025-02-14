import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage.tsx'
import RegistrationPage from './pages/RegistrationPage.tsx'
import SchedulePage from './pages/SchedulePage.tsx'
import PrizePage from './pages/PrizePage.tsx'
import HistoryPage from './pages/HistoryPage.tsx'
import RealTimeTablePage from './pages/RealTimeTablePage.tsx'

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/prize" element={<PrizePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/realtime" element={<RealTimeTablePage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
