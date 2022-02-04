import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
//import Jumbotron from 'react-bootstrap/Jumbotron'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import Spinner from 'react-bootstrap/Spinner'
import Toast from 'react-bootstrap/Toast'
import Alert from 'react-bootstrap/Alert'
import { FaCloudversify, FaCloudRain, FaArrowDown, FaArrowUp } from 'react-icons/fa'

import Cabecalho from 'components/Cabecalho'

function App() {

    const [cidade, setCidade] = useState('')
    const [clima, setClima] = useState(null)
    const [obtendoClima, setObtendoClima] = useState(false)
    const [erro, setErro] = useState(false)
    const [erroGeo, setErroGeo] = useState(false)

    const listaErrosGeo = [{ "codigo": 1, "texto": "Não foi dada permissão para o sistema encontrar a sua localização!" },
    { "codigo": 2, "texto": "Não foi possível obter a sua localização!" },
    { "codigo": 3, "texto": "O tempo para obter a sua localização foi expirado!" }]

    useEffect(() => {
        const apigeo = process.env.REACT_APP_APIGEO
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                console.log(position)
                obtemCidade(position.coords.latitude, position.coords.longitude)
            }, function (error) {
                console.error(error)
                setErroGeo(error.code)
            })
        }
        async function obtemCidade(latitude, longitude) {
            let url = `https◘//api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apigeo}`
            await fetch(url)
                .then(response => response.json())
                .then(data => {
                    //console.log(data)
                    setCidade(data.results[0].components.city + ', ' + data.results[0].components.country)
                })
                .catch(function (error) {
                    console.error(`Não foi possível buscar a cidade a partir da lat/long. Erro: ${error.message}`)
                })
        }
    }, [])

    async function obtemClima(cidade) {
        setObtendoClima(true)
        const apiweather = process.env.REACT_APP_APIWEATHER
        let urlClima = `http://api.openweathermap.org/data/2.5/weather?q=${cidade}&lang=pt&units=metric&appid=${apiweather}`

        await fetch(urlClima)
            .then(response => response.json())
            .then(data => {
                switch (data.cod) {
                    case '401':
                        setErro('A API Key informada é inválida!')
                        setClima(null)
                        break
                    case '404':
                        setErro('A cidade informada não existe!')
                        setClima(null)
                        setCidade('')
                        break
                    case '429':
                        setErro('O uso gratuito da API foi excedido! (60 chamadas por minuto)')
                        setClima(null)
                        break
                    default:
                        setClima(data)
                }
            })
            .catch(function (error) {
                console.error(`Erro ao obter o clima: ${error.message}`)
            })
        setObtendoClima(false)
    }

    return (
        <>
            <Cabecalho />

            <Form inline>
                <FormControl type="text" value={cidade} placeholder="Informe a cidade..."
                    onChange={event => setCidade(event.target.value)} />
                &nbsp;
                <Button variant="secondary" onClick={() => obtemClima(cidade)} disabled={cidade.length < 3}> {obtendoClima ? <Spinner size="sm" animation="border" /> : <FaCloudversify />}Obter Clima</Button>
            </Form>

            {/*<Jumbotron>
                <h1><FaCloudRain /> FateClima</h1>
                <p>
                    Consulte o clima de qualquer cidade do mundo. <br></br>
                    App desenvolvido em RectJS e integrado com a API OpenWeatherMap.
                </p>
            </Jumbotron>*/}

            {erroGeo &&
                <Alert variant="danger" onClose={() => setErroGeo(null)} dismissible>
                    <Alert.Heading>Ops! Ocorreu um erro ao obter a sua localização.</Alert.Heading>
                    <p>{listaErrosGeo[erroGeo].texto}</p>
                </Alert>
            }

            {erro &&
                <Toast onClose={() => setErro(null)} delay={4000} autohide className="bg-danger">
                    <Toast.Header>
                        <strong className="mr-auto">{erro}</strong>
                        <small>😞</small>
                    </Toast.Header>
                    <Toast.Body className="bg-white text-danger">
                        Por favor, faça uma nova busca.
                    </Toast.Body>
                </Toast>
            }

            {obtendoClima &&
                <Row className="justify-content-center">
                    <Spinner animation="border" variant="primary" />
                </Row>
            }

            <Row className="justify-content-center">
                {clima &&
                    <Card bg="primary" className="text-center">
                        <Card.Header>
                            <h2>{clima.name}</h2>
                            <h3>{clima.main.temp}&#x2103;</h3>
                            <h5>min: {clima.main.temp_min}&#x2103;<FaArrowDown className="text-danger" /> - máx: {clima.main.temp_max}&#x2103;<FaArrowUp className="text-success" /></h5>
                            <Card.Body>
                                <Card.Img src={`http://openweathermap.org/img/wn/${clima.weather[0].icon}@4x.png`}
                                    title={clima.weather[0].description} />
                                <Card.Title className="text-light">{clima.weather[0].description}</Card.Title>
                            </Card.Body>
                            <Card.Footer className="text-white">
                                Atualizado em: {new Date(clima.dt * 1000).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
                            </Card.Footer>
                        </Card.Header>
                    </Card>
                }
            </Row>

        </>
    )
}

export default App;