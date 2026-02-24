"use client";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Загрузка..." }: LoadingStateProps) {
  return (
    <div className="retro-bg flex min-h-dvh items-center justify-center">
      <div className="retro-overlay absolute inset-0" />
      <div className="pixel-text relative z-10 text-2xl font-bold text-white">
        {message}
      </div>
    </div>
  );
}
