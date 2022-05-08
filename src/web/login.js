import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import React ,{ useEffect, useState } from "react";
import GoogleLogin from 'react-google-login';
import Loading from "../components/Loading";

const CLIENT_ID = "860266555787-337c130jdi6jar97gkmomb1dq71sv02i.apps.googleusercontent.com"

function Login() {
    const [showModal, setShowModal] = useState(false);
    const [loaded, isLoaded] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    useEffect(() => {
        if (sessionStorage.getItem("token") !== null) {
          var requestOptions = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem("token") }
          };
          fetch(process.env.REACT_APP_BASE_URL + 'login/check', requestOptions).then
          (response => response.json()).then
          (data => {
            if (data.mensaje !== "caducado") {
                window.location.replace("/");
            }
            isLoaded(true) 
          })
        }else{
            isLoaded(true)
        }
      }, [])

    const responseGoogle = (response) => {
        sessionStorage.setItem('token',response.tokenId)
        var requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json','Authorization' : response.tokenId }
        };
        fetch(process.env.REACT_APP_BASE_URL+"login/",requestOptions).then(response => response.json()).then
        ((data) => {
           if(data.mensaje != null){
                console.log(data.mensaje)
           }else{
                sessionStorage.setItem("idUsuario",data.id)
                window.location.replace("/")
           }
        })
    }
    
    if(!loaded){
        return <Loading />
    }else{
        return (
            <Container>
              <Modal show={showModal} onHide={handleCloseModal} backdrop="static" >
                  <Modal.Header closeButton>
                      <Modal.Title>Error al iniciar sesión</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>Error al iniciar sesión con su cuenta de Google</Modal.Body>
                  <Modal.Footer>
                      <Button variant="primary" onClick={handleCloseModal}>De acuerdo</Button>
                  </Modal.Footer>
              </Modal>
                <br/><br/><br/><br/><br/>
               <Row>
                   <Col></Col>
                   <Col><h3>Iniciar sesion en SmartMeters</h3></Col>
                   <Col></Col>    
               </Row> 
               <br/><br/>
               <Row>
                   <Col></Col>
                   <Col>
                      <GoogleLogin
                          clientId = {CLIENT_ID}
                          buttonText="Login"
                          onSuccess={responseGoogle}
                          onFailure={handleShowModal}
                          cookiePolicy={'single_host_origin'}
                      />
                   </Col>
                   <Col></Col>
               </Row> 
            </Container>
        );
    }

}

export default Login;