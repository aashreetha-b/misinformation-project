"use client"

import { useState } from "react"
import axios from "axios"

function Home() {
  const [text, setText] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleTextChange = (e) => {
    setText(e.target.value)
    // Clear previous results when text changes
    if (result) setResult(null)
    if (error) setError(null)
  }

  const analyzeText = async () => {
    if (!text.trim()) {
      setError("Please enter some text to analyze")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axios.post("http://localhost:5000/analyze", { text })
      setResult(response.data)
    } catch (err) {
      console.error("Error analyzing text:", err)
      setError(
        err.response?.data?.message ||
          "Failed to analyze text. Please check your network connection or try again later.",
      )
    } finally {
      setLoading(false)
    }
  }

  const getResultClass = () => {
    if (!result) return ""

    // Assuming higher scores are more concerning
    if (result.score > 0.7) return "result-high"
    if (result.score > 0.4) return "result-medium"
    return "result-low"
  }

  return (
    <div className="home-container">
      <h2>Text Analysis</h2>
      <p className="description">Paste or type text below to analyze it for potential misinformation or hate speech.</p>

      <div className="analysis-form">
        <textarea
          className="text-input"
          placeholder="Enter text to analyze..."
          value={text}
          onChange={handleTextChange}
          rows={6}
        />

        <button className="analyze-button" onClick={analyzeText} disabled={loading || !text.trim()}>
          {loading ? "Analyzing..." : "Analyze Text"}
        </button>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Analyzing your text...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className={`result-container ${getResultClass()}`}>
          <h3>Analysis Results</h3>
          <div className="result-item">
            <span className="result-label">Analysis:</span>
            <span className="result-value">{result.analysis}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Score:</span>
            <span className="result-value">{(result.score * 100).toFixed(2)}%</span>
          </div>
          <div className="result-item">
            <span className="result-label">Sentiment:</span>
            <span className="result-value">{result.sentiment}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Toxicity:</span>
            <span className="result-value">{(result.toxicity * 100).toFixed(2)}%</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home

