export default function DailyLoading() {
  return (
    <div className="retro-bg flex min-h-dvh items-center justify-center">
      <div className="retro-overlay absolute inset-0" />
      <div className="relative z-10">
        <div className="pixel-text text-2xl text-white">Загрузка...</div>
      </div>
    </div>
  );
}
