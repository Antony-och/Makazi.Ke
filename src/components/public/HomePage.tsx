import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HERO_IMAGE, PROPERTY_CATEGORIES, KENYAN_LOCATIONS } from '../../data/mockData';
import { PropertyCard } from './PropertyCard';
import {
  Search,
  MapPin,
  Building2,
  Home,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  Shield,
  ShieldCheck,
  Smartphone,
  FileCheck,
  TrendingUp,
  KeyRound,
  Users,
  Compass,
  DollarSign
} from 'lucide-react';

interface HomePageProps {
  onSelectProperty: (id: string) => void;
  onExplore: (category?: string, location?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectProperty, onExplore }) => {
  const { properties, switchRole, setCurrentView } = useApp();

  // Hero Quick Search State (5 fields as in design reference)
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchMinRent, setSearchMinRent] = useState('');
  const [searchMaxRent, setSearchMaxRent] = useState('');
  const [searchBeds, setSearchBeds] = useState('');

  const featuredProperties = properties.filter((p) => p.isFeatured && p.isPublished).slice(0, 3);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onExplore(searchType || undefined, searchLocation || undefined);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* SECTION A: Architectural Hero Section Matching Reference Image Exactly */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center bg-[#143642] overflow-hidden">
        {/* Background Luxury Interior with Measured Left Scrim for Contrast */}
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_IMAGE}
            alt="MAKAZI Modern Nairobi Apartment Architecture"
            className="w-full h-full object-cover object-center"
          />
          {/* Left-to-right dark teal scrim matching reference screenshot */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#143642] via-[#143642]/85 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#143642]/70 via-transparent to-transparent z-10" />
        </div>

        {/* Hero Content Container - Left Aligned */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-14 pb-28 sm:pb-36 lg:pb-40 text-left">
          
          <div className="space-y-6 max-w-2xl">
            {/* Outline pill badge with shield icon */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-[#143642]/50 backdrop-blur-md text-white/90 text-xs font-semibold tracking-wider">
              <Shield className="w-3.5 h-3.5 text-white/90" />
              <span>NAIROBI · MOMBASA · KISUMU · NAKURU</span>
            </div>

            {/* Main Headline with Serif Typography and Italic Accent */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-white tracking-tight leading-[1.08] text-balance">
              Find a Place That <br />
              <span className="italic text-[#E89257] font-normal">Feels Like Home.</span>
            </h1>

            {/* Subtitle text */}
            <p className="text-white/80 text-base sm:text-lg max-w-xl font-normal leading-relaxed text-balance">
              MAKAZI brings Kenya's rentals into one clear view — verified listings you can trust, and a management workspace that keeps owners, managers and tenants on the same page.
            </p>

            {/* Dual CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onExplore()}
                className="px-6 py-3.5 rounded-xl font-medium bg-[#B76935] hover:bg-[#a05a2d] text-white flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <span>Explore Properties</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentView('list-property')}
                className="px-6 py-3.5 rounded-xl font-medium bg-transparent text-white border border-white/35 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <span>List Your Property</span>
              </button>
            </div>

            {/* Key Metric Strip directly below CTAs */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-xs sm:text-sm text-white/70 pt-3">
              <div>
                <strong className="font-bold text-white text-sm sm:text-base">1,200+</strong> verified listings
              </div>
              <div>
                <strong className="font-bold text-white text-sm sm:text-base">8</strong> counties covered
              </div>
              <div>
                <strong className="font-bold text-white text-sm sm:text-base">4.9/5</strong> tenant satisfaction
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B: Floating 5-Field Property Search Card Overlapping Hero Bottom */}
      <div className="-mt-20 sm:-mt-24 lg:-mt-28 relative z-30 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl border border-[#E7E4DE] p-5 sm:p-7 space-y-4">
          <form onSubmit={handleHeroSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              
              {/* 1. LOCATION */}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#687477] uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-[#B76935]" />
                  <span>Location</span>
                </label>
                <select
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E7E4DE] rounded-xl text-xs sm:text-sm font-medium text-[#202A2D] focus:outline-hidden focus:border-[#B76935] transition-colors"
                >
                  <option value="">Any location</option>
                  <option value="Nairobi">Nairobi</option>
                  <option value="Kilimani">Kilimani</option>
                  <option value="Westlands">Westlands</option>
                  <option value="Karen">Karen</option>
                  <option value="Kileleshwa">Kileleshwa</option>
                  <option value="Lavington">Lavington</option>
                  <option value="Ruaka">Ruaka / Kiambu</option>
                  <option value="Mombasa">Mombasa</option>
                  <option value="Kisumu">Kisumu</option>
                  <option value="Nakuru">Nakuru</option>
                </select>
              </div>

              {/* 2. PROPERTY TYPE */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#687477] uppercase tracking-wider block">
                  Property Type
                </label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E7E4DE] rounded-xl text-xs sm:text-sm font-medium text-[#202A2D] focus:outline-hidden focus:border-[#B76935] transition-colors"
                >
                  <option value="">Any type</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Bedsitter">Bedsitter</option>
                  <option value="Studio">Studio</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              {/* 3. MIN RENT */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#687477] uppercase tracking-wider block">
                  Min Rent
                </label>
                <select
                  value={searchMinRent}
                  onChange={(e) => setSearchMinRent(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E7E4DE] rounded-xl text-xs sm:text-sm font-medium text-[#202A2D] focus:outline-hidden focus:border-[#B76935] transition-colors font-mono"
                >
                  <option value="">No min</option>
                  <option value="15000">KSh 15,000</option>
                  <option value="30000">KSh 30,000</option>
                  <option value="50000">KSh 50,000</option>
                  <option value="80000">KSh 80,000</option>
                  <option value="120000">KSh 120,000</option>
                  <option value="200000">KSh 200,000</option>
                </select>
              </div>

              {/* 4. MAX RENT */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#687477] uppercase tracking-wider block">
                  Max Rent
                </label>
                <select
                  value={searchMaxRent}
                  onChange={(e) => setSearchMaxRent(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E7E4DE] rounded-xl text-xs sm:text-sm font-medium text-[#202A2D] focus:outline-hidden focus:border-[#B76935] transition-colors font-mono"
                >
                  <option value="">No max</option>
                  <option value="40000">KSh 40,000</option>
                  <option value="80000">KSh 80,000</option>
                  <option value="120000">KSh 120,000</option>
                  <option value="200000">KSh 200,000</option>
                  <option value="350000">KSh 350,000</option>
                  <option value="500000">KSh 500,000+</option>
                </select>
              </div>

              {/* 5. BEDROOMS */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#687477] uppercase tracking-wider block">
                  Bedrooms
                </label>
                <select
                  value={searchBeds}
                  onChange={(e) => setSearchBeds(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E7E4DE] rounded-xl text-xs sm:text-sm font-medium text-[#202A2D] focus:outline-hidden focus:border-[#B76935] transition-colors"
                >
                  <option value="">Any</option>
                  <option value="0">Bedsitter / Studio</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                </select>
              </div>
            </div>

            {/* Bottom Bar: Trust Indicators on Left + Search CTA Button on Right */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3.5 border-t border-[#E7E4DE]/70">
              <div className="text-xs text-[#687477] font-medium">
                Verified listings · Updated daily · No hidden fees
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 bg-[#B76935] hover:bg-[#a05a2d] text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search Properties</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* SECTION C: Property Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#B76935]">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#143642] tracking-tight">
              Explore by Property Type
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('categories')}
            className="text-xs font-semibold text-[#143642] hover:text-[#B76935] flex items-center gap-1 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {PROPERTY_CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => onExplore(cat.slug)}
              className="group p-5 bg-white rounded-2xl border border-[#E7E4DE] text-left hover:border-[#B76935] hover:shadow-lg transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F8F6F2] group-hover:bg-[#143642] flex items-center justify-center text-[#143642] group-hover:text-white transition-colors mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#143642] group-hover:text-[#B76935] transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-[#687477] mt-1">
                {cat.count} listings
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* SECTION D: Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#B76935]">
              Hand-Vetted Residences
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#143642] tracking-tight">
              Featured Properties in Nairobi
            </h2>
          </div>
          <button
            onClick={() => onExplore()}
            className="text-xs font-semibold text-[#143642] hover:text-[#B76935] flex items-center gap-1 transition-colors"
          >
            <span>Browse Full Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} onSelect={onSelectProperty} />
          ))}
        </div>
      </section>

      {/* SECTION E: Popular Kenyan Locations */}
      <section className="bg-white py-16 border-y border-[#E7E4DE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B76935]">
              Prime Neighbourhoods
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#143642] tracking-tight">
              Popular Locations Across Kenya
            </h2>
            <p className="text-xs text-[#687477]">
              Explore rental properties situated close to top international schools, diplomatic enclaves, and vibrant business districts.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: 'Kilimani', county: 'Nairobi', desc: 'Luxury high-rises & vibrant dining' },
              { name: 'Westlands', county: 'Nairobi', desc: 'Commercial heart & rooftop lounges' },
              { name: 'Karen', county: 'Nairobi', desc: 'Gated villas & half-acre lush gardens' },
              { name: 'Kileleshwa', county: 'Nairobi', desc: 'Serene tree-lined suburban estates' },
              { name: 'Ruaka', county: 'Kiambu', desc: 'Two Rivers mall corridor & studios' },
              { name: 'Nyali', county: 'Mombasa', desc: 'Coastal beachside residences' },
            ].map((loc) => (
              <button
                key={loc.name}
                onClick={() => onExplore(undefined, loc.name)}
                className="p-4 rounded-xl bg-[#F8F6F2] hover:bg-[#143642] text-left group transition-all border border-[#E7E4DE]"
              >
                <MapPin className="w-4 h-4 text-[#B76935] group-hover:text-[#F8F6F2] mb-2" />
                <h4 className="font-bold text-xs text-[#143642] group-hover:text-white transition-colors">
                  {loc.name}
                </h4>
                <span className="text-[10px] text-[#687477] group-hover:text-[#E7E4DE]/80 block">
                  {loc.county}
                </span>
                <p className="text-[10px] text-[#687477] group-hover:text-white/70 mt-1 line-clamp-1">
                  {loc.desc}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION F: Why Choose MAKAZI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B76935]">
            Engineered for Kenya
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#143642] tracking-tight">
            Why Property Seekers & Managers Choose MAKAZI
          </h2>
          <p className="text-xs text-[#687477]">
            Eliminating broker scams, hidden fee surprises, and manual paper receipts across Kenyan rental housing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#143642]">Verified Ownership & Listings</h3>
            <p className="text-xs text-[#687477] leading-relaxed">
              Every property on MAKAZI undergoes rigorous title deed and management verification by platform administrators before being published. No fake listings.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#143642]">Instant Safaricom M-Pesa Integration</h3>
            <p className="text-xs text-[#687477] leading-relaxed">
              Automated STK push prompts for tenants and real-time ledger updates for landlords. Digital PDF receipts generated instantly with genuine Safaricom transaction refs.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#143642]">End-to-End Tenancy Management</h3>
            <p className="text-xs text-[#687477] leading-relaxed">
              From online tenant screening and digital lease drafting to unit maintenance tracking and financial income reporting, MAKAZI replaces fragmented spreadsheets.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION G: How It Works */}
      <section className="bg-[#143642] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B76935]">
              Simple & Transparent
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              How MAKAZI Works
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* For Property Seekers */}
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 space-y-6">
              <div className="flex items-center gap-3">
                <Compass className="w-5 h-5 text-[#B76935]" />
                <h3 className="font-bold text-lg text-white">For Property Seekers</h3>
              </div>

              <div className="space-y-4 text-xs text-[#E7E4DE]">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#B76935] text-white flex items-center justify-center font-mono font-bold shrink-0 text-[11px]">1</span>
                  <div>
                    <h4 className="font-bold text-white text-sm">Discover & Compare</h4>
                    <p className="text-white/70 mt-0.5">Filter by budget, neighbourhood, bedrooms, and amenities across verified listings.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#B76935] text-white flex items-center justify-center font-mono font-bold shrink-0 text-[11px]">2</span>
                  <div>
                    <h4 className="font-bold text-white text-sm">Schedule Accompanied Viewing</h4>
                    <p className="text-white/70 mt-0.5">Select a convenient date and time to inspect the property with the direct building manager.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#B76935] text-white flex items-center justify-center font-mono font-bold shrink-0 text-[11px]">3</span>
                  <div>
                    <h4 className="font-bold text-white text-sm">Apply & Sign Digital Lease</h4>
                    <p className="text-white/70 mt-0.5">Submit screening documentation online and receive instant access to your Resident Portal.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Property Owners */}
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 space-y-6">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-lg text-white">For Property Owners & Landlords</h3>
              </div>

              <div className="space-y-4 text-xs text-[#E7E4DE]">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-mono font-bold shrink-0 text-[11px]">1</span>
                  <div>
                    <h4 className="font-bold text-white text-sm">List Buildings & Units</h4>
                    <p className="text-white/70 mt-0.5">Create your portfolio, set unit rent amounts, and publish verified public listings.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-mono font-bold shrink-0 text-[11px]">2</span>
                  <div>
                    <h4 className="font-bold text-white text-sm">Assign Leases & Screen Tenants</h4>
                    <p className="text-white/70 mt-0.5">Review incoming applicant incomes, assign units, and issue legally binding lease contracts.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-mono font-bold shrink-0 text-[11px]">3</span>
                  <div>
                    <h4 className="font-bold text-white text-sm">Automate M-Pesa Invoicing & Maintenance</h4>
                    <p className="text-white/70 mt-0.5">Collect monthly rent seamlessly, resolve maintenance tickets, and track net cash flow.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION H: Promotional Call To Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#B76935] to-[#8f4f24] rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Are you a Landlord or Property Manager?
            </h3>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Join leading Kenyan property management companies already managing thousands of units on MAKAZI. List your vacancies today and streamline your M-Pesa rent collections.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => switchRole('manager')}
              className="px-6 py-3 bg-white hover:bg-[#F8F6F2] text-[#143642] rounded-xl text-xs font-bold transition-all shadow-md whitespace-nowrap"
            >
              Test Owner Dashboard
            </button>
            <button
              onClick={() => setCurrentView('list-property')}
              className="px-6 py-3 bg-[#143642] hover:bg-[#0e2730] text-white rounded-xl text-xs font-semibold transition-all whitespace-nowrap"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
