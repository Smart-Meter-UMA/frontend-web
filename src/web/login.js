import { Col, Container, Row } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import {uiConfig, firebaseExport, auth} from '../components/Firebase'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { onAuthStateChanged } from "firebase/auth";
import Loading from "../components/Loading";

function Login() {

    const [loaded, isLoaded] = useState(false)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
              window.location.replace("/")
            }else{
                isLoaded(true)
            }
        })
    }, [])

    if(!loaded){
        return <Loading />
    }else{
        return (
            <Container>
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
                   <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseExport.auth()} />
                   </Col>
                   <Col></Col>
               </Row> 
            </Container>
        );
    }

}

export default Login;