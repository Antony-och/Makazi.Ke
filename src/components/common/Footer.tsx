import React from 'react';
import { useApp } from '../../context/AppContext';
import { MAKAZI_LOGO } from '../../data/mockData';
import { Building2, MapPin, Phone, Mail, Shield, RefreshCw } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, switchRole, resetAllData } = useApp();

  return (
    <footer className="bg-[#143642] text-[#F8F6F2] pt-16 pb-12 border-t border-[#143642]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand & Address */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white px-3.5 py-2 rounded-2xl inline-block shadow-xs">
              <img
                src={MAKAZI_LOGO}
                alt="MAKAZI"
                className="h-7 sm:h-8 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-[#E7E4DE]/80 leading-relaxed max-w-sm">
              Find Your Place. Manage Your Property. Nairobi's premier real estate technology platform for property discovery, automated tenant leases, and Safaricom M-Pesa rent collections.
            </p>
            <div className="space-y-2 text-xs text-[#E7E4DE]/70 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B76935] shrink-0 mt-0.5" />
                <span>6th Floor, The Pavilion, Westlands Road, Nairobi, Kenya</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B76935] shrink-0" />
                <span>+254 20 440 9000 · +254 712 345 678</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B76935] shrink-0" />
                <span>concierge@makazi.co.ke</span>
              </div>
            </div>
          </div>

          {/* Quick Links: Discover */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Discover Rentals
            </h4>
            <ul className="space-y-2 text-xs text-[#E7E4DE]/80">
              <li>
                <button onClick={() => setCurrentView('browse')} className="hover:text-white transition-colors">
                  Kilimani Apartments
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('browse')} className="hover:text-white transition-colors">
                  Westlands Executive Lofts
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('browse')} className="hover:text-white transition-colors">
                  Karen Luxury Villas
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('browse')} className="hover:text-white transition-colors">
                  Kileleshwa Townhouses
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('browse')} className="hover:text-white transition-colors">
                  Ruaka Studios & Bypass
                </button>
              </li>
            </ul>
          </div>

          {/* Management & Leases */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Property Management
            </h4>
            <ul className="space-y-2 text-xs text-[#E7E4DE]/80">
              <li>
                <button onClick={() => switchRole('manager')} className="hover:text-white transition-colors">
                  Owner Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('list-property')} className="hover:text-white transition-colors">
                  List Your Property
                </button>
              </li>
              <li>
                <button onClick={() => switchRole('tenant')} className="hover:text-white transition-colors">
                  Resident Tenant Portal
                </button>
              </li>
              <li>
                <button onClick={() => switchRole('manager')} className="hover:text-white transition-colors">
                  M-Pesa STK Collections
                </button>
              </li>
              <li>
                <button onClick={() => switchRole('admin')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  <span>Admin Control Room</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Controls */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Platform Controls
            </h4>
            <p className="text-xs text-[#E7E4DE]/70 leading-relaxed">
              Curated for the Kenyan property ecosystem. All currency in Kenya Shillings (KSh).
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  if (confirm('Reset all property and demo financial data to original seed?')) {
                    resetAllData();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-[#F8F6F2] rounded-lg text-xs transition-colors"
                title="Restore fresh demonstration data"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Demo Records</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E7E4DE]/60">
          <p>© 2026 MAKAZI Technologies Limited. All rights reserved. Registered in Kenya.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => setCurrentView('about')} className="hover:text-white transition-colors">About</button>
            <button onClick={() => setCurrentView('contact')} className="hover:text-white transition-colors">Contact</button>
            <span className="text-[#B76935] font-medium">Nairobi · Mombasa · Kisumu · Nakuru</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
