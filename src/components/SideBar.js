import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Stack } from "react-bootstrap";
import iconoBorrar from "../assets/papelera.png"

function SideBar() {
    const [hogares, setHogares] = useState([])
    const [loaded, isLoaded] = useState(false)
    useEffect(() => {
        var requestOptions = {
            method: 'GET',
            headers: { 'Authorization' : sessionStorage.getItem("token") }
        };
        fetch(process.env.REACT_APP_BASE_URL + "hogars/", requestOptions).then
        (response => response.json()).then
        ((data) => {
            setHogares(data)
            isLoaded(true)
        })
    },[])
    if(!loaded){
        return(<></>)
    }else{
        return (
            <div className="sidenav">
                <h4>Smart Meters</h4>
                {hogares.length > 0 &&
                hogares.map((hogar) =>(
                    <Row>
                        <Card key={"Dark"} bg={"dark"} text={"light"} className="mb-2">
                            <Stack>
                                <Row>
                                    <Button variant="dark" href={hogar.id}>{hogar.nombre}</Button>
                                </Row>
                                <Row>
                                    <Col sm={1}><Button variant="danger"><img src={iconoBorrar} width="15" height="15" className="d-inline-block align-top"/></Button></Col>
                                    <Col sm={6}></Col>
                                    <Col sm={1}><Button>Fav</Button></Col>
                                </Row>
                            </Stack>
                        </Card>
                    </Row>
                ))
                }
            </div>
        );
    }


}

export default SideBar