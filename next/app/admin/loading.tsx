export default function AdminLoading() {
  return (
    <div className="retro-bg min-h-dvh">
      <div className="retro-overlay absolute inset-0" />
      <div className="relative z-10 flex items-center justify-center h-dvh">
        <div className="pixel-text text-2xl text-white">Loading...</div>
      </div>
    </div>
  );
}
