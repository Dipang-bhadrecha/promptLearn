import styles from '../../styles/Sidebar.module.css';

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h1>Chat History</h1>
      </div>
      <div className={styles.content}>
        {/* Add chat history items here */}
      </div>
    </div>
  );
}