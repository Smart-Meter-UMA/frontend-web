import { useEffect, useState } from "react";
import Loading from "../components/Loading";


function Perfil() {

    const [currentUser, setCurrentUser] = useState(null);
    const [loaded, isLoaded] = useState(false);

    useEffect(() => {
        console.log('HOLA')
          var requestOptions = {
              method: 'GET',
              headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem("token") }
          };
          fetch(process.env.REACT_APP_BASE_URL + 'usuarios/2', requestOptions).then
          (response => response.json()).then
          (data => {
            setCurrentUser(data)
            console.log(data)

            isLoaded(true)
          })

      }, [])
    if (!loaded){
        return <Loading />
    }else{
        return(
            <>
                <h1>Mi perfil {currentUser.email}</h1>
                <form>
                    <label>Nombre:</label>
                    <input type={Text} required> {currentUser.nombre}</input>
                    <label>Apellidos:</label>
                    <input type={Text} required></input>
                </form>
            </>
        );
    }
}

export default Perfil;