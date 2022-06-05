import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Modal,Tab, Nav, Card, OverlayTrigger, Tooltip, ButtonGroup } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import iconoBorrar from "../assets/papelera.png"
import iconoI from "../assets/iconoI.png"
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function EdicionHogar(){
    let {id} = useParams()

    const [hogar, setHogar] = useState(null)
    const [loaded, isLoaded] = useState(false)
    const [nombre, setNombre] = useState("");
    const [potencia_contratada, setPotencia_contratada] = useState(null);
    
    const [hayDispositivos, setHayDispositivos] = useState(false)
    const [dispositivos, setDispositivos] = useState([])
    
    useEffect(() =>{
        var requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem("token") }
        };
        fetch(process.env.REACT_APP_BASE_URL + "hogars/" + id, requestOptions).then
        (response => response.json()).then
        ((data) => {
            setHogar(data)
            setNombre(data.nombre)
            setPotencia_contratada(data.potencia_contratada)
            setDispositivos(data.dispositivos)
            setHayDispositivos(data.dispositivos.length !== 0)
            isLoaded(true)
        })
    }, [])

        //Para el modal de borrar un dispositivo
        const [showModalBorrarDispositivo, setShowModalBorrarDispositivo] = useState(false);
        const [idDispositivoABorrar, setIdDispositivoABorrar] = useState(null)
        const handleCloseModalBorrarDispositivo = () => setShowModalBorrarDispositivo(false);
        const handleShowModalBorrarDispositivo = () => setShowModalBorrarDispositivo(true);
    
        //Para el modal de borrar el hogar
        const [showModalBorrarHogar, setShowModalBorrarHogar] = useState(false);
        const handleCloseModalBorrarHogar = () => setShowModalBorrarHogar(false);
        const handleShowModalModalBorrarHogar = () => setShowModalBorrarHogar(true);

        function borrarHogar(){
            var requestOptions = {
                method: 'DELETE',
                headers: { 'Authorization' : sessionStorage.getItem("token") }
            };
            fetch(process.env.REACT_APP_BASE_URL + "hogars/" + id, requestOptions).then
            (response => {window.location.replace("/")})
        }

        function handleMostrarModalBorrarDispositivo(id){
            setIdDispositivoABorrar(id)
            handleShowModalBorrarDispositivo()
        }
    
        function borrarDispositivo(){
            var requestOptions = {
                method: 'DELETE',
                headers: { 'Authorization' : sessionStorage.getItem("token") }
            };
            fetch(process.env.REACT_APP_BASE_URL + "dispositivos/" + idDispositivoABorrar, requestOptions).then
            (response => {window.location.replace("/edicionHogar/" + id)})
        }

    const ModifyHogar = () => {
        hogar.nombre = nombre
        if (potencia_contratada == null || potencia_contratada == ""){
            setPotencia_contratada(0)
        }
        if(nombre !== ""){
            hogar.potencia_contratada = potencia_contratada
            var requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization' : sessionStorage.getItem("token") },
                body: JSON.stringify(hogar)
              };
              fetch(process.env.REACT_APP_BASE_URL + "hogars/"+hogar.id, requestOptions).then
              (response => {window.location.replace("/hogar/"+hogar.id)})
        }else{
            toast.error("El nombre del hogar no puede quedar vacio")
        }

    }

    const renderTooltipTiempoRefrescado = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          Este parámetro sirve para modificar el tiempo por el cual el dispositivo refresca la información (-tiempo +actualizado).
          Es en minutos y va desde 1 minuto hasta 15 minutos
        </Tooltip>
      );
    
    const renderTooltipTiempoMedida = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          Este parámetro sirve para modificar el tiempo por el cual el dispositivo recoge medidas (- tiempo + precisión).
          Es en segundos y va desde 1 segundo hasta 15 segundos
        </Tooltip>
      );
    
    const renderTooltipNotificacion = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          Al activar las notificaciones recibiras correos cuando el Smart meter 
          se pase a partir del limite máximo indicado en ese apartado. Es en Kwh

          ¡¡Cuidado!! Recomendación no indicar los kwh justos sino un limite máximo
          más bajo por que recuerde que por muy bajo que sea el tiempo de refrescado 
          no será muy preciso.

        </Tooltip>
      );
    
    function actualiarDispositivo(i){
        if(dispositivos[i].nombre !== "" && dispositivos[i].tiempo_medida >= 1 && dispositivos[i].tiempo_medida <= 15 && dispositivos[i].tiempo_refrescado >= 1 && dispositivos[i].tiempo_refrescado <= 15){
            var requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization' : sessionStorage.getItem("token") },
                body: JSON.stringify(dispositivos[i])
              };
              fetch(process.env.REACT_APP_BASE_URL + "dispositivos/"+dispositivos[i].id, requestOptions).then
              (response => {window.location.replace("/hogar/"+hogar.id)})
        }else if (dispositivos[i].nombre === ""){
            toast.error("No se puede dejar el nombre de dispositivo vacio")
        }else if(dispositivos[i].tiempo_medida < 1 || dispositivos[i].tiempo_medida > 15 ){
            toast.error("El tiempo de medida no puede ser menor que 1 ni mayor que 15")
        }else if(dispositivos[i].tiempo_refrescado < 1 || dispositivos[i].tiempo_refrescado > 15 ){
            toast.error("El tiempo de refrescado no puede ser menor que 1 ni mayor que 15")
        }

    }

    if(!loaded){
        return(<Loading />)
    }else{
        return(
            <>
            <ToastContainer />
            {/*Modal para preguntar si quiere borrar un dispositivo*/}
            <Modal show={showModalBorrarDispositivo} onHide={handleCloseModalBorrarDispositivo}>
                <Modal.Header closeButton>
                    <Modal.Title>¿Estás seguro de que quieres borrar el dispositivo?</Modal.Title>
                </Modal.Header>
                <Modal.Body>Los cambios serán permanentes y no podrás recuperarlo una vez borrado</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => {borrarDispositivo()}}>Borrar</Button>
                    <Button variant="primary" onClick={handleCloseModalBorrarDispositivo}>Cerrar</Button>
                </Modal.Footer>
            </Modal>

            {/*Modal para preguntar si quiere borrar el hogar*/}
             <Modal show={showModalBorrarHogar} onHide={handleCloseModalBorrarHogar}>
                <Modal.Header closeButton>
                    <Modal.Title>¿Estás seguro de que quieres borrar el hogar?</Modal.Title>
                </Modal.Header>
                <Modal.Body>Los cambios serán permanentes y no podrás recuperarlo una vez borrado</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => {borrarHogar()}}>Borrar</Button>
                    <Button variant="primary" onClick={handleCloseModalBorrarHogar}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
            <br/>
            <Container>
                <Row>
                    <Col><h1>Hogar: {hogar.nombre}</h1></Col>
                </Row>
                <br/>
                <Row>
                    <Col sm={3}></Col>
                    <Col>
                        <Row>
                            <Col><Row>Nombre:</Row></Col> 
                            <Col sm={6}><Row><input type="text" name="nombre" defaultValue={hogar.nombre} onChange={(e) => setNombre(e.target.value)} maxLength="20" required/></Row></Col>
                        </Row>
                    </Col>
                    <Col sm={3}></Col>
                </Row>
                <br/>
                <Row>
                    <Col sm={3}></Col>
                    <Col>
                        <Row>
                            <Col><Row>Potencia contratada (KW):</Row></Col> 
                            <Col sm={6}><Row><input type="text" name="potencia_contratada" defaultValue={hogar.potencia_contratada} onChange={(e) => setPotencia_contratada(e.target.value)} min="0"/></Row> </Col>
                        </Row>
                    </Col>
                    <Col sm={3}></Col>
                </Row>
                <br/>
                <Row>
                    <Col sm={5}></Col>
                    <Col>
                        <Row>
                            <Col><Row><Button onClick={ModifyHogar}>Actualizar hogar</Button></Row></Col> 
                        </Row>
                    </Col>
                    <Col sm={5}></Col>
                </Row>
                <br/>
                <Row>
                    <h4>Smart meters</h4>
                </Row>
                <Row>
                    <Col sm={2}></Col> 
                    <Col> 
                        {!hayDispositivos &&
                           (<>
                            <h4>Aun no tienes dispositivos creados</h4>
                            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                           </>)
                        }
                        {hayDispositivos &&
                            <Tab.Container id="left-tabs-example" defaultActiveKey={dispositivos[0].id}>
                                <Row>
                                    <Col sm={3}>
                                        <Nav variant="pills" className="flex-column">
                                            {dispositivos.map((dispositivo) => (
                                                <Nav.Item><Nav.Link eventKey={dispositivo.id}>{dispositivo.nombre}</Nav.Link></Nav.Item>
                                            ))}
                                        </Nav>
                                    </Col>
                                    <Col sm={7}>
                                        <Tab.Content>
                                            {dispositivos.map(((dispositivo,i) => (
                                                <Tab.Pane eventKey={dispositivo.id}>
                                                    <Card>
                                                        <Card.Body>
                                                            <Container>
                                                                <Row>
                                                                    <Col sm={1}></Col>
                                                                    <Col>
                                                                        <Row>
                                                                            <Col><Row>Nombre:</Row></Col> 
                                                                            <Col sm={7}><Row><input type="text" name="nombre" defaultValue={dispositivo.nombre} onChange={(e) =>{dispositivos[i].nombre = e.target.value; setDispositivos(dispositivos);}} /></Row></Col>
                                                                        </Row>
                                                                    </Col>
                                                                    <Col sm={3}></Col>
                                                                </Row>
                                                                <br/>
                                                                <Row>
                                                                    <Col sm={1}></Col>
                                                                    <Col>
                                                                        <Row>
                                                                            <Col><Row>General:</Row></Col> 
                                                                            <Col><Row><label><input type={"radio"} name="general" defaultChecked={dispositivo.general} onClick={() =>{dispositivos[i].general = true; setDispositivos(dispositivos);}} />{' '}Sí</label></Row></Col>
                                                                            <Col><Row><label><input type={"radio"} name="general" defaultChecked={!(dispositivo.general)} onClick={() =>{dispositivos[i].general = false; setDispositivos(dispositivos);}} />{' '}No</label></Row></Col>
                                                                        </Row>
                                                                    </Col>
                                                                    <Col sm={3}></Col>
                                                                </Row>
                                                                <br/>
                                                                <Row>
                                                                    <Col sm={2}></Col>
                                                                    <Col sm={6}><Row><h5>Notificaciones</h5></Row></Col>
                                                                    <Col sm={1}><OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltipNotificacion}><img src={iconoI} width="20" height="20" className="d-inline-block align-top"/></OverlayTrigger></Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col sm={1}></Col>
                                                                    <Col>
                                                                        <Row>
                                                                            <Col><Row>Notificacion:</Row></Col> 
                                                                            <Col><Row><label><input type={"radio"} name="notificacion" defaultChecked={dispositivo.notificacion} onClick={() =>{dispositivos[i].notificacion = true; setDispositivos(dispositivos);}}/>{' '}Sí</label></Row></Col>
                                                                            <Col><Row><label><input type={"radio"} name="notificacion" defaultChecked={!(dispositivo.notificacion)} onClick={() =>{dispositivos[i].notificacion = false; setDispositivos(dispositivos);}}/>{' '}No</label></Row></Col>
                                                                        </Row>
                                                                    </Col>
                                                                    <Col sm={3}></Col>
                                                                </Row>
                                                                <br/>
                                                                <Row>
                                                                    <Col sm={1}></Col>
                                                                    <Col>
                                                                        <Row>
                                                                            <Col><Row>Límite mínimo:</Row></Col> 
                                                                            <Col sm={7}><Row><input type="number" name="limite_minimo" defaultValue={dispositivo.limite_minimo} onChange={(e) =>{dispositivos[i].limite_minimo = e.target.value; setDispositivos(dispositivos);}} /></Row></Col>
                                                                        </Row>
                                                                    </Col>
                                                                    <Col sm={3}></Col>
                                                                </Row>
                                                                <br/>
                                                                <Row>
                                                                    <Col sm={1}></Col>
                                                                    <Col>
                                                                        <Row>
                                                                            <Col><Row>Límite máximo:</Row></Col> 
                                                                            <Col sm={7}><Row><input type="number" name="limite_maximo" defaultValue={dispositivo.limite_maximo} onChange={(e) =>{dispositivos[i].limite_maximo = e.target.value; setDispositivos(dispositivos);}} /></Row></Col>
                                                                        </Row>
                                                                    </Col>
                                                                    <Col sm={3}></Col>
                                                                </Row>
                                                                <br/>
                                                                <Row>
                                                                    <Col sm={2}></Col>
                                                                    <Col sm={8}><Row><h5>Configuración dispositivo</h5></Row></Col>
                                                                    <Col sm={1}></Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col sm={1}></Col>
                                                                    <Col>
                                                                        <Row>  
                                                                            <Col><Row>Tiempo refrecado:</Row></Col>
                                                                            <Col sm={5}><Row><input type="number" name="nombre" defaultValue={dispositivo.tiempo_refrescado} onChange={(e) =>{dispositivos[i].tiempo_refrescado = e.target.value; setDispositivos(dispositivos);}}/></Row></Col>
                                                                            <Col sm={1}><OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltipTiempoRefrescado}><img src={iconoI} width="20" height="20" className="d-inline-block align-top"/></OverlayTrigger></Col>
                                                                        </Row>
                                                                    </Col>
                                                                    <Col sm={3}></Col>
                                                                </Row>
                                                                <br/>
                                                                <Row>
                                                                    <Col sm={1}></Col>
                                                                    <Col>
                                                                        <Row>  
                                                                            <Col><Row>Tiempo medida:</Row></Col>
                                                                            <Col sm={5}><Row><input type="number" name="tiempoMedida" defaultValue={dispositivo.tiempo_medida} onChange={(e) =>{dispositivos[i].tiempo_medida = e.target.value; setDispositivos(dispositivos);}}/></Row></Col>
                                                                            <Col sm={1}><OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltipTiempoMedida}><img src={iconoI} width="20" height="20" className="d-inline-block align-top"/></OverlayTrigger></Col>
                                                                        </Row>
                                                                    </Col>
                                                                    <Col sm={3}></Col>
                                                                </Row>
                                                                <br/>
                                                                <Row>
                                                                    <Col sm={2}><Button variant="danger" onClick={() => {handleMostrarModalBorrarDispositivo(dispositivo.id)}}><img src={iconoBorrar} width="20" height="20" className="d-inline-block align-top"/></Button></Col>
                                                                    <Col sm={1}></Col>
                                                                    <Col><Row><Button onClick={() => {actualiarDispositivo(i)}} >Actualizar Smart meter</Button></Row></Col>
                                                                    <Col sm={3}></Col>
                                                                </Row>
                                                            </Container> 
                                                        </Card.Body>
                                                    </Card>
                                                </Tab.Pane>
                                            )))}
                                                           
                                        </Tab.Content>
                                    </Col>
                                </Row>
                            </Tab.Container>
                        } 
                    </Col>
                    <Col sm={2}></Col> 
                </Row>
                <Row>
                    <Col sm={2}><Row><Button variant="danger" onClick={handleShowModalModalBorrarHogar}>Eliminar hogar</Button></Row></Col>
                    <Col sm={6}></Col>
                    <Col sm={6}></Col>
                    <Col sm={6}></Col>
                </Row>
                <br/>
            </Container>
                
            </>
        )
    }

}

export default EdicionHogar;