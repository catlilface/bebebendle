"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface ShareButtonProps {
  userAnswers: {
    isCorrect: boolean;
  }[];
  score: number;
}

export function ShareButton({ userAnswers, score }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const circles = userAnswers.map((answer) => (answer.isCorrect ? "🟢" : "🔴")).join("");
    const text = `${circles} - ${score}/10\nhttps://bebebendle.ru`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="pixel-btn inline-flex items-center gap-2 bg-blue-500 border-4 border-black px-6 py-3 text-white text-lg hover:bg-blue-400 mt-4"
    >
      {copied ? (
        <>
          <Check className="w-5 h-5" />
          Скопировано!
        </>
      ) : (
        <>
          <Copy className="w-5 h-5" />
          Поделиться результатом
        </>
      )}
    </button>
  );
}
