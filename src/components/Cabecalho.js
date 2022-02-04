import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

const Cabecalho = () => {
    return (
        <Navbar bg="primary">
            <Navbar.Brand href="/">WeatherNow</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link href="/">Inicio</Nav.Link>
            </Nav>
        </Navbar>
    )
}

export default Cabecalho