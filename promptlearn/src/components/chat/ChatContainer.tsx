import { useState } from 'react';
import Message from './Message';
import InputArea from './InputArea';
import styles from '../../styles/ChatContainer.module.css';

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hello! How can I help you today?", isUser: false, timestamp: new Date() }
  ]);

  const handleSend = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now().toString(),
        text: "I'm an AI response to: " + text,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.messages}>
        {messages.map(message => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      <InputArea onSend={handleSend} />
    </div>
  );
}