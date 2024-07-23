"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SendHorizonal } from "lucide-react";
import { useState } from "react";

const Message = ({
  userMessages,
}: {
  userMessages: { role: "system" | "user"; content: string }[];
}) => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] =
    useState<{ role: "system" | "user"; content: string }[]>(userMessages);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input.trim() }]);
    setInput("");
    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: input.trim() }),
    });
    const data = await response.json();
    const message = data.message;
    setMessages((prev) => [...prev, { role: "system", content: message }]);
  };

  return (
    <main className="grid w-full flex-1 gap-4 overflow-auto p-4 grid-cols-1">
      <div className="relative flex w-full h-full flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
        <div className="w-full flex-1 flex flex-col gap-y-4">
          {messages.map((m, index) => (
            <div
              key={index}
              className={cn(
                "w-fit",
                m.role === "system" ? "self-start" : "self-end"
              )}
            >
              <div
                className={cn(
                  "p-3 rounded-lg",
                  m.role === "system"
                    ? "bg-primary text-background"
                    : "bg-background text-primary border"
                )}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>
        <form
          onSubmit={handleSubmit}
          className="relative rounded-lg border-2 bg-background focus-within:ring-1 focus-within:ring-ring"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your prompt here..."
            className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <Button size="icon" type="submit" className="absolute right-1 top-3">
            <SendHorizonal className="size-6" />
          </Button>
        </form>
      </div>
    </main>
  );
};

export default Message;
