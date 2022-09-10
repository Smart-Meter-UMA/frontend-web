import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { Button, Col, Container, Row } from "react-bootstrap";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Registro_Hogar() {
    const [loaded, isLoaded] = useState(false);
    const [nombre, setNombre] = useState("");
    const [potencia, setPotencia] = useState(0);

    const AddHogar = () => {
      var potencia_aux = 0
      if (potencia != null && potencia != ""){
        potencia_aux = potencia
      }
      if(nombre !== ""){
        var requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem("token")},
          body: JSON.stringify({"nombre":nombre, "potencia_contratada":potencia_aux})
        };
        fetch(process.env.REACT_APP_BASE_URL + "hogars/", requestOptions).then
        (response => response.json()).then
        ((data) => {
          if(data.id){
            window.location.replace("/hogar/"+data.id)
          }else{
              toast.error("No se ha podido crear correctamente")
          }
        })
      }else{
        toast.error("El nombre del hogar no puede ser vacio")
      }

  }
  useEffect(() => {
    if(sessionStorage.getItem("token") !== null){
      isLoaded(true)
    }
  },[])

    if (!loaded){
        return <Loading />
    }else{
        return(
            <>
              <ToastContainer />
              <Container>
                <br/>
                <Row><h1>Registre su nuevo hogar</h1></Row>
                <br/>
                <Row>
                  <Col sm={3}></Col>
                    <Col>
                        <Row>
                            <Col><Row>Nombre:</Row></Col> 
                            <Col sm={6}><Row><input type="text" name="nombre" onChange={(e) => setNombre(e.target.value)} maxLength="20" required/></Row></Col>
                        </Row>
                    </Col>
                    <Col sm={3}></Col>
                </Row>
                <br/>
                <Row>
                  <Col sm={3}></Col>
                    <Col>
                        <Row>
                            <Col><Row>Potencia contratada (KW):</Row></Col> 
                            <Col sm={6}><Row><input type="number" name="potencia" onChange={(e) => setPotencia(e.target.value)} min="0" defaultValue={0}/></Row></Col>
                        </Row>
                    </Col>
                    <Col sm={3}></Col>
                </Row>
                <br/>
                <Row>
                    <Col sm={5}></Col>
                    <Col>
                        <Row>
                            <Col><Row><Button variant="primary" onClick={AddHogar}>Añadir hogar</Button></Row></Col> 
                        </Row>
                    </Col>
                    <Col sm={5}></Col>
                </Row>
              </Container>
                
            </>
        );
    }
}

export default Registro_Hogar;