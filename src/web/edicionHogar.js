import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";



function EdicionHogar(){
    let {id} = useParams()
    const [hogar, setHogar] = useState(null)
    const [loaded, isLoaded] = useState(false)
    useEffect(() =>{
        fetch(process.env.REACT_APP_BASE_URL + "hogars/" + id).then
        (response => response.json()).then
        ((data) => {
            setHogar(data)
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
                            <Col sm={6}><Row><input type="text" name="nombre" defaultValue={hogar.nombre}/></Row></Col>
                        </Row>
                    </Col>
                    <Col sm={3}></Col>
                </Row>
                <br/>
                <Row>
                    <Col sm={3}></Col>
                    <Col>
                        <Row>
                            <Col><Row>Potencia contratada:</Row></Col> 
                            <Col sm={6}><Row><input type="text" name="potencia_contratada" defaultValue={hogar.potencia_contratada}/></Row></Col>
                        </Row>
                    </Col>
                    <Col sm={3}></Col>
                </Row>
                <br/>
                <Row>
                    <Col sm={5}></Col>
                    <Col>
                        <Row>
                            <Col><Row><Button>Actualizar hogar</Button></Row></Col> 
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