import React, { useState } from 'react';
import './App.css';
import Chatbot from './components/Chatbot';
import MessageForm from './components/MessageForm';
import Tittle from './components/Tittle';

function App() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = (message) => {
    console.log(message)
    // Add the user's message to the messages state along with previous messages
    const newMessage = { text: message, sender: 'user' };
    setMessages([...messages, newMessage]);
  };

  const handleBotResponse = (response) => {
    // Add the bot's response to the messages state along with previous messages
    setMessages([...messages, { text: response, sender: 'bot' }]);
  };

  const handleError = (errorMsg) => {
    console.log('Error:', errorMsg);
    // Update the error state with the error message
    setError(errorMsg);
  };

  return (
    <div className="App">
      <div className="App-header">
        <div className="header-content">
          <Tittle />
        </div>
     </div>
     <main>
        <div className="chat-container">
          <Chatbot messages={messages} error={error} /> {/* Pass error prop to Chatbot */}
        </div>
      </main>
      <footer>
        <MessageForm onSubmit={handleSubmit} onBotResponse={handleBotResponse} onError={handleError} />
      </footer>
    </div>
  );
}

export default App;
