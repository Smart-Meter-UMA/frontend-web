import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import {auth} from '../components/Firebase'
import { onAuthStateChanged, getAuth, deleteUser } from "firebase/auth";
import { Button } from "react-bootstrap";


function Registro_Hogar() {

    const [currentUser, setCurrentUser] = useState(null);
    const [loaded, isLoaded] = useState(false);
    const [nombre, setNombre] = useState("");
    const [potencia, setPotencia] = useState(0);
    const [hogar, setHogar] = useState(null);

    const AddHogar = () => {
      var potencia_aux = 0
      if (potencia != null && potencia != ""){
        potencia_aux = potencia
      }
      
      var requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({"nombre":nombre, "potencia_contratada":potencia_aux,"owner":currentUser})
        };
        fetch(process.env.REACT_APP_BASE_URL + "hogars/", requestOptions).then
        (response => response.json())
  }
    
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
              var requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({"email":user.email})
              };
              fetch(process.env.REACT_APP_BASE_URL + "login/", requestOptions).then
              (response => response.json()).then
              ((data) => {
                setCurrentUser(data)
                isLoaded(true)
              })
            }
        })
      }, [])

    if (!loaded){
        return <Loading />
    }else{
        return(
            <>
                <h1>Registre su nuevo hogar</h1>
                <label>Nombre: </label>
                <input type="text" name="nombre" onChange={(e) => setNombre(e.target.value)} maxLength="20" required/> <br/>
                <label>Potencia contratada: </label>
                <input type="number" name="potencia" onChange={(e) => setPotencia(e.target.value)} min="0" defaultValue={0}/> KW <br/>

                <Button variant="primary" onClick={AddHogar}>Añadir hogar</Button>
            </>
        );
    }
}

export default Registro_Hogar;