import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Board from './pages/Board'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/board/:roomId" element={<Board />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App