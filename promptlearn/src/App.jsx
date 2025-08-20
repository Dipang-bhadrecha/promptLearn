import { useState } from 'react';
import PromptArea from "./component/promptArea/promptArea";
import "./styles/promptArea.css";
import Sidebar from "./component/Sidebar/Sidebar";
import "./styles/sidebar.css"; 

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {isSidebarOpen && <Sidebar />}
      <PromptArea isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
    </div>
  );
}

