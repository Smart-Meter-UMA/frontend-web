import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";



function EdicionHogar(){
    let {id} = useParams()

    const [hogar, setHogar] = useState(null)
    const [loaded, isLoaded] = useState(false)
    const [nombre, setNombre] = useState("");
    const [potencia_contratada, setPotencia_contratada] = useState(null);
    useEffect(() =>{
        fetch(process.env.REACT_APP_BASE_URL + "hogars/" + id).then
        (response => response.json()).then
        ((data) => {
            setHogar(data)
            setNombre(data.nombre)
            setPotencia_contratada(data.potencia_contratada)
            isLoaded(true)
        })
    }, [])

    const handleSubmitEliminacion = e => {
        var requestOptions = {
            method: 'DELETE'
        };
        fetch(process.env.REACT_APP_BASE_URL + "hogars/" + id, requestOptions).then
        (response => {window.location.replace("/")})
    }

    const ModifyHogar = () => {
        hogar.nombre = nombre
        if (potencia_contratada == null || potencia_contratada == ""){
            setPotencia_contratada(0)
        }
        hogar.potencia_contratada = potencia_contratada
        var requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(hogar)
          };
          fetch(process.env.REACT_APP_BASE_URL + "hogars/"+hogar.id, requestOptions).then
          (response => {window.location.replace("/hogar/"+hogar.id)})
    }

    if(!loaded){
        return(<Loading />)
    }else{
        return(
            <>
            <br/>
            <Container>
                <Row>
                    <Col><h1>Hogar: {hogar.nombre}</h1></Col>
                </Row>
                <br/>
                <Row>
                    <Col sm={3}></Col>
                    <Col>
                        <Row>
                            <Col><Row>Nombre:</Row></Col> 
                            <Col sm={6}><Row><input type="text" name="nombre" defaultValue={hogar.nombre} onChange={(e) => setNombre(e.target.value)} maxLength="20" required/></Row></Col>
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
                            <Col sm={6}><Row><input type="text" name="potencia_contratada" defaultValue={hogar.potencia_contratada} onChange={(e) => setPotencia_contratada(e.target.value)} min="0"/></Row> </Col>
                        </Row>
                    </Col>
                    <Col sm={3}></Col>
                </Row>
                <br/>
                <Row>
                    <Col sm={5}></Col>
                    <Col>
                        <Row>
                            <Col><Row><Button onClick={ModifyHogar}>Actualizar hogar</Button></Row></Col> 
                        </Row>
                    </Col>
                    <Col sm={5}></Col>
                </Row>
                <br/>
                <Row>
                    <Col sm={5}></Col>
                    <Col>
                        <Row>
                            <Col><Row><Button variant="danger" onClick={handleSubmitEliminacion}>Eliminar hogar</Button></Row></Col> 
                        </Row>
                    </Col>
                    <Col sm={5}></Col>
                </Row>
            </Container>
                
            </>
        )
    }

}

export default EdicionHogar;