// src/App.jsx
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import UrlListPage from "./pages/urls.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="container main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/urls" element={ <UrlListPage/>} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
