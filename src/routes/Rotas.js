import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'

import Inicio from 'pages/Inicio'

export default function Rotas() {
    return (
        <HashRouter>
            <Routes>
                <Route exact path='/' element={<Inicio />} />
            </Routes>
        </HashRouter>
    )
}