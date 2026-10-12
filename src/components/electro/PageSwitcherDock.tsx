import type { FC } from 'react';
import { Eye } from 'lucide-react';
import type { PageId } from './ElectroHeader';

interface PageSwitcherDockProps {
  activePage: PageId;
  onSelectPage: (page: PageId) => void;
  onOpenReferenceModal: () => void;
}

export const PageSwitcherDock: FC<PageSwitcherDockProps> = ({
  activePage,
  onSelectPage,
  onOpenReferenceModal,
}) => {
  const pages: { id: PageId; label: string; number: string }[] = [
    { id: 'home', label: 'Home Page', number: '1' },
    { id: 'product-details', label: 'Product Details', number: '2' },
    { id: 'signup', label: 'Sign Up', number: '3' },
    { id: 'signin', label: 'Sign In', number: '4' },
    { id: 'checkout', label: 'Checkout', number: '5' },
    { id: 'review', label: 'Write a Review', number: '6' },
  ];

  return (
    <div className="bg-[#E5D7CA] border-b border-[#D8C7B8] px-4 py-2 text-[#111111] select-none sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: 6 Pages Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="font-bold text-[11px] uppercase tracking-wider text-[#555555] mr-2 hidden lg:inline">
            PAGES:
          </span>
          {pages.map((p) => {
            const active = activePage === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectPage(p.id)}
                className={`px-3 py-1.5 rounded-md font-semibold tracking-wide transition flex items-center gap-1.5 whitespace-nowrap ${
                  active
                    ? 'bg-[#CCA893] text-[#1A1A1A] font-bold shadow-xs'
                    : 'bg-[#EEE4DA] hover:bg-[#E5D7CA] text-[#444444]'
                }`}
              >
                <span className="opacity-60 text-[10px]">{p.number}.</span>
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Compare with Reference Image */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenReferenceModal}
            className="px-3 py-1.5 rounded-md bg-[#FAF6F2] hover:bg-white border border-[#DFD4C8] text-[#111111] font-semibold flex items-center gap-1.5 transition shadow-2xs"
            title="Inspect approved reference design"
          >
            <Eye className="w-3.5 h-3.5 text-[#C49B82]" />
            <span>Compare Reference Image</span>
          </button>
        </div>
      </div>
    </div>
  );
};
