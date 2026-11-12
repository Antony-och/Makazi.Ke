import React from 'react';
import { PROPERTY_CATEGORIES, KENYAN_LOCATIONS } from '../../data/mockData';
import { Building2, Home, Castle, Maximize2, Compass, Briefcase, ArrowRight } from 'lucide-react';

interface CategoriesPageProps {
  onSelectCategory: (category: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onSelectCategory }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#B76935]">
          Architectural Portfolios
        </span>
        <h1 className="text-3xl font-extrabold text-[#143642] tracking-tight">
          Property Categories
        </h1>
        <p className="text-xs text-[#687477]">
          From high-rise serviced executive suites in Westlands to serene detached family villas in Karen.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROPERTY_CATEGORIES.map((cat) => (
          <div
            key={cat.slug}
            className="bg-white rounded-2xl border border-[#E7E4DE] p-6 space-y-4 hover:border-[#B76935] hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#F8F6F2] text-[#143642] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[#B76935]" />
              </div>
              <h3 className="font-bold text-lg text-[#143642]">{cat.name}</h3>
              <p className="text-xs text-[#687477] leading-relaxed">{cat.desc}</p>
            </div>

            <div className="pt-4 border-t border-[#E7E4DE] flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[#143642]">
                {cat.count} listings available
              </span>
              <button
                onClick={() => onSelectCategory(cat.slug)}
                className="px-3.5 py-1.5 bg-[#143642] hover:bg-[#B76935] text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <span>Browse</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
