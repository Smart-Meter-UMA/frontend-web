import { useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Container, FormGroup, Row, Table, ToggleButton} from "react-bootstrap";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import Modal from 'react-bootstrap/Modal'
import AnyChart from 'anychart-react'
import React from 'react'; 
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideBar from "../components/SideBar.js";
import LoadingVentanaEmergente from "../components/LoadingVentanaEmergente";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

function Hogar(){
    let {id} = useParams();
    const minFechaDefault = obtenerFormatoFecha(new Date(new Date().getTime() - 24*60*60*1000))
    const maxFechaDefault = obtenerFormatoFecha(new Date())
    const [loading, isLoading] = useState(false)

    const [hogar, setHogar] = useState(null)
    const [dispositivos, setDispositivos] = useState(null)
    const [loadedEstadistica, isEstadisticaLoaded] = useState(false)
    const [loadedDatos, isDatosLoaded] = useState(false)
    const [radioValue, setRadioValue] = useState('1');
    const [hayDispositivos, setHayDispositivos] = useState(false);
    const [datos, setDatos] = useState([]);

    const [xAxisFiltro, setxAxisFiltro] = useState(false)


    const [tituloGraficaTramosHoras, setTituloGraficaTramosHoras] = useState(null)
    const [tituloGraficaTramosSemanales, setTituloGraficaTramosSemanales] = useState(null)
    const [tituloGraficaTramosMensuales, setTituloGraficaTramosMensuales] = useState(null)

    const [datosTramosHorarios, setdatosTramosHorarios] = useState([]);
    const [radioValueTramosHorarios, setRadioValueTramosHorarios] = useState('1');

    const [datosTramosSemanales, setdatosTramosSemanales] = useState([]);
    const [radioValueTramosSemanales, setRadioValueTramosSemanales] = useState('1');

    const [datosTramosMensuales, setdatosTramosMensuales] = useState([]);
    const [radioValueTramosMensuales, setRadioValueTramosMensuales] = useState('1');

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

    function poner0(val){return val > 9 ? val : "0" + val }

    function obtenerFormatoFecha(fecha){return fecha.getFullYear()+"-"+poner0(fecha.getMonth() + 1)+"-"+poner0(fecha.getDate())+"T"+poner0(fecha.getHours())+":"+poner0(fecha.getMinutes())}

    function fechaEstadistica(fecha){
        let date = new Date(fecha)
        return poner0(date.getDate()) + "/" + poner0(date.getMonth() + 1) + "/" + date.getFullYear()
    }

    function formarFechaFiltro(fecha){
        return fecha.getFullYear()+"-"+poner0(fecha.getMonth())+"-"+poner0(fecha.getDate())+"T"
    }

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

    function stringMes(value){
        if (value==1){
            return "Enero"
        }else if(value==2){
            return "Febrero"
        }else if(value==3){
            return "Marzo"
        }else if(value==4){
            return "Abril"
        }else if(value==5){
            return "Mayo"
        }else if(value==6){
            return "Junio"
        }else if(value==7){
            return "Julio"
        }else if(value==8){
            return "Agosto"
        }else if(value==9){
            return "Septiembre"
        }else if(value==10){
            return "Octubre"
        }else if(value==11){
            return "Noviembre"
        }else if(value==12){
            return "Diciembre"
        }
    }

    function stringSemanal(value){
        if (value==0){
            return "Lunes"
        }else if(value==1){
            return "Martes"
        }else if(value==2){
            return "Miercoles"
        }else if(value==3){
            return "Jueves"
        }else if(value==4){
            return "Viernes"
        }else if(value==5){
            return "Sabado"
        }else if(value==6){
            return "Domingo"
        }
    }
    
    function handleChangeRadioTramoHorarios(value){
        setRadioValueTramosHorarios(value)
        var p;
        if (value == 0){
           p = estadisticas.tramosHoras
           setTituloGraficaTramosHoras("KWh totales consumidos en cada hora")
        }else if(value == 1){
            p = estadisticas.tramosHorasMedia
            setTituloGraficaTramosHoras("KWh de media consumidos en cada hora")
        }
        let aux_tramo_horario = []
        for (var key of Object.keys(p)) {
            aux_tramo_horario.push({'x': key,'y': p[key]})
        }
        setdatosTramosHorarios(aux_tramo_horario)
    }

    function handleChangeRadioTramoSemanal(value){
        setRadioValueTramosSemanales(value)
        var p;
        if (value == 0){
           p = estadisticas.tramoSemanal
           setTituloGraficaTramosSemanales("KWh totales consumidos en cada día de la semana")
        }else if(value == 1){
            p = estadisticas.tramosSemanalMedia
            setTituloGraficaTramosSemanales("KWh de media consumidos en cada día de la semana")
        }
        let aux_tramo_semanal = []
        for (var key of Object.keys(p)) {
            aux_tramo_semanal.push({'x': stringSemanal(key),'y': p[key]})
        }
        setdatosTramosSemanales(aux_tramo_semanal)
    }


    function handleChangeRadioTramoMensual(value){
        setRadioValueTramosMensuales(value)
        var p;
        if (value == 0){
           p = estadisticas.tramosMensual
           setTituloGraficaTramosMensuales("KWh totales consumidos en cada mes")
        }else if(value == 1){
            p = estadisticas.tramosMensualMedia
            setTituloGraficaTramosMensuales("KWh de media consumidos en cada mes")
        }
        let aux_tramo_mensual = []
        for (var key of Object.keys(p)) {
            aux_tramo_mensual.push({'x': stringMes(key),'y': p[key]})
        }
        setdatosTramosMensuales(aux_tramo_mensual)
    }

    function handleChangeDispositivo(id){
        isEstadisticaLoaded(false)
        var requestOptions = {
            method: 'GET',
            headers: { 'Authorization' : sessionStorage.getItem("token") }
        };
        fetch(process.env.REACT_APP_BASE_URL + "dispositivos/" + id, requestOptions).then
        (response => response.json()).then
        ((data) =>{
            limpiarDatosFiltro()
            setEstadisticas(data.estadisticas)
            setRadioValue(id)
            fetch(process.env.REACT_APP_BASE_URL + "dispositivos/" + id + "/medidas?orderBy=fecha&minDate=" + minFechaDefault+"&maxDate="+maxFechaDefault, requestOptions).then
            (response => response.json()).then
            ((data) =>{
                let aux = []
                if(data.length !== 0){
                    data.map((dato) => {
                        let hora = dato.fecha.split("T")[1]
                        hora = hora.substring(0,hora.length-1)
                        aux.push([fechaEstadistica(dato.fecha)+" "+hora,dato.kw])
                    })
                }
                setDatos(aux)
                isEstadisticaLoaded(true)
                isDatosLoaded(true)
            })
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
            setHayDispositivos(data.dispositivos.length != 0)
            setDispositivos(data.dispositivos)

            if (data.dispositivos.length != 0){
                setRadioValue(data.dispositivos[0].id)
                fetch(process.env.REACT_APP_BASE_URL + "dispositivos/" + data.dispositivos[0].id, requestOptions).then
                (response => response.json()).then
                ((data) =>{
                    setEstadisticas(data.estadisticas)
                    isEstadisticaLoaded(true)
                    setxAxisFiltro("Horas")

                    var p = data.estadisticas.tramosHoras
                    let aux_tramo_horario = []
                    for (var key of Object.keys(p)) {
                        aux_tramo_horario.push({'x': key,'y': p[key]})
                    }
                    setRadioValueTramosHorarios(0)
                    setdatosTramosHorarios(aux_tramo_horario)
                    setTituloGraficaTramosHoras("KWh totales consumidos en cada de hora")

                    p = data.estadisticas.tramoSemanal
                    let aux_tramo_semanal = []
                    for (var key of Object.keys(p)) {
                        aux_tramo_semanal.push({'x': stringSemanal(key),'y': p[key]})
                    }
                    setRadioValueTramosSemanales(0)
                    setdatosTramosSemanales(aux_tramo_semanal)
                    setTituloGraficaTramosSemanales("KWh totales consumidos en cada día de la semana")

                    p = data.estadisticas.tramosMensual
                    let aux_tramo_mensual = []
                    for (var key of Object.keys(p)) {
                        aux_tramo_mensual.push({'x': stringMes(key),'y': p[key]})
                    }
                    setRadioValueTramosMensuales(0)
                    setdatosTramosMensuales(aux_tramo_mensual)
                    setTituloGraficaTramosMensuales("KWh totales consumidos en cada mes")
                    
                })
                setFechaDesde(minFechaDefault)
                setFechaHasta(maxFechaDefault)
                fetch(process.env.REACT_APP_BASE_URL + "dispositivos/" + data.dispositivos[0].id + "/medidas?orderBy=fecha&minDate=" + minFechaDefault+"&maxDate="+maxFechaDefault, requestOptions).then
                (response => response.json()).then
                ((data) =>{
                    let aux = []
                    if(data.length !== 0){
                        data.map((dato) => {
                            let hora = dato.fecha.split("T")[1]
                            hora = hora.substring(0,hora.length-1)
                            hora = hora.split(":")
                            hora = hora[0] + ":" + hora[1]
                            aux.push([hora,dato.kw])
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
        var fecha_ini = new Date(fechaDesde)
        var fecha_fin = new Date(fechaHasta)
        var diff = (fecha_fin - fecha_ini)/(1000*60*60*24);
        console.log(diff)
        if(fechaDesde != ""){
            filtro += "&minDate="+obtenerFormatoFecha(new Date(fechaDesde))
        }
        if(fechaHasta != ""){
            filtro += "&maxDate="+obtenerFormatoFecha(new Date(fechaHasta))
        }
        if(fechaDesde == "" && fechaHasta == ""){
            filtro += "&minDate="+minFechaDefault+"&maxDate="+maxFechaDefault
        }
        if (diff <= 1){
            setxAxisFiltro("Horas")
        }else{
            setxAxisFiltro("Dias")
        }
        fetch(process.env.REACT_APP_BASE_URL + "dispositivos/" + radioValue + "/medidas?orderBy=fecha" + filtro, requestOptions).then
        (response => response.json()).then
        ((data) =>{
            let aux = []
            if(data.length !== 0){
                data.map((dato) => {
                    if (diff > 1){
                        aux.push([fechaEstadistica(dato.fecha),dato.kw])
                        
                    }else{
                        let hora = dato.fecha.split("T")[1]
                        hora = hora.substring(0,hora.length-1)
                        hora = hora.split(":")
                        hora = hora[0] + ":" + hora[1]
                        aux.push([hora,dato.kw])
                    }
                    
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
            let fechaMinima = obtenerFormatoFecha(new Date(day.getFullYear(), day.getMonth(),day.getDate(), 0, 0, 0))
            let fechaMaxima = obtenerFormatoFecha(new Date(day.getFullYear(), day.getMonth(),day.getDate(),23,59,59))
            fetch(process.env.REACT_APP_BASE_URL + "dispositivos/" + radioValue + "/medidas?orderBy=fecha&minDate="+fechaMinima+"&maxDate="+fechaMaxima, requestOptions).then
            (response => response.json()).then
            ((data) =>{
                let aux = []
                if(data.length !== 0){
                    data.map((dato) => {
                        let hora = dato.fecha.split("T")[1]
                        hora = hora.substring(0,hora.length-1)
                        aux.push([hora,dato.kw])
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
            let fechaMinima = obtenerFormatoFecha(new Date(day.getFullYear(), day.getMonth(),day.getDate(), 0, 0, 0))
            let fechaMaxima = obtenerFormatoFecha(new Date(day.getFullYear(), day.getMonth(),day.getDate(),23,59,59))
            fetch(process.env.REACT_APP_BASE_URL + "dispositivos/" + radioValue + "/medidas?orderBy=fecha&minDate="+fechaMinima+"&maxDate="+fechaMaxima, requestOptions).then
            (response => response.json()).then
            ((data) =>{
                let aux = []
                if(data.length !== 0){
                    data.map((dato) => {
                        let hora = dato.fecha.split("T")[1]
                        hora = hora.substring(0,hora.length-1)
                        aux.push([hora,dato.kw])
                    })
                }
                setSegundoDiaDatos(aux)
                handleCloseLoadingCompararDias()
            })
        }else{
            handleCloseLoadingCompararDias()
        }
    }

    if(!loadedDatos){
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
                                    checked={radioValue == dispositivo.id}
                                    value={dispositivo.id}
                                    onChange={(e) => {handleChangeDispositivo(e.currentTarget.value)}}
                                    >{dispositivo.nombre}
                                    </ToggleButton>
                                ))}
                            </ButtonGroup> 
                        }
                    </Col>
                </Row>
                <br/>
                {!loadedEstadistica && hayDispositivos && <Loading />}
                {loadedEstadistica  && hayDispositivos && (
                <>
                <Row>
                    <Col></Col>
                    <Col><Row>Consumido Hoy:</Row></Col>
                    <Col>{estadisticas.consumidoHoy} KWh ({estadisticas.sumaDiaDinero} €)</Col>
                    <Col><Row>Consumido Mes:</Row></Col>
                    <Col>{estadisticas.consumidoMes} KWh ({estadisticas.sumaMesDinero} €)</Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col><Row>Media diaria:</Row></Col>
                    <Col>{estadisticas.mediaKWHDiaria} KWh ({(estadisticas.mediaKWHDiaria > 0 && estadisticas.sumaMediaDiariaDinero == 0? "~ " : "") + estadisticas.sumaMediaDiariaDinero} €)</Col>
                    <Col><Row>Media mensual:</Row></Col>
                    <Col>{estadisticas.mediaKWHMensual} KWh ({(estadisticas.mediaKWHMensual > 0 && estadisticas.sumaMediaMensualDinero == 0? "~ " : "") + estadisticas.sumaMediaMensualDinero} €)</Col>
                    <Col></Col>
                </Row>
                    
                <Row>
                    <Col sm={1}></Col>
                    <Col>
                        <Row>
            <Tabs>
                <TabList style={{
                    fontSize: '20px',
                    margin: '20px',
                    color: "#1616b7",
                    borderRadius: '10px',
                }}>
                    <Tab style={{ background: '#a7f8a2', 
                        borderRadius: '5px' }}>Filtrar</Tab>
                    <Tab style={{ background: '#f4faa0', 
                        borderRadius: '5px' }}>Estadisticas</Tab>
                    <Tab style={{ background: '#f4faa0', 
                        borderRadius: '5px' }}>Predicciones</Tab>
                    <Tab style={{ background: '#f4faa0', 
                        borderRadius: '5px' }}>Comparar días</Tab>
                </TabList>
                <TabPanel style={{ fontSize: '20px', 
                    margin: '20px' }}>
                    <Tabs defaultIndex={1}>
                        <Container>
                            <br/>
                            <Row>
                                <Col sm={4}>
                                    <Row>
                                        <Col><Row>Fecha inicio:</Row></Col>
                                        <Col><Row><input type={"datetime-local"} value={fechaDesde} onChange={(e) =>{setFechaDesde(e.target.value)}} max={obtenerFormatoFecha(new Date())}/></Row></Col>
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
                                <Col sm={1}><Row><Button onClick={filtrarDatos}>Filtrar</Button></Row></Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col sm={1}></Col>
                                {datos!="" && <Col><AnyChart id="lineChart" width={1200} height={600} type="line" data={datos} title="Potencia registrada en el tramo de tiempo filtrado" yScale={{minimum:0}} xAxis={[0, {title:xAxisFiltro}]}  yAxis={[0, {title:"KW"}]} /></Col>}
                                {datos=="" && <Col>No hay ninguna medida registrada con estos filtros</Col>}
                                <Col sm={1}></Col>
                            </Row>
                        </Container>
                    </Tabs>
                </TabPanel>
                <TabPanel style={{ fontSize: '20px', 
                    margin: '20px' }}>
                    <Tabs>
                        <TabList>
                            <Tab style={{ background: '#f5e5f8', 
                                borderRadius: '5px' }}>Tramos</Tab>
                            <Tab style={{ background: '#f2f9a0', 
                                borderRadius: '5px' }}>Histórico</Tab>
                        </TabList>
                        <TabPanel>
                        <Row>
                                <Col>
                                    <ButtonGroup>
                                        <ToggleButton
                                            id={"tramoHorarioTotal1"}
                                            variant="outline-secondary"
                                            type="radio"
                                            name="radioTramoHorarioTotal"
                                            checked={radioValueTramosHorarios == 0}
                                            value={0}
                                            onChange={(e) => {handleChangeRadioTramoHorarios(e.currentTarget.value)}}
                                            >
                                            Tramo horario total
                                        </ToggleButton>
            
                                        <ToggleButton
                                            id={"tramoHorarioTotal2"}
                                            variant="outline-secondary"
                                            type="radio"
                                            name="radioTramoHorarioTotal"
                                            checked={radioValueTramosHorarios == 1}
                                            value={1}
                                            onChange={(e) => {handleChangeRadioTramoHorarios(e.currentTarget.value)}}
                                            >
                                            Tramo horario media
                                        </ToggleButton>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col><AnyChart data={datosTramosHorarios} id={"TramoSemanas"} name={"TramoHorario"} type="column" title={tituloGraficaTramosHoras} width={1300} height={500} xAxis={[0, {title:"Horas"}]} yAxis={[0, {title:"KWh"}]}/></Col>
                            </Row>

                            <Row >
                                <Col>
                                    <ButtonGroup>
                                        <ToggleButton
                                            id={"tramoSemanalTotal1"}
                                            variant="outline-secondary"
                                            type="radio"
                                            name="radioTramoSemanal"
                                            checked={radioValueTramosSemanales == 0}
                                            value={0}
                                            onChange={(e) => {handleChangeRadioTramoSemanal(e.currentTarget.value)}}
                                            >
                                            Tramo semanal total
                                        </ToggleButton>
            
                                        <ToggleButton
                                            id={"tramoSemanalTotal2"}
                                            variant="outline-secondary"
                                            type="radio"
                                            name="radioTramoSemanal"
                                            checked={radioValueTramosSemanales == 1}
                                            value={1}
                                            onChange={(e) => {handleChangeRadioTramoSemanal(e.currentTarget.value)}}
                                            >
                                            Tramo semanal media
                                        </ToggleButton>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col><AnyChart id={"TramoSemanas"} name={"TramoSemanal"} data={datosTramosSemanales} type="column" title={tituloGraficaTramosSemanales} width={1300} height={500} xAxis={[0, {title:"Dias"}]} yAxis={[0, {title:"KWh"}]}/></Col>
                            </Row>
                            <Row >
                                <Col>
                                    <ButtonGroup>
                                        <ToggleButton
                                            id={"tramoMensualTotal1"}
                                            variant="outline-secondary"
                                            type="radio"
                                            name="radioTramoMensual"
                                            checked={radioValueTramosMensuales == 0}
                                            value={0}
                                            onChange={(e) => {handleChangeRadioTramoMensual(e.currentTarget.value)}}
                                            >
                                            Tramo mensual total
                                        </ToggleButton>
            
                                        <ToggleButton
                                            id={"tramoMensualTotal2"}
                                            variant="outline-secondary"
                                            type="radio"
                                            name="radioTramoMensual"
                                            checked={radioValueTramosMensuales == 1}
                                            value={1}
                                            onChange={(e) => {handleChangeRadioTramoMensual(e.currentTarget.value)}}
                                            >
                                            Tramo Mensual media
                                        </ToggleButton>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col><AnyChart id={"TramoMensual"} name={"TramoMensual"} data={datosTramosMensuales} type="column" title={tituloGraficaTramosMensuales} width={1300} height={500} xAxis={[0, {title:"Meses"}]} yAxis={[0, {title:"KWh"}]}/></Col>
                            </Row>
                        </TabPanel>
                        <TabPanel>
                            <Table striped bordered hover title="Top dias mas consumidos del año" >
                                <thead>
                                    <tr>
                                    <th>Fecha</th>
                                    <th>Energía consumida</th>
                                    <th>Dinero</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(estadisticas.historicoMasConsumido.anualDiasMasConsumidos).map((est) => {
                                        return(
                                            <tr>
                                                <td>
                                                    {poner0(est.dia)}/{poner0(est.mes)}/{(est.year)}
                                                </td>
                                                <td>
                                                    {Math.round(est.energia_consumida*1000)/1000} KWh
                                                </td>
                                                <td>
                                                    {Math.round(est.precio_estimado*100)/100} euros
                                                </td>
                                            </tr>
                                        );
                                    })}
                
                                </tbody>
                            </Table>
                        </TabPanel>
                    </Tabs>
                </TabPanel>
            
                <TabPanel style={{ fontSize: '20px', margin: '20px' }}>
                    Predicciones
                </TabPanel>
                <TabPanel style={{ fontSize: '20px', margin: '20px' }}>
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
                </TabPanel> 
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
//JSON.stringify(obj)
