import React from 'react';

const Chatbot = ({ messages, error }) => {
  console.log(messages)
  return (
    <div>
      {messages.map((message, index) => (
        <div key={index} className={`message ${message.sender}`}>
          {message.sender === 'user' && (
            <div className="user-message">User: {message.text}</div>
          )}
          {message.sender === 'bot' && (
            <div className='bot-message-container'>
            <div className="bot-name"> BOT</div>
            <div className="bot-message"> {message.text}</div>
          </div>
          )}
        </div>
      ))}
      {/* {error && (
        <div className="message bot-message">
          Bot: {error}
        </div>
      )} */}
    </div>
  );
};

export default Chatbot;
