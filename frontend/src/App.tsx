import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./layouts/Layout.tsx";
import Dashboard from "./pages/Dashboard.tsx";


function App() {

    return (

        <BrowserRouter>

            <Routes>
                <Route path={"/"} element={<Layout/>}>
                    <Route index element={<Dashboard/>}/>
                    <Route path={"controls"} element={<div>Controles</div>}/>
                    <Route path={"access"} element={<div>Accesos</div>}/>
                    <Route path={"events"} element={<div>Eventos</div>}/>
                </Route>
            </Routes>


        </BrowserRouter>


    )
}

export default App
