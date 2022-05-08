import './App.css';
import BarraSup from './components/barraSup';
import Login from './web/login';
import { Route, Routes } from 'react-router-dom';
import Home from './web/home';

function App() {
  return (
    <div className="App">
      <BarraSup />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
      </Routes>
    </div>
  );
}

export default App;
