import React, { useEffect, useState, Component } from "react";
import { Button, ButtonGroup, Col, Container, FormGroup, Row, Table, ToggleButton} from "react-bootstrap";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import Modal from 'react-bootstrap/Modal'
import AnyChart from 'anychart-react'
import anychart from 'anychart'
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideBar from "../components/SideBar.js";
import LoadingVentanaEmergente from "../components/LoadingVentanaEmergente";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';


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

    const stage = anychart.graphics.create();
    const[chartPrediccion, setchartPrediccion] = useState(anychart.line());

    const [tituloGraficaTramosHoras, setTituloGraficaTramosHoras] = useState(null)
    const [tituloGraficaTramosSemanales, setTituloGraficaTramosSemanales] = useState(null)
    const [tituloGraficaTramosMensuales, setTituloGraficaTramosMensuales] = useState(null)

    const [datosTramosHorarios, setdatosTramosHorarios] = useState([]);
    const [radioValueTramosHorarios, setRadioValueTramosHorarios] = useState('1');

    const [datosTramosSemanales, setdatosTramosSemanales] = useState([]);
    const [radioValueTramosSemanales, setRadioValueTramosSemanales] = useState('1');

    const [datosTramosMensuales, setdatosTramosMensuales] = useState([]);
    const [radioValueTramosMensuales, setRadioValueTramosMensuales] = useState('1');

    const [historicoAnualDiasMasConsumidos, sethistoricoAnualDiasMasConsumidos] = useState(null);
    const [historicoAnualMesesMasConsumidos, sethistoricoAnualMesesMasConsumidos] = useState(null);
    
    const [historicoMensualDiasMasConsumidosMes, sethistoricoMensualDiasMasConsumidosMes] = useState(null);
    const [historicoMensualDiasMasConsumidosYear, sethistoricoMensualDiasMasConsumidosYear] = useState(null);


    const [listaHistoricoAnualDiasMasConsumidos, setlistaHistoricoAnualDiasMasConsumidos] = useState([]);
    const [listaHistoricoMensualDiasMasConsumidos, setlistaHistoricoMensualDiasMasConsumidos] = useState([]);
    const [listaHistoricoAnualMesesMasConsumidos, setlistaHistoricoAnualMesesMasConsumidos] = useState([]);

    const [prediccionDia, setPrediccionDia] = useState([]);
    const [inputPrediccionDia, setinputPrediccionDia] = useState(null);
    const [inputPrediccionSemana, setinputPrediccionSemana] = useState(null);
    const [prediccionSemana, setprediccionSemana] = useState([]);

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

    const minMaxInputMes = event => {
        const historicoMensualDiasMasConsumidosMes = Number(event.target.value);
        let listadoHistoricoDiasMasConsumidosAux = estadisticas.historicoMasConsumido.mesDiasMasConsumidos.filter(est => est.mes == historicoMensualDiasMasConsumidosMes && est.year == historicoMensualDiasMasConsumidosYear)
        setlistaHistoricoMensualDiasMasConsumidos(listadoHistoricoDiasMasConsumidosAux)
      };

      const minInputYearMesDiasMasConsumidos = event => {
        const historicoMensualDiasMasConsumidosYear = Math.max(Number(0), Number(event.target.value));
        let listadoHistoricoDiasMasConsumidosAux = estadisticas.historicoMasConsumido.mesDiasMasConsumidos.filter(est => est.mes == historicoMensualDiasMasConsumidosMes && est.year == historicoMensualDiasMasConsumidosYear)
        sethistoricoMensualDiasMasConsumidosYear(historicoMensualDiasMasConsumidosYear)
        setlistaHistoricoMensualDiasMasConsumidos(listadoHistoricoDiasMasConsumidosAux)
      };
      
      const minInputYearAnualDiasMasConsumidos = event => {
        const historicoDiasMasConsumidos = Math.max(Number(0), Number(event.target.value));
        let listadoHistoricoAnualDiasMasConsumidosAux = estadisticas.historicoMasConsumido.anualDiasMasConsumidos.filter(est => est.year == historicoDiasMasConsumidos)
        sethistoricoAnualDiasMasConsumidos(historicoDiasMasConsumidos)
        setlistaHistoricoAnualDiasMasConsumidos(listadoHistoricoAnualDiasMasConsumidosAux)
      };

      const minInputYearAnualMesesMasConsumidos = event => {
        const historicoDiasMasConsumidos = Math.max(Number(0), Number(event.target.value));
        let listadoHistoricoAnualDiasMasConsumidosAux = estadisticas.historicoMasConsumido.anualMesesMasConsumidos.filter(est => est.year == historicoDiasMasConsumidos)
        sethistoricoAnualMesesMasConsumidos(historicoDiasMasConsumidos)
        setlistaHistoricoAnualMesesMasConsumidos(listadoHistoricoAnualDiasMasConsumidosAux)
      };

      const prediccionDiaInput = event => {
        setprediccionSemana([])
        var requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem("token")},
            body: JSON.stringify({"fecha": inputPrediccionDia})
        };
        fetch(process.env.REACT_APP_BASE_URL + "prediccion/precios/dia/", requestOptions).then
        (response => response.json()).then
        ((data) =>{
            setPrediccionDia(data.list)
        }
        )
      };

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

            sethistoricoAnualDiasMasConsumidos(new Date().getFullYear())

            sethistoricoMensualDiasMasConsumidosYear(new Date().getFullYear())
            sethistoricoMensualDiasMasConsumidosMes(new Date().getMonth()+1)
            
            let listadoHistoricoDiasMasConsumidosAux = data.estadisticas.historicoMasConsumido.mesDiasMasConsumidos.filter(est => est.mes-1 == ((new Date()).getMonth()) && est.year == ((new Date()).getFullYear()))
            setlistaHistoricoMensualDiasMasConsumidos(listadoHistoricoDiasMasConsumidosAux)
            
            let listadoHistoricoAnualDiasMasConsumidosAux = data.estadisticas.historicoMasConsumido.anualDiasMasConsumidos.filter(est => est.year == ((new Date()).getFullYear()))
            setlistaHistoricoAnualDiasMasConsumidos(listadoHistoricoAnualDiasMasConsumidosAux)
            
            sethistoricoAnualMesesMasConsumidos(new Date().getFullYear())
            let listadoHistoricoAnualMesesMasConsumidosAux = data.estadisticas.historicoMasConsumido.anualMesesMasConsumidos.filter(est => est.year == ((new Date()).getFullYear()))
            setlistaHistoricoAnualMesesMasConsumidos(listadoHistoricoAnualMesesMasConsumidosAux)

            setFechaDesde(minFechaDefault)
            setFechaHasta(maxFechaDefault)
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

                    sethistoricoMensualDiasMasConsumidosYear(new Date().getFullYear())
                    sethistoricoMensualDiasMasConsumidosMes(new Date().getMonth()+1)
                    let listadoHistoricoDiasMasConsumidosAux = data.estadisticas.historicoMasConsumido.mesDiasMasConsumidos.filter(est => est.mes-1 == ((new Date()).getMonth()) && est.year == ((new Date()).getFullYear()))
                    setlistaHistoricoMensualDiasMasConsumidos(listadoHistoricoDiasMasConsumidosAux)

                    sethistoricoAnualMesesMasConsumidos(new Date().getFullYear())
                    let listadoHistoricoAnualMesesMasConsumidosAux = data.estadisticas.historicoMasConsumido.anualMesesMasConsumidos.filter(est => est.year == ((new Date()).getFullYear()))
                    setlistaHistoricoAnualMesesMasConsumidos(listadoHistoricoAnualMesesMasConsumidosAux)
                    
                    sethistoricoAnualDiasMasConsumidos(new Date().getFullYear())
                    let listadoHistoricoAnualDiasMasConsumidosAux = data.estadisticas.historicoMasConsumido.anualDiasMasConsumidos.filter(est => est.year == ((new Date()).getFullYear()))
                    setlistaHistoricoAnualDiasMasConsumidos(listadoHistoricoAnualDiasMasConsumidosAux)

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
        handleCloseCompararDias()
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
                var lineSeries1 =  chartPrediccion.line(aux);

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
                var lineSeries2 =  chartPrediccion.line(aux);
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
                    <Tab style={{borderRadius: '5px' }}>Filtrar</Tab>
                    <Tab style={{borderRadius: '5px' }}>Estadisticas</Tab>
                    <Tab style={{borderRadius: '5px' }}>Predicciones</Tab>
                    <Tab style={{borderRadius: '5px' }}>Comparar días</Tab>
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
                            <Tab style={{ borderRadius: '5px' }}>Tramos</Tab>
                            <Tab style={{ borderRadius: '5px' }}>Histórico</Tab>
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
                            
                            <br/>
                            <Divider variant="middle" />
                            <br/>

                            <Row >
                                <Col>
                                    <ButtonGroup>
                                        <ToggleButton
                                            id={"tramoSemanal1"}
                                            variant="outline-secondary"
                                            type="radio"
                                            name="radioTramoSemanal"
                                            checked={radioValueTramosSemanales == 0}
                                            value={0}
                                            onChange={(e) => {handleChangeRadioTramoSemanal(e.currentTarget.value)}}
                                            >
                                            Tramo Semanal total
                                        </ToggleButton>
            
                                        <ToggleButton
                                            id={"tramoSemanal2"}
                                            variant="outline-secondary"
                                            type="radio"
                                            name="radioTramoSemanal"
                                            checked={radioValueTramosSemanales == 1}
                                            value={1}
                                            onChange={(e) => {handleChangeRadioTramoSemanal(e.currentTarget.value)}}
                                            >
                                            Tramo Semanal media
                                        </ToggleButton>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col><AnyChart id={"TramoSemanal"} name={"TramoSemanal"} data={datosTramosSemanales} type="column" title={tituloGraficaTramosSemanales} width={1300} height={500} xAxis={[0, {title:"Semanas"}]} yAxis={[0, {title:"KWh"}]}/></Col>
                            </Row>
                            <br/>
                            <Divider variant="middle" />
                            <br/>
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
                            
                            <Row>
                                <Card variant="outlined" style={{flex:1, backgroundColor:'#E4F9FE'}}>

                                    <h4>Top días de mayor consumo de energía en un mes</h4>

                                    <form>
                                        <Col>
                                            <label>Mes: &nbsp; &nbsp;</label>
                                            <select onChange={minMaxInputMes}>
                                                {(historicoMensualDiasMasConsumidosMes == 1) ? <option value="1" selected>Enero</option> : <option value="1" >Enero</option>}
                                                {(historicoMensualDiasMasConsumidosMes == 2) ? <option value="2" selected>Febrero</option> : <option value="2">Febrero</option>}
                                                {(historicoMensualDiasMasConsumidosMes == 3) ? <option value="3" selected>Marzo</option> : <option value="3">Marzo</option>}
                                                {(historicoMensualDiasMasConsumidosMes == 4) ? <option value="4" selected>Abril</option> : <option value="4">Abril</option>}
                                                {(historicoMensualDiasMasConsumidosMes == 5) ? <option value="5" selected>Mayo</option> : <option value="5">Mayo</option>}
                                                {(historicoMensualDiasMasConsumidosMes == 6) ? <option value="6" selected>Junio</option> : <option value="6">Junio</option>}
                                                {(historicoMensualDiasMasConsumidosMes == 7) ? <option value="7" selected>Julio</option> : <option value="7">Julio</option>}
                                                {(historicoMensualDiasMasConsumidosMes == 8) ? <option value="8" selected>Agosto</option> : <option value="8">Agosto</option>}
                                                {(historicoMensualDiasMasConsumidosMes == 9) ? <option value="9" selected>Septiembre</option> : <option value="9">Septiembre</option>}
                                                {(historicoMensualDiasMasConsumidosMes == 10) ? <option value="10" selected>Octubre</option> : <option value="10">Octubre</option>}
                                                {(historicoMensualDiasMasConsumidosMes == 11) ? <option value="11" selected>Noviembre</option> : <option value="11">Noviembre</option>}
                                                {(historicoMensualDiasMasConsumidosMes == 12) ? <option value="12" selected>Diciembre</option> : <option value="12">Diciembre</option>}                           
                                            </select>
                                            &nbsp; &nbsp;
                                            <label>Año: &nbsp; &nbsp;</label>
                                            <input defaultValue={historicoMensualDiasMasConsumidosYear} value={historicoMensualDiasMasConsumidosYear} onChange={minInputYearMesDiasMasConsumidos}></input>
                                        </Col>
                                    </form>

                                    {(listaHistoricoMensualDiasMasConsumidos.length === 0) ? <p>No hay ningún top valores de consumo dichos mes</p> : 
                                        <Table striped bordered hover title="Top dias mas consumidos del mes" >
                                            <thead>
                                                <tr>
                                                <th>Fecha</th>
                                                <th>Energía consumida</th>
                                                <th>Dinero</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(listaHistoricoMensualDiasMasConsumidos).map((est) => {
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
                                    }
                                </Card>
                            </Row>
                            
                    

                            <br/>
                            <Divider variant="middle" />
                            <br/>
                            
                            <Row>
                                <Col>
                                    <Card variant="outlined" style={{flex:1, backgroundColor:'#E4F9FE'}}>
                                        <h5>Top días de mayor consumo de energía en un año</h5>
                                        <form>
                                            <label>Año: &nbsp; &nbsp;</label>
                                            <input defaultValue={historicoAnualDiasMasConsumidos} value={historicoAnualDiasMasConsumidos} onChange={minInputYearAnualDiasMasConsumidos}></input>
                                        </form>

                                        {(listaHistoricoAnualDiasMasConsumidos.length === 0) ? <p>No hay ningún valor disponible</p> : 
                                            <Table striped bordered hover title="Top dias mas consumidos del año" >
                                                <thead>
                                                    <tr>
                                                    <th>Fecha</th>
                                                    <th>Energía consumida</th>
                                                    <th>Dinero</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(listaHistoricoAnualDiasMasConsumidos).map((est) => {
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
                                        }
                                    </Card>
                                </Col>
                                <Col>
                                    <Card variant="outlined" style={{flex:1, backgroundColor:'#E4F9FE'}}>
                                        <h5>Top días de mayor consumo de energía historicamente </h5>
                                        <br/>
                                        {(estadisticas.historicoMasConsumido.historicamentediasMasConsumido.length === 0) ? <p>No hay ningún valor</p> : 
                                        <Table striped bordered hover title="Top dias mas consumidos" >
                                            <thead>
                                                <tr>
                                                <th>Fecha</th>
                                                <th>Energía consumida</th>
                                                <th>Dinero</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(estadisticas.historicoMasConsumido.historicamentediasMasConsumido).map((est) => {
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
                                    }
                                    </Card>
                                </Col>
                            </Row>



                            <br/>
                            <Divider variant="middle" />
                            <br/>
                            <Row>
                                <Col>
                                    <Card variant="outlined" style={{flex:1, backgroundColor:'#E4F9FE'}}>
                                        <h5>Top meses de mayor consumo de energía en un año</h5>
                                        <form>
                                            <label>Año: &nbsp; &nbsp;</label>
                                            <input defaultValue={historicoAnualMesesMasConsumidos} value={historicoAnualMesesMasConsumidos} onChange={minInputYearAnualMesesMasConsumidos}></input>
                                            {(listaHistoricoAnualMesesMasConsumidos.length === 0) ? <p>No hay ningún valor disponible </p>: 
                                                <Table striped bordered hover title="Top meses mas consumidos del año" >
                                                    <thead>
                                                        <tr>
                                                        <th>Fecha</th>
                                                        <th>Energía consumida</th>
                                                        <th>Dinero</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {(listaHistoricoAnualMesesMasConsumidos).map((est) => {
                                                            return(
                                                                <tr>
                                                                    <td>
                                                                        {stringMes(est.mes)} del {(est.year)}
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
                                            }
                                        </form>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card variant="outlined" style={{flex:1, backgroundColor:'#E4F9FE'}}>
                                        <h5>Top meses de mayor consumo de energía</h5>
                                        <br/>
                                        {(estadisticas.historicoMasConsumido.historicamenteMesesMasConsumidos.length === 0) ? <p>No hay ningún valor disponible </p> : 
                                            <Table striped bordered hover title="Top meses mas consumidos historicamente" >
                                                <thead>
                                                    <tr>
                                                    <th>Fecha</th>
                                                    <th>Energía consumida</th>
                                                    <th>Dinero</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(estadisticas.historicoMasConsumido.historicamenteMesesMasConsumidos).map((est) => {
                                                        return(
                                                            <tr>
                                                                <td>
                                                                    {stringMes(est.mes)} del {(est.year)}
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
                                        }
                                    </Card>
                                </Col>
                            </Row>

                        </TabPanel>
                    </Tabs>
                </TabPanel>
            
                <TabPanel style={{ fontSize: '20px', margin: '20px' }}>
                    <Row>
                        <form>
                            <label>Fecha: </label>
                            &nbsp; &nbsp;
                            <input type="date" value={inputPrediccionDia} onChange={(e) =>{setinputPrediccionDia(e.target.value)}}></input>
                            <Button onClick={prediccionDiaInput}>Filtrar</Button>
                            </form>
                    </Row>
                    {(prediccionDia == "") ? <p>No hay ningún valor disponible </p> : 
                        <Table striped bordered hover title="Top meses mas consumidos historicamente" >
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Predicción de precio</th>
                                </tr>
                            </thead> 
                            <tbody>
                                {(prediccionDia).map((pred) => {
                                    return(
                                        <tr>
                                            <td>
                                                {poner0(new Date(pred.fecha).getDate())}/{poner0(new Date(pred.fecha).getMonth()+1)}/{new Date(pred.fecha).getFullYear()} - {pred.fecha.toString().substring(11, 16)}
                                            </td>
                                            <td>
                                                {Math.round(pred.real*100)/100} €/MWh
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    }
                </TabPanel>
                <TabPanel style={{ fontSize: '20px', margin: '20px' }}>
                        <Row>
                            <Col>
                                <Row>
                                    <Col><label>1º Día</label></Col>
                                    <Col><input type={"date"} value={primerDia} onChange={(e) =>{setPrimerDia(e.target.value)}}/></Col>
                                </Row>    
                            </Col>
                            <Col sm={1}></Col>
                            <Col >
                                <Row>
                                    <Col><label>2º Día</label></Col>
                                    <Col><input type={"date"} value={segundoDia} onChange={(e) =>{setSegundoDia(e.target.value)}}/></Col>
                                </Row>    
                            </Col>
                            <Col sm={1}></Col>
                            <Col sm={1}><Row><Button onClick={comparacionDias}>Buscar</Button></Row></Col>
                            <Col sm={1}></Col>
                            <Col sm={1}><Row><Button onClick={limpiarDatosCompararDias}>Limpiar</Button></Row></Col>
                        </Row>
                        {showCompararDias && 
                            <Row>
                                <AnyChart
                                    instance={stage}
                                    width={1300} 
                                    height={870}
                                    charts={[chartPrediccion]}
                                />
                            </Row>
                        } 
                        
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
