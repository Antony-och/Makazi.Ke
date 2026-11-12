import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Upload,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Phone
} from 'lucide-react';

export const ListPropertyPromoPage: React.FC = () => {
  const { switchRole, addProperty, currentUser, properties } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  // Quick Add Property Form
  const [formData, setFormData] = useState({
    title: '',
    propertyType: 'Apartment' as any,
    county: 'Nairobi',
    city: 'Nairobi',
    neighbourhood: 'Kilimani',
    estate: '',
    address: '',
    baseRent: 75000,
    securityDeposit: 75000,
    bedrooms: 2,
    bathrooms: 2,
    sizeSqFt: 1300,
    furnishing: 'unfurnished' as any,
    parkingSlots: 1,
    description: '',
    amenities: ['24/7 Security', 'Borehole Water Backup', 'High Speed Lifts', 'Fibre WiFi Ready'],
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProperty({
      ...formData,
      organizationId: currentUser.organizationId || 'org_makazi_prime',
      images: [
        '/src/assets/images/property_kilimani_luxury_suite_1794387610317.jpg',
        '/src/assets/images/hero_nairobi_modern_apartment_1794387609458.jpg',
      ],
      featuredImage: '/src/assets/images/property_kilimani_luxury_suite_1794387610317.jpg',
      isFeatured: false,
      isPublished: true,
      moderationStatus: 'approved',
      managerName: currentUser.name || 'David Kiprop',
      managerPhone: currentUser.phone || '+254 712 345 678',
      managerEmail: currentUser.email || 'manager@makazi.co.ke',
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowAddModal(false);
      switchRole('manager');
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero */}
      <div className="bg-[#143642] rounded-3xl p-8 sm:p-14 text-white text-center space-y-6 relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-[#B76935]">
            Landlords & Property Management Firms
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Rent Out Your Property to Vetted Tenants Faster
          </h1>
          <p className="text-sm text-[#E7E4DE]/90 leading-relaxed">
            Eliminate idle vacancy days. MAKAZI connects you directly with credit-screened applicants and automates monthly Safaricom M-Pesa rent collections.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-[#B76935] hover:bg-[#a05b2d] text-white rounded-xl text-xs font-bold transition-all shadow-lg"
          >
            Create New Property Listing
          </button>
          <button
            onClick={() => switchRole('manager')}
            className="px-6 py-3 bg-white text-[#143642] hover:bg-[#F8F6F2] rounded-xl text-xs font-semibold transition-all shadow-sm"
          >
            Switch to Property Manager Console
          </button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#B76935] flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[#143642]">Multi-Unit Portfolio Management</h3>
          <p className="text-xs text-[#687477] leading-relaxed">
            Manage individual units within multi-storey apartments. Track occupancy rate, vacancy dates, and scheduled unit turnover seamlessly.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[#143642]">Automated M-Pesa Ledgers</h3>
          <p className="text-xs text-[#687477] leading-relaxed">
            Tenants pay via automated STK push. Each payment matches against the lease invoice, updating balances and generating official receipts.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[#143642]">Digital Tenancy Agreements</h3>
          <p className="text-xs text-[#687477] leading-relaxed">
            Draft, issue, and manage Kenyan residential leases with customized deposit schedules, rent escalation clauses, and tenant record keeping.
          </p>
        </div>
      </div>

      {/* Quick Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E7E4DE] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E7E4DE] pb-3">
              <div>
                <h3 className="font-bold text-base text-[#143642]">List a New Property</h3>
                <p className="text-xs text-[#687477]">Publish a rental listing to the public MAKAZI marketplace</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-xs text-[#687477]">Close</button>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-lg text-[#143642]">Property Created Successfully</h4>
                <p className="text-xs text-[#687477]">Redirecting to Property Management Console...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#202A2D] mb-1">Property Name / Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Heights Residences"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Property Category</label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as any })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                    >
                      <option>Apartment</option>
                      <option>Villa</option>
                      <option>Townhouse</option>
                      <option>Studio</option>
                      <option>Bedsitter</option>
                      <option>Commercial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Neighbourhood / Area</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kilimani, Westlands, Karen"
                      value={formData.neighbourhood}
                      onChange={(e) => setFormData({ ...formData, neighbourhood: e.target.value })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Monthly Rent (KSh)</label>
                    <input
                      type="number"
                      required
                      value={formData.baseRent}
                      onChange={(e) => setFormData({ ...formData, baseRent: Number(e.target.value) })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono focus:border-[#B76935] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Security Deposit (KSh)</label>
                    <input
                      type="number"
                      required
                      value={formData.securityDeposit}
                      onChange={(e) => setFormData({ ...formData, securityDeposit: Number(e.target.value) })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono focus:border-[#B76935] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Bedrooms</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Bathrooms</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Furnishing</label>
                    <select
                      value={formData.furnishing}
                      onChange={(e) => setFormData({ ...formData, furnishing: e.target.value as any })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                    >
                      <option value="unfurnished">Unfurnished</option>
                      <option value="semi-furnished">Semi-Furnished</option>
                      <option value="furnished">Furnished</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#202A2D] mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ring Road, Kilimani"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#202A2D] mb-1">Property Description</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe views, proximity to schools, security features..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#B76935] hover:bg-[#a05b2d] text-white font-semibold rounded-xl transition-colors shadow-sm"
                  >
                    Save & Publish Property to MAKAZI
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#B76935]">
          About MAKAZI
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#143642] tracking-tight">
          Modernising Rental Real Estate Across Kenya
        </h1>
        <p className="text-sm text-[#687477] max-w-2xl mx-auto leading-relaxed">
          Headquartered in Nairobi, MAKAZI connects property seekers with verified rental residences while empowering landlords with enterprise property management tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-6">
        <div className="space-y-4 text-xs sm:text-sm text-[#202A2D] leading-relaxed">
          <h2 className="text-xl font-bold text-[#143642]">
            Our Mission & The Kenyan Rental Context
          </h2>
          <p>
            Renting in Nairobi has historically been fraught with opaque middleman broker fees, duplicate unverified listings, and cumbersome manual bank slips or cheque clearances.
          </p>
          <p>
            MAKAZI was engineered to bring architectural elegance, algorithmic transparency, and financial rigor to the sector. By integrating direct Safaricom M-Pesa Daraja payment verification, digital tenancy leases, and automated maintenance dispatch, we ensure peace of mind for both residents and landlords.
          </p>
        </div>

        <div className="bg-[#143642] text-white p-8 rounded-3xl space-y-4">
          <h3 className="font-bold text-lg text-white">MAKAZI Standards</h3>
          <ul className="space-y-3 text-xs text-[#E7E4DE]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Verified ownership documents & management credentials</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instant Safaricom M-Pesa automated receipts</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Digital leases compliant with Kenya Landlord & Tenant Act</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Strict organization-level tenant data security</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#B76935]">
          Get in Touch
        </span>
        <h1 className="text-3xl font-extrabold text-[#143642]">
          Contact MAKAZI Concierge
        </h1>
        <p className="text-xs text-[#687477]">
          We are here to assist with property listing verifications, viewings, and technical onboarding.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-3xl border border-[#E7E4DE] shadow-xs">
        <div className="space-y-6 text-xs">
          <div>
            <h3 className="font-bold text-base text-[#143642] mb-1">Nairobi Headquarters</h3>
            <p className="text-[#687477]">6th Floor, The Pavilion, Westlands Road, Nairobi, Kenya</p>
          </div>

          <div className="space-y-2 text-[#202A2D]">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#B76935]" />
              <span>General Enquiries: +254 20 440 9000</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#B76935]" />
              <span>M-Pesa Collections Support: +254 712 345 678</span>
            </div>
          </div>

          <div className="p-4 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE] space-y-1">
            <h4 className="font-bold text-[#143642]">Working Hours</h4>
            <p className="text-[#687477]">Monday – Friday: 8:00 AM – 6:00 PM</p>
            <p className="text-[#687477]">Saturday: 9:00 AM – 2:00 PM (Viewings)</p>
          </div>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-base text-[#143642]">Message Received</h4>
            <p className="text-xs text-[#687477]">A MAKAZI representative will contact you within 2 business hours.</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-[#202A2D] mb-1">Your Name</label>
              <input type="text" required className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden" />
            </div>
            <div>
              <label className="block font-semibold text-[#202A2D] mb-1">Email</label>
              <input type="email" required className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden" />
            </div>
            <div>
              <label className="block font-semibold text-[#202A2D] mb-1">Subject</label>
              <select className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden">
                <option>Listing a Property</option>
                <option>Viewing Request Support</option>
                <option>Tenant Portal & M-Pesa Help</option>
                <option>Partnership / Agency Onboarding</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#202A2D] mb-1">Message</label>
              <textarea rows={3} required className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden" />
            </div>
            <button type="submit" className="w-full py-2.5 bg-[#143642] text-white font-semibold rounded-xl hover:bg-[#0e2730] transition-colors">
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
