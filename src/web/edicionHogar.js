import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Modal,Tab, Nav, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import iconoBorrar from "../assets/papelera.png"


function EdicionHogar(){
    let {id} = useParams()

    const [hogar, setHogar] = useState(null)
    const [loaded, isLoaded] = useState(false)
    const [nombre, setNombre] = useState("");
    const [potencia_contratada, setPotencia_contratada] = useState(null);
    
    const [hayDispositivos, setHayDispositivos] = useState(false)
    const [dispositivos, setDispositivos] = useState([])
    
    useEffect(() =>{
        fetch(process.env.REACT_APP_BASE_URL + "hogars/" + id).then
        (response => response.json()).then
        ((data) => {
            setHogar(data)
            setNombre(data.nombre)
            setPotencia_contratada(data.potencia_contratada)
            fetch(process.env.REACT_APP_BASE_URL + "hogars/" + id + "/dispositivos").then
            (response => response.json()).then
            ((data) => {
                setDispositivos(data)
                if(data.length !== 0){
                    setHayDispositivos(true)
                }else{
                    setHayDispositivos(false)
                }
                isLoaded(true)
            })
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
                method: 'DELETE'
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
                method: 'DELETE'
            };
            fetch(process.env.REACT_APP_BASE_URL + "dispositivos/" + idDispositivoABorrar, requestOptions).then
            (response => {window.location.replace("/edicionHogar/" + id)})
        }

    const ModifyHogar = () => {
        hogar.nombre = nombre
        if (potencia_contratada == null || potencia_contratada == ""){
            setPotencia_contratada(0)
        }
        hogar.potencia_contratada = potencia_contratada
        var requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(hogar)
          };
          fetch(process.env.REACT_APP_BASE_URL + "hogars/"+hogar.id, requestOptions).then
          (response => {window.location.replace("/hogar/"+hogar.id)})
    }

    if(!loaded){
        return(<Loading />)
    }else{
        return(
            <>
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
                            <Tab.Container id="left-tabs-example" defaultActiveKey={dispositivos[0].nombre}>
                                <Row>
                                    <Col sm={3}>
                                        <Nav variant="pills" className="flex-column">
                                            {dispositivos.map((dispositivo) => (
                                                <Nav.Item><Nav.Link eventKey={dispositivo.nombre}>{dispositivo.nombre}</Nav.Link></Nav.Item>
                                            ))}
                                        </Nav>
                                    </Col>
                                    <Col sm={7}>
                                        <Tab.Content>
                                            {dispositivos.map((dispositivo => (
                                                <Tab.Pane eventKey={dispositivo.nombre}>
                                                    <Card>
                                                        <Card.Body>
                                                            <Container>
                                                                <Row>
                                                                    <Col sm={1}></Col>
                                                                    <Col>
                                                                        <Row>
                                                                            <Col><Row>Nombre:</Row></Col> 
                                                                            <Col sm={7}><Row><input type="text" name="nombre" defaultValue={dispositivo.nombre}/></Row></Col>
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
                                                                            <Col><Row><label><input type={"radio"} name="general" value="SI" />{' '}Sí</label></Row></Col>
                                                                            <Col><Row><label><input type={"radio"} name="general" value="NO" />{' '}No</label></Row></Col>
                                                                        </Row>
                                                                    </Col>
                                                                    <Col sm={3}></Col>
                                                                </Row>
                                                                <br/>
                                                                <Row>
                                                                    <Col sm={2}></Col>
                                                                    <Col sm={6}><Row><h5>Notificaciones</h5></Row></Col>
                                                                    <Col></Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col sm={1}></Col>
                                                                    <Col>
                                                                        <Row>
                                                                            <Col><Row>Límite mínimo:</Row></Col> 
                                                                            <Col sm={7}><Row><input type="text" name="nombre" defaultValue={dispositivo.limite_minimo}/></Row></Col>
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
                                                                            <Col sm={7}><Row><input type="text" name="nombre" defaultValue={dispositivo.limite_maximo}/></Row></Col>
                                                                        </Row>
                                                                    </Col>
                                                                    <Col sm={3}></Col>
                                                                </Row>
                                                                <br/>
                                                                <Row>
                                                                    <Col sm={2}><Button variant="danger" onClick={() => {handleMostrarModalBorrarDispositivo(dispositivo.id)}}><img src={iconoBorrar} width="20" height="20" className="d-inline-block align-top"/></Button></Col>
                                                                    <Col sm={1}></Col>
                                                                    <Col><Row><Button>Actualizar Smart meter</Button></Row></Col>
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

            </Container>
                
            </>
        )
    }

}

export default EdicionHogar;