"use client";

import { useState, FormEvent } from "react";

interface LoginFormProps {
  onLogin: (password: string) => Promise<boolean>;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const success = await onLogin(password);
    
    if (!success) {
      setError("Invalid password");
    }
    
    setPassword("");
    setIsLoading(false);
  };

  return (
    <div className="retro-bg flex min-h-dvh items-center justify-center">
      <div className="retro-overlay absolute inset-0" />
      <div className="pixel-container relative z-10 w-full max-w-md rounded-none border-4 border-black bg-white p-8">
        <h1 className="pixel-text mb-6 text-2xl font-bold text-black">
          Admin Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold text-black">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-none border-2 border-black bg-white px-4 py-2 text-black focus:border-yellow-400 focus:outline-none"
              placeholder="Enter admin password"
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-sm font-bold text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="pixel-btn w-full bg-yellow-400 px-4 py-2 text-lg font-bold text-black hover:bg-yellow-300 disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
