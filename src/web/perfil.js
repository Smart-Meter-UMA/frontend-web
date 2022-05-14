import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import {auth} from '../components/Firebase'
import { onAuthStateChanged, getAuth, deleteUser } from "firebase/auth";
import { Button } from "react-bootstrap";


function Perfil() {

    const [currentUser, setCurrentUser] = useState(null);
    const [loaded, isLoaded] = useState(false);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellidos, setApellidos] = useState("");

    const ModifyInfo = () => {
        currentUser.nombre = nombre
        currentUser.apellidos = apellidos
        var requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(currentUser)
          };
          fetch(process.env.REACT_APP_BASE_URL + "usuarios/"+currentUser.id, requestOptions).then
          (response => {window.location.replace("/perfil")})
    }
    
    const DeleteInfo = () => {
        try{
            const auth = getAuth();
            const user = auth.currentUser;
            deleteUser(user).then(() => {
                var requestOptions = {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json'}
                };
                fetch(process.env.REACT_APP_BASE_URL + "usuarios/" + currentUser.id,requestOptions).then
                (response => window.location.replace("/login"))
              }).catch((error) => {
              });
        }catch (error){
            console.log(error)
        }
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user && sessionStorage.getItem("id") !== null) {
                fetch(process.env.REACT_APP_BASE_URL + "usuarios/" + sessionStorage.getItem("id")).then
                (response => response.json()).then
                ((data) => {
                  setCurrentUser(data)
                  setNombre(data.nombre)
                  setApellidos(data.apellidos)
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
                <h1>Mi perfil {currentUser.email}</h1>
                <label>Nombre: </label>
                <input type="text" defaultValue={currentUser.nombre} name="nombre" onChange={(e) => setNombre(e.target.value)} required/> 
                <label>Apellidos: </label>
                <input type="text" defaultValue={currentUser.apellidos} name="apellidos" onChange={(e) => setApellidos(e.target.value)}  required/> 
                <Button variant="primary" onClick={ModifyInfo}>Actualizar</Button>

                <Button variant="danger" onClick={DeleteInfo}>Darse de baja</Button>
            </>
        );
    }
}

export default Perfil;