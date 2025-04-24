// app/page.tsx
"use client";

import { useAssistant } from "@ai-sdk/react"; // Import useAssistant
import { useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { IoMdSend } from "react-icons/io";

export default function AssistantChat() {
  const {
    status,
    messages,
    input,
    submitMessage,
    handleInputChange,
    error,
    threadId,
  } = useAssistant({
    api: "/api/assistant", // Point to our new assistant API route
  });

  // Optional: Log thread ID changes (useful for debugging or persistence)
  useEffect(() => {
    if (threadId) {
      console.log("Current Thread ID:", threadId);
      // You could store the threadId in localStorage here to persist across sessions
    }
  }, [threadId]);

  // Handle form submission using submitMessage
  const handleFormSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault(); // Prevent default form submission if called from form onSubmit
    if (input.trim()) {
      // Only submit if input is not just whitespace
      submitMessage();
    }
  };

  // Handle Enter key press for submission (Shift+Enter for new line)
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent new line on Enter
      handleFormSubmit(); // Trigger submission
    }
    // Shift+Enter will naturally create a new line in the textarea
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-screen bg-gray-100 lg:p-8">
      {" "}
      {/* Optional: Adds padding and a background on large screens */}
      {/* Chat Component Container */}
      <div
        className="flex flex-col
    w-full h-screen                     
    bg-brand-surface                   
    shadow-lg                           

    lg:max-w-5xl                        
    lg:h-[calc(100vh-4rem)]             
    lg:rounded-lg                        
    lg:border lg:border-brand-sage      
    overflow-hidden"
      >
        <div className="flex justify-center items-center min-h-screen w-screen bg-gray-100 lg:p-8">
          {/* Chat Component Container */}
          <div
            className="
        flex flex-col
        w-full h-screen                      {/* Mobile: Full width and height */}
        bg-brand-surface
        shadow-lg

        lg:max-w-5xl                         {/* Desktop: Max width */}
        lg:h-[calc(100vh-4rem)]              {/* Desktop: Reduced height */}
        lg:rounded-lg
        lg:border lg:border-brand-sage
        overflow-hidden                      {/* Crucial to contain children */}
      "
          >
            {/* Header */}
            <header className="bg-brand-altsurface p-4 border-b text-cyan-300 border-brand-sage shadow-sm shrink-0">
              <h1 className="text-xl font-semibold text-cyan-300">
                Camper Assistant: 2021 Forest River Flagstaff Epro 20BHS
              </h1>
              {threadId && (
                <p className="text-xs text-gray-400 mt-1">
                  Thread: {threadId} {"- (Debugging purposes.)"}
                </p>
              )}
            </header>

            {/* Message List */}
            <div className="flex-1 bg-brand-surface overflow-y-auto p-6 space-y-4">
              {/* ... (message mapping code remains the same) ... */}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`whitespace-pre-wrap max-w-lg px-4 py-2 rounded-lg shadow ${
                      m.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-brand-sage text-white"
                    }`}
                  >
                    <span className="font-semibold capitalize mr-2">
                      {m.role}:
                    </span>
                    {typeof m.content === "string"
                      ? m.content.split("\n").map((line, i) => (
                          <span key={i}>
                            {line}
                            {i !== m.content.split("\n").length - 1 && <br />}
                          </span>
                        ))
                      : JSON.stringify(m.content)}
                  </div>
                </div>
              ))}
              {status === "in_progress" && (
                <span className="text-gray-500 text-center">Loading...</span>
              )}{" "}
              {/* Loading indicator */}
              {error && (
                <div className="text-red-500 text-center">{error?.message}</div>
              )}{" "}
              {/* Error message */}
            </div>

            {/* --- Input Form Area --- */}
            <div className="p-3 bg-white border-t border-brand-sage shrink-0">
              {" "}
              {/* Slightly reduced padding */}
              {/* Form now has relative positioning context */}
              <form
                onSubmit={handleFormSubmit}
                className="relative flex items-end"
              >
                {" "}
                {/* Use items-end */}
                <TextareaAutosize
                  rows={1}
                  maxRows={5} // Limit max height to 5 rows
                  className="flex-1 py-2 px-3 pr-12 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 text-black bg-white" // Added padding-right (pr-12), resize-none
                  value={input}
                  placeholder="Ask the assistant..."
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown} // Add keydown handler
                  disabled={status === "in_progress"}
                />
                <button
                  type="submit"
                  className={`absolute bottom-1 right-2 p-2 rounded-md text-xl ${
                    // Positioned bottom-right inside the area
                    input.trim() && status !== "in_progress"
                      ? "text-blue-600 hover:text-blue-800" // Enabled state color
                      : "text-gray-400" // Disabled state color
                  } focus:outline-none focus:ring-1 focus:ring-blue-300 disabled:text-gray-400 transition-colors duration-150`}
                  disabled={!input.trim() || status === "in_progress"} // Disable if input is empty or assistant is busy
                  aria-label="Send message" // Accessibility label
                >
                  <IoMdSend /> {/* Use the imported icon */}
                </button>
              </form>
            </div>
            {/* --- End Input Form Area --- */}
          </div>
        </div>
      </div>
    </div>
  );
}
