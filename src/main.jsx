import { createRoot } from 'react-dom/client'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from './pages/home/home'
import ManagePage from './pages/manage/manage';
import './index.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/manage" element={<ManagePage/>}/>
    </Routes>
  </BrowserRouter>
)