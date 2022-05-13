import { useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Container, Row, ToggleButton } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import Modal from 'react-bootstrap/Modal'

function Hogar(){
    let {id} = useParams();
    const [hogar, setHogar] = useState(null)
    const [dispositivos, setDispositivos] = useState(null)
    const [loaded, isLoaded] = useState(false)
    const [radioValue, setRadioValue] = useState('1');
    const [hayDispositivos, setHayDispositivos] = useState(false);

    const [compartidos, setCompartidos] = useState([]);
    const [hayCompartidos, setHayCompartidos] = useState(false)

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        fetch(process.env.REACT_APP_BASE_URL + "hogars/" + id + "/compartidos").then
        (response => response.json()).then
        ((data) => {
            setCompartidos(data)
            if(data.length !== 0){
                setHayCompartidos(true)
            }else{
                setHayCompartidos(false)
            }
            setShow(true)
        })
    };

    useEffect(() =>{
        fetch(process.env.REACT_APP_BASE_URL + "hogars/" + id).then
        (response => response.json()).then
        ((data) => {
            setHogar(data)
            fetch(process.env.REACT_APP_BASE_URL + "hogars/" + id + "/dispositivos").then
            (response => response.json()).then
            ((data) => {
                setDispositivos(data)
                if(data.length !== 0){
                    setRadioValue(data[0].id)
                    setHayDispositivos(true)
                }else{
                    setHayDispositivos(false)
                }
                isLoaded(true)
            })
        })
    }, [])

    function handleDejarCompartir(id){
        var requestOptions = {
            method: 'DELETE'
        };
        fetch(process.env.REACT_APP_BASE_URL + "compartidos/" + id, requestOptions).then
        (response => {handleClose()})
    }

    if(!loaded){
        return <Loading />
    }else{
        return(
            <>
            <br/>
            <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Compatidos</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            {!hayCompartidos && 
                                <h5>No has compartido con nadie!</h5>
                            }
                            {hayCompartidos &&
                               compartidos.map((compartido) => (
                                   <Row>
                                       <Col>{compartido.compartido.email}</Col>
                                       <Col><Button onClick={() => {handleDejarCompartir(compartido.id)}}>Dejar de compartir</Button></Col>
                                    </Row>
                               ))
                            }
                        </Container>
                    </Modal.Body>
            </Modal>
            <Container>
                <Row className="justify-content-md-center">
                    <Col xs lg="2"></Col>
                    <Col md="auto"><h1>{hogar.nombre}</h1></Col>
                    <Col xs lg="2"><Button onClick={() => {window.location.replace("/edicionHogar/" + hogar.id)}}>Editar</Button></Col>
                    <Col xs lg="2"><Button onClick={handleShow}>Compartidos</Button></Col>
                </Row>
            </Container>
                <br/>
                {!hayDispositivos &&
                <h3>No hay dispositivos</h3>
                }
                {hayDispositivos &&
                <ButtonGroup>
                {dispositivos.map((dispositivo) => (
                    <ToggleButton
                    key={dispositivo.id}
                    id={`radio-${dispositivo.id}`}
                    type="radio"
                    variant="outline-primary"
                    name="radio"
                    checked={radioValue === dispositivo.id}
                    onChange={(e) => setRadioValue(dispositivo.id)}
                    >
                        {dispositivo.nombre}
                    </ToggleButton>
                ))}
                </ButtonGroup> 
                }
                
                
            </>
        );
    }
    
}

export default Hogar;