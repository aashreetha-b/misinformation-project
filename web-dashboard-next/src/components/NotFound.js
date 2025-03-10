import { Link } from "react-router-dom"

function NotFound() {
  return (
    <div className="not-found-container">
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <div className="not-found-image">404</div>
      <p>Here are some helpful links:</p>
      <ul className="helpful-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/chat">Chatbot</Link>
        </li>
        <li>
          <Link to="/extension">Extension</Link>
        </li>
      </ul>
    </div>
  )
}

export default NotFound

