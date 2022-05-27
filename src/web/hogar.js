import { useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Container, Row, Tabs, ToggleButton } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import Modal from 'react-bootstrap/Modal'
import Tab from 'react-bootstrap/Tab'
import AnyChart from 'anychart-react'
import React from 'react'; 
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideBar from "../components/SideBar.js";


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
    const [showCompartir, setShowCompartir] = useState(false);

    const [correoInvitado, setCorreoInvitado] = useState("");

    const handleClose = () => setShow(false);
    const handleShow = () => {
        var requestOptions = {
            method: 'GET',
            headers: { 'Authorization' : sessionStorage.getItem("token") }
        };
        fetch(process.env.REACT_APP_BASE_URL + "hogars/" + id + "/compartidos",requestOptions).then
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
    const handleCloseCompartir = () => setShowCompartir(false);
    const handleShowCompartir = () => {
            setShowCompartir(true)
    };

    const InviteHogar = () => {
        var requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem("token")},
            body: JSON.stringify({"hogarInvitado": hogar, "correoInvitado": correoInvitado})
          };
          fetch(process.env.REACT_APP_BASE_URL + "ofrecerInvitacion/", requestOptions).then
          (response => response.json()).then
            ((data) =>{
                setShowCompartir(false);
                setShow(false);
                if (!data.mensaje){
                    toast.success("Has enviado una invitación a su hogar con éxito!");
                }else {
                    toast.error(data.mensaje);
                }
            })
    }

    function handleChangeDispositivo(id){
        var requestOptions = {
            method: 'GET',
            headers: { 'Authorization' : sessionStorage.getItem("token") }
        };
        fetch(process.env.REACT_APP_BASE_URL + "dispositivos/" + id, requestOptions).then
        (response => response.json()).then
        ((data) =>{
            setEstadisticas(data.estadisticas)
            setRadioValue(id)
        })
    }

    //Para estadisticas
    const [estadisticas, setEstadisticas] = useState(null);

    useEffect(() =>{
        var requestOptions = {
            method: 'GET',
            headers: { 'Authorization' : sessionStorage.getItem("token") }
        };
        fetch(process.env.REACT_APP_BASE_URL + "hogars/" + id, requestOptions).then
        (response => response.json()).then
        ((data) => {
            setHogar(data)
            setHayDispositivos(data.dispositivos.length !== 0)
            setDispositivos(data.dispositivos)
            if (data.dispositivos.length !== 0){
                setRadioValue(data.dispositivos[0].id)
                fetch(process.env.REACT_APP_BASE_URL + "dispositivos/" + data.dispositivos[0].id, requestOptions).then
                (response => response.json()).then
                ((data) =>{
                    setEstadisticas(data.estadisticas)
                    isLoaded(true)
                })
            }else{
                isLoaded(true)
            }
        })
    }, [])

    function handleDejarCompartir(id){
        var requestOptions = {
            method: 'DELETE',
            headers: { 'Authorization' : sessionStorage.getItem("token") }
        };
        fetch(process.env.REACT_APP_BASE_URL + "compartidos/" + id, requestOptions).then
        (response => {handleClose()})
    }

    if(!loaded){
        return <Loading />
    }else{
        return(
            <>
            <ToastContainer />
            <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Container>
                            <Row>
                                <Col><Modal.Title>Compatidos</Modal.Title></Col>
                                <Col><Button variant="primary" onClick={handleShowCompartir}>Invitar</Button></Col>
                            </Row>
                        </Container>
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
            <Modal show={showCompartir} onHide={handleCloseCompartir}>
                    <Modal.Header closeButton>
                        <Modal.Title>Compartir con</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Row>
                                <Col><input type="email" name="correoInvitado" onChange={(e) => setCorreoInvitado(e.target.value)} required/></Col>
                                <Col><Button onClick={InviteHogar}>Compartir</Button></Col>
                            </Row>
                        </Container>
                    </Modal.Body>
            </Modal>
            <Container>
                <Row className="justify-content-md-center">
                    <Col xs lg="2"></Col>
                    <Col md="auto"><h1>{hogar.nombre}</h1></Col>
                    <Col xs lg="2"><Button hidden={!hogar.editable} onClick={() => {window.location.replace("/edicionHogar/" + hogar.id)}}>Editar</Button></Col>
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
                    onChange={() => {handleChangeDispositivo(id)}}
                    >
                        {dispositivo.nombre}
                    </ToggleButton>
                ))}
                </ButtonGroup> 
                }
                </Col>
            </Row>
            <br/>
            {estadisticas !== null && (
                <>
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
                    <Col>{estadisticas.consumidoHoy} KW</Col>
                    <Col></Col>
                    <Col>{estadisticas.consumidoMes} KW</Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col><Row>Medida diaria:</Row></Col>
                    <Col>{estadisticas.mediaKWHDiaria} KW</Col>
                    <Col><Row>Medida mensual:</Row></Col>
                    <Col>{estadisticas.mediaKWHMensual} KW</Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col><Row>Mínimo diario:</Row></Col>
                    <Col>{estadisticas.minKWHDiario} KW</Col>
                    <Col><Row>Mínimo mensual:</Row></Col>
                    <Col>{estadisticas.minKWHMensual} KW</Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col><Row>Máximo diario:</Row></Col>
                    <Col>{estadisticas.maxKWHDiario} KW</Col>
                    <Col><Row>Limite máximo mensual:</Row></Col>
                    <Col>{estadisticas.maxKWHMensual} KW</Col>
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
                                            <Col sm={1}><Row>Filtrar por:</Row></Col>
                                            <Col sm={3}><Row><label><input type="checkbox"/> Tramos de tiempo</label></Row></Col>
                                            <Col sm={5}><Row><label><input type="checkbox"/> Valores máximos y mínimos de consumo</label></Row></Col>
                                            <Col></Col>
                                            <Col></Col>
                                            <Col></Col>
                                            <Col></Col>
                                        </Row>
                                        <Row>
                                            <Col sm={5}>
                                                <Row>
                                                    <Col><Row>Fecha inicio:</Row></Col>
                                                    <Col><Row><input type={"datetime-local"}/></Row></Col>
                                                </Row>    
                                            </Col>
                                            <Col></Col>
                                            <Col sm={5}>
                                                <Row>
                                                    <Col><Row>Fecha fin:</Row></Col>
                                                    <Col><Row><input type={"datetime-local"}/></Row></Col>
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
                                            <Col sm={5}>
                                                <Row>
                                                    <Col><Row>Valor máximo:</Row></Col>
                                                    <Col><Row><input type={"number"}/></Row></Col>
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
                                                title="KW"
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
            )}

                
                
            </>
        );
    }
    
}

export default Hogar;