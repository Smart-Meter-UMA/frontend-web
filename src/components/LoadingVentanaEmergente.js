import { Col, Container, Row } from 'react-bootstrap';
import ReactLoading from 'react-loading';


function LoadingVentanaEmergente() { 
    return(
        <Container>
            <Row>
                <Col></Col>
                <Col><ReactLoading type="spin" color="#3357FF" width={200} height={200}/></Col>
                <Col></Col>
            </Row>
        </Container>   
    )
}

export default LoadingVentanaEmergente;