export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center space-y-4">
        <span className="material-symbols-outlined text-primary text-5xl animate-spin">
          progress_activity
        </span>
        <p className="font-mono text-xs text-text-muted">Loading...</p>
      </div>
    </div>
  );
}
