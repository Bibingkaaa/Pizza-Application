import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Favorites } from "./pages/Favorites";
const App = () => {
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/favorites" element={<Favorites />} />
    </Routes>
  )
}

export default App
