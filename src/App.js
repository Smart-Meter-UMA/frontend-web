import './App.css';
import BarraSup from './components/barraSup';
import Login from './web/login';
import { Route, Routes } from 'react-router-dom';
import Home from './web/home';
import Perfil from './web/perfil';
import Registro_Hogar from './web/registro_hogar';
import Hogar from './web/hogar';
import EdicionHogar from './web/edicionHogar';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <div className="App">
      <GoogleOAuthProvider clientId="860266555787-337c130jdi6jar97gkmomb1dq71sv02i.apps.googleusercontent.com">
      <BarraSup />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/perfil" element={<Perfil />}/>
        <Route path="/registro/hogar" element={<Registro_Hogar />}/>
        <Route path="/hogar/:id" element={<Hogar />}/>
        <Route path="/edicionHogar/:id" element={<EdicionHogar />}/>
      </Routes>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;
