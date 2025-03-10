function ExtensionInfo() {
  return (
    <div className="extension-container">
      <h2>Browser Extension</h2>
      <p className="description">Install our browser extension to detect misinformation as you browse the web.</p>

      <div className="extension-features">
        <div className="feature-item">
          <h3>Real-time Analysis</h3>
          <p>Get instant alerts when browsing potentially misleading content.</p>
        </div>

        <div className="feature-item">
          <h3>Source Credibility</h3>
          <p>See reliability ratings for news sources and websites.</p>
        </div>

        <div className="feature-item">
          <h3>Fact Checking</h3>
          <p>Access fact-checking resources with a single click.</p>
        </div>

        <div className="feature-item">
          <h3>Privacy Focused</h3>
          <p>Your browsing data stays on your device.</p>
        </div>
      </div>

      <div className="download-section">
        <h3>Download for your browser</h3>
        <div className="browser-buttons">
          <a href="#" className="browser-button chrome">
            <span className="browser-icon">Chrome</span>
            Download for Chrome
          </a>
          <a href="#" className="browser-button firefox">
            <span className="browser-icon">Firefox</span>
            Download for Firefox
          </a>
          <a href="#" className="browser-button edge">
            <span className="browser-icon">Edge</span>
            Download for Edge
          </a>
        </div>
        <p className="extension-note">Note: Extension is currently in beta. Some features may be limited.</p>
      </div>

      <div className="installation-guide">
        <h3>Installation Guide</h3>
        <ol>
          <li>Click the download button for your browser</li>
          <li>Confirm the extension installation when prompted</li>
          <li>Pin the extension to your toolbar for easy access</li>
          <li>Click the extension icon to configure settings</li>
        </ol>
      </div>
    </div>
  )
}

export default ExtensionInfo

