import { useState } from "react";
import { Button, Col, Container, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import iconoI from "../assets/iconoI.png"
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddTarifa(){

    function poner0(val){return val > 9 ? val : "0" + val }

    function obtenerFormatoFecha(fecha){return fecha.getFullYear()+"-"+poner0(fecha.getMonth() + 1)+"-"+poner0(fecha.getDate())}
    const [tarifa, setTarifa] = useState({
        "comercializadora": "",
        "nombre": "",
        "fecha_actualización": obtenerFormatoFecha(new Date()),
        "potencia_1":0,
        "potencia_2":0,
        "precio_1":0,
        "precio_2":0,
        "precio_3":null
      })

    function handleComercializadora (e) {
        tarifa.comercializadora = e.target.value;
        setTarifa(tarifa);
    }

    function handleNombreTarifa (e) {
        tarifa.nombre = e.target.value;
        setTarifa(tarifa);
    }

    function handlePrecio1 (e) {
        tarifa.precio_1 = e.target.value;
        setTarifa(tarifa);
    }

    function handlePrecio2 (e) {
        tarifa.precio_2 = e.target.value;
        setTarifa(tarifa);
    }

    function handlePotencia1 (e) {
        tarifa.potencia_1 = e.target.value;
        setTarifa(tarifa);
    }

    function handlePotencia2 (e) {
        tarifa.potencia_2 = e.target.value;
        setTarifa(tarifa);
    }

    function handleNuevaTarifa(){
        let aux = tarifa
        aux.precio_1 = aux.precio_1 != null? parseFloat(aux.precio_1) : null
        aux.precio_2 = aux.precio_2 != null? parseFloat(aux.precio_2) : null
        aux.potencia_1 = aux.potencia_1 != null? parseFloat(aux.potencia_1) : null
        aux.potencia_2 = aux.potencia_2 != null? parseFloat(aux.potencia_2) : null
        var requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(aux)
        };
        fetch("http://51.38.189.176/add_tarifa",requestOptions).then
        (response => {
            console.log(response.json())
            if(response.status == 422){
                toast.error("Error al crear la tarifa: " + response.json().msg)
            }else{
                window.location.replace("/valoresEnergia")
            }
        })
       
    }

    const renderTooltipNotificacion = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            ¡OJO! Pedimos que los datos que ofrezcan sean reales para poder tener una
            recopilación de datos real y no haya ruido en los datos
        </Tooltip>
      );

    return(
        <>
            <ToastContainer />
            <Container>
                <br/>
                <Row>
                    <Col></Col>
                    <Col>
                        <h1>
                            Nueva tarifa
                            <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltipNotificacion}><img src={iconoI} width="20" height="20" className="d-inline-block align-top"/></OverlayTrigger>
                        </h1>
                    </Col>
                    <Col></Col>
                </Row>
                <br/>
                <Row>
                    <Col></Col>
                    <Col><Row>Comercializadora:</Row></Col>
                    <Col><Row><input type="text" onChange={handleComercializadora}/> </Row></Col>
                    <Col></Col>
                </Row>
                <br/>
                <Row>
                    <Col></Col>
                    <Col><Row>Nombre de la tarifa:</Row></Col>
                    <Col><Row><input type="text" onChange={handleNombreTarifa}/> </Row></Col>
                    <Col></Col>
                </Row>
                <br/>
                <Row>
                    <Col></Col>
                    <Col><Row>Potencia periodo punta:</Row></Col>
                    <Col><Row><input type="number" onChange={handlePotencia1}/> </Row></Col>
                    <Col></Col>
                </Row>
                <br/>
                <Row>
                    <Col></Col>
                    <Col><Row>Potencia periodo valle:</Row></Col>
                    <Col><Row><input type="number" onChange={handlePotencia2}/> </Row></Col>
                    <Col></Col>
                </Row>
                <br/>
                <Row>
                    <Col></Col>
                    <Col><Row>Precio llano/día:</Row></Col>
                    <Col><Row><input type="number" onChange={handlePrecio1}/> </Row></Col>
                    <Col></Col>
                </Row>
                <br/>
                <Row>
                    <Col></Col>
                    <Col><Row>Precio alto:</Row></Col>
                    <Col><Row><input type="number" onChange={handlePrecio2}/> </Row></Col>
                    <Col></Col>
                </Row>
                <br/>
                <Row>
                    <Col sm={5}></Col>
                    <Col>
                        <Row>
                            <Col><Row><Button onClick={handleNuevaTarifa}>Nueva tarifa</Button></Row></Col> 
                        </Row>
                    </Col>
                    <Col sm={5}></Col>
                </Row>
            </Container>
        </>
    )

}

export default AddTarifa;