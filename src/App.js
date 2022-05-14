import './App.css';
import BarraSup from './components/barraSup';
import Login from './web/login';
import { Route, Routes } from 'react-router-dom';
import Home from './web/home';
import Perfil from './web/perfil';
import Registro_Hogar from './web/registro_hogar';
import Hogar from './web/hogar';
import EdicionHogar from './web/edicionHogar';
import Registrarse from './web/Registarse';

function App() {
  return (
    <div className="App">
      <BarraSup />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/registrarse" element={<Registrarse />}/>
        <Route path="/perfil" element={<Perfil />}/>
        <Route path="/registro/hogar" element={<Registro_Hogar />}/>
        <Route path="/hogar/:id" element={<Hogar />}/>
        <Route path="/edicionHogar/:id" element={<EdicionHogar />}/>
      </Routes>
    </div>
  );
}

export default App;
