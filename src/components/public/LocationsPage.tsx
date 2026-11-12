import React from 'react';
import { KENYAN_LOCATIONS } from '../../data/mockData';
import { MapPin, ArrowRight } from 'lucide-react';

interface LocationsPageProps {
  onSelectLocation: (location: string) => void;
}

export const LocationsPage: React.FC<LocationsPageProps> = ({ onSelectLocation }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#B76935]">
          Geographic Coverage
        </span>
        <h1 className="text-3xl font-extrabold text-[#143642] tracking-tight">
          Property Locations in Kenya
        </h1>
        <p className="text-xs text-[#687477]">
          Nairobi metropolitan hubs and East African growth corridors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {KENYAN_LOCATIONS.map((loc) => (
          <div
            key={loc.name}
            className="bg-white rounded-2xl border border-[#E7E4DE] p-6 space-y-4 hover:border-[#B76935] hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E4DE]">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#B76935]" />
                <h3 className="font-bold text-lg text-[#143642]">{loc.name} County</h3>
              </div>
              <button
                onClick={() => onSelectLocation(loc.name)}
                className="text-xs font-semibold text-[#B76935] hover:underline"
              >
                View All
              </button>
            </div>

            <p className="text-xs text-[#687477]">
              Key residential and executive neighbourhoods:
            </p>

            <div className="flex flex-wrap gap-2">
              {loc.neighbourhoods.map((n) => (
                <button
                  key={n}
                  onClick={() => onSelectLocation(n)}
                  className="px-2.5 py-1 bg-[#F8F6F2] hover:bg-[#143642] hover:text-white rounded-lg text-xs text-[#202A2D] transition-colors"
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
