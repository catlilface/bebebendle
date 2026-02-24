import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { ShareButton } from "../../app/components/ShareButton";

describe("ShareButton", () => {
  const mockUserAnswers = [
    { isCorrect: true },
    { isCorrect: false },
    { isCorrect: true },
  ];

  const mockScore = 2;

  beforeEach(() => {
    vi.clearAllTimers();
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it("should render share button with copy icon", () => {
    render(<ShareButton userAnswers={mockUserAnswers} score={mockScore} />);
    
    expect(screen.getByText("Поделиться результатом")).toBeInTheDocument();
  });

  it("should copy formatted text to clipboard when clicked", async () => {
    render(<ShareButton userAnswers={mockUserAnswers} score={mockScore} />);
    
    const button = screen.getByRole("button");
    await act(async () => {
      fireEvent.click(button);
    });

    const expectedText = "🟢🔴🟢 - 2/10\nhttps://bebebendle.ru";
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expectedText);
    });
  });

  it("should show copied state after successful copy", async () => {
    render(<ShareButton userAnswers={mockUserAnswers} score={mockScore} />);
    
    const button = screen.getByRole("button");
    await act(async () => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(screen.getByText("Скопировано!")).toBeInTheDocument();
    });
  });

  it("should revert to copy state after timeout", async () => {
    render(<ShareButton userAnswers={mockUserAnswers} score={mockScore} />);
    
    const button = screen.getByRole("button");
    await act(async () => {
      fireEvent.click(button);
    });

    // Wait for copied state
    await waitFor(() => {
      expect(screen.getByText("Скопировано!")).toBeInTheDocument();
    });

    // Wait for the timeout to complete (2 seconds)
    await waitFor(() => {
      expect(screen.getByText("Поделиться результатом")).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it("should handle clipboard error gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error("Clipboard error")),
      },
    });

    render(<ShareButton userAnswers={mockUserAnswers} score={mockScore} />);
    
    const button = screen.getByRole("button");
    await act(async () => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Failed to copy:", expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it("should display correct emoji pattern based on answers", async () => {
    const allCorrect = [
      { isCorrect: true },
      { isCorrect: true },
      { isCorrect: true },
    ];
    
    render(<ShareButton userAnswers={allCorrect} score={3} />);
    
    const button = screen.getByRole("button");
    await act(async () => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "🟢🟢🟢 - 3/10\nhttps://bebebendle.ru"
      );
    });
  });

  it("should display all red circles when all answers are wrong", async () => {
    const allWrong = [
      { isCorrect: false },
      { isCorrect: false },
      { isCorrect: false },
    ];
    
    render(<ShareButton userAnswers={allWrong} score={0} />);
    
    const button = screen.getByRole("button");
    await act(async () => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "🔴🔴🔴 - 0/10\nhttps://bebebendle.ru"
      );
    });
  });
});
