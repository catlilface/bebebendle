import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { DailyPlayButton } from "../../app/components/DailyPlayButton";
import * as cookiesModule from "../../app/lib/cookies";

// Mock the cookies module
vi.mock("../../app/lib/cookies", () => ({
  hasPlayedToday: vi.fn(),
  getTodayResult: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} className="next-link-mock">{children}</a>
  ),
}));

describe("DailyPlayButton", () => {
  const mockHasPlayedToday = cookiesModule.hasPlayedToday as ReturnType<typeof vi.fn>;
  const mockGetTodayResult = cookiesModule.getTodayResult as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render play button when user has not played today", () => {
    mockHasPlayedToday.mockReturnValue(false);

    render(<DailyPlayButton />);

    expect(screen.getByText("Дейлик!")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/daily");
  });

  it("should render disabled button when user has played today", () => {
    mockHasPlayedToday.mockReturnValue(true);
    mockGetTodayResult.mockReturnValue({
      date: "2024-01-15",
      score: 7,
      totalRounds: 10,
      userAnswers: [],
    });

    render(<DailyPlayButton />);

    expect(screen.getByText("Уже сыграно ✓")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should display score when user has played today", () => {
    mockHasPlayedToday.mockReturnValue(true);
    mockGetTodayResult.mockReturnValue({
      date: "2024-01-15",
      score: 8,
      totalRounds: 10,
      userAnswers: [],
    });

    render(<DailyPlayButton />);

    expect(screen.getByText("Ваш результат: 8/10")).toBeInTheDocument();
  });

  it("should show next daily message when played today", () => {
    mockHasPlayedToday.mockReturnValue(true);
    mockGetTodayResult.mockReturnValue({
      date: "2024-01-15",
      score: 5,
      totalRounds: 10,
      userAnswers: [],
    });

    render(<DailyPlayButton />);

    expect(screen.getByText("Следующий дейлик завтра")).toBeInTheDocument();
  });

  it("should not show score when result is null", () => {
    mockHasPlayedToday.mockReturnValue(true);
    mockGetTodayResult.mockReturnValue(null);

    render(<DailyPlayButton />);

    expect(screen.queryByText(/Ваш результат/)).not.toBeInTheDocument();
  });

  it("should render link when not played", () => {
    mockHasPlayedToday.mockReturnValue(false);

    render(<DailyPlayButton />);

    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent("Дейлик!");
  });

  it("should apply disabled styling when played", () => {
    mockHasPlayedToday.mockReturnValue(true);
    mockGetTodayResult.mockReturnValue({
      date: "2024-01-15",
      score: 6,
      totalRounds: 10,
      userAnswers: [],
    });

    render(<DailyPlayButton />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("bg-gray-500");
    expect(button).toHaveClass("cursor-not-allowed");
    expect(button).toHaveClass("opacity-70");
  });
});
