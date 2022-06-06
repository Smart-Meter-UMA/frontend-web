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
import LoadingVentanaEmergente from "../components/LoadingVentanaEmergente";


function Hogar(){
    let {id} = useParams();

    const minFechaDefault = new Date(new Date().getTime() - 24*60*60*1000).toJSON()
    const maxFechaDefault = new Date().toJSON()

    const [loading, isLoading] = useState(false)
    
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
        isLoading(true)
        setShow(true)
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
            isLoading(false)
        })
    };
    const handleCloseCompartir = () => setShowCompartir(false);
    const handleShowCompartir = () => setShowCompartir(true);

    const [showAbandonarHogar, setShowAbandonarHogar] = useState(false);
    const handleCloseAbandonarHogar = () => setShowAbandonarHogar(false);
    const handleShowAbandonarHogar = () => setShowAbandonarHogar(true);

    const [showCompararDias, setShowCompararDias] = useState(false)
    const handleCloseCompararDias = () => setShowCompararDias(false);
    const handleShowCompararDias = () => setShowCompararDias(true);
    const [loadingCompararDias, setLoadingCompararDias] = useState(0);
    const handleCloseLoadingCompararDias = () => setLoadingCompararDias(2);
    const handleShowLoadingCompararDias = () => setLoadingCompararDias(0);

    //Variables para filtrar
    const [filtrarFechas,setFiltrarFechas] = useState(false);
    const [fechaDesde,setFechaDesde] = useState("");
    const [fechaHasta,setFechaHasta] = useState("");
    const [filtrarValores,setFiltrarValores] = useState(false);
    const [valoresMinimo,setValoresMinimo] = useState("");
    const [valoresMaximo,setValoresMaximo] = useState("");

    const [primerDia,setPrimerDia] = useState("");
    const [segundoDia,setSegundoDia] = useState("");

    const [primerDiaDatos, setPrimerDiaDatos] = useState([]);
    const [primerDiaTitle, setPrimerDiaTitle] = useState(""); 
    const [segundoDiaDatos, setSegundoDiaDatos] = useState([]);
    const [segundoDiaTitle, setSegundoDiaTitle] = useState(""); 


    const InviteHogar = () => {
        isLoading(true)
        var requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem("token")},
            body: JSON.stringify({"hogarInvitado": hogar, "correoInvitado": correoInvitado})
          };
          fetch(process.env.REACT_APP_BASE_URL + "ofrecerInvitacion/", requestOptions).then
          (response => response.json()).then
            ((data) =>{
                isLoading(false)
                handleCloseCompartir();
                handleShow();
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
                fetch(process.env.REACT_APP_BASE_URL + "dispositivos/" + data.dispositivos[0].id + "/medidas?orderBy=fecha&minDate=" + minFechaDefault+"&maxDate="+maxFechaDefault, requestOptions).then
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
        isLoading(true)
        var requestOptions = {
            method: 'DELETE',
            headers: { 'Authorization' : sessionStorage.getItem("token") }
        };
        fetch(process.env.REACT_APP_BASE_URL + "compartidos/" + id, requestOptions).then
        (response => {handleClose(); isLoading(false);})
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
                console.log(new Date(fechaDesde).toJSON())
                filtro += "&minDate="+new Date(fechaDesde).toJSON()
            }
            if(fechaHasta !== null){
                filtro += "&maxDate="+new Date(fechaHasta).toJSON()
            }
            if(fechaDesde === null && fechaHasta === null){
                filtro += "&minDate="+minFechaDefault
            }
        }else{
            filtro += "&minDate="+minFechaDefault+"&maxDate="+maxFechaDefault
        }
        if(filtrarValores){
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
            console.log(data)
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

    function limpiarDatosFiltro(e){
        setFechaDesde("");
        setFechaHasta("");
        setValoresMinimo("");
        setValoresMaximo("");
        setFiltrarFechas(false);
        setFiltrarValores(false);
    }

    function limpiarDatosCompararDias(e){
        setPrimerDia("")
        setSegundoDia("")
    }

    function comparacionDias(){
        handleShowCompararDias()
        handleShowLoadingCompararDias()
        var requestOptions = {
            method: 'GET',
            headers: { 'Authorization' : sessionStorage.getItem("token") }
        };
        if(primerDia !== null){
            let day = new Date(primerDia)
            setPrimerDiaTitle(day.toDateString())
            let fechaMinima = new Date(day.getFullYear(), day.getMonth(),day.getDate(), 2, 0, 0).toJSON()
            let fechaMaxima = new Date(day.getFullYear(), day.getMonth(),day.getDate(),25,59,59).toJSON()
            fetch(process.env.REACT_APP_BASE_URL + "dispositivos/" + radioValue + "/medidas?orderBy=fecha&minDate="+fechaMinima+"&maxDate="+fechaMaxima, requestOptions).then
            (response => response.json()).then
            ((data) =>{
                let aux = []
                if(data.length !== 0){
                    data.map((dato) => {
                        let fecha = new Date(dato.fecha)
                        aux.push({'x':fecha.toLocaleTimeString(),'value':dato.kw})
                    })
                }
                setPrimerDiaDatos(aux)
                handleCloseLoadingCompararDias()
            })
        }else{
            handleCloseLoadingCompararDias()
        }
        if(segundoDia !== null){
            let day = new Date(segundoDia)
            setSegundoDiaTitle(day.toDateString())
            let fechaMinima = new Date(day.getFullYear(), day.getMonth(),day.getDate(), 2, 0, 0).toJSON()
            let fechaMaxima = new Date(day.getFullYear(), day.getMonth(),day.getDate(),25,59,59).toJSON()
            fetch(process.env.REACT_APP_BASE_URL + "dispositivos/" + radioValue + "/medidas?orderBy=fecha&minDate="+fechaMinima+"&maxDate="+fechaMaxima, requestOptions).then
            (response => response.json()).then
            ((data) =>{
                let aux = []
                if(data.length !== 0){
                    data.map((dato) => {
                        let fecha = new Date(dato.fecha)
                        aux.push({'x':fecha.toLocaleTimeString(),'value':dato.kw})
                    })
                }
                setSegundoDiaDatos(aux)
                handleCloseLoadingCompararDias()
            })
        }else{
            handleCloseLoadingCompararDias()
        }
    }

    if(!loadedDatos && !loadedEstadistica){
        return <Loading />
    }else{
        return(
        <>
            <ToastContainer />
            <Modal show={show} onHide={handleClose}>
                {loading && (<><br/><LoadingVentanaEmergente /><br/></>)}
                {!loading && (<><Modal.Header closeButton>
                        <Container>
                            <Row>
                                <Col><Modal.Title>Compatidos</Modal.Title></Col>
                                <Col><Button variant="primary" onClick={() => {handleClose(); handleShowCompartir();}}>Invitar</Button></Col>
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
                    </Modal.Body></>)}    
            </Modal>
            <Modal show={showCompararDias} onHide={handleCloseCompararDias} size="xl">
                {loadingCompararDias != 2 && (<><br/><LoadingVentanaEmergente /><br/></>)}
                {loadingCompararDias == 2 && (<><Modal.Header closeButton><h3>Comparando días</h3></Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Row>
                                <Col><AnyChart id="lineChartPrimerDia" type="line" data={primerDiaDatos} width={500} height={250} title={primerDiaTitle}/></Col>
                                <Col><AnyChart id="lineChartSegundoDia" type="line" data={segundoDiaDatos} width={500} height={250} title={segundoDiaTitle}/></Col>
                            </Row>
                        </Container>
                    </Modal.Body></>)}    
            </Modal>
            <Modal show={showCompartir} onHide={() => {handleCloseCompartir(); handleShow();}}>
                {loading && (<><br/><LoadingVentanaEmergente /><br/></>)}
                {!loading && (<><Modal.Header closeButton>
                        <Modal.Title>Compartir con</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Row>
                                <Col><input type="email" name="correoInvitado" onChange={(e) => setCorreoInvitado(e.target.value)} required/></Col>
                                <Col><Button onClick={InviteHogar}>Compartir</Button></Col>
                            </Row>
                        </Container>
                    </Modal.Body></>)}    
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
                    <Col><Row>Media diaria:</Row></Col>
                    <Col>{estadisticas.mediaKWHDiaria} KWh</Col>
                    <Col><Row>Media mensual:</Row></Col>
                    <Col>{estadisticas.mediaKWHMensual} KWh</Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col><Row>Mínimo diario:</Row></Col>
                    {estadisticas.minKWHDiario === -1 && <Col>-</Col>}
                    {estadisticas.minKWHDiario !== -1 && <Col>{estadisticas.minKWHDiario} KWh</Col>}
                    <Col><Row>Mínimo mensual:</Row></Col>
                    {estadisticas.minKWHMensual === -1 && <Col>-</Col>}
                    {estadisticas.minKWHMensual !== -1 && <Col>{estadisticas.minKWHMensual} KWh</Col>}
                    <Col></Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col><Row>Máximo diario:</Row></Col>
                    {estadisticas.maxKWHDiario === -1 && <Col>-</Col>}
                    {estadisticas.minKWHDiario !== -1 && <Col>{estadisticas.maxKWHDiario} KWh</Col>}
                    <Col><Row>Máximo mensual:</Row></Col>
                    {estadisticas.maxKWHMensual === -1 && <Col>-</Col>}
                    {estadisticas.maxKWHMensual !== -1 && <Col>{estadisticas.maxKWHMensual} KWh</Col>}
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
                                            <Col sm={3}><Row><label><input type="checkbox" checked={filtrarFechas} onClick={(e) => {setFiltrarFechas(!filtrarFechas)}}/> Tramos de tiempo</label></Row></Col>
                                            <Col sm={5}><Row><label><input type="checkbox" checked={filtrarValores} onClick={(e) => {setFiltrarValores(!filtrarValores)}}/> Valores máximos y mínimos de consumo</label></Row></Col>
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
                                                    <Col><Row><input type={"datetime-local"} value={fechaDesde} onChange={(e) =>{setFechaDesde(e.target.value); console.log(e.target.value)}}/></Row></Col>
                                                </Row>    
                                            </Col>
                                            <Col sm={1}></Col>
                                            <Col sm={4}>
                                                <Row>
                                                    <Col><Row>Fecha fin:</Row></Col>
                                                    <Col><Row><input type={"datetime-local"} value={fechaHasta} onChange={(e) =>{setFechaHasta(e.target.value)}}/></Row></Col>
                                                </Row>    
                                            </Col>
                                            <Col sm={1}></Col>
                                            <Col sm={1}><Row><Button onClick={limpiarDatosFiltro}>Limpiar</Button></Row></Col>
                                        </Row>
                                        <br/>
                                        <Row>
                                            <Col sm={4}>
                                                <Row>
                                                    <Col><Row>Valor mínimo:</Row></Col>
                                                    <Col><Row><input type={"number"} value={valoresMinimo} onChange={(e) =>{setValoresMinimo(e.target.value)}}/></Row></Col>
                                                </Row>    
                                            </Col>
                                            <Col sm={1}></Col>
                                            <Col sm={4}>
                                                <Row>
                                                    <Col><Row>Valor máximo:</Row></Col>
                                                    <Col><Row><input type={"number"} value={valoresMaximo} onChange={(e) =>{setValoresMaximo(e.target.value)}}/></Row></Col>
                                                </Row>    
                                            </Col>
                                            <Col sm={1}></Col>
                                            <Col sm={1}><Row><Button onClick={filtrarDatos}>Filtrar</Button></Row></Col>
                                        </Row>
                                        <br/>
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
                                            <Col sm={3}>
                                                <Row>
                                                    <Col><Row>1º Día</Row></Col>
                                                    <Col><Row><input type={"date"} value={primerDia} onChange={(e) =>{setPrimerDia(e.target.value)}}/></Row></Col>
                                                </Row>    
                                            </Col>
                                            <Col sm={1}></Col>
                                            <Col sm={3}>
                                                <Row>
                                                    <Col><Row>2º Día</Row></Col>
                                                    <Col><Row><input type={"date"} value={segundoDia} onChange={(e) =>{setSegundoDia(e.target.value)}}/></Row></Col>
                                                </Row>    
                                            </Col>
                                            <Col sm={1}></Col>
                                            <Col sm={1}><Row><Button onClick={comparacionDias}>Buscar</Button></Row></Col>
                                            <Col sm={1}></Col>
                                            <Col sm={1}><Row><Button onClick={limpiarDatosCompararDias}>Limpiar</Button></Row></Col>
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