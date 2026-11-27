export default function Loading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] dark:bg-[#060D1F]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-[#2563EB]/20 border-t-[#2563EB] animate-spin" />
        <p className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
          Loading Nexora Workforce...
        </p>
      </div>
    </div>
  );
}
