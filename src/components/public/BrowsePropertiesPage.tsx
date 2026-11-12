import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Property, PropertyType, FurnishingStatus } from '../../types';
import { PropertyCard } from './PropertyCard';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  X,
  MapPin,
  ChevronDown,
  Sparkles,
  Bed,
  Building2,
  DollarSign,
  FilterX
} from 'lucide-react';

interface BrowsePropertiesPageProps {
  onSelectProperty: (id: string) => void;
  initialCategory?: string;
  initialLocation?: string;
}

export const BrowsePropertiesPage: React.FC<BrowsePropertiesPageProps> = ({
  onSelectProperty,
  initialCategory,
  initialLocation,
}) => {
  const { properties, formatKSh } = useApp();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCounty, setSelectedCounty] = useState(initialLocation || '');
  const [selectedNeighbourhood, setSelectedNeighbourhood] = useState('');
  const [selectedType, setSelectedType] = useState<string>(initialCategory || '');
  const [minRent, setMinRent] = useState<number | ''>('');
  const [maxRent, setMaxRent] = useState<number | ''>('');
  const [bedrooms, setBedrooms] = useState<string>('');
  const [furnishing, setFurnishing] = useState<string>('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Layout & Sort
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'beds-desc'>('newest');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Available amenities for checklist
  const allAmenities = [
    'Swimming Pool',
    'Heated Swimming Pool',
    'Fully Equipped Gym',
    'Full Backup Generator',
    'Borehole Water Supply',
    '24/7 CCTV & Biometric Access',
    'Fibre Internet Ready',
    'Pet Friendly Compound',
    'Solar Water Heating'
  ];

  const handleToggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCounty('');
    setSelectedNeighbourhood('');
    setSelectedType('');
    setMinRent('');
    setMaxRent('');
    setBedrooms('');
    setFurnishing('');
    setSelectedAmenities([]);
    setOnlyAvailable(false);
  };

  // Filter properties
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // Must be published and approved
      if (!prop.isPublished || prop.moderationStatus !== 'approved') return false;

      // Text search
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = prop.title.toLowerCase().includes(query);
        const matchesLocation = `${prop.neighbourhood} ${prop.city} ${prop.county} ${prop.estate}`.toLowerCase().includes(query);
        const matchesDesc = prop.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesLocation && !matchesDesc) return false;
      }

      // County filter
      if (selectedCounty && prop.county.toLowerCase() !== selectedCounty.toLowerCase()) {
        return false;
      }

      // Neighbourhood filter
      if (selectedNeighbourhood && prop.neighbourhood.toLowerCase() !== selectedNeighbourhood.toLowerCase()) {
        return false;
      }

      // Property type filter
      if (selectedType && prop.propertyType !== selectedType) {
        return false;
      }

      // Price range
      if (minRent !== '' && prop.baseRent < Number(minRent)) {
        return false;
      }
      if (maxRent !== '' && prop.baseRent > Number(maxRent)) {
        return false;
      }

      // Bedrooms
      if (bedrooms !== '') {
        const beds = Number(bedrooms);
        if (beds === 4 && prop.bedrooms < 4) return false;
        if (beds !== 4 && prop.bedrooms !== beds) return false;
      }

      // Furnishing
      if (furnishing && prop.furnishing !== furnishing) {
        return false;
      }

      // Amenities checklist
      if (selectedAmenities.length > 0) {
        const hasAll = selectedAmenities.every((req) =>
          prop.amenities.some((a) => a.toLowerCase().includes(req.toLowerCase()))
        );
        if (!hasAll) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.baseRent - b.baseRent;
      if (sortBy === 'price-desc') return b.baseRent - a.baseRent;
      if (sortBy === 'beds-desc') return b.bedrooms - a.bedrooms;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [
    properties,
    searchTerm,
    selectedCounty,
    selectedNeighbourhood,
    selectedType,
    minRent,
    maxRent,
    bedrooms,
    furnishing,
    selectedAmenities,
    sortBy,
  ]);

  const activeFiltersCount = [
    selectedCounty,
    selectedNeighbourhood,
    selectedType,
    minRent !== '',
    maxRent !== '',
    bedrooms !== '',
    furnishing,
    ...selectedAmenities,
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header & Search Bar Strip */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#143642] tracking-tight">
              Explore Rental Properties
            </h1>
            <p className="text-xs text-[#687477] mt-0.5">
              Verified apartments, villas, townhouses and studios across Nairobi and Kenyan urban corridors.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-[#F8F6F2] border border-[#E7E4DE] rounded-xl text-xs font-semibold text-[#143642]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#B76935]" />
              <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
            </button>

            {/* Grid / List toggle */}
            <div className="flex items-center bg-[#F8F6F2] p-1 rounded-xl border border-[#E7E4DE]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-[#143642] shadow-xs' : 'text-[#687477]'
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white text-[#143642] shadow-xs' : 'text-[#687477]'
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Global Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#687477] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by neighbourhood, estate, building name (e.g. Kilimani, Karen, The Aura)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#F8F6F2] border border-[#E7E4DE] rounded-xl text-xs sm:text-sm text-[#202A2D] placeholder-[#687477] focus:outline-hidden focus:border-[#B76935] focus:bg-white transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#687477] hover:text-[#202A2D]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Location Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-[#687477]">
          <span className="font-semibold text-[#143642] shrink-0">Popular:</span>
          {['Kilimani', 'Westlands', 'Karen', 'Kileleshwa', 'Lavington', 'Ruaka'].map((loc) => (
            <button
              key={loc}
              onClick={() => setSelectedNeighbourhood(selectedNeighbourhood === loc ? '' : loc)}
              className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedNeighbourhood === loc
                  ? 'bg-[#143642] text-white font-medium'
                  : 'bg-[#F8F6F2] hover:bg-[#E7E4DE] text-[#202A2D]'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Content Layout (Filters Sidebar + Property Listings) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Column: Filter Panel (Desktop & Mobile Drawer) */}
        <div className={`lg:block ${showFiltersMobile ? 'block' : 'hidden'} lg:col-span-1 space-y-6`}>
          <div className="bg-white p-5 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E4DE]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#B76935]" />
                <h3 className="font-bold text-sm text-[#143642]">Filter Listings</h3>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] font-semibold text-[#B76935] hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Property Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#143642]">Property Category</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-2.5 bg-[#F8F6F2] border border-[#E7E4DE] rounded-xl text-xs text-[#202A2D] focus:outline-hidden focus:border-[#B76935]"
              >
                <option value="">All Categories</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Studio">Studio</option>
                <option value="Bedsitter">Bedsitter</option>
                <option value="House">Single Family House</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            {/* County */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#143642]">County</label>
              <select
                value={selectedCounty}
                onChange={(e) => {
                  setSelectedCounty(e.target.value);
                  setSelectedNeighbourhood('');
                }}
                className="w-full p-2.5 bg-[#F8F6F2] border border-[#E7E4DE] rounded-xl text-xs text-[#202A2D] focus:outline-hidden focus:border-[#B76935]"
              >
                <option value="">All Kenya</option>
                <option value="Nairobi">Nairobi</option>
                <option value="Kiambu">Kiambu</option>
                <option value="Mombasa">Mombasa</option>
                <option value="Nakuru">Nakuru</option>
                <option value="Kisumu">Kisumu</option>
              </select>
            </div>

            {/* Price Range (KSh) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#143642]">Monthly Rent (KSh)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min KSh"
                  value={minRent}
                  onChange={(e) => setMinRent(e.target.value ? Number(e.target.value) : '')}
                  className="w-full p-2 bg-[#F8F6F2] border border-[#E7E4DE] rounded-xl text-xs font-mono text-[#202A2D] focus:outline-hidden focus:border-[#B76935]"
                />
                <input
                  type="number"
                  placeholder="Max KSh"
                  value={maxRent}
                  onChange={(e) => setMaxRent(e.target.value ? Number(e.target.value) : '')}
                  className="w-full p-2 bg-[#F8F6F2] border border-[#E7E4DE] rounded-xl text-xs font-mono text-[#202A2D] focus:outline-hidden focus:border-[#B76935]"
                />
              </div>
            </div>

            {/* Bedrooms */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#143642]">Bedrooms</label>
              <div className="grid grid-cols-5 gap-1">
                {['', '1', '2', '3', '4'].map((val) => (
                  <button
                    key={val}
                    onClick={() => setBedrooms(bedrooms === val ? '' : val)}
                    className={`py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      bedrooms === val
                        ? 'bg-[#143642] text-white border-[#143642]'
                        : 'bg-[#F8F6F2] text-[#202A2D] border-[#E7E4DE] hover:bg-[#E7E4DE]'
                    }`}
                  >
                    {val === '' ? 'Any' : val === '4' ? '4+' : val}
                  </button>
                ))}
              </div>
            </div>

            {/* Furnishing Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#143642]">Furnishing</label>
              <select
                value={furnishing}
                onChange={(e) => setFurnishing(e.target.value)}
                className="w-full p-2.5 bg-[#F8F6F2] border border-[#E7E4DE] rounded-xl text-xs text-[#202A2D] focus:outline-hidden focus:border-[#B76935]"
              >
                <option value="">Any Furnishing</option>
                <option value="unfurnished">Unfurnished</option>
                <option value="semi-furnished">Semi-Furnished</option>
                <option value="furnished">Fully Furnished</option>
              </select>
            </div>

            {/* Amenities Checkboxes */}
            <div className="space-y-2 pt-2 border-t border-[#E7E4DE]">
              <label className="text-xs font-bold text-[#143642] block">Amenities</label>
              <div className="space-y-2 text-xs">
                {allAmenities.map((amenity) => {
                  const checked = selectedAmenities.includes(amenity);
                  return (
                    <label key={amenity} className="flex items-center gap-2 cursor-pointer text-[#202A2D] hover:text-[#143642]">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleToggleAmenity(amenity)}
                        className="rounded border-[#E7E4DE] text-[#B76935] focus:ring-[#B76935]"
                      />
                      <span>{amenity}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Listings Header & Grid */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Active Filter Chips & Sort Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E7E4DE]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#143642]">
                {filteredProperties.length} Properties Found
              </span>
              {activeFiltersCount > 0 && (
                <span className="text-[11px] text-[#687477]">
                  ({activeFiltersCount} filters active)
                </span>
              )}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#687477] whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="p-1.5 bg-white border border-[#E7E4DE] rounded-lg text-xs font-medium text-[#143642] focus:outline-hidden focus:border-[#B76935]"
              >
                <option value="newest">Featured & Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="beds-desc">Most Bedrooms</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {selectedType && (
                <button
                  onClick={() => setSelectedType('')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F8F6F2] border border-[#E7E4DE] rounded-lg text-xs text-[#202A2D] hover:bg-[#E7E4DE]"
                >
                  <span>Category: {selectedType}</span>
                  <X className="w-3 h-3 text-[#687477]" />
                </button>
              )}
              {selectedNeighbourhood && (
                <button
                  onClick={() => setSelectedNeighbourhood('')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F8F6F2] border border-[#E7E4DE] rounded-lg text-xs text-[#202A2D] hover:bg-[#E7E4DE]"
                >
                  <span>Area: {selectedNeighbourhood}</span>
                  <X className="w-3 h-3 text-[#687477]" />
                </button>
              )}
              {selectedCounty && (
                <button
                  onClick={() => setSelectedCounty('')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F8F6F2] border border-[#E7E4DE] rounded-lg text-xs text-[#202A2D] hover:bg-[#E7E4DE]"
                >
                  <span>County: {selectedCounty}</span>
                  <X className="w-3 h-3 text-[#687477]" />
                </button>
              )}
              {minRent !== '' && (
                <button
                  onClick={() => setMinRent('')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F8F6F2] border border-[#E7E4DE] rounded-lg text-xs text-[#202A2D] hover:bg-[#E7E4DE]"
                >
                  <span>Min: {formatKSh(Number(minRent))}</span>
                  <X className="w-3 h-3 text-[#687477]" />
                </button>
              )}
              {maxRent !== '' && (
                <button
                  onClick={() => setMaxRent('')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F8F6F2] border border-[#E7E4DE] rounded-lg text-xs text-[#202A2D] hover:bg-[#E7E4DE]"
                >
                  <span>Max: {formatKSh(Number(maxRent))}</span>
                  <X className="w-3 h-3 text-[#687477]" />
                </button>
              )}
              {bedrooms !== '' && (
                <button
                  onClick={() => setBedrooms('')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F8F6F2] border border-[#E7E4DE] rounded-lg text-xs text-[#202A2D] hover:bg-[#E7E4DE]"
                >
                  <span>{bedrooms} Beds</span>
                  <X className="w-3 h-3 text-[#687477]" />
                </button>
              )}
              {selectedAmenities.map((a) => (
                <button
                  key={a}
                  onClick={() => handleToggleAmenity(a)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F8F6F2] border border-[#E7E4DE] rounded-lg text-xs text-[#202A2D] hover:bg-[#E7E4DE]"
                >
                  <span>{a}</span>
                  <X className="w-3 h-3 text-[#687477]" />
                </button>
              ))}
            </div>
          )}

          {/* Properties Result Listing */}
          {filteredProperties.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E7E4DE] p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#F8F6F2] text-[#687477] flex items-center justify-center mx-auto">
                <FilterX className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#143642]">No properties match these criteria</h3>
              <p className="text-xs text-[#687477] max-w-sm mx-auto">
                Try widening your budget, selecting another neighbourhood, or clearing specific amenities.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-[#143642] text-white rounded-xl text-xs font-semibold hover:bg-[#0e2730] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((p) => (
                <PropertyCard key={p.id} property={p} onSelect={onSelectProperty} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProperties.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProperty(p.id)}
                  className="group bg-white rounded-2xl border border-[#E7E4DE] p-4 hover:border-[#B76935]/40 hover:shadow-lg transition-all cursor-pointer flex flex-col sm:flex-row gap-5 items-stretch"
                >
                  <div className="sm:w-56 aspect-4/3 rounded-xl overflow-hidden bg-[#F8F6F2] shrink-0">
                    <img
                      src={p.featuredImage || p.images[0]}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#687477] mb-1">
                        <MapPin className="w-3.5 h-3.5 text-[#B76935]" />
                        <span>{p.neighbourhood}, {p.county}</span>
                        <span>·</span>
                        <span className="font-medium text-[#143642]">{p.propertyType}</span>
                      </div>
                      <h3 className="text-base font-bold text-[#143642] group-hover:text-[#B76935] transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-xs text-[#687477] mt-1 line-clamp-2">
                        {p.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#E7E4DE] mt-3">
                      <div className="flex items-center gap-4 text-xs text-[#687477]">
                        <span>{p.bedrooms} Beds</span>
                        <span>·</span>
                        <span>{p.bathrooms} Baths</span>
                        <span>·</span>
                        <span>{p.sizeSqFt || 1200} sq ft</span>
                      </div>
                      <div className="font-mono font-bold text-[#143642] text-sm">
                        {formatKSh(p.baseRent)} <span className="text-[10px] font-normal text-[#687477]">/mo</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
