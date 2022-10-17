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
import ValoresEnergia from './web/valoresEnergia';
import AddTarifa from './web/addTarifa';
import React, { useEffect, useState, Component } from "react";

function App() {
  return (
    <div className="App">
      <BarraSup />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/valoresEnergia" element={<ValoresEnergia />}/>
        <Route path="/perfil" element={<Perfil />}/>
        <Route path="/registro/hogar" element={<Registro_Hogar />}/>
        <Route path="/hogar/:id" element={<Hogar />}/>
        <Route path="/edicionHogar/:id" element={<EdicionHogar />}/>
        <Route path="/addTarifa" element={<AddTarifa />} />
      </Routes>
    </div>
  );
}

export default App;
