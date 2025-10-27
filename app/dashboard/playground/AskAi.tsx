"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const AskAi = () => {
  const [inputText, setInputText] = useState<string>();
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [timeInterval, setTimeInterval] = useState({ start: 0, end: 0 });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputText) {
      toast.error("Please enter a question");
      return;
    }

    setOutput("");
    setLoading(true);
    setTimeInterval({ start: Date.now(), end: 0 });
    const res = await fetch("/api/ask", {
      method: "POST",
      body: JSON.stringify({ prompt: inputText }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.body) return;

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      setOutput((prev) => prev + decoder.decode(value));
    }
    setLoading(false);
    setTimeInterval((prev) => ({ start: prev.start, end: Date.now() }));
  };

  return (
    <form
      className="border-2 flex flex-col  rounded-sm p-4 gap-3"
      onSubmit={handleSubmit}
    >
      <p className="text-sm">LLM Prompting</p>
      <Textarea
        placeholder="Enter your question here"
        onChange={(e) => setInputText(e.target.value)}
        required
        className="min-h-[100px]"
      />
      <Button type="submit">
        {loading && <Spinner />}
        Ask
      </Button>
      <div className="flex flex-row gap-2 justify-between">
        <p>Response:</p>
        {timeInterval.start && timeInterval.end ? (
          <Badge>
            {(timeInterval.end - timeInterval.start) / 1000} seconds
          </Badge>
        ) : null}
      </div>
      <div className="flex-grow flex-shrink-0 border-1 basis-0 bg-card rounded-sm overflow-auto p-3 text-sm leading-none">
        {output}
      </div>
    </form>
  );
};
