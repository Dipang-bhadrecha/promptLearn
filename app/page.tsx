// app/page.tsx
import React from "react";
import { AppSidebar } from "../components/app.sidebar";

export default function HomePage() {
  return (
    <div className="flex">
      <AppSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Welcome to My App</h1>
        <p>Here is your main content.</p>
      </main>
    </div>
  );
}
