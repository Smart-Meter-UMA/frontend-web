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
        fetch(process.env.REACT_APP_BASE_URL + "usuarios/" + sessionStorage.getItem("id") + "/invitacions").then
        (response => response.json()).then
        ((data) => {
            setInvitaciones(data)
            console.log(data)
            if(data.length !== 0){
                setHayInvitaciones(true)
            }
            isLoaded(true)
        })
      }, [])

    function aceptarInvitacion(id, hogar, currentUser){
        var requestOptions = {
            method: 'DELETE'
        };
        fetch(process.env.REACT_APP_BASE_URL + "invitacions/" + id, requestOptions).then
        (response => {
            var requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({"compartido":currentUser,"hogarCompartido":hogar})
            };
            fetch(process.env.REACT_APP_BASE_URL + "compartidos/", requestOptions).then
            (response => {
                window.location.replace("/")
            })
        })
    }
    
    if(!loaded){
        return <Loading />
    }else{
        return(
            <>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Invitaciones</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            {!hayInvitaciones && 
                                <h5>No tienes invitaciones!</h5>
                            }
                            {hayInvitaciones &&
                               invitaciones.map((invitacion) => (
                                   <Row>
                                       <Col>{invitacion.invitante.email}</Col>
                                       <Col>{invitacion.hogarInvitado.nombre}</Col>
                                       <Col><Button onClick={() => {aceptarInvitacion(invitacion.id, invitacion.hogarInvitado, invitacion.invitado)}}>Aceptar</Button>{' '}</Col>
                                       <Col><Button>Denegar</Button>{' '}</Col>
                                   </Row>
                               ))
                            }
                        </Container>
                    </Modal.Body>
                </Modal>
            </>
        )
    }
}

export default Home;