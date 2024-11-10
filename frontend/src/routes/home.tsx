import { SendHorizonal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/navbar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function Home() {
  const [files, setFiles] = useState<{ id: string; name: string }[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("http://localhost:8000/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();
        setFiles((prevFiles) => [
          ...prevFiles,
          { id: data.document_id, name: file.name },
        ]);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const onFileRemove = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || files.length === 0) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: input,
          document_id: files[files.length - 1].id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get answer");
      }

      const data = await response.json();
      const newAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
      };

      setMessages((prevMessages) => [...prevMessages, newAssistantMessage]);
    } catch (error) {
      console.error("Error asking question:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-100 to-white">
      <Navbar
        files={files}
        onFileChange={onFileChange}
        onFileRemove={onFileRemove}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3 p-4 text-black">
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage alt="AI Assistant" src="/bot.png" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}

                {message.role === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage alt="User" />
                    <AvatarFallback className="bg-violet-200">S</AvatarFallback>
                  </Avatar>
                )}
                <p className="flex-1 text-sm text-black">{message.content}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4">
          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl relative">
            <Textarea
              ref={textareaRef}
              className="min-h-[52px] pr-12 resize-none bg-white border-gray-200 text-black placeholder:text-gray-400"
              placeholder="Send a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-2 bottom-2 h-8 w-8"
              disabled={isLoading || !input.trim() || files.length === 0}
            >
              <SendHorizonal className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
