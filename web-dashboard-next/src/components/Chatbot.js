"use client"

import { useState, useRef, useEffect } from "react"

function Chatbot() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your misinformation detection assistant. How can I help you today?", sender: "bot" },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const sendMessage = async (e) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add user message to chat
    const userMessage = { id: messages.length + 1, text: input, sender: "user" }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      // Replace with your actual chatbot endpoint
      const endpoint = "https://your-chatbot-endpoint"

      // For demo purposes, we'll simulate a response
      // In production, uncomment the axios call and use your actual endpoint

      /*
      const response = await axios.post(endpoint, {
        message: input
      });
      const botMessage = { id: messages.length + 2, text: response.data.reply, sender: 'bot' };
      */

      // Simulated response (remove this in production)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const simulatedResponses = [
        "I've analyzed this claim and found it to be potentially misleading. Here's why...",
        "This appears to be accurate information based on current data.",
        "I'm detecting some elements of misinformation in this statement. Let me explain...",
        "I need more context to properly evaluate this claim. Could you provide more details?",
        "This is a common misconception. The facts actually indicate that...",
      ]
      const randomResponse = simulatedResponses[Math.floor(Math.random() * simulatedResponses.length)]
      const botMessage = { id: messages.length + 2, text: randomResponse, sender: "bot" }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error sending message to chatbot:", error)
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: "bot",
        isError: true,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chatbot-container">
      <h2>Misinformation Detection Chatbot</h2>
      <p className="description">
        Ask questions about news articles, social media posts, or any content you're unsure about.
      </p>

      <div className="chat-interface">
        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`chat-message ${message.sender} ${message.isError ? "error" : ""}`}>
              {message.text}
            </div>
          ))}
          {loading && (
            <div className="chat-message bot loading">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-form" onSubmit={sendMessage}>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            disabled={loading}
            className="chat-input"
          />
          <button type="submit" disabled={loading || !input.trim()} className="send-button">
            Send
          </button>
        </form>
      </div>

      <div className="chatbot-info">
        <h3>How to use the chatbot</h3>
        <ul>
          <li>Ask about specific claims or news articles</li>
          <li>Request fact-checking on statements</li>
          <li>Inquire about reliable sources on a topic</li>
          <li>Learn about common misinformation patterns</li>
        </ul>
      </div>
    </div>
  )
}

export default Chatbot

