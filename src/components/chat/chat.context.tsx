"use client";
 
import { useChatUIStore } from "./chat-ui.store";
import { PanelRight, PanelRightClose } from "lucide-react";

export default function ChatContext() {
   const { contextCollapsed, toggleContext } = useChatUIStore();

  return (
    <div className=" space-y-3 ">
      
      {/* Header Section */}
      {/* <div className="sticky top-0 bg-gradient-to-r from-slate-950/95 to-slate-900/95 backdrop-blur-sm p-4  rounded-xl border border-slate-800/50 mb-2">
        <h2 className="text-base font-semibold text-cyan-300 tracking-wide">Conversation Context</h2>
        <p className="text-xs text-slate-400 mt-1">Your learning journey</p>
      </div> */}
      <div className="sticky top-0 flex items-center justify-between
                      bg-gradient-to-r from-slate-950/95 to-slate-900/95
                      backdrop-blur-sm p-4 rounded-xl border border-slate-800/50">

        <div>
          <h2 className="text-base font-semibold text-cyan-300">
            Conversation Context
          </h2>
          <p className="text-xs text-slate-400">
            Your learning journey
          </p>
        </div>

        <button
          onClick={toggleContext}
          className="p-2 rounded-md hover:bg-slate-800"
        >
          <PanelRightClose className="w-4 h-4 text-slate-300" />
        </button>
      </div>


      {/* Context Items */}
      <section className="group rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-900/60 p-4 hover:from-slate-800/60 hover:to-slate-800/40 border border-slate-700/40 hover:border-cyan-500/30 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-cyan-500/10">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 opacity-60 group-hover:opacity-100 transition"></div>
          <p className="text-sm font-medium text-slate-200 leading-relaxed">
            What is a Docker Compose file?
          </p>
        </div>
      </section>

      <section className="group rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-900/60 p-4 hover:from-slate-800/60 hover:to-slate-800/40 border border-slate-700/40 hover:border-cyan-500/30 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-cyan-500/10">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 opacity-60 group-hover:opacity-100 transition"></div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-200 leading-relaxed">
              What is the difference between Docker and Docker Compose?
            </p>
            <p className="text-xs text-slate-400 italic">Docker vs Compose comparison</p>
          </div>
        </div>
      </section>

      <section className="group rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-900/60 p-4 hover:from-slate-800/60 hover:to-slate-800/40 border border-slate-700/40 hover:border-cyan-500/30 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-cyan-500/10">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 opacity-60 group-hover:opacity-100 transition"></div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-200 leading-relaxed">
              Multi-container orchestration best practices
            </p>
            <p className="text-xs text-slate-400 italic">Container management</p>
          </div>
        </div>
      </section>

      <section className="group rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-900/60 p-4 hover:from-slate-800/60 hover:to-slate-800/40 border border-slate-700/40 hover:border-cyan-500/30 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-cyan-500/10">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 opacity-60 group-hover:opacity-100 transition"></div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-200 leading-relaxed">
              Service networking and communication patterns
            </p>
            <p className="text-xs text-slate-400 italic">Network configuration</p>
          </div>
        </div>
      </section>

      <section className="group rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-900/60 p-4 hover:from-slate-800/60 hover:to-slate-800/40 border border-slate-700/40 hover:border-cyan-500/30 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-cyan-500/10">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 opacity-60 group-hover:opacity-100 transition"></div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-200 leading-relaxed">
              Volume management and data persistence
            </p>
            <p className="text-xs text-slate-400 italic">Storage and persistence</p>
          </div>
        </div>
      </section>

      <section className="group rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-900/60 p-4 hover:from-slate-800/60 hover:to-slate-800/40 border border-slate-700/40 hover:border-cyan-500/30 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-cyan-500/10">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 opacity-60 group-hover:opacity-100 transition"></div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-200 leading-relaxed">
              Environment variables and configuration management
            </p>
            <p className="text-xs text-slate-400 italic">Configuration setup</p>
          </div>
        </div>
      </section>

      <section className="group rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-900/60 p-4 hover:from-slate-800/60 hover:to-slate-800/40 border border-slate-700/40 hover:border-cyan-500/30 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-cyan-500/10">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 opacity-60 group-hover:opacity-100 transition"></div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-200 leading-relaxed">
              Health checks and service dependencies
            </p>
            <p className="text-xs text-slate-400 italic">Service orchestration</p>
          </div>
        </div>
      </section>

      <section className="group rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-900/60 p-4 hover:from-slate-800/60 hover:to-slate-800/40 border border-slate-700/40 hover:border-cyan-500/30 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-cyan-500/10">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 opacity-60 group-hover:opacity-100 transition"></div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-200 leading-relaxed">
              Production deployment strategies
            </p>
            <p className="text-xs text-slate-400 italic">Deployment and scaling</p>
          </div>
        </div>
      </section>

      <section className="group rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-900/60 p-4 hover:from-slate-800/60 hover:to-slate-800/40 border border-slate-700/40 hover:border-cyan-500/30 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-cyan-500/10">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 opacity-60 group-hover:opacity-100 transition"></div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-200 leading-relaxed">
              Common troubleshooting patterns and debugging
            </p>
            <p className="text-xs text-slate-400 italic">Debugging techniques</p>
          </div>
        </div>
      </section>

      {/* Action Button */}
      <div className="sticky bottom-0 pt-4 bg-gradient-to-t from-slate-950 to-transparent">
        <button className="w-full group relative px-6 py-3 rounded-lg font-semibold text-sm overflow-hidden transition-all duration-300">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 group-hover:from-cyan-500/20 group-hover:to-blue-500/20 transition-all"></div>
          
          {/* Border and glow */}
          <div className="absolute inset-0 border border-cyan-500/30 rounded-lg group-hover:border-cyan-400/60 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all"></div>
          
          {/* Text */}
          <span className="relative flex items-center justify-center gap-2 text-cyan-300 group-hover:text-cyan-100">
            <span>✨</span>
            Generate Follow-up Question
            <span className="group-hover:translate-x-1 transition">→</span>
          </span>
        </button>
        <p className="text-xs text-slate-500 text-center mt-2 group-hover:text-slate-400 transition">
          Ask a deeper question to explore this topic further
        </p>
      </div>

    </div>
  );
}
