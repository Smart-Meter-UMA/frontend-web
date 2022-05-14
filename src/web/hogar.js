import { useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Container, Row, Tabs, ToggleButton } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import Modal from 'react-bootstrap/Modal'
import Tab from 'react-bootstrap/Tab'
import AnyChart from 'anychart-react'

function Hogar(){
    let {id} = useParams();
    const [hogar, setHogar] = useState(null)
    const [dispositivos, setDispositivos] = useState(null)
    const [loaded, isLoaded] = useState(false)
    const [radioValue, setRadioValue] = useState('1');
    const [hayDispositivos, setHayDispositivos] = useState(false);

    const [compartidos, setCompartidos] = useState([]);
    const [hayCompartidos, setHayCompartidos] = useState(false)

    const [key, setKey] = useState('filtrar');

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
            <Row>
                <Col>
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
                </Col>
            </Row>
            <br/>
            <Row>
                <Col></Col>
                <Col>
                    Consumido de hoy: 
                </Col>
                <Col>
                    Consumido de este mes:
                </Col>
                <Col></Col>
            </Row>
            <Row>
            <Col></Col>
                <Col></Col>
                <Col>
                    10 KW/h
                </Col>
                <Col>
                </Col>
                <Col>
                    200 KW/h
                </Col>
                <Col></Col>
                <Col></Col>
            </Row>
            <Row>
                <Col></Col>
                <Col><Row>Medida diaria:</Row></Col>
                <Col>
                    10 KW/h
                </Col>
                <Col><Row>Medida mensual:</Row></Col>
                <Col>
                    200 KW/h
                </Col>
                <Col></Col>
                <Col></Col>
            </Row>
            <Row>
            <Col></Col>
                <Col><Row>Limite minimo diario:</Row></Col>
                <Col>
                    10 KW/h
                </Col>
                <Col>
                   <Row>Limite minimo mensual:</Row>
                </Col>
                <Col>
                    200 KW/h
                </Col>
                <Col></Col>
                <Col></Col>
            </Row>
            <Row>
            <Col></Col>
                <Col><Row>Limite máximo diario:</Row></Col>
                <Col>
                    10 KW/h
                </Col>
                <Col>
                   <Row>Limite máximo mensual:</Row>
                </Col>
                <Col>
                    200 KW/h
                </Col>
                <Col></Col>
                <Col></Col>
            </Row>
            <Row>
                <Col sm={2}></Col>
                <Col>
                    <Row>
                        <Tabs
                            id="controlled-tab-example"
                            activeKey={key}
                            onSelect={(k) => setKey(k)}
                            className="mb-3"
                        >
                            <Tab eventKey="filtrar" title="Filtrar">
                                <Container>
                                    <Row>
                                        <Col><Row>Filtrar por:</Row></Col>
                                        <Col sm={2}><Row><label><input type="checkbox"/>Tramos de tiempo</label></Row></Col>
                                        <Col sm={4}><Row><label><input type="checkbox"/>Valores máximos y mínimos de consumo</label></Row></Col>
                                        <Col></Col>
                                        <Col></Col>
                                        <Col></Col>
                                        <Col></Col>
                                    </Row>
                                    <Row>
                                        <Col sm={4}>
                                            <Row>
                                                <Col><Row>Fecha de inicio:</Row></Col>
                                                <Col><Row><input type={"datetime-local"}/></Row></Col>
                                            </Row>    
                                        </Col>
                                        <Col></Col>
                                        <Col sm={7}>
                                            <Row>
                                                <Col><Row>Fecha fin:</Row></Col>
                                                <Col><Row><input type={"datetime-local"}/></Row></Col>
                                                <Col></Col>
                                                <Col></Col>
                                                <Col></Col>
                                                <Col></Col>
                                            </Row>    
                                        </Col>
                                    </Row>
                                    <br/>
                                    <Row>
                                        <Col sm={4}>
                                            <Row>
                                                <Col><Row>Valor mínimo:</Row></Col>
                                                <Col><Row><input type={"number"}/></Row></Col>
                                            </Row>    
                                        </Col>
                                        <Col></Col>
                                        <Col sm={7}>
                                            <Row>
                                                <Col><Row>Valor máximo:</Row></Col>
                                                <Col><Row><input type={"number"}/></Row></Col>
                                                <Col></Col>
                                                <Col></Col>
                                                <Col></Col>
                                            </Row>    
                                        </Col>
                                    </Row>
                                    <Row>
                                        <AnyChart
                                            id="lineChart"
                                            width={800}
                                            height={600}
                                            type="line"
                                            data={[[2,3],[3,5]]}
                                            title="KW/H"
                                        />
                                    </Row>
                                </Container>
                            </Tab>
                            <Tab eventKey="estadisticas" title="Estadisticas">
                                Profile
                            </Tab>
                            <Tab eventKey="predicciones" title="Prediciones">
                                Contact
                            </Tab>
                        </Tabs>

                    </Row>
                </Col>
                <Col sm={2}></Col>
            </Row>
                
                
            </>
        );
    }
    
}

export default Hogar;