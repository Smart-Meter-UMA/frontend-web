import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { GoogleLogin, GoogleOAuthProvider} from '@react-oauth/google';

function Login() {

    const [loaded, isLoaded] = useState(false)
    const [error, setError] = useState("")
    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    useEffect(() => {
        if(sessionStorage.getItem('token') != null){
            window.location.replace("/")
        }else{
            isLoaded(true)
        }
    }, [])

    const responseGoogleOnSuccess = (response) => {
        console.log(response.credential)
        var requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json','Authorization' : response.credential }
        };
        fetch(process.env.REACT_APP_BASE_URL+"login/",requestOptions).then(response => response.json()).then
        ((data) => {
            console.log(data)
            sessionStorage.setItem('token',response.credential)
            window.location.replace("/")
        }, (error) => {
            setError(error)
        })
    }

    if(!loaded){
        return <Loading />
    }else{
        return (
            <>
            <GoogleOAuthProvider clientId="724046535439-g4gdj010v7qdkpbcpu7qq9edjt61nbva.apps.googleusercontent.com">
                <Modal show={showModal} onHide={handleCloseModal} backdrop="static" >
                    <Modal.Header closeButton>
                        <Modal.Title>Error al iniciar sesión</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Error al iniciar sesión con su cuenta de Google</Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleCloseModal}>De acuerdo</Button>
                    </Modal.Footer>
                </Modal>
                <Container>
                <br/><br/><br/>
                <Row>
                   <Col><h3>Iniciar sesión con Smart meter</h3></Col> 
                </Row>
                <br/><br/><br/>
                <Row>
                    <GoogleLogin 
                        onSuccess={responseGoogleOnSuccess}
                        onError={() => {
                            console.log('Login Failed');
                          }}
                    />
                </Row>
                {error !== "" && <p>{error}</p>}
                
                </Container>
                </GoogleOAuthProvider>
            </>
        );
    }

}

export default Login;