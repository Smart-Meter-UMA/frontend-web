import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { Button, Col, Container, Row, ToggleButton, ToggleButtonGroup } from "react-bootstrap";


function Perfil() {

    const [currentUser, setCurrentUser] = useState(null);
    const [loaded, isLoaded] = useState(false);
    const [nombre, setNombre] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [notificaciones, setNotificaciones] = useState(false)

    const ModifyInfo = () => {
        var requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem("token")},
            body: JSON.stringify({"nombre":nombre,"apellidos":apellidos,"notificacion_invitados":notificaciones})
          };
          fetch(process.env.REACT_APP_BASE_URL + "usuarios/" + currentUser.id, requestOptions).then
          (response => {window.location.replace("/perfil")})
    }
    
    const DeleteInfo = () => {
        var requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem("token")}
        };
        fetch(process.env.REACT_APP_BASE_URL + "usuarios/" + currentUser.id, requestOptions).then
        (response => {window.location.replace("/login")},
        error =>{})
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
                    <br/>
                <Container>
                    <Row><h1>Mi perfil {currentUser.email}</h1></Row>
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
                        <Col sm={2}></Col>
                        <Col>
                            ¿Desea recibir notificaciones sobre las invitaciones que recibe?{' '}
                            <ToggleButtonGroup type="radio" name="options" defaultValue={notificaciones?1:2}>
                                <ToggleButton id="tbg-radio-1" value={1}  variant={"outline-success"} onClick={() => setNotificaciones(true)}>
                                    Si
                                </ToggleButton>
                                <ToggleButton id="tbg-radio-2" value={2} variant={"outline-danger"} onClick={() => setNotificaciones(false)}>
                                    No
                                </ToggleButton>
                            </ToggleButtonGroup>
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
                    <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
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