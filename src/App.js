import './App.css';
import BarraSup from './components/barraSup';
import Login from './web/login';
import { Route, Routes } from 'react-router-dom';
import Home from './web/home';
import Perfil from './web/perfil';

function App() {
  return (
    <div className="App">
      <BarraSup />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/perfil" element={<Perfil />}/>
      </Routes>
    </div>
  );
}

export default App;
