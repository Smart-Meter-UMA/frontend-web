import { useEffect, useState } from "react";
import Loading from '../components/Loading'
import Modal from 'react-bootstrap/Modal'
import { Button, Col, Container, Row } from "react-bootstrap";
function Home() {
    const [loaded,isLoaded] = useState(false);
    const [hayInvitaciones, setHayInvitaciones] = useState(false);
    const [invitaciones, setInvitaciones] = useState([])

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        var requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem("token") }
        };
        fetch(process.env.REACT_APP_BASE_URL + "invitacionsRecibidas/",requestOptions).then
        (response => response.json()).then
        ((data) => {
            setInvitaciones(data)
            if(data.length !== 0){
                setHayInvitaciones(true)
            }
            isLoaded(true)
        })
      }, [])

    function aceptarInvitacion(id, hogar){
        var requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem("token")},
            body: JSON.stringify({"hogarCompartido":hogar})
        };
        fetch(process.env.REACT_APP_BASE_URL + "compartidos/", requestOptions).then
        (response => {
            window.location.replace("/")
        })
    }

    function rechazarInvitacion(id, hogar){
        var requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem("token")}
        };
        fetch(process.env.REACT_APP_BASE_URL + "invitacions/" + id, requestOptions).then
                    (response => {
                window.location.replace("/")
            })
    }
    
    if(!loaded){
        return <Loading />
    }else{
        return(
            <>
                Home
            </>
        )
    }
}

export default Home;