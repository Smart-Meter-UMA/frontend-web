import React, { useEffect, useState, Component } from "react";
import { Button, Col, Container, Nav, OverlayTrigger, Row, Tab, Table, Tabs, Tooltip } from "react-bootstrap";
import iconoI from "../assets/iconoI.png"
import Loading from "../components/Loading";


function ValoresEnergia() {

    const [data, setData] = useState([])
    const [loaded, isLoaded] = useState(false)
    const [key, setKey] = useState('');

    const renderTooltipNotificacion = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          Cabe recordar que estos precios son recogidos por la comunidad,
          por lo que estos precios se deben tomar como una estimación y no como algo real
        </Tooltip>
      );

    function obtenerDatosComerzializadora(auxDatos,comercializadora){
        let salida = null
        if (auxDatos.length != 0){
            auxDatos.map((datosComercializadora) =>{
                if (datosComercializadora.nombre == comercializadora){
                    salida = datosComercializadora
                }     
            })
        }
        return salida
    }

    function formatearDatos(datos){
        let auxDatos = []
            datos.map((tarifa) => {
                let comercializadora = tarifa.comercializadora
                let datosComerzializadora = obtenerDatosComerzializadora(auxDatos,comercializadora)
                if(datosComerzializadora == null){
                    datosComerzializadora = {
                        "nombre":comercializadora,
                        "tarifas":[tarifa]
                    }
                    auxDatos.push(datosComerzializadora)
                }else{
                    let tarifasNew = []
                    let metido = false
                    datosComerzializadora.tarifas.map((tarifaComercializadora) => {
                        if (tarifaComercializadora.nombre == tarifa.nombre){
                            if(tarifaComercializadora.fecha_actualización >= tarifa.fecha_actualización){
                                tarifasNew.push(tarifaComercializadora)
                            }else{
                                tarifasNew.push(tarifa)
                            }
                            metido = true
                            
                        }else{
                            tarifasNew.push(tarifaComercializadora)
                        }
                    })
                    if(!metido){
                        tarifasNew.push(tarifa)
                    }
                    let auxAuxDatos = []
                    datosComerzializadora.tarifas = tarifasNew
                    auxDatos.map((datos) =>{
                        if (datos.nombre == tarifa.comercializadora){
                            auxAuxDatos.push(datosComerzializadora)
                        }else{
                            auxAuxDatos.push(datos)
                        }
                    })
                    auxDatos = auxAuxDatos
                }
            })
        return auxDatos
    }

    useEffect(() =>{
        fetch(process.env.REACT_APP_BASE_URL_PRECIOS+ "obtener_tarifas").then
        (response => response.json()).then
        ((data) => { 
            let aux = formatearDatos(data)
            setKey(aux[0].nombre)
            setData(aux)
            isLoaded(true)
        })
    },[])

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
                            <h1>Valores de energía de las empresas
                            <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltipNotificacion}><img src={iconoI} width="20" height="20" className="d-inline-block align-top"/></OverlayTrigger>
                            </h1>
                        </Col>
                        <Col sm={2}><Button href="/addTarifa">Añadir tarifa</Button></Col>
                    </Row>
                    <br/>
                    <Row>
                        <Tab.Container id="left-tabs-example" defaultActiveKey={key}>
                            <Row>
                                <Col sm={2}>
                                    <Nav variant="pills" className="flex-column">
                                        {data.map((objeto) => (
                                            <Nav.Item><Nav.Link eventKey={objeto.nombre}>{objeto.nombre}</Nav.Link></Nav.Item>
                                        ))}
                                    </Nav>
                                </Col>
                                <Col sm={10}>
                                    <Tab.Content>
                                        {data.map((objeto) => (
                                            <Tab.Pane eventKey={objeto.nombre}>
                                                <Container>
                                                    <Row>
                                                    <Table striped bordered hover>
                                                    <thead>
                                                        <tr>
                                                            <th>Tipo factura</th>
                                                            <th>Precio llano</th>
                                                            <th>Precio alto</th>
                                                            <th>Precio dia</th>
                                                            <th>Fecha de actualización</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {objeto.tarifas.map((tarifa) => (
                                                            <>
                                                            {(tarifa.precio2 != null) && ( 
                                                                <tr>
                                                                    <td>{tarifa.nombre}</td>
                                                                    <td>{Math.round(tarifa.precio1 * 100)/100}€/KWh</td>
                                                                    <td>{Math.round(tarifa.precio2 * 100)/100}€/KWh</td>
                                                                    <td>-</td>
                                                                    <td>{tarifa.fecha_actualización}</td>
                                                                </tr>
                                                            )}                                          
                                                            {(tarifa.precio2 == null) && ( 
                                                                <tr>
                                                                    <td>{tarifa.nombre}</td>
                                                                    <td>-</td>
                                                                    <td>-</td>
                                                                    <td>{Math.round(tarifa.precio1 * 100)/100}€/KWh</td>
                                                                    <td>{tarifa.fecha_actualización}</td>
                                                                </tr>
                                                            )}
                                                            </>
                                                            
                                                        ))}
                                                    </tbody>
                                                    </Table>
                                                    </Row>
                                                </Container>
                                            </Tab.Pane>
                                        ))}
                                    </Tab.Content>
                                </Col>
                            </Row>
                        </Tab.Container>
                    </Row>
                    <br/>
                </Container>
            </>
        );
    }


}


export default ValoresEnergia;