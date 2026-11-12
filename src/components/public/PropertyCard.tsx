import React from 'react';
import { Property } from '../../types';
import { useApp } from '../../context/AppContext';
import { Heart, MapPin, Bed, Bath, Square, ShieldCheck, ArrowUpRight } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onSelect: (id: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect }) => {
  const { isFavourite, toggleFavourite, formatKSh, units } = useApp();

  // Find available units for this property
  const propUnits = units.filter(u => u.propertyId === property.id);
  const vacantUnits = propUnits.filter(u => u.status === 'Vacant');
  const fav = isFavourite(property.id);

  return (
    <div className="group bg-white rounded-2xl border border-[#E7E4DE] overflow-hidden hover:border-[#B76935]/40 hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Property Image Container */}
      <div className="relative aspect-4/3 w-full bg-[#F8F6F2] overflow-hidden">
        <img
          src={property.featuredImage || property.images[0]}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Styled graceful fallback if image fails to load
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavourite(property.id);
          }}
          className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-[#202A2D] hover:text-[#B76935] hover:scale-110 transition-all"
          aria-label="Save property"
        >
          <Heart className={`w-4 h-4 ${fav ? 'fill-[#B76935] text-[#B76935]' : ''}`} />
        </button>

        {/* Quiet Verified Tag & Type overlay */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
          <span className="px-2.5 py-1 text-[11px] font-semibold bg-[#143642]/90 backdrop-blur-md text-white rounded-md tracking-wide">
            {property.propertyType}
          </span>
          {property.moderationStatus === 'approved' && (
            <span className="px-2 py-1 text-[11px] font-medium bg-emerald-950/80 backdrop-blur-md text-emerald-300 rounded-md flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Verified</span>
            </span>
          )}
        </div>

        {/* Bottom image gradient scrim with units info */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-center justify-between text-white text-xs">
          <span className="font-medium text-emerald-300 text-[11px]">
            {vacantUnits.length > 0 ? `${vacantUnits.length} Vacant Units Ready` : 'Fully Occupied · Inquire'}
          </span>
          <span className="text-[11px] text-white/80">
            {property.furnishing}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location Line */}
          <div className="flex items-center gap-1.5 text-xs text-[#687477] mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#B76935] shrink-0" />
            <span className="font-medium text-[#202A2D]">{property.neighbourhood}</span>
            <span aria-hidden="true">·</span>
            <span>{property.city}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelect(property.id)}
            className="font-bold text-base text-[#143642] group-hover:text-[#B76935] transition-colors cursor-pointer line-clamp-1"
          >
            {property.title}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-[#687477] mt-1.5 line-clamp-2 leading-relaxed">
            {property.description}
          </p>

          {/* Specs row: Clean unboxed metadata with separators */}
          <div className="mt-4 pt-3 border-t border-[#E7E4DE] flex items-center justify-between text-xs text-[#687477]">
            <div className="flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5 text-[#143642]" />
              <span className="font-medium text-[#202A2D]">{property.bedrooms}</span>
              <span>Beds</span>
            </div>
            <span aria-hidden="true" className="text-[#E7E4DE]">|</span>
            <div className="flex items-center gap-1.5">
              <Bath className="w-3.5 h-3.5 text-[#143642]" />
              <span className="font-medium text-[#202A2D]">{property.bathrooms}</span>
              <span>Baths</span>
            </div>
            <span aria-hidden="true" className="text-[#E7E4DE]">|</span>
            <div className="flex items-center gap-1.5">
              <Square className="w-3.5 h-3.5 text-[#143642]" />
              <span className="font-medium text-[#202A2D]">{property.sizeSqFt || 1200}</span>
              <span>sq ft</span>
            </div>
          </div>
        </div>

        {/* Price & Action CTA */}
        <div className="mt-5 pt-3.5 border-t border-[#E7E4DE] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold text-[#687477] tracking-wider block">
              Monthly Rent
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold font-mono text-[#143642]">
                {formatKSh(property.baseRent)}
              </span>
              <span className="text-[11px] text-[#687477]">/mo</span>
            </div>
          </div>

          <button
            onClick={() => onSelect(property.id)}
            className="px-3.5 py-2 bg-[#F8F6F2] hover:bg-[#143642] text-[#143642] hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1 group/btn"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
