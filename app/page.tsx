import Link from "next/link";
import { Github, Database } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black overflow-x-hidden">
      <main className="relative z-10 flex flex-col items-center justify-center px-3 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 text-center w-full max-w-[900px]">
        <h1 className="pixel-text mb-8 sm:mb-12 text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl text-white font-bold tracking-wider">
          Bebebendle  В&nbsp;С&nbsp;Ё
        </h1>

        <div className="pixel-container bg-black/90 p-6 sm:p-8 md:p-10 mb-10 sm:mb-12 w-full">
          <p className="pixel-text text-sm sm:text-base md:text-lg text-white/90 max-w-[800px] mx-auto leading-relaxed whitespace-pre-line">
Проект закрывается, автор устал, деньги кончились, ваши бебендлы трагично случайно удалены.
Спасибо всем за вклад в этот проект, вы пупсики и сладусики.
Новые дейлики уже в планах, есть идеи и наработки, но пока автору нужен небольшой отпуск после всего того экзистенциального ужаса, биологических масс и продуктов нурглитов, которые попадали к нему на модерацию.
Всем пока!
          </p>
          <p>
P.S. Была заключена многомиллиардная сделка между представителями Olesha Entertainment и независимыми разработчиками, благодаря чему Бебебендле станет частью СВАГИ+
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center w-fit mx-auto">
          <Link
            href="https://github.com/catlilface/bebebendle"
            target="_blank"
            rel="noopener noreferrer"
            className="pixel-btn inline-flex items-center gap-2 sm:gap-3 bg-gray-800 border-2 sm:border-4 border-white px-4 sm:px-6 py-2 sm:py-3 text-white text-sm sm:text-base md:text-lg 2xl:text-xl hover:bg-gray-700 w-fit"
          >
            <Github className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 2xl:w-8 2xl:h-8" />
            <span>github</span>
          </Link>
          <Link
            href="https://db.bebebendle.ru"
            target="_blank"
            rel="noopener noreferrer"
            className="pixel-btn inline-flex items-center gap-2 sm:gap-3 bg-gray-800 border-2 sm:border-4 border-white px-4 sm:px-6 py-2 sm:py-3 text-white text-sm sm:text-base md:text-lg 2xl:text-xl hover:bg-gray-700 w-fit"
          >
            <Database className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 2xl:w-8 2xl:h-8" />
            <span>База данных (12MB)</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
