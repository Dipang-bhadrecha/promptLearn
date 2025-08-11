import { format } from 'date-fns';
import styles from './styles.module.css';

interface MessageProps {
  message: Message;
}

export default function Message({ message }: MessageProps) {
  return (
    <div className={`${styles.message} ${message.isUser ? styles.user : styles.ai}`}>
      <div className={styles.content}>
        {message.text}
      </div>
      <div className={styles.timestamp}>
        {format(message.timestamp, 'HH:mm')}
      </div>
    </div>
  );
}