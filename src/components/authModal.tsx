"use client";

import AuthForm from "./authForm";

export default function AuthModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      
      <div className="bg-white rounded-2xl w-[900px] max-w-full h-[520px] flex overflow-hidden relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-xl text-gray-400 hover:text-black"
        >
          ✕
        </button>

        {/* Left Image */}
        {/* <div className="w-1/2 hidden md:block">
          <img
            src="/forest-rocket.jpg"
            alt="art"
            className="h-full w-full object-cover"
          />
        </div> */}
        <div className="w-1/2 hidden md:block bg-yellow-500" />


        {/* Right Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-10">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
