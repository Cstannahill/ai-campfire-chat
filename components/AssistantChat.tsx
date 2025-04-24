// app/page.tsx (or wherever AssistantChat is defined)
"use client";

import React, { useState, FormEvent, useEffect, ChangeEvent } from "react";
import { useAssistant, Message } from "@ai-sdk/react"; // Import Message type
import TextareaAutosize from "react-textarea-autosize";
import { IoMdSend } from "react-icons/io";
import { PiSpinnerGapBold } from "react-icons/pi"; // For loading indicators

// --- Define your Assistants (Replace with actual IDs!) ---
const availableAssistants = [
  {
    id: process.env.ASSISTANT_ID,
    name: "TRON (Camper Assistant)",
  },
  {
    id: process.env.ASTRONOMY_ASSISTANT_ID,
    name: "TRON (Astronomy Assistant)",
  },
  // Use env var for default
  // { id: "asst_YourCamperAssistantId", name: "Camper Specialist" },
  // { id: "asst_YourTroubleshootingId", name: "Troubleshooting Bot" },
  // Add more assistants as needed
];

export default function AssistantChat() {
  // --- State for Assistant Selection ---
  const [selectedAssistantId, setSelectedAssistantId] = useState<string>(
    availableAssistants[0]?.id || ""
  );

  const {
    status,
    messages,
    input,
    submitMessage,
    handleInputChange,
    error,
    threadId,
    setMessages, // <--- Get setMessages
  } = useAssistant({
    api: "/api/assistant",
    // --- Send selected assistant ID to backend ---
    body: {
      assistantId: selectedAssistantId,
    },
  });

  // --- Handle Assistant Selection Change ---
  const handleAssistantChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newAssistantId = event.target.value;
    if (newAssistantId !== selectedAssistantId) {
      console.log("Switching Assistant to:", newAssistantId);
      setSelectedAssistantId(newAssistantId);
      setMessages([]); // Clear messages on context switch
    }
  };

  // Optional: Log thread ID changes
  useEffect(() => {
    if (threadId) {
      console.log("Current Thread ID:", threadId);
    }
  }, [threadId]);

  // Handle form submission
  const handleFormSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (input.trim()) {
      submitMessage();
    }
  };

  // Handle Enter key press
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleFormSubmit();
    }
  };

  // --- Helper to render message content ---
  // Handles potential annotations or complex content parts later
  const renderMessageContent = (message: Message) => {
    if (typeof message.content === "string") {
      return message.content.split("\n").map((line, i, arr) => (
        <span key={i}>
          {line}
          {i !== arr.length - 1 && <br />}
        </span>
      ));
    }
    // Basic fallback for non-string content (like tool calls/results if added later)
    return JSON.stringify(message.content);
  };

  return (
    // Outer container for centering and padding on large screens
    <div className="flex justify-center items-center min-h-screen w-screen bg-gray-900 lg:p-8">
      {" "}
      {/* Example dark background */}
      {/* Chat Component Container (Handles sizing and main layout) */}
      <div
        className="
        flex flex-col
        w-full h-screen                      {/* Mobile: Full screen */}
        bg-brand-surface                     {/* Your surface color */}
        shadow-2xl                           {/* Enhanced shadow */}

        lg:max-w-5xl                         {/* Desktop: Constrain width */}
        lg:h-[calc(100vh-4rem)]              {/* Desktop: Reduced height to fit padding */}
        lg:rounded-xl                        {/* Your rounded corners */}
        overflow-hidden                      {/* Important for rounded corners */}
      "
      >
        {/* Header */}
        <header className="bg-brand-altsurface p-4 border-b border-cyan-600 shadow-sm shrink-0 flex items-center justify-between">
          {/* Left side: Title */}
          <div>
            <h1 className="text-xl font-semibold text-cyan-600 font-[Electrolize]">
              TRON
            </h1>
            {threadId && (
              <p className="text-xs text-gray-400 mt-1 hidden md:block">
                {" "}
                {/* Hide thread on small screens */}
                Thread: {threadId}
              </p>
            )}
          </div>

          {/* Right side: Assistant Selector */}
          <div className="relative">
            <label htmlFor="assistant-select" className="sr-only">
              Select Assistant
            </label>{" "}
            {/* Accessibility */}
            <select
              id="assistant-select"
              value={selectedAssistantId}
              onChange={handleAssistantChange}
              disabled={status === "in_progress"}
              // Style to match the header - adjust colors as needed
              className="pl-3 pr-8 py-1.5 text-sm bg-brand-altsurface text-cyan-400 border border-cyan-700 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 disabled:opacity-70 cursor-pointer"
            >
              {availableAssistants.map((assistant) => (
                <option
                  key={assistant.id}
                  value={assistant.id}
                  className="bg-white text-black"
                >
                  {" "}
                  {/* Style options if needed */}
                  {assistant.name}
                </option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-cyan-500">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </header>

        {/* Message List */}
        <div className="flex-1 bg-brand-surface overflow-y-auto p-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                // Added max-width constraints
                className={`whitespace-pre-wrap max-w-xl lg:max-w-2xl px-4 py-2 rounded-lg shadow ${
                  m.role === "user"
                    ? "bg-blue-600 text-white" // Your user style
                    : "bg-brand-sage text-white" // Your assistant style
                }`}
              >
                {/* Optionally hide role prefix for cleaner look */}
                {/* <span className="font-semibold capitalize mr-2">{m.role}:</span> */}
                {renderMessageContent(m)}
              </div>
            </div>
          ))}
          {/* Loading Indicator */}
          {status === "in_progress" && (
            <div className="flex justify-start">
              <div className="px-4 py-2 rounded-lg shadow bg-brand-sage text-gray-300 animate-pulse">
                {" "}
                {/* Styled loading */}
                Assistant is thinking...
              </div>
            </div>
          )}
          {/* Error Message */}
          {error && (
            <div className="flex justify-center">
              <div className="px-4 py-2 rounded-lg shadow bg-red-900 bg-opacity-80 text-red-100 border border-red-700">
                Error: {error?.message || "Unknown error"}
              </div>
            </div>
          )}
          {/* Spacer div to push content up */}
          <div className="h-4"></div>
        </div>

        {/* Input Form Area */}
        <div className="p-3 bg-brand-altsurface  border-t border-brand-sage shrink-0 sticky bottom-0">
          <div className="mx-auto lg:max-w-5xl">
            {" "}
            {/* Constrain input width on large screens */}
            <form
              onSubmit={handleFormSubmit}
              className="relative flex items-end"
            >
              <TextareaAutosize
                rows={1}
                maxRows={5}
                className="flex-1 bg-brand-surface py-2 px-3 pr-12 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-cyan-500 text-cyan-600"
                value={input}
                placeholder="Ask the assistant..."
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={status === "in_progress"}
              />
              <button
                type="submit"
                className={`absolute bottom-1.5 right-2 p-2 rounded-md text-xl ${
                  input.trim() && status !== "in_progress"
                    ? "text-blue-600 hover:text-blue-800 cursor-pointer"
                    : "text-gray-400 cursor-not-allowed"
                } focus:outline-none focus:ring-1 focus:ring-blue-300 disabled:text-gray-400 transition-colors duration-150`}
                disabled={!input.trim() || status === "in_progress"}
                aria-label="Send message"
              >
                <IoMdSend className="fill-cyan-600" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
