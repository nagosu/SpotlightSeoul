import { ClipLoader } from 'react-spinners';

type SectionSpinnerProps = {
  size?: number;
  color?: string;
  label?: string;
  className?: string;
};

function SectionSpinner({
  size = 36,
  color = '#FFDB59',
  label = '로딩 중입니다',
  className = '',
}: SectionSpinnerProps) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <ClipLoader color={color} size={size} />
    </div>
  );
}

export default SectionSpinner;
