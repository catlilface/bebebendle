import { AnswerIndicators } from "@/components/answer-indicators";
import { ScoreDisplay } from "@/components/score-display";
import { ShareButton } from "@/components/share-button";
import Link from "next/link";
import type { DailyResult } from "@/types/game";

interface AlreadyPlayedServerProps {
  result: string; // JSON string from cookie
}

export function AlreadyPlayedServer({ result }: AlreadyPlayedServerProps) {
  const parsedResult: DailyResult = JSON.parse(result);

  return (
    <div className="retro-bg flex min-h-dvh flex-col items-center justify-center px-4">
      <div className="retro-overlay absolute inset-0" />
      <div className="relative z-10 w-full max-w-4xl text-center">
        <h1 className="pixel-text mb-4 text-4xl font-bold text-white sm:text-5xl">
          Вы уже играли сегодня!
        </h1>

        <p className="pixel-text mb-8 text-xl text-white">
          Следующий дейлик будет доступен завтра
        </p>

        <AnswerIndicators answers={parsedResult.userAnswers} />
        <ScoreDisplay score={parsedResult.score} className="mb-8" />
        <ShareButton userAnswers={parsedResult.userAnswers} score={parsedResult.score} />

        <Link
          href="/"
          className="pixel-btn mt-4 inline-block border-4 border-black bg-yellow-400 px-8 py-4 text-lg text-black hover:bg-yellow-300"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}
