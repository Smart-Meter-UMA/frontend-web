import { useState } from "react";
import { Button, Col, Container, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import iconoI from "../assets/iconoI.png"
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddTarifa(){

    const [tarifa, setTarifa] = useState({
        "comercializadora":"",
        "nombre":"",
        "potencia1":null,
        "potencia2":null,
        "precio1":null,
        "preico2":null,
        "precio3":null
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
        tarifa.precio1 = e.target.value;
        setTarifa(tarifa);
    }

    function handlePrecio2 (e) {
        tarifa.precio2 = e.target.value;
        setTarifa(tarifa);
    }

    function handleNuevaTarifa(){
        var requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tarifa)
        };
        //TODO: HACER EL FETCH CUANDO ESTE
        fetch().then
        (response => {
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