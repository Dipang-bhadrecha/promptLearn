import { useState } from 'react';
import '../../styles/promptArea.css';   

const PromptArea = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // TODO: Handle message submission
    console.log('Submitted:', message);
    setMessage('');
  };

  return (
    <div className="prompt-container">
      <div className="chat-area">
        {/* <div className="chat-header">
          <h2>Chat with AI</h2>
        </div> */}
        <div className="messages-container">
          {/* Messages will be rendered here */}
        </div>
      </div>
      {/* <form className="prompt-form" onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          className="prompt-input"
        />
        <button type="submit" className="submit-button">
          Send
        </button>
      </form> */}
    </div>
  );
};

export default PromptArea;