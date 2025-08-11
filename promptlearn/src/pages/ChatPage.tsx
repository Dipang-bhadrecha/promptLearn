import Sidebar from '../components/sidebar/Sidebar';
import ChatContainer from '../components/chat/ChatContainer';
import styles from './ChatPage.module.css';

export default function ChatPage() {
  return (
    <div className={styles.container}>
      <Sidebar />
      <ChatContainer />
    </div>
  );
}