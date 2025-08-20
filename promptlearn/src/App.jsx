
import PromptArea from "./component/promptArea/promptArea";
import "./styles/promptArea.css";
import Sidebar from "./component/Sidebar/Sidebar";
import "./styles/sidebar.css"; 

export default function App() {
  return (
    <div className="app-root">
      <Sidebar />
      <PromptArea />
    </div>
  );
}

