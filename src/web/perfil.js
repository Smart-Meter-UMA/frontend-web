import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Perfil() {

    const [currentUser, setCurrentUser] = useState(null);
    const [loaded, isLoaded] = useState(false);
    const [nombre, setNombre] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [notificaciones, setNotificaciones] = useState(false)

    const ModifyInfo = () => {
        if(nombre !== ""){
            var requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem("token")},
                body: JSON.stringify({"nombre":nombre,"apellidos":apellidos,"notificacion_invitados":notificaciones})
              };
              fetch(process.env.REACT_APP_BASE_URL + "usuarios/" + currentUser.id, requestOptions).then
              (response => {toast.success("Se ha actualizado el perfil correctamente"); window.location.replace("/perfil")})
        }else{
            toast.error("El nombre no puede quedar vacio")
        }
    }
    
    const DeleteInfo = () => {
        var requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem("token")}
        };
        fetch(process.env.REACT_APP_BASE_URL + "usuarios/" + currentUser.id, requestOptions).then
        (response => {window.location.replace("/login")})
    }

    useEffect(() => {
        var requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem("token") }
        };
        fetch(process.env.REACT_APP_BASE_URL+"login/",requestOptions).then(response => response.json()).then
        ((data) => {
            setCurrentUser(data)
            setNombre(data.nombre)
            setApellidos(data.apellidos)
            setNotificaciones(data.notificacion_invitados)
            isLoaded(true)
        })
      }, [])

    if (!loaded){
        return <Loading />
    }else{
        return(
            <>
                <ToastContainer />
                <br/>
                <Container>
                    <Row><h1>Mi perfil</h1></Row>
                    <br/>
                    <Row>
                        <Col></Col>
                        <Col><Row>Nombre:</Row></Col>
                        <Col><Row><input type="text" defaultValue={currentUser.nombre} name="nombre" onChange={(e) => setNombre(e.target.value)} required/></Row></Col>
                        <Col></Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col></Col>
                        <Col><Row>Apellidos:</Row></Col>
                        <Col><Row><input type="text" defaultValue={currentUser.apellidos} name="apellidos" onChange={(e) => setApellidos(e.target.value)}  required/> </Row></Col>
                        <Col></Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col></Col>
                        <Col><Row>Email:</Row></Col>
                        <Col><Row><input type="text" defaultValue={currentUser.email} name="email" disabled/> </Row></Col>
                        <Col></Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col sm={2}></Col>
                        <Col>
                            <Row>
                                <Col sm={1}></Col>
                                <Col sm={7}>¿Desea recibir notificaciones sobre las invitaciones que recibe?</Col>
                                <Col sm={1}>
                                    {notificaciones === true && "Si"}
                                    {notificaciones === false && "No"}
                                </Col>
                                <Col sm={1}><Form.Check type="switch" id="custom-switch" checked={notificaciones} onClick={() => {setNotificaciones(!notificaciones)}}/></Col>
                            </Row>
                        </Col>
                        <Col sm={2}></Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col sm={5}></Col>
                        <Col>
                            <Row><Button variant="primary" onClick={ModifyInfo}>Actualizar</Button></Row>
                        </Col>
                        <Col sm={5}></Col>
                    </Row>
                    <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                    <Row>
                        <Col sm={2}><Row><Button variant="danger" onClick={DeleteInfo}>Darse de baja</Button></Row></Col>
                        <Col sm={6}></Col>
                        <Col sm={6}></Col>
                        <Col sm={6}></Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default Perfil;