import { Button, Col, Container, Row } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import {uiConfig, firebaseExport, auth} from '../components/Firebase'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import Loading from "../components/Loading";

function Login() {

    const [loaded, isLoaded] = useState(false)
    const [error, setError] = useState("")
    const [user,setUser] = useState({
        email:"",
        password: ""
    })

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user && sessionStorage.getItem("id") !== null) {
              window.location.replace("/")
            }else{
                isLoaded(true)
            }
        })
    }, [])

    const handleChange = e => {
        setUser({...user,[e.target.name]: e.target.value})
    }
    const handleSubmit = e => {
        setError("")
        try{
            signInWithEmailAndPassword(auth, user.email, user.password)
              .then((userCredential) => {
                var requestOptions2 = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify({"email":user.email})
                };
                fetch(process.env.REACT_APP_BASE_URL + "login/",requestOptions2).then
                (response => response.json()).then
                ((data) => {
                    localStorage.setItem('id',data.id)
                    localStorage.setItem('email',data.email)
                    window.location.replace("/")
                })
              })
              .catch((error) => {
                setError(error.message)
              });
        }catch (error){
            setError("Error no se ha podido registrar")
        }
    };
    const singInWithGoogle = () =>{
        let googleProvider = new GoogleAuthProvider();
        signInWithPopup(auth,googleProvider)              
        .then((userCredential) => {
            var requestOptions2 = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({"email":userCredential.user.email, "nombre":userCredential.user.displayName})
            };
            fetch(process.env.REACT_APP_BASE_URL + "login/",requestOptions2).then
            (response => response.json()).then
            ((data) => {
                console.log(data)
                sessionStorage.setItem("id",data.id)
                window.location.replace("/")
            })
          })
          .catch((error) => {
              console.log("hola")
            //setError(error.message)
          });
    }

    if(!loaded){
        return <Loading />
    }else{
        return (
            <Container>
                <br/><br/><br/>
                <Row>
                   <Col><h3>Iniciar sesión con Smart meter</h3></Col> 
                </Row>
                <br/><br/><br/>
                <Row>
                    <Col></Col>
                    <Col>
                        <Row>
                            <Col><Row>Email:</Row></Col> 
                            <Col sm={9}><Row><input type="email" name="email" onChange={handleChange}/></Row></Col>
                        </Row>
                    </Col>
                    <Col></Col>
                </Row>
                <br/>
                <Row>
                    <Col></Col>
                    <Col>
                        <Row>
                            <Col><Row>Password:</Row></Col> 
                            <Col sm={9}><Row><input type="password" name="password" onChange={handleChange}/></Row></Col>
                        </Row>
                    </Col>
                    <Col></Col>
                </Row>
                <br/>
                <Row>
                    <Col sm={5}></Col>
                    <Col>
                        <Row>
                            <Col><Button onClick={handleSubmit}>Login</Button></Col>
                            <Col><Row><a href="/registrarse">Registarse</a></Row></Col>
                        </Row>
                    </Col>
                    <Col sm={5}></Col>
                </Row>
                <br/>
                <Row>
                    <Col sm={5}></Col>
                    <Col>
                        <Row><Button onClick={singInWithGoogle}>Login with google</Button></Row>
                    </Col>
                    <Col sm={5}></Col>
                </Row>
                {error !== "" && <p>{error}</p>}
                
            </Container>
        );
    }

}

export default Login;