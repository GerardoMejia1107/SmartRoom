import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./layouts/Layout.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Events from "./pages/Events.tsx";
import Access from "./pages/Access.tsx";
import {Toaster} from "react-hot-toast";


function App() {

    return (

        <>
            <Toaster position={"top-center"}/>
            <BrowserRouter>

                <Routes>
                    <Route path={"/"} element={<Layout/>}>
                        <Route index element={<Dashboard/>}/>
                        <Route path={"access"} element={<Access/>}/>
                        <Route path={"events"} element={<Events/>}/>
                    </Route>
                </Routes>


            </BrowserRouter></>


    )
}

export default App
