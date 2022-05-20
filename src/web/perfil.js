import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { Button } from "react-bootstrap";


function Perfil() {

    const [currentUser, setCurrentUser] = useState(null);
    const [loaded, isLoaded] = useState(false);
    const [nombre, setNombre] = useState("");
    const [apellidos, setApellidos] = useState("");

    const ModifyInfo = () => {
        currentUser.nombre = nombre
        currentUser.apellidos = apellidos
        var requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem("token")},
            body: JSON.stringify({"nombre":nombre,"apellidos":apellidos})
          };
          fetch(process.env.REACT_APP_BASE_URL + "usuarios/", requestOptions).then
          (response => {window.location.replace("/perfil")})
    }
    
    const DeleteInfo = () => {
        var requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem("token")}
        };
        fetch(process.env.REACT_APP_BASE_URL + "usuarios/").then
        (response => {window.location.replace("/login")},
        error =>{})
    }

    useEffect(() => {
        var requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem("token") }
        };
        fetch(process.env.REACT_APP_BASE_URL+"login/",requestOptions).then(response => response.json()).then
        ((data) => {
            setCurrentUser(data)
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