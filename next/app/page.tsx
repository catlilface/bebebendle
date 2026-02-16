import Image from "next/image";
import Link from "next/link";
import { Twitch, Github, Send } from "lucide-react";
import { CountdownTimer } from "./components/CountdownTimer";
import { DailyPlayButton } from "./components/DailyPlayButton";

export default function Home() {
  return (
    <div
      className="flex min-h-screen items-start justify-center font-sans overflow-x-hidden"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0" />
      <main className="relative z-10 flex flex-col items-center justify-start px-3 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 text-center pt-24 sm:pt-32 lg:pt-44 2xl:pt-56 4xl:pt-72 w-full max-w-[100vw]">
        <div className="mb-8 sm:mb-12 lg:mb-16 2xl:mb-20 w-full">
          <h1 className="mb-4 sm:mb-6 2xl:mb-8 animate-rotate">
            <Image
              src="/бебендл.webp"
              alt="бебендл"
              width={1303}
              height={319}
              className="h-auto w-[85vw] sm:w-[75vw] md:w-[70vw] lg:w-[65vw] xl:w-[60vw] 2xl:w-[55vw] 4xl:w-[50vw] max-w-[1000px] 2xl:max-w-[1400px] 4xl:max-w-[1800px] animate-title mx-auto"
              priority
            />
          </h1>
          <p className="pixel-text mb-4 sm:mb-6 2xl:mb-8 text-base sm:text-lg md:text-xl 2xl:text-2xl 4xl:text-3xl text-white max-w-[90%] sm:max-w-xl md:max-w-2xl 2xl:max-w-3xl 4xl:max-w-4xl mx-auto text-center leading-relaxed px-2">
            Scrandle по еде зрителей стримера Olesha, дарованный подписчиками платного тг-канала
          </p>
          <div className="scale-90 sm:scale-100 2xl:scale-110 4xl:scale-125">
            <CountdownTimer />
          </div>
          <DailyPlayButton />
        </div>
      </main>

      <div className="fixed bottom-2 sm:bottom-4 right-2 sm:right-4 2xl:bottom-8 2xl:right-8 4xl:bottom-12 4xl:right-12 z-20 flex flex-col gap-2 sm:gap-3 2xl:gap-4 4xl:gap-5 items-end">
        <a
          href="https://www.twitch.tv/olesha"
          target="_blank"
          rel="noopener noreferrer"
          className="pixel-btn inline-flex items-center gap-1.5 sm:gap-2 2xl:gap-3 4xl:gap-4 bg-purple-500 border-2 sm:border-4 border-black px-2 sm:px-4 py-1.5 sm:py-2 2xl:px-6 2xl:py-3 4xl:px-8 4xl:py-4 text-white text-xs sm:text-sm md:text-base 2xl:text-xl 4xl:text-2xl hover:bg-purple-400 w-fit"
        >
          <Twitch className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 2xl:w-7 2xl:h-7 4xl:w-9 4xl:h-9" />
          <span className="hidden sm:inline">olesha</span>
          <span className="sm:hidden">twitch</span>
        </a>
        <a
          href="https://github.com/catlilface"
          target="_blank"
          rel="noopener noreferrer"
          className="pixel-btn inline-flex items-center gap-1.5 sm:gap-2 2xl:gap-3 4xl:gap-4 bg-gray-700 border-2 sm:border-4 border-black px-2 sm:px-4 py-1.5 sm:py-2 2xl:px-6 2xl:py-3 4xl:px-8 4xl:py-4 text-white text-xs sm:text-sm md:text-base 2xl:text-xl 4xl:text-2xl hover:bg-gray-600 w-fit"
        >
          <Github className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 2xl:w-7 2xl:h-7 4xl:w-9 4xl:h-9" />
          <span className="hidden sm:inline">github</span>
          <span className="sm:hidden">git</span>
        </a>
        <a
          href="https://t.me/bebebendle_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="pixel-btn inline-flex items-center gap-1.5 sm:gap-2 2xl:gap-3 4xl:gap-4 bg-blue-500 border-2 sm:border-4 border-black px-2 sm:px-4 py-1.5 sm:py-2 2xl:px-6 2xl:py-3 4xl:px-8 4xl:py-4 text-white text-xs sm:text-sm md:text-base 2xl:text-xl 4xl:text-2xl hover:bg-blue-400 w-fit"
        >
          <Send className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 2xl:w-7 2xl:h-7 4xl:w-9 4xl:h-9" />
          <span className="hidden sm:inline">Предложить свой слоп</span>
          <span className="sm:hidden">слоп</span>
        </a>
      </div>
    </div>
  );
}
