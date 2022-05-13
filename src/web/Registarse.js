import { Button, Col, Container, Form, Row } from "react-bootstrap"
import {useEffect, useState} from 'react'
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"
import {auth} from '../components/Firebase'
import Loading from "../components/Loading"



function Registrarse(){
    const [user,setUser] = useState({
        username: "",
        lastname: "",
        email:"",
        password: ""
    })

    const[error, setError] = useState("")
    const[loaded, isLoaded] = useState(false)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
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
        if(user.username === ""){
            setError("No puedes tener el nombre vacio")
        }else{
            try{
                createUserWithEmailAndPassword(auth, user.email, user.password)
                .then((userCredential) => {
                    var requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json'},
                        body: JSON.stringify({"email":user.email,"username":user.username,"lastname":user.lastname})
                    };
                    fetch(process.env.REACT_APP_BASE_URL + "usuarios/",requestOptions).then
                    (response => {
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
                })
                .catch((error) => {
                    setError(error.message)
                });
            }catch (error){
                setError("Error no se ha podido registrar")
            }
        }
    };

    if(!loaded){
        return(<Loading />)
    }else{
        return(
            <Container>
                <h1>Registarse</h1>
                <br/><br/><br/><br/>
                <Row>
                    <Col></Col>
                    <Col>
                        <Row>
                            <Col>Nombre</Col>
                            <Col>
                                <Form.Control type="text" name="username" onChange={handleChange}/>
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col>Apellidos</Col>
                            <Col>
                                <Form.Control type="text" name="lastname" onChange={handleChange}/>
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col>Email</Col>
                            <Col>
                                <Form.Control type="email" name="email" onChange={handleChange}/>
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col>Password</Col>
                            <Col><Form.Control type="password" name="password" onChange={handleChange}/></Col>
                        </Row>
                        <br/>
                        <Row>
                            <Button onClick={handleSubmit}>Registrarse</Button>
                        </Row>
                    </Col>
                    <Col></Col>
                </Row>
                <br/>
                <Row>
                    <Col></Col>
                    <Col>{error !== "" && <p>{error}</p>}</Col>
                    <Col></Col>
                </Row>
            </Container>
        )
    }

}

export default Registrarse