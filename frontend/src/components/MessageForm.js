import React, { useState } from 'react';

const MessageForm = ({ onSubmit, onBotResponse, onError }) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = inputText.trim();

    if (message !== '') {
      setIsLoading(true);
      try {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: message }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Check if the response contains an error message
        if (data.error) {
          throw new Error(data.error.message);
        }

        const query = { text: message, sender: 'user' };
        const botResponse = { text: data.response, sender: 'bot' };
        
        onSubmit(query.text)
        onBotResponse(botResponse.text);
      } catch (error) {
        onError('The bot is unable to answer the question.');
      } finally {
        setIsLoading(false);
        setInputText('');
      }
    }
  };

  return (
    <div className="message-form">
      <form onSubmit={handleSubmit} className="message-form">
      <textarea
          placeholder="Ask me a question related to IoT..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="message-input"
        ></textarea>
        <button type="submit" className="send-button" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default MessageForm;
