import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Bed,
  Bath,
  Square,
  ShieldCheck,
  Heart,
  Calendar,
  Clock,
  Phone,
  Mail,
  User,
  Share2,
  Check,
  ArrowLeft,
  DollarSign,
  Car,
  Sofa,
  Sparkles,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { PropertyCard } from './PropertyCard';

interface PropertyDetailPageProps {
  propertyId: string;
  onBack: () => void;
  onSelectProperty: (id: string) => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({
  propertyId,
  onBack,
  onSelectProperty,
}) => {
  const {
    properties,
    units,
    formatKSh,
    isFavourite,
    toggleFavourite,
    requestViewing,
    submitApplication,
    currentUser,
  } = useApp();

  const property = properties.find((p) => p.id === propertyId);
  const propUnits = units.filter((u) => u.propertyId === propertyId);
  const similarProps = properties.filter((p) => p.id !== propertyId && p.county === property?.county).slice(0, 3);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');

  // Modals state
  const [showViewingModal, setShowViewingModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Viewing Form State
  const [viewingForm, setViewingForm] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    time: '10:00 AM',
    notes: '',
  });
  const [viewingSubmitted, setViewingSubmitted] = useState(false);

  // Application Form State
  const [appForm, setAppForm] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    employment: 'Employed Full-Time',
    employer: '',
    income: 180000,
    moveInDate: new Date(Date.now() + 86400000 * 15).toISOString().split('T')[0],
    occupants: 2,
    nationalId: currentUser.nationalId || '32891045',
    notes: '',
  });
  const [appSubmitted, setAppSubmitted] = useState(false);

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-[#143642]">Property not found</h2>
        <p className="text-sm text-[#687477] mt-2">The requested listing may have been unlisted or removed.</p>
        <button
          onClick={onBack}
          className="mt-6 px-4 py-2 bg-[#143642] text-white rounded-xl text-xs font-semibold"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  const fav = isFavourite(property.id);

  const handleViewingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestViewing({
      propertyId: property.id,
      unitId: selectedUnitId || undefined,
      applicantName: viewingForm.name,
      applicantEmail: viewingForm.email,
      applicantPhone: viewingForm.phone,
      preferredDate: viewingForm.date,
      preferredTime: viewingForm.time,
      notes: viewingForm.notes,
      status: 'Submitted',
    });
    setViewingSubmitted(true);
    setTimeout(() => {
      setViewingSubmitted(false);
      setShowViewingModal(false);
    }, 2500);
  };

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitApplication({
      propertyId: property.id,
      unitId: selectedUnitId || undefined,
      applicantName: appForm.name,
      applicantEmail: appForm.email,
      applicantPhone: appForm.phone,
      employmentStatus: appForm.employment,
      employer: appForm.employer,
      monthlyIncome: appForm.income,
      preferredMoveInDate: appForm.moveInDate,
      occupantsCount: appForm.occupants,
      nationalIdNumber: appForm.nationalId,
      additionalNotes: appForm.notes,
      status: 'Submitted',
    });
    setAppSubmitted(true);
    setTimeout(() => {
      setAppSubmitted(false);
      setShowApplicationModal(false);
    }, 2500);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#143642] hover:text-[#B76935] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Listings</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#202A2D] bg-white border border-[#E7E4DE] rounded-xl hover:bg-[#F8F6F2] transition-colors"
          >
            {shareCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-[#687477]" />}
            <span>{shareCopied ? 'Link Copied' : 'Share'}</span>
          </button>

          <button
            onClick={() => toggleFavourite(property.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border transition-colors ${
              fav
                ? 'bg-[#B76935]/10 text-[#B76935] border-[#B76935]'
                : 'bg-white text-[#202A2D] border-[#E7E4DE] hover:bg-[#F8F6F2]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${fav ? 'fill-[#B76935]' : ''}`} />
            <span>{fav ? 'Saved in Favourites' : 'Save Property'}</span>
          </button>
        </div>
      </div>

      {/* Main Title & Address Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 pb-4 border-b border-[#E7E4DE]">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="px-2.5 py-1 bg-[#143642] text-white rounded-md">
              {property.propertyType}
            </span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Title & Management</span>
            </span>
            <span className="text-[#687477]">
              {property.furnishing.toUpperCase()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#143642] tracking-tight">
            {property.title}
          </h1>

          <div className="flex items-center gap-2 text-xs text-[#687477]">
            <MapPin className="w-4 h-4 text-[#B76935] shrink-0" />
            <span className="font-medium text-[#202A2D]">{property.address}</span>
            <span>·</span>
            <span>{property.estate}</span>
            <span>·</span>
            <span>{property.neighbourhood}, {property.county}</span>
          </div>
        </div>

        {/* Pricing Box */}
        <div className="bg-white p-4 rounded-2xl border border-[#E7E4DE] shadow-xs text-left lg:text-right shrink-0">
          <span className="text-[11px] uppercase tracking-wider text-[#687477] font-semibold block">
            Monthly Rental Rate
          </span>
          <div className="flex items-baseline gap-1 lg:justify-end">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-[#143642]">
              {formatKSh(property.baseRent)}
            </span>
            <span className="text-xs text-[#687477]">/ month</span>
          </div>
          <span className="text-[11px] text-[#687477] block mt-1">
            Refundable Security Deposit: <strong className="text-[#202A2D]">{formatKSh(property.securityDeposit)}</strong>
          </span>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main large display image */}
        <div className="lg:col-span-2 relative aspect-16/10 rounded-2xl overflow-hidden bg-[#F8F6F2] border border-[#E7E4DE]">
          <img
            src={property.images[activeImageIndex] || property.featuredImage}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-white text-xs font-medium">
            Photo {activeImageIndex + 1} of {property.images.length}
          </div>
        </div>

        {/* Thumbnail gallery */}
        <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
          {property.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`relative aspect-16/10 rounded-xl overflow-hidden border-2 transition-all ${
                activeImageIndex === idx ? 'border-[#B76935] shadow-md scale-102' : 'border-[#E7E4DE] opacity-80 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`${property.title} thumb ${idx}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Split: Details & Available Units VS Manager & Action Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column (2 Cols): Specs, Description, Amenities, Available Units */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Key Specifications Grid */}
          <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs">
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#143642] mb-4">
              Property Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE]">
                <span className="text-[#687477] block text-[11px]">Bedrooms</span>
                <div className="flex items-center gap-1.5 font-bold text-[#143642] mt-1 text-sm">
                  <Bed className="w-4 h-4 text-[#B76935]" />
                  <span>{property.bedrooms} Ensuite</span>
                </div>
              </div>

              <div className="p-3 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE]">
                <span className="text-[#687477] block text-[11px]">Bathrooms</span>
                <div className="flex items-center gap-1.5 font-bold text-[#143642] mt-1 text-sm">
                  <Bath className="w-4 h-4 text-[#B76935]" />
                  <span>{property.bathrooms} Full Baths</span>
                </div>
              </div>

              <div className="p-3 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE]">
                <span className="text-[#687477] block text-[11px]">Floor Size</span>
                <div className="flex items-center gap-1.5 font-bold text-[#143642] mt-1 text-sm">
                  <Square className="w-4 h-4 text-[#B76935]" />
                  <span>{property.sizeSqFt || 1400} sq ft</span>
                </div>
              </div>

              <div className="p-3 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE]">
                <span className="text-[#687477] block text-[11px]">Parking Slots</span>
                <div className="flex items-center gap-1.5 font-bold text-[#143642] mt-1 text-sm">
                  <Car className="w-4 h-4 text-[#B76935]" />
                  <span>{property.parkingSlots} Dedicated</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-3">
            <h3 className="text-base font-bold text-[#143642]">
              About this Property
            </h3>
            <p className="text-sm text-[#202A2D] leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities & Features */}
          <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-[#143642]">
              Amenities & Residential Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {property.amenities.map((amenity, i) => (
                <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg bg-[#F8F6F2]/70 text-[#202A2D]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Real Available Units Table */}
          <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#143642]">
                  Individual Units in this Property ({propUnits.length})
                </h3>
                <p className="text-xs text-[#687477] mt-0.5">
                  Real-time occupancy and rent schedules. Select a unit to apply or book a viewing.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E7E4DE] text-[#687477] font-semibold">
                    <th className="pb-3 px-2">Unit</th>
                    <th className="pb-3 px-2">Floor</th>
                    <th className="pb-3 px-2">Beds/Baths</th>
                    <th className="pb-3 px-2 text-right">Rent (KSh)</th>
                    <th className="pb-3 px-2 text-center">Status</th>
                    <th className="pb-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E4DE]">
                  {propUnits.map((u) => {
                    const isVacant = u.status === 'Vacant';
                    return (
                      <tr key={u.id} className="hover:bg-[#F8F6F2] transition-colors">
                        <td className="py-3 px-2 font-bold text-[#143642]">{u.unitNumber}</td>
                        <td className="py-3 px-2 text-[#687477]">{u.floor || 'Standard'}</td>
                        <td className="py-3 px-2 text-[#202A2D]">{u.bedrooms} Bed · {u.bathrooms} Bath</td>
                        <td className="py-3 px-2 text-right font-mono font-bold text-[#143642]">
                          {formatKSh(u.rentAmount)}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              isVacant
                                ? 'bg-emerald-100 text-emerald-800'
                                : u.status === 'Reserved'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          {isVacant ? (
                            <button
                              onClick={() => {
                                setSelectedUnitId(u.id);
                                setShowApplicationModal(true);
                              }}
                              className="px-2.5 py-1 bg-[#B76935] hover:bg-[#a05b2d] text-white rounded-lg text-[11px] font-semibold transition-colors"
                            >
                              Apply Now
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedUnitId(u.id);
                                setShowViewingModal(true);
                              }}
                              className="px-2.5 py-1 bg-[#F8F6F2] hover:bg-[#E7E4DE] text-[#143642] rounded-lg text-[11px] font-medium transition-colors"
                            >
                              Waitlist
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col Sticky): Actions Card & Manager Information */}
        <div className="space-y-6 lg:sticky lg:top-24">
          
          {/* Primary Action Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-md space-y-4">
            <h3 className="text-sm font-bold text-[#143642]">
              Interested in this Property?
            </h3>
            <p className="text-xs text-[#687477]">
              Submit a formal application or schedule an accompanied private viewing with the registered manager.
            </p>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => setShowViewingModal(true)}
                className="w-full py-3 bg-[#B76935] hover:bg-[#a05b2d] text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Request Private Viewing</span>
              </button>

              <button
                onClick={() => setShowApplicationModal(true)}
                className="w-full py-3 bg-[#143642] hover:bg-[#0e2730] text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Submit Rental Application</span>
              </button>

              <button
                onClick={() => setShowContactModal(true)}
                className="w-full py-2.5 bg-[#F8F6F2] hover:bg-[#E7E4DE] text-[#202A2D] rounded-xl text-xs font-medium border border-[#E7E4DE] flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-[#687477]" />
                <span>Contact Property Concierge</span>
              </button>
            </div>
          </div>

          {/* Manager / Management Company Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-4">
            <h4 className="text-xs uppercase font-bold text-[#687477] tracking-wider">
              Managing Agency
            </h4>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#143642] text-white flex items-center justify-center font-bold text-base">
                DK
              </div>
              <div>
                <h5 className="font-bold text-sm text-[#143642]">{property.managerName}</h5>
                <p className="text-xs text-[#687477]">Prime Heritage Properties Ltd</p>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium inline-block mt-1">
                  Licensed Real Estate Manager
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E7E4DE] space-y-2 text-xs text-[#202A2D]">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#B76935]" />
                <span>{property.managerPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#B76935]" />
                <span className="truncate">{property.managerEmail}</span>
              </div>
            </div>
          </div>

          {/* M-Pesa Security Note */}
          <div className="bg-[#F8F6F2] p-4 rounded-xl border border-[#E7E4DE] text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#143642]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Direct M-Pesa Payments</span>
            </div>
            <p className="text-[#687477] text-[11px] leading-relaxed">
              Once approved, rent invoices are paid via Safaricom Paybill 4082200 with immediate official receipt generation. No middleman broker fees.
            </p>
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      {similarProps.length > 0 && (
        <div className="pt-12 border-t border-[#E7E4DE] space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#143642]">
              Similar Properties in {property.county}
            </h3>
            <button
              onClick={onBack}
              className="text-xs font-semibold text-[#B76935] hover:underline"
            >
              Explore all {property.county} listings
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProps.map((p) => (
              <PropertyCard key={p.id} property={p} onSelect={onSelectProperty} />
            ))}
          </div>
        </div>
      )}

      {/* Viewing Request Modal */}
      {showViewingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E7E4DE] space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E7E4DE] pb-3">
              <div>
                <h3 className="font-bold text-base text-[#143642]">Request a Property Viewing</h3>
                <p className="text-xs text-[#687477]">{property.title}</p>
              </div>
              <button
                onClick={() => setShowViewingModal(false)}
                className="text-xs text-[#687477] hover:text-[#202A2D]"
              >
                Close
              </button>
            </div>

            {viewingSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-lg text-[#143642]">Viewing Request Dispatched</h4>
                <p className="text-xs text-[#687477] max-w-xs mx-auto">
                  {property.managerName} has received your viewing request for {viewingForm.date} at {viewingForm.time} and will call you to confirm.
                </p>
              </div>
            ) : (
              <form onSubmit={handleViewingSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#202A2D] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={viewingForm.name}
                    onChange={(e) => setViewingForm({ ...viewingForm, name: e.target.value })}
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+254 7..."
                      value={viewingForm.phone}
                      onChange={(e) => setViewingForm({ ...viewingForm, phone: e.target.value })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={viewingForm.email}
                      onChange={(e) => setViewingForm({ ...viewingForm, email: e.target.value })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Preferred Date</label>
                    <input
                      type="date"
                      required
                      value={viewingForm.date}
                      onChange={(e) => setViewingForm({ ...viewingForm, date: e.target.value })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Preferred Time</label>
                    <select
                      value={viewingForm.time}
                      onChange={(e) => setViewingForm({ ...viewingForm, time: e.target.value })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                    >
                      <option>09:00 AM</option>
                      <option>10:00 AM</option>
                      <option>11:30 AM</option>
                      <option>02:00 PM</option>
                      <option>03:30 PM</option>
                      <option>05:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#202A2D] mb-1">Additional Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Specific questions about parking, pets, or service charges..."
                    value={viewingForm.notes}
                    onChange={(e) => setViewingForm({ ...viewingForm, notes: e.target.value })}
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#B76935] hover:bg-[#a05b2d] text-white font-semibold rounded-xl transition-colors shadow-xs"
                >
                  Confirm Viewing Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Rental Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E7E4DE] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E7E4DE] pb-3">
              <div>
                <h3 className="font-bold text-base text-[#143642]">Official Tenancy Application</h3>
                <p className="text-xs text-[#687477]">{property.title}</p>
              </div>
              <button
                onClick={() => setShowApplicationModal(false)}
                className="text-xs text-[#687477] hover:text-[#202A2D]"
              >
                Close
              </button>
            </div>

            {appSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-lg text-[#143642]">Application Submitted Successfully</h4>
                <p className="text-xs text-[#687477] max-w-xs mx-auto">
                  Your tenant screening application has been saved to the database. The property manager will review your credentials and issue a digital lease.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplicationSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Applicant Name</label>
                    <input
                      type="text"
                      required
                      value={appForm.name}
                      onChange={(e) => setAppForm({ ...appForm, name: e.target.value })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">National ID / Passport</label>
                    <input
                      type="text"
                      required
                      value={appForm.nationalId}
                      onChange={(e) => setAppForm({ ...appForm, nationalId: e.target.value })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={appForm.phone}
                      onChange={(e) => setAppForm({ ...appForm, phone: e.target.value })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={appForm.email}
                      onChange={(e) => setAppForm({ ...appForm, email: e.target.value })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Employment Status</label>
                    <select
                      value={appForm.employment}
                      onChange={(e) => setAppForm({ ...appForm, employment: e.target.value })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                    >
                      <option>Employed Full-Time</option>
                      <option>Self-Employed / Business Owner</option>
                      <option>Consultant / NGO</option>
                      <option>Diaspora / International</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Employer / Company Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Safaricom, Deloitte, NGO"
                      value={appForm.employer}
                      onChange={(e) => setAppForm({ ...appForm, employer: e.target.value })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Net Monthly Income (KSh)</label>
                    <input
                      type="number"
                      required
                      value={appForm.income}
                      onChange={(e) => setAppForm({ ...appForm, income: Number(e.target.value) })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono focus:border-[#B76935] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Preferred Move-In Date</label>
                    <input
                      type="date"
                      required
                      value={appForm.moveInDate}
                      onChange={(e) => setAppForm({ ...appForm, moveInDate: e.target.value })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#202A2D] mb-1">Number of Occupants</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={appForm.occupants}
                    onChange={(e) => setAppForm({ ...appForm, occupants: Number(e.target.value) })}
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#202A2D] mb-1">Additional Information</label>
                  <textarea
                    rows={2}
                    placeholder="Previous tenancy references, lease duration preferences..."
                    value={appForm.notes}
                    onChange={(e) => setAppForm({ ...appForm, notes: e.target.value })}
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#143642] hover:bg-[#0e2730] text-white font-semibold rounded-xl transition-colors shadow-xs"
                  >
                    Submit Application for Manager Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Contact Concierge Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#E7E4DE] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7E4DE] pb-2">
              <h3 className="font-bold text-sm text-[#143642]">Direct Property Concierge</h3>
              <button onClick={() => setShowContactModal(false)} className="text-xs text-[#687477]">Close</button>
            </div>
            <div className="space-y-3 text-xs">
              <p className="text-[#687477]">
                Connect immediately with {property.managerName} regarding availability, deposits, or special arrangements:
              </p>
              <div className="p-3 bg-[#F8F6F2] rounded-xl space-y-2 border border-[#E7E4DE]">
                <div className="flex items-center justify-between">
                  <span className="text-[#687477]">Direct Mobile:</span>
                  <a href={`tel:${property.managerPhone}`} className="font-mono font-bold text-[#143642] hover:text-[#B76935]">
                    {property.managerPhone}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#687477]">WhatsApp:</span>
                  <a href={`https://wa.me/${property.managerPhone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-700 font-semibold hover:underline">
                    Open WhatsApp Chat
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#687477]">Email Desk:</span>
                  <span className="text-[#143642] truncate max-w-[140px]">{property.managerEmail}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
