import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/logoSmartMeterNoFondo2.png';
import { useEffect, useState } from "react";

function BarraSup() {

  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    if(sessionStorage.getItem("token") !== null){
      var requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem("token") }
      };
      fetch(process.env.REACT_APP_BASE_URL+"login/",requestOptions).then(response => response.json()).then
      ((data) => {
        setCurrentUser(data)
      }, (error) => {
        sessionStorage.removeItem("token")
        window.location.replace("/login")
      })
    }else if (sessionStorage.getItem("token") === null && window.location.pathname !== "/login"){
      window.location.replace("/login")
  }
}, [])

  const logout = (e) => {
    sessionStorage.removeItem("token")
    window.location.replace("/login");
  }

  if(currentUser === null){
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
      <Navbar bg="dark" variant="dark">
      <Container>
      <Navbar.Brand href="/">
          <img src={logo} width="35" height="35"  className="d-inline-block align-top"/>
          {' '}
          K-Project
      </Navbar.Brand>
      <Nav>
        <NavDropdown title={"Hola, " + currentUser.nombre}>
              <NavDropdown.Item href="/perfil">Mi perfil</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logout}>Cerrar Sesión</NavDropdown.Item>
        </NavDropdown>
      </Nav>
      </Container>
    </Navbar>
    );
  }

}

export default BarraSup;