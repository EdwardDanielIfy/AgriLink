export default function LoadingScreen() {
  return (
    <div className="loading-screen flex-col gap-4">
      <div className="w-12 h-12 spinner" />
      <p className="text-primary-700 font-semibold text-sm animate-pulse">Loading AgriLink…</p>
    </div>
  );
}
