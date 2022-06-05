import { Container, Nav, Navbar, NavDropdown, Row, Col, Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/logoSmartMeterNoFondo2.png';
import { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal'
import LoadingVentanaEmergente from "./LoadingVentanaEmergente";

function BarraSup() {
  const [loading, isLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState(null);
  const [hogares, setHogares] = useState(null);
  const [show, setShow] = useState(false);
  const [hayInvitaciones, setHayInvitaciones] = useState(false);
  const [invitaciones, setInvitaciones] = useState([])
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const obtenerInvitaciones = () => {
    var requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem("token") }
    };
    fetch(process.env.REACT_APP_BASE_URL + "invitacionsRecibidas/",requestOptions).then
    (response => { 
      if(response.status === 401){
        sessionStorage.removeItem("token")
        window.location.replace("/login");
      }else{
        return response.json()
      }
    }).then
    ((data) => {
        setInvitaciones(data)
        if(data.length !== 0){
            setHayInvitaciones(true)
        }
        handleShow()
  })}
  function aceptarInvitacion(id, hogar){
    isLoading(true)
    var requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem("token")},
        body: JSON.stringify({"hogarCompartido":hogar})
    };
    fetch(process.env.REACT_APP_BASE_URL + "compartidos/", requestOptions).then
    (response => {
      window.location.reload()
    })
}

function rechazarInvitacion(id, hogar){
    isLoading(true)
    var requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem("token")}
    };
    fetch(process.env.REACT_APP_BASE_URL + "invitacions/" + id, requestOptions).then
                (response => {
            window.location.reload()
        })
}
  useEffect(() => {
    if(sessionStorage.getItem("token") !== null){
      var requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem("token") }
      };
      fetch(process.env.REACT_APP_BASE_URL+"login/",requestOptions).then(response => { 
        if(response.status === 401){
          sessionStorage.removeItem("token")
          window.location.replace("/login");
        }else{
          return response.json()
        }
      }).then((data) => {
        setCurrentUser(data)
      }, (error) => {
        sessionStorage.removeItem("token")
        window.location.replace("/login")
      })
      var requestOptions2 = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem("token") }
      };
      fetch(process.env.REACT_APP_BASE_URL+"hogars/",requestOptions2).then(response => response.json()).then
      ((data) => {
        setHogares(data)
      })
    }else if (sessionStorage.getItem("token") === null && window.location.pathname !== "/login"){
      window.location.replace("/login")
  }
}, [])

  const logout = (e) => {
    sessionStorage.removeItem("token")
    window.location.replace("/login");
  }

  if(currentUser === null || hogares === null){
    return(
      <Navbar bg="dark" variant="dark">
      <Container>
      <Navbar.Brand href="/">
          <img src={logo} width="35" height="35"  className="d-inline-block align-top"/>
          {' '}
          K-Project
      </Navbar.Brand>
      </Container>
    </Navbar>
    )
  }else{
    return (
      <>
        <Modal show={show} onHide={handleClose} size="lg">
          {loading && (<><br/><LoadingVentanaEmergente /><br/></>)}
          {!loading && (<>          
          <Modal.Header closeButton><Modal.Title>Invitaciones</Modal.Title></Modal.Header>
          <Modal.Body>
              <Container>
                  {!hayInvitaciones && 
                      <h5>No tienes invitaciones!</h5>
                  }
                  {hayInvitaciones &&
                      invitaciones.map((invitacion) => (
                        <>
                          <Row>
                              <Col sm={3}>{invitacion.ofertante.email}</Col>
                              <Col sm={3}>{invitacion.hogarInvitado.nombre}</Col>
                              <Col sm={3}><Button onClick={() => {aceptarInvitacion(invitacion.id, invitacion.hogarInvitado)}}>Aceptar</Button>{' '}</Col>
                              <Col sm={3}><Button variant="danger" onClick={() => {rechazarInvitacion(invitacion.id, invitacion.hogarInvitado)}}>Denegar</Button>{' '}</Col>
                          </Row>
                          <br/>
                          </>
                      ))
                  }
              </Container>
          </Modal.Body></>)}
        </Modal>
      <Navbar bg="dark" variant="dark">
      <Container>
      <Navbar.Brand href="/">
          <img src={logo} width="35" height="35"  className="d-inline-block align-top"/>
          {' '}
          K-Project
      </Navbar.Brand>
      <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="me-auto">
        <NavDropdown title="Hogares" id="basic-nav-dropdown">
          {hogares.map((hogar) => (
            <NavDropdown.Item href={"/hogar/"+hogar.id}>{hogar.nombre}</NavDropdown.Item>
          ))}
          {hogares.length !== 0 &&  <NavDropdown.Divider />}
          <NavDropdown.Item href="/registro/hogar">Nuevo hogar</NavDropdown.Item>
        </NavDropdown>
      </Nav>
      </Navbar.Collapse>
      <Nav>
        <Nav.Link onClick={obtenerInvitaciones}>Ver invitaciones</Nav.Link>

        <NavDropdown title={"Hola, " + currentUser.nombre}>
              <NavDropdown.Item href="/perfil">Mi perfil</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logout}>Cerrar Sesión</NavDropdown.Item>
        </NavDropdown>
      </Nav>
      </Container>
    </Navbar>
    </>
    );
  }

}

export default BarraSup;