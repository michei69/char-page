import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Dev from "./pages/Dev";
import CharacterPage from "./pages/CharacterPage";
import "./App.css";
import Editor from "./pages/Editor";
import { ToastContainer } from "react-toastify";
import { ContextMenuProvider } from "./components/ContextMenuContext";
function App() {
    return (
        <BrowserRouter>
            <ContextMenuProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dev" element={<Dev />} />
                    <Route path="/character/:id" element={<CharacterPage />} />
                    <Route path="/edit/:id" element={<Editor />} />
                </Routes>
            </ContextMenuProvider>

            <ToastContainer theme="dark" newestOnTop={true} />
        </BrowserRouter>
    );
}

export default App;
