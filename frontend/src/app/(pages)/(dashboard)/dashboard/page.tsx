"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

interface Message {
  Role: "user" | "system";
  content: string;
}

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [initialPrompt, setInitialPrompt] = useState("");
  const [disableButton, setDisableButton] = useState(true);

  const [prompt, setPrompt] = useState("");
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("id");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) return;
    try {
      const userMessage: Message = { Role: "user", content: prompt };
      setMessages((prev) => [...prev, userMessage]);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat/`,
        { prompt, conversationId }
      );
      setMessages((prev) => [
        ...prev,
        { Role: "system", content: res.data.data },
      ]);
      setPrompt("");
    } catch (error) {
      console.log("🚀 ~ handleSend ~ error:", error);
    }
  };

  useEffect(() => {
    const initialPromptCall = async () => {
      try {
        const storeQuestion = localStorage.getItem("question");
        const userMessage: Message = {
          Role: "user",
          content: storeQuestion || "",
        };
        setMessages((prev) => [...prev, userMessage]);

        setInitialPrompt(storeQuestion || "");
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat/`,
          { conversationId, prompt: initialPrompt }
        );
        const systemMessage: Message = {
          Role: "system",
          content: res.data.data,
        };
        setMessages((prev) => [...prev, systemMessage]);

        localStorage.removeItem("question");
      } catch (error) {
        console.log("🚀 ~ initalPromptCall ~ error:", error);
      }
    };
    initialPromptCall();
  }, [initialPrompt]);

  useEffect(() => {
    if (!conversationId) return;
    const apicall = async () => {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat/getAllMessage`,
          { conversationId }
        );
        console.log("🚀 ~ apicall ~ res:", res);
        const rawMessages = res.data?.allMessage || [];

        const cleanedMessages = rawMessages.map(
          (msg: { content: string; Role: string }) => ({
            ...msg,
            content: msg.content
              .replace(/\*\*/g, "")
              .replace(/\*/g, "•")
              .replace(/#+\s?/g, ""),
          })
        );
        setMessages(cleanedMessages);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    apicall();
  }, [conversationId]);

  useEffect(() => {
    setDisableButton(prompt.trim().length === 0);
  }, [prompt]);

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.Role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-lg p-3 max-w-2xl m-2.5  text-sm whitespace-pre-wrap ${
                msg.Role === "user"
                  ? "bg-blue-600 text-white "
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={handleSend}
        className="p-4 border-t bg-white flex gap-2 items-center"
      >
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          type="submit"
          disabled={disableButton}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
