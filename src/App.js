import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import AdvancedJS from "./components/AdvancedJS";
import FAQ from "./components/FAQ";
import Invoice from "./components/Invoice";
import "./App.css";

function Layout() {
  const location = useLocation();
  const titles = {
    "/extension": "JavaScript Extension",
    "/faq": "Frequently Asked Questions",
    "/invoice": "Repair Booking"
  };
  const title = titles[location.pathname] || "Phone Fix Booking System";

  return (
    <>
      <NavBar />
      <Header title={title} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/extension" element={<AdvancedJS />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/invoice" element={<Invoice />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL || "/"}>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
