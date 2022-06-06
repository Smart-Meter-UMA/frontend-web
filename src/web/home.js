import { useEffect, useState } from "react";
import Loading from '../components/Loading'
import AnyChart from 'anychart-react'
import anychart from 'anychart'
import { Button, Card, Col, Container, Row } from "react-bootstrap";

function Home() {
    const [loaded,isLoaded] = useState(false);

    const [datos, setDatos] = useState([]);
    const [fechaTitulo, setFechaTitulo] = useState("");
    const [fecha, setFecha] = useState(null);

    function poner0(val){return val > 9 ? val : "0" + val }

    function obtenerFormatoFecha(fecha){return fecha.getFullYear()+"-"+poner0(fecha.getMonth() + 1)+"-"+poner0(fecha.getDate())}

    function obtenerFormatoFechaApi(fecha){
        let year = (""+fecha.getFullYear()+"")
        return year.slice(year.length-2,year.length)+"-"+poner0(fecha.getMonth() + 1)+"-"+poner0(fecha.getDate())
    }
    useEffect(() => {
        fetch(process.env.REACT_APP_BASE_URL + "precios/1?fecha="+obtenerFormatoFechaApi(new Date())).then
        (response => response.json()).then
        ((data) => {
            let hora = 0
            let aux = []
            data.precios_pvpc.map((precio) =>{
                aux.push({'x':poner0(hora),'y':precio[""+poner0(hora)+""] / 1000})
                hora = hora + 1
            })
            setDatos(aux)
            setFecha(new Date(data.Dia))
            setFechaTitulo(data.Dia)
            isLoaded(true)
        })
      }, [])


      function filtrarFecha(){
        isLoaded(false)
        fetch(process.env.REACT_APP_BASE_URL + "precios/1?fecha="+obtenerFormatoFechaApi(fecha)).then
        (response => response.json()).then
        ((data) => {
            let hora = 0
            let aux = []
            data.precios_pvpc.map((precio) =>{
                aux.push({'x':poner0(hora),'y':precio[""+poner0(hora)+""] / 1000})
                hora = hora + 1
            })
            setDatos(aux)
            setFechaTitulo(data.Dia)
            isLoaded(true)
        })
      }
    
    if(!loaded){
        return <Loading />
    }else{
        return(
            <>
                <Container>
                    <br/>
                    <Row>
                        <Col sm={3}></Col>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Container>
                                        <Row>
                                            <Col>Selecciona una fecha:</Col>
                                            <Col><input type={"date"} value={obtenerFormatoFecha(fecha)} onChange={(e) => {setFecha(new Date(e.target.value))}}/></Col>
                                            <Col><Button onClick={filtrarFecha}>Buscar</Button></Col>
                                        </Row>
                                    </Container>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col sm={3}></Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col></Col>
                        <Col><AnyChart data={datos} type="column" title={"Precio de la luz en € el día "+fechaTitulo} width={800} height={600} /></Col>
                        <Col></Col>
                    </Row>
                </Container>
            </>
        )
    }
}

export default Home;