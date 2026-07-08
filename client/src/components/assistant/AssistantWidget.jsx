import { useMemo, useRef, useState } from "react";
import {
  Bot,
  ChevronDown,
  ChevronUp,
  Loader2,
  MessageCircle,
  Minimize2,
  Send,
  Sparkles,
  X,
} from "lucide-react";

import { sendAssistantMessage } from "../../api/assistantApi";
import { useAuth } from "../../hooks/useAuth";

const managerPrompts = [
  "Summarize team activity this week",
  "What blockers are currently open?",
  "Who may have workload imbalance?",
];

const memberPrompts = [
  "Summarize my current tasks",
  "What blockers do I have?",
  "What should I focus on next?",
];

const initialAssistantMessage = {
  id: "welcome",
  role: "assistant",
  text: "Hi, I can answer questions about reports, tasks, projects, blockers, and team activity in this system.",
};

const AssistantLauncher = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-700"
    aria-label="Open AI assistant"
  >
    <MessageCircle size={24} />
  </button>
);

const cleanAssistantText = (text) =>
  text
    .replace(/\*\*/g, "")
    .replace(/^\s*\*\s+/gm, "- ")
    .replace(/\s+\*\s+/g, "\n- ")
    .replace(/([.!?])\s+-\s+/g, "$1\n- ")
    .replace(/:\s+-\s+/g, ":\n- ")
    .trim();

const formatMessageText = (text) =>
  cleanAssistantText(text)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";
  const lines = isUser ? [message.text] : formatMessageText(message.text);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-6 ${
          isUser
            ? "bg-blue-600 text-white"
            : "border border-slate-200 bg-slate-50 text-slate-700"
        }`}
      >
        <div className="space-y-2">
          {lines.map((line, index) => {
            const isBullet = line.startsWith("- ");

            return (
              <p
                key={`${message.id}-${index}`}
                className={isBullet ? "pl-4 [text-indent:-0.75rem]" : ""}
              >
                {line}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const AssistantWidget = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([initialAssistantMessage]);
  const [sending, setSending] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const messageIdRef = useRef(0);

  const suggestedPrompts = useMemo(
    () => (user?.role === "MANAGER" ? managerPrompts : memberPrompts),
    [user?.role],
  );

  const addMessage = (role, text) => {
    messageIdRef.current += 1;
    const message = {
      id: `${role}-${messageIdRef.current}`,
      role,
      text,
    };

    setMessages((currentMessages) => [...currentMessages, message]);
    return message;
  };

  const handleSend = async (messageText = input) => {
    const trimmedMessage = messageText.trim();
    if (!trimmedMessage || sending) return;

    setInput("");
    addMessage("user", trimmedMessage);
    setSending(true);

    try {
      const response = await sendAssistantMessage(trimmedMessage);
      addMessage("assistant", response.answer);
    } catch (error) {
      addMessage(
        "assistant",
        error.response?.data?.message ||
          "I could not reach the assistant right now. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

  if (!open) {
    return <AssistantLauncher onClick={() => setOpen(true)} />;
  }

  return (
    <div className="fixed bottom-5 right-5 z-30 w-[calc(100vw-2.5rem)] max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15">
      <div className="flex items-center justify-between bg-slate-950 px-4 py-3 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600">
            <Bot size={21} />
          </div>
          <div>
            <p className="font-semibold">AI Team Assistant</p>
            <p className="text-xs text-slate-300">System data only</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded-xl p-2 text-slate-300 hover:bg-white/10 hover:text-white"
            onClick={() => setMinimized((current) => !current)}
            aria-label="Minimize assistant"
          >
            <Minimize2 size={17} />
          </button>
          <button
            type="button"
            className="rounded-xl p-2 text-slate-300 hover:bg-white/10 hover:text-white"
            onClick={() => setOpen(false)}
            aria-label="Close assistant"
          >
            <X size={17} />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          <div className="max-h-[420px] min-h-80 space-y-3 overflow-auto bg-white px-4 py-4">
            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
              <div className="mb-1 flex items-center gap-2 font-semibold">
                <Sparkles size={16} />
                Ask about your workspace
              </div>
              <p>
                I can summarize reports, blockers, workload, projects, and tasks.
                I will refuse unrelated questions.
              </p>
            </div>

            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                  <Loader2 size={15} className="animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 bg-slate-50 px-4 py-3">
            <div className="mb-3">
              <button
                type="button"
                className="mb-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-white hover:text-slate-700"
                onClick={() => setShowPrompts((current) => !current)}
              >
                Example questions
                {showPrompts ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronUp size={14} />
                )}
              </button>

              {showPrompts && (
                <div className="flex flex-wrap gap-2">
                  {suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-blue-200 hover:text-blue-700"
                      onClick={() => handleSend(prompt)}
                      disabled={sending}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              className="flex items-end gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                handleSend();
              }}
            >
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                rows={2}
                placeholder="Ask about team reports, blockers, tasks..."
                className="max-h-28 flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default AssistantWidget;
