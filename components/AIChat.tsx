// app/page.tsx
"use client";

import { useChat } from "@ai-sdk/react";

export default function AIChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat();
  // Default API endpoint is `/api/chat` if not specified in useChat options

  return (
    <div className="flex flex-col h-screen text-dark bg-gray-50">
      {/* Header (Optional) */}
      <header className="bg-white p-4 border-b border-gray-200 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800">AI Chat</h1>
      </header>

      {/* Message List */}
      <div className="flex-1 text-black overflow-y-auto p-6 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-lg  text-black px-4 py-2 rounded-lg shadow ${
                m.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800 border border-gray-200"
              }`}
            >
              <span className="font-semibold capitalize mr-2">{m.role}:</span>
              {/* Render message parts (useful for future multi-modal support) */}
              {m.content.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i !== m.content.split("\n").length - 1 && <br />}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* Display loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-lg shadow bg-gray-100 text-gray-500 border border-gray-200">
              Thinking...
            </div>
          </div>
        )}

        {/* Display error messages */}
        {error && (
          <div className="flex justify-center">
            <div className="px-4 py-2 rounded-lg shadow bg-red-100 text-red-700 border border-red-300">
              Error: {error.message}
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            className="flex-1 text-black p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            placeholder="Ask anything..."
            onChange={handleInputChange}
            disabled={isLoading} // Disable input while loading
          />
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg text-white ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            disabled={isLoading} // Disable button while loading
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
