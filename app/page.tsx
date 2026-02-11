import Image from "next/image";
import Link from "next/link";
import { CountdownTimer } from "./components/CountdownTimer";

export default function Home() {
  return (
    <div
      className="flex min-h-screen items-center justify-center font-sans"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0" />
      <main className="relative z-10 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-16">
          <h1 className="mb-6 text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-7xl md:text-8xl animate-rotate">
            <Image
              src="/бебендл.webp"
              alt="бебендл"
              width={1303}
              height={319}
              className="h-auto w-[70vw] max-w-[1200px] animate-title"
            />
          </h1>
          <CountdownTimer />
          <Link
            href="/daily"
            className="pixel-btn inline-block bg-yellow-400 border-4 border-black px-8 py-4 text-black text-lg sm:text-xl hover:bg-yellow-300"
          >
            Дейлик!
          </Link>
        </div>
      </main>
    </div>
  );
}
