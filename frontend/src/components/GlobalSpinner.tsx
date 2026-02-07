import { ClipLoader } from 'react-spinners';
import { useGlobalLoadingStore } from '../stores/useGlobalLoadingStore';

type GlobalSpinnerProps = {
  label?: string;
};

function GlobalSpinner({ label = '로딩 중입니다' }: GlobalSpinnerProps) {
  const isLoading = useGlobalLoadingStore((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/90 px-6 py-5 shadow-lg">
        <ClipLoader color="#FFDB59" size={56} />
        <p className="text-sm font-semibold text-zinc-800">{label}</p>
      </div>
    </div>
  );
}

export default GlobalSpinner;
