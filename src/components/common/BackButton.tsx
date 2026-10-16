import type { FC } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';

interface BackButtonProps {
  label?: string;
  className?: string;
  onClick?: () => void;
}

export const BackButton: FC<BackButtonProps> = ({
  label = 'Back',
  className = '',
  onClick,
}) => {
  const { goBack } = useNavigation();

  return (
    <button
      type="button"
      onClick={onClick || goBack}
      className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#666666] hover:text-[#111111] transition py-1.5 px-3 rounded-lg hover:bg-[#EEE9E5] -ml-3 mb-4 group ${className}`}
      title="Go back to previous page"
    >
      <ArrowLeft className="w-4 h-4 text-[#C49B82] group-hover:-translate-x-1 transition" />
      <span>{label}</span>
    </button>
  );
};
