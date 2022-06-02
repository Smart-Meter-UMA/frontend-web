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

    const minFechaDefault = new Date(new Date().getTime() - 24*60*60*1000).toJSON()
    
    const [hogar, setHogar] = useState(null)
    const [dispositivos, setDispositivos] = useState(null)
    const [loadedEstadistica, isEstadisticaLoaded] = useState(false)
    const [loadedDatos, isDatosLoaded] = useState(false)
    const [radioValue, setRadioValue] = useState('1');
    const [hayDispositivos, setHayDispositivos] = useState(false);
    const [datos, setDatos] = useState([]);

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
    const handleShowCompartir = () => setShowCompartir(true);

    const [showAbandonarHogar, setShowAbandonarHogar] = useState(false);
    const handleCloseAbandonarHogar = () => setShowAbandonarHogar(false);
    const handleShowAbandonarHogar = () => setShowAbandonarHogar(true);

    //Variables para filtrar
    const [filtrarFechas,setFiltrarFechas] = useState(false);
    const [fechaDesde,setFechaDesde] = useState(null);
    const [fechaHasta,setFechaHasta] = useState(null);
    const [filtrarValores,setFiltrarValores] = useState(false);
    const [valoresMinimo,setValoresMinimo] = useState(null);
    const [valoresMaximo,setValoresMaximo] = useState(null);

    const [primerDia,setPrimerDia] = useState(null);
    const [segundoDia,setSegundoDia] = useState(null);

    const [primerDiaDatos, setPrimerDiaDatos] = useState([]);
    const [segundoDiaDatos, setSegundoDiaDatos] = useState([]);


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
                    isEstadisticaLoaded(true)
                })
                fetch(process.env.REACT_APP_BASE_URL + "dispositivos/" + data.dispositivos[0].id + "/medidas?orderBy=fecha&minDate=" + minFechaDefault, requestOptions).then
                (response => response.json()).then
                ((data) =>{
                    let aux = []
                    if(data.length !== 0){
                        data.map((dato) => {
                            let fecha = new Date(dato.fecha)
                            aux.push([fecha.toLocaleDateString()+" "+fecha.toLocaleTimeString(),dato.kw])
                        })
                    }
                    setDatos(aux)
                    isDatosLoaded(true)
                })
            }else{
                isDatosLoaded(true)
                isEstadisticaLoaded(true)
            }
        })
    }, [])

    function handleDejarCompartir(id){
        console.log(id)
        var requestOptions = {
            method: 'DELETE',
            headers: { 'Authorization' : sessionStorage.getItem("token") }
        };
        fetch(process.env.REACT_APP_BASE_URL + "compartidos/" + id, requestOptions).then
        (response => {handleClose()})
    }

    function abandonarHogar(){
        var requestOptions = {
            method: 'DELETE',
            headers: { 'Authorization' : sessionStorage.getItem("token") }
        };
        fetch(process.env.REACT_APP_BASE_URL + "compartidos/" + hogar.idCompartido , requestOptions).then
        (response => {window.location.replace("/")})
    }

    function filtrarDatos(){
        isDatosLoaded(false)
        var requestOptions = {
            method: 'GET',
            headers: { 'Authorization' : sessionStorage.getItem("token") }

        };
        let filtro = ""
        if(filtrarFechas){
            if(fechaDesde !== null){
                filtro += "&minDate="+new Date(fechaDesde).toJSON()
            }
            if(fechaHasta !== null){
                filtro += "&maxDate="+new Date(fechaHasta).toJSON()
            }
            if(fechaDesde === null && fechaHasta === null){
                filtro += "&minDate="+minFechaDefault
            }
        }else{
            filtro += "&minDate="+minFechaDefault
        }
        if(filtrarDatos){
            if(valoresMinimo !== null){
                filtro += "&minData="+valoresMinimo
            }
            if(fechaHasta !== null){
                filtro += "&maxData="+valoresMaximo
            }
        }
        fetch(process.env.REACT_APP_BASE_URL + "dispositivos/" + radioValue + "/medidas?orderBy=fecha" + filtro, requestOptions).then
        (response => response.json()).then
        ((data) =>{
            let aux = []
            if(data.length !== 0){
                data.map((dato) => {
                    let fecha = new Date(dato.fecha)
                    aux.push([fecha.toLocaleDateString()+" "+fecha.toLocaleTimeString(),dato.kw])
                })
            }
            setDatos(aux)
            isDatosLoaded(true)
        })
    }

    function limpiarDatos(e){
        setFechaDesde(null);
        setFechaHasta(null);
        setValoresMinimo(null);
        setValoresMaximo(null);
        setFiltrarFechas(false);
        setFiltrarValores(false);
    }

    function comparacionDias(){
        var requestOptions = {
            method: 'GET',
            headers: { 'Authorization' : sessionStorage.getItem("token") }
        };
        if(primerDia !== null){
            let day = new Date(primerDia)
            let fechaMinima = new Date(day.getFullYear(), day.getMonth(),day.getDate(), 2, 0, 0).toJSON()
            let fechaMaxima = new Date(day.getFullYear(), day.getMonth(),day.getDate(),25,59,59).toJSON()
            fetch(process.env.REACT_APP_BASE_URL + "dispositivos/" + radioValue + "/medidas?orderBy=fecha&minDate="+fechaMinima+"&maxDate="+fechaMaxima, requestOptions).then
            (response => response.json()).then
            ((data) =>{
                let aux = []
                if(data.length !== 0){
                    data.map((dato) => {
                        let fecha = new Date(dato.fecha)
                        aux.push([fecha.toLocaleDateString()+" "+fecha.toLocaleTimeString(),dato.kw])
                    })
                }
                setPrimerDiaDatos(aux)
            })
        }
        if(segundoDia !== null){
            let day = new Date(segundoDia)
            let fechaMinima = new Date(day.getFullYear(), day.getMonth(),day.getDate(), 2, 0, 0).toJSON()
            let fechaMaxima = new Date(day.getFullYear(), day.getMonth(),day.getDate(),25,59,59).toJSON()
            fetch(process.env.REACT_APP_BASE_URL + "dispositivos/" + radioValue + "/medidas?orderBy=fecha&minDate="+fechaMinima+"&maxDate="+fechaMaxima, requestOptions).then
            (response => response.json()).then
            ((data) =>{
                let aux = []
                if(data.length !== 0){
                    data.map((dato) => {
                        let fecha = new Date(dato.fecha)
                        aux.push([fecha.toLocaleDateString()+" "+fecha.toLocaleTimeString(),dato.kw])
                    })
                }
                setSegundoDiaDatos(aux)
            })
        } 

    }

    if(!loadedDatos && !loadedEstadistica){
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
            <Modal show={showAbandonarHogar} onHide={handleCloseAbandonarHogar}>
                    <Modal.Header closeButton>
                        <Modal.Title>¿Estas seguro que quiere dejar el hogar?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Esto será de manera permanente y no podrás volver atras.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleCloseAbandonarHogar}>Cancelar</Button>
                        <Button variant="danger" onClick={abandonarHogar}>Aceptar</Button>
                    </Modal.Footer>
            </Modal>
            <br/>
            <Container>
                <Row className="justify-content-md-center">
                    <Col xs lg="4"></Col>
                    <Col md="auto"><h1>{hogar.nombre}</h1></Col>
                    <Col xs lg="2">
                        {hogar.idCompartido === -1 &&
                            <Button onClick={() => {window.location.replace("/edicionHogar/" + hogar.id)}}>Editar</Button>}
                        {hogar.idCompartido !== -1 &&
                            <Button variant={"danger"} onClick={handleShowAbandonarHogar}>Abandonar hogar</Button>}
                    </Col>
                    <Col xs lg="2"><Button hidden={hogar.idCompartido !== -1} onClick={handleShow}>Compartidos</Button></Col>
                </Row>
                <br/>
                <Row className="justify-content-md-center">
                    <Col>
                        {!hayDispositivos &&<h3>No hay dispositivos</h3>}
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
                                    >{dispositivo.nombre}</ToggleButton>
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
                    <Col><Row>Consumido Hoy:</Row></Col>
                    <Col>{estadisticas.consumidoHoy} KWh</Col>
                    <Col><Row>Consumido Mes:</Row></Col>
                    <Col>{estadisticas.consumidoMes} KWh</Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col><Row>Medida diaria:</Row></Col>
                    <Col>{estadisticas.mediaKWHDiaria} KWh</Col>
                    <Col><Row>Medida mensual:</Row></Col>
                    <Col>{estadisticas.mediaKWHMensual} KWh</Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col><Row>Mínimo diario:</Row></Col>
                    <Col>{estadisticas.minKWHDiario} KWh</Col>
                    <Col><Row>Mínimo mensual:</Row></Col>
                    <Col>{estadisticas.minKWHMensual} KWh</Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col><Row>Máximo diario:</Row></Col>
                    <Col>{estadisticas.maxKWHDiario} KWh</Col>
                    <Col><Row>Limite máximo mensual:</Row></Col>
                    <Col>{estadisticas.maxKWHMensual} KWh</Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col sm={1}></Col>
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
                                            <Col sm={3}><Row><label><input type="checkbox" onClick={(e) => {setFiltrarFechas(!filtrarFechas)}}/> Tramos de tiempo</label></Row></Col>
                                            <Col sm={5}><Row><label><input type="checkbox" onClick={(e) => {setFiltrarValores(!filtrarValores)}}/> Valores máximos y mínimos de consumo</label></Row></Col>
                                            <Col></Col>
                                            <Col></Col>
                                            <Col></Col>
                                            <Col></Col>
                                        </Row>
                                        <br/>
                                        <Row>
                                            <Col sm={4}>
                                                <Row>
                                                    <Col><Row>Fecha inicio:</Row></Col>
                                                    <Col><Row><input type={"datetime-local"} defaultValue={fechaDesde} onChange={(e) =>{setFechaDesde(e.target.value)}}/></Row></Col>
                                                </Row>    
                                            </Col>
                                            <Col sm={1}></Col>
                                            <Col sm={4}>
                                                <Row>
                                                    <Col><Row>Fecha fin:</Row></Col>
                                                    <Col><Row><input type={"datetime-local"} defaultValue={fechaHasta} onChange={(e) =>{setFechaHasta(e.target.value)}}/></Row></Col>
                                                </Row>    
                                            </Col>
                                            <Col sm={1}></Col>
                                            <Col sm={1}><Row><Button onClick={limpiarDatos}>Limpiar</Button></Row></Col>
                                        </Row>
                                        <br/>
                                        <Row>
                                            <Col sm={4}>
                                                <Row>
                                                    <Col><Row>Valor mínimo:</Row></Col>
                                                    <Col><Row><input type={"number"} defaultValue={valoresMinimo} onChange={(e) =>{setValoresMinimo(e.target.value)}}/></Row></Col>
                                                </Row>    
                                            </Col>
                                            <Col sm={1}></Col>
                                            <Col sm={4}>
                                                <Row>
                                                    <Col><Row>Valor máximo:</Row></Col>
                                                    <Col><Row><input type={"number"}  onChange={(e) =>{setValoresMaximo(e.target.value)}}/></Row></Col>
                                                </Row>    
                                            </Col>
                                            <Col sm={1}></Col>
                                            <Col sm={1}><Row><Button onClick={filtrarDatos}>Filtrar</Button></Row></Col>
                                        </Row>
                                        <Row>
                                            <Col sm={1}></Col>
                                            <Col><AnyChart id="lineChart" width={1200} height={600} type="line" data={datos} title="KW"/></Col>
                                            <Col sm={1}></Col>
                                        </Row>
                                    </Container>
                                </Tab>
                                <Tab eventKey="estadisticas" title="Estadisticas">
                                    Profile
                                </Tab>
                                <Tab eventKey="predicciones" title="Prediciones">
                                    Predicciones
                                </Tab>
                                <Tab eventKey="compararDias" title="Comparar días">
                                    <Container>
                                        <Row>
                                            <Col sm={4}>
                                                <Row>
                                                    <Col><Row>1º Día</Row></Col>
                                                    <Col><Row><input type={"date"} onChange={(e) =>{setPrimerDia(e.target.value)}}/></Row></Col>
                                                </Row>    
                                            </Col>
                                            <Col sm={1}></Col>
                                            <Col sm={4}>
                                                <Row>
                                                    <Col><Row>2º Día</Row></Col>
                                                    <Col><Row><input type={"date"} onChange={(e) =>{setSegundoDia(e.target.value)}}/></Row></Col>
                                                </Row>    
                                            </Col>
                                            <Col sm={1}></Col>
                                            <Col sm={1}><Row><Button onClick={comparacionDias}>Buscar</Button></Row></Col>
                                        </Row>
                                        <Row>
                                            <Col><AnyChart id="lineChart1Dia" type="line" data={primerDiaDatos} width={500} height={250} /></Col>
                                            <Col><AnyChart id="lineChart2Dia" type="line" data={segundoDiaDatos} width={500} height={250} /></Col>
                                        </Row>
                                    </Container>
                                </Tab>
                            </Tabs>
                        </Row>
                    </Col>
                    <Col sm={1}></Col>
                </Row>
                </>
                )}
            </Container>        
        </>
        );
    }
    
}

export default Hogar;