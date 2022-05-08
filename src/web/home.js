import { useEffect, useState } from "react";
import Loading from "../components/Loading";


function Home() {

    useEffect(() => {
        if (sessionStorage.getItem("token") !== null) {
          var requestOptions = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem("token") }
          };
          fetch(process.env.REACT_APP_BASE_URL + 'login/check', requestOptions).then
          (response => response.json()).then
          (data => {
            if (data.mensaje === "caducado") {
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('idUsuario');
                window.location.replace("/login");
            } 
          })
        }else{
            window.location.replace("/login");
        }
      }, [])

    return(
        <>
            Home
        </>
    );
}

export default Home;