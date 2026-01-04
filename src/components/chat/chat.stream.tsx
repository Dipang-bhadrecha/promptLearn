import ChatMessage from "./chat.message";
import { useSidebar } from "../ui/sidebar";
import { PanelLeft } from "lucide-react";

const messages: { id: number; role: "assistant" | "user"; content: string }[] = [
  {
    id: 1,
    role: "user",
    content: "Explain how to use docker-compose to run multiple containers"
  },
  {
    id: 2,
    role: "assistant",
    content: "# Docker Compose Guide\n\n## Overview\nDocker Compose is a tool for defining and running multi-container Docker applications. It uses a YAML file to configure your application's services, networks, and volumes.\n\n## Basic Structure\nHere's a simple example of a docker-compose.yml file:\n\n```yaml\nversion: '3.8'\nservices:\n  web:\n    image: nginx:latest\n    ports:\n      - \"80:80\"\n    depends_on:\n      - db\n  db:\n    image: postgres:13\n    environment:\n      POSTGRES_PASSWORD: example\n    volumes:\n      - db_data:/var/lib/postgresql/data\n\nvolumes:\n  db_data:\n```\n\n## Key Components\n\n### Services\n- Define individual containers\n- Specify images, ports, environment variables\n- Set dependencies and links between services\n\n### Networks\n- Services communicate through container names\n- Custom networks for isolation\n- Bridge networks by default\n\n### Volumes\n- Persist data between container restarts\n- Share data between containers\n- Named volumes or bind mounts\n\n## Common Commands\n\n**Start services:**\n```bash\ndocker-compose up\n```\n\n**Run in background:**\n```bash\ndocker-compose up -d\n```\n\n**Stop services:**\n```bash\ndocker-compose down\n```\n\n**View logs:**\n```bash\ndocker-compose logs -f\n```\n\n## Best Practices\n- Use version 3.8 or higher\n- Pin specific image versions\n- Set resource limits\n- Use environment files for secrets\n- Define health checks for critical services\n\nThis makes your containerized application reproducible and easy to scale!"
  }
];

export default function ChatStream() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="relative min-h-screen">

      {/* Header */}
      <div className="absolute left-0 top-0">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-slate-800 transition cursor-pointer"
          title="Toggle sidebar"
        >
          <PanelLeft className="w-5 h-5 text-slate-300 hover:text-white" />
        </button>
      </div>

      {/* Messages Container */}
      <div className="mx-auto max-w-3xl space-y-6 pt-16">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} {...msg} />
        ))}
      </div>
    </div>
  );
}
