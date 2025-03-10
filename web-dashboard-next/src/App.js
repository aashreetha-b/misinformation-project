import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom"
import Home from "./components/Home"
import Dashboard from "./components/Dashboard"
import Chatbot from "./components/Chatbot"
import ExtensionInfo from "./components/ExtensionInfo"
import NotFound from "./components/NotFound"
import "./App.css"

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Misinformation Detection</h1>
          <nav className="main-nav">
            <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Home
            </NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Dashboard
            </NavLink>
            <NavLink to="/chat" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Chatbot
            </NavLink>
            <NavLink to="/extension" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Extension
            </NavLink>
          </nav>
        </header>

        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chatbot />} />
            <Route path="/extension" element={<ExtensionInfo />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>© {new Date().getFullYear()} Misinformation Detection Project</p>
        </footer>
      </div>
    </Router>
  )
}

export default App

