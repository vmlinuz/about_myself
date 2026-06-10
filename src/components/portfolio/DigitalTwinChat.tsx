"use client";

import {
  Bot,
  LoaderCircle,
  MessageCircle,
  Send,
  Sparkles,
  UserRound
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";

type ChatRole = "assistant" | "user";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

type ChatStatus = "idle" | "submitting";

const initialMessage: ChatMessage = {
  id: "initial",
  role: "assistant",
  content:
    "I can answer career questions from Volodymyr's portfolio context: embedded Linux, Qt/QML, C++, Python, product ownership, production support, and selected projects."
};

const starterPrompts = [
  "What senior roles fit Volodymyr best?",
  "Summarize his embedded Linux experience.",
  "How has he handled production ownership?",
  "Which projects show engineering quality?"
];

export function DigitalTwinChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const isSubmitting = status === "submitting";

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, error, status]);

  async function submitMessage(value = input) {
    const content = value.trim();

    if (!content || isSubmitting) {
      return;
    }

    const userMessage = createMessage("user", content);
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setError(null);
    setStatus("submitting");

    try {
      const response = await fetch("/api/digital-twin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content: messageContent }) => ({
            role,
            content: messageContent
          }))
        })
      });

      const data = (await response.json()) as { message?: unknown; error?: unknown };

      if (!response.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "The Digital Twin is unavailable.");
      }

      if (typeof data.message !== "string" || data.message.trim().length === 0) {
        throw new Error("The Digital Twin returned an empty response.");
      }

      setMessages([...nextMessages, createMessage("assistant", data.message)]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The Digital Twin is unavailable.");
    } finally {
      setStatus("idle");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitMessage();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submitMessage();
    }
  }

  return (
    <section className="digital-twin-section" id="digital-twin" aria-labelledby="digital-twin-title">
      <div className="digital-twin-layout">
        <div className="digital-twin-copy">
          <div className="section-header">
            <p className="section-kicker">
              <MessageCircle size={16} strokeWidth={1.8} aria-hidden="true" />
              Digital Twin
            </p>
            <h2 id="digital-twin-title">Ask about the career behind the code.</h2>
            <p>
              A portfolio-grounded AI chat for role fit, systems experience, production ownership, and
              project-level questions.
            </p>
          </div>
          <div className="twin-highlights" aria-label="Digital Twin focus areas">
            <span>Embedded Linux, Yocto, RTOS, and constrained device workflows.</span>
            <span>Qt/QML, Python, C++, APIs, data layers, and desktop product work.</span>
            <span>Release support, field issue analysis, and long-lived codebase ownership.</span>
          </div>
        </div>

        <div className="chat-panel" aria-label="Digital Twin chat">
          <div className="chat-panel-header">
            <div>
              <span>Volodymyr Salo</span>
              <strong>Career Digital Twin</strong>
            </div>
            <div className="chat-status-pill" data-loading={isSubmitting}>
              {isSubmitting ? (
                <LoaderCircle size={15} strokeWidth={2} aria-hidden="true" />
              ) : (
                <Sparkles size={15} strokeWidth={1.9} aria-hidden="true" />
              )}
              {isSubmitting ? "Thinking" : "OpenRouter"}
            </div>
          </div>

          <div className="chat-log" ref={logRef} aria-live="polite">
            {messages.map((message) => (
              <div className={`chat-message ${message.role}`} key={message.id}>
                <div className="message-avatar" aria-hidden="true">
                  {message.role === "assistant" ? (
                    <Bot size={18} strokeWidth={1.9} />
                  ) : (
                    <UserRound size={18} strokeWidth={1.9} />
                  )}
                </div>
                <p className="message-bubble">{message.content}</p>
              </div>
            ))}
            {isSubmitting ? (
              <div className="chat-message assistant pending">
                <div className="message-avatar" aria-hidden="true">
                  <Bot size={18} strokeWidth={1.9} />
                </div>
                <p className="message-bubble">Thinking through the career context...</p>
              </div>
            ) : null}
            {error ? <p className="chat-error">{error}</p> : null}
          </div>

          {messages.length === 1 ? (
            <div className="chat-suggestions" aria-label="Suggested career questions">
              {starterPrompts.map((prompt) => (
                <button
                  className="chat-suggestion"
                  disabled={isSubmitting}
                  key={prompt}
                  onClick={() => void submitMessage(prompt)}
                  type="button"
                >
                  <Sparkles size={15} strokeWidth={1.9} aria-hidden="true" />
                  {prompt}
                </button>
              ))}
            </div>
          ) : null}

          <form className="chat-form" onSubmit={handleSubmit}>
            <textarea
              aria-label="Ask the Digital Twin about Volodymyr's career"
              disabled={isSubmitting}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about embedded Linux, Qt, production support, projects..."
              rows={2}
              value={input}
            />
            <button
              className="chat-send"
              data-loading={isSubmitting}
              disabled={isSubmitting || input.trim().length === 0}
              type="submit"
            >
              {isSubmitting ? (
                <LoaderCircle size={20} strokeWidth={2} aria-hidden="true" />
              ) : (
                <Send size={20} strokeWidth={2} aria-hidden="true" />
              )}
              <span className="sr-only">Send message</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function createMessage(role: ChatRole, content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content
  };
}
