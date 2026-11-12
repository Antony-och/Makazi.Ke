import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Menu,
  X,
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogIn,
  LogOut,
  User,
  UserPlus,
  Layers,
  MapPin,
  Info,
  Phone
} from 'lucide-react';

import { MAKAZI_LOGO } from '../../data/mockData';

export const Navbar: React.FC = () => {
  const {
    currentRole,
    currentUser,
    switchRole,
    currentView,
    setCurrentView,
    favourites,
    setSelectedPropertyId
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'explore' | 'company' | null>(null);

  const handleNavClick = (view: string) => {
    setSelectedPropertyId(null);
    setCurrentView(view);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isOnDashboard =
    currentView === 'manager-dashboard' ||
    currentView === 'tenant-portal' ||
    currentView === 'admin-control-room';

  const handleOpenDashboard = () => {
    if (currentRole === 'manager') setCurrentView('manager-dashboard');
    else if (currentRole === 'tenant') setCurrentView('tenant-portal');
    else if (currentRole === 'admin') setCurrentView('admin-control-room');
    else setCurrentView('home');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isExploreActive = currentView === 'categories' || currentView === 'locations';
  const isCompanyActive = currentView === 'about' || currentView === 'contact';
  const isBrowseActive = currentView === 'browse' || currentView === 'property-detail';
  const isListActive = currentView === 'list-property';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E7E4DE] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-18">
          
          {/* Zone 1: Official Brand Logo (Links to Home) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center text-left group focus:outline-hidden cursor-pointer py-1"
              aria-label="MAKAZI - Find Your Place. Manage Your Property."
            >
              <img
                src={MAKAZI_LOGO}
                alt="MAKAZI"
                className="h-8 sm:h-9 w-auto object-contain transition-transform duration-150 group-hover:scale-[1.02]"
              />
            </button>
          </div>

          {/* Zone 2: Streamlined Core Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-xs lg:text-sm font-medium text-[#687477]">
            {/* 1. Browse Properties */}
            <button
              onClick={() => handleNavClick('browse')}
              className={`hover:text-[#143642] transition-colors whitespace-nowrap py-1 relative ${
                isBrowseActive ? 'text-[#143642] font-bold' : ''
              }`}
            >
              <span>Browse Properties</span>
              {isBrowseActive && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#B76935] rounded-full" />
              )}
            </button>

            {/* 2. Explore (Combined Categories & Locations) */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'explore' ? null : 'explore')}
                className={`flex items-center gap-1 hover:text-[#143642] transition-colors whitespace-nowrap py-1 relative ${
                  isExploreActive || activeDropdown === 'explore' ? 'text-[#143642] font-bold' : ''
                }`}
              >
                <span>Explore</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${activeDropdown === 'explore' ? 'rotate-180 text-[#B76935]' : 'text-[#687477]'}`} />
                {isExploreActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#B76935] rounded-full" />
                )}
              </button>

              {activeDropdown === 'explore' && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setActiveDropdown(null)}
                  />
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E7E4DE] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                      onClick={() => handleNavClick('categories')}
                      className={`w-full p-2.5 rounded-xl text-left flex items-start gap-3 transition-colors ${
                        currentView === 'categories' ? 'bg-[#143642]/5 border border-[#143642]/15' : 'hover:bg-[#F8F6F2]'
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-[#F8F6F2] border border-[#E7E4DE] text-[#143642] mt-0.5">
                        <Layers className="w-4 h-4 text-[#B76935]" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#143642]">Property Categories</div>
                        <div className="text-[11px] text-[#687477] mt-0.5">Apartments, Studios, Villas & Commercial</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleNavClick('locations')}
                      className={`w-full p-2.5 rounded-xl text-left flex items-start gap-3 transition-colors ${
                        currentView === 'locations' ? 'bg-[#143642]/5 border border-[#143642]/15' : 'hover:bg-[#F8F6F2]'
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-[#F8F6F2] border border-[#E7E4DE] text-[#143642] mt-0.5">
                        <MapPin className="w-4 h-4 text-[#143642]" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#143642]">Popular Locations</div>
                        <div className="text-[11px] text-[#687477] mt-0.5">Nairobi, Kilimani, Westlands, Karen & Coast</div>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* 3. List Property */}
            <button
              onClick={() => handleNavClick('list-property')}
              className={`hover:text-[#143642] transition-colors whitespace-nowrap py-1 relative ${
                isListActive ? 'text-[#143642] font-bold' : ''
              }`}
            >
              <span>List Property</span>
              {isListActive && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#B76935] rounded-full" />
              )}
            </button>

            {/* 4. About & Contact (Combined) */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'company' ? null : 'company')}
                className={`flex items-center gap-1 hover:text-[#143642] transition-colors whitespace-nowrap py-1 relative ${
                  isCompanyActive || activeDropdown === 'company' ? 'text-[#143642] font-bold' : ''
                }`}
              >
                <span>About & Contact</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${activeDropdown === 'company' ? 'rotate-180 text-[#B76935]' : 'text-[#687477]'}`} />
                {isCompanyActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#B76935] rounded-full" />
                )}
              </button>

              {activeDropdown === 'company' && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setActiveDropdown(null)}
                  />
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E7E4DE] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                      onClick={() => handleNavClick('about')}
                      className={`w-full p-2.5 rounded-xl text-left flex items-start gap-3 transition-colors ${
                        currentView === 'about' ? 'bg-[#143642]/5 border border-[#143642]/15' : 'hover:bg-[#F8F6F2]'
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-[#F8F6F2] border border-[#E7E4DE] text-[#143642] mt-0.5">
                        <Info className="w-4 h-4 text-[#B76935]" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#143642]">About MAKAZI</div>
                        <div className="text-[11px] text-[#687477] mt-0.5">Our mission & verified standards</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleNavClick('contact')}
                      className={`w-full p-2.5 rounded-xl text-left flex items-start gap-3 transition-colors ${
                        currentView === 'contact' ? 'bg-[#143642]/5 border border-[#143642]/15' : 'hover:bg-[#F8F6F2]'
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-[#F8F6F2] border border-[#E7E4DE] text-[#143642] mt-0.5">
                        <Phone className="w-4 h-4 text-[#143642]" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#143642]">Contact & Support</div>
                        <div className="text-[11px] text-[#687477] mt-0.5">Inquiries, dispute desk & office headquarters</div>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Zone 3: Actions & Authentication (No perspective switcher) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Favourites quick count */}
            <button
              onClick={() => handleNavClick('browse')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#687477] hover:text-[#B76935] hover:bg-[#F8F6F2] rounded-xl transition-colors border border-transparent hover:border-[#E7E4DE]"
              title="Saved Properties"
            >
              <Heart className={`w-4 h-4 ${favourites.length > 0 ? 'fill-[#B76935] text-[#B76935]' : ''}`} />
              <span className="font-mono text-xs">{favourites.length}</span>
            </button>

            {/* Auth Buttons */}
            {currentRole === 'seeker' ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => handleNavClick('profile-settings')}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shrink-0 ${
                    currentView === 'profile-settings'
                      ? 'bg-[#143642] text-white'
                      : 'text-[#687477] hover:text-[#143642] hover:bg-[#F8F6F2]'
                  }`}
                  title="My Profile & Settings"
                >
                  <User className="w-3.5 h-3.5 text-[#B76935]" />
                  <span className="hidden lg:inline">Profile</span>
                </button>

                <button
                  onClick={() => handleNavClick('login')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shrink-0 ${
                    currentView === 'login'
                      ? 'bg-[#143642] text-white'
                      : 'text-[#143642] hover:bg-[#F8F6F2] border border-[#E7E4DE]'
                  }`}
                  title="Sign In to your MAKAZI Account"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>

                <button
                  onClick={() => handleNavClick('signup')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0 ${
                    currentView === 'signup'
                      ? 'bg-[#143642] text-white'
                      : 'bg-[#B76935] hover:bg-[#a05b2d] text-white'
                  }`}
                  title="Create a new account"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Get Started</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={handleOpenDashboard}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    isOnDashboard
                      ? 'bg-[#143642] text-white font-bold ring-2 ring-[#B76935]/40'
                      : 'bg-[#143642] hover:bg-[#0e2730] text-white'
                  }`}
                  title="Open Role Dashboard"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {isOnDashboard ? 'Dashboard' : 'Open Dashboard'}
                  </span>
                </button>

                <button
                  onClick={() => handleNavClick('profile-settings')}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shrink-0 ${
                    currentView === 'profile-settings'
                      ? 'bg-[#143642] text-white font-bold'
                      : 'text-[#202A2D] hover:bg-[#F8F6F2] border border-[#E7E4DE]'
                  }`}
                  title="Account & Profile Settings"
                >
                  <User className="w-3.5 h-3.5 text-[#B76935]" />
                  <span className="hidden sm:inline">Profile</span>
                </button>

                <button
                  onClick={() => {
                    switchRole('seeker');
                    handleNavClick('home');
                  }}
                  className="p-1.5 text-xs text-[#687477] hover:text-red-600 hover:bg-red-50 rounded-xl border border-[#E7E4DE] transition-colors"
                  title="Sign Out of session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#202A2D] hover:bg-[#F8F6F2] rounded-xl transition-colors border border-[#E7E4DE]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E7E4DE] py-4 space-y-1 bg-white animate-in slide-in-from-top-2 duration-150">
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-left px-3.5 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                currentView === 'home'
                  ? 'bg-[#143642]/5 text-[#143642] font-bold border-l-4 border-[#B76935]'
                  : 'text-[#202A2D] hover:bg-[#F8F6F2]'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('browse')}
              className={`w-full text-left px-3.5 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                isBrowseActive
                  ? 'bg-[#143642]/5 text-[#143642] font-bold border-l-4 border-[#B76935]'
                  : 'text-[#202A2D] hover:bg-[#F8F6F2]'
              }`}
            >
              Browse Properties
            </button>

            {/* Combined Explore links on mobile */}
            <div className="py-1 px-3.5 text-[11px] font-bold uppercase tracking-wider text-[#687477]">
              Explore
            </div>

            <button
              onClick={() => handleNavClick('categories')}
              className={`w-full text-left pl-6 pr-3.5 py-2 text-sm font-medium rounded-xl transition-colors flex items-center gap-2 ${
                currentView === 'categories'
                  ? 'bg-[#143642]/5 text-[#143642] font-bold'
                  : 'text-[#202A2D] hover:bg-[#F8F6F2]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#B76935]" />
              <span>Property Categories</span>
            </button>

            <button
              onClick={() => handleNavClick('locations')}
              className={`w-full text-left pl-6 pr-3.5 py-2 text-sm font-medium rounded-xl transition-colors flex items-center gap-2 ${
                currentView === 'locations'
                  ? 'bg-[#143642]/5 text-[#143642] font-bold'
                  : 'text-[#202A2D] hover:bg-[#F8F6F2]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#143642]" />
              <span>Popular Locations</span>
            </button>

            <button
              onClick={() => handleNavClick('list-property')}
              className={`w-full text-left px-3.5 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                isListActive
                  ? 'bg-[#143642]/5 text-[#143642] font-bold border-l-4 border-[#B76935]'
                  : 'text-[#202A2D] hover:bg-[#F8F6F2]'
              }`}
            >
              List Your Property
            </button>

            {/* Combined Company links on mobile */}
            <div className="py-1 px-3.5 text-[11px] font-bold uppercase tracking-wider text-[#687477]">
              About & Contact
            </div>

            <button
              onClick={() => handleNavClick('about')}
              className={`w-full text-left pl-6 pr-3.5 py-2 text-sm font-medium rounded-xl transition-colors flex items-center gap-2 ${
                currentView === 'about'
                  ? 'bg-[#143642]/5 text-[#143642] font-bold'
                  : 'text-[#202A2D] hover:bg-[#F8F6F2]'
              }`}
            >
              <Info className="w-3.5 h-3.5 text-[#B76935]" />
              <span>About MAKAZI</span>
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`w-full text-left pl-6 pr-3.5 py-2 text-sm font-medium rounded-xl transition-colors flex items-center gap-2 ${
                currentView === 'contact'
                  ? 'bg-[#143642]/5 text-[#143642] font-bold'
                  : 'text-[#202A2D] hover:bg-[#F8F6F2]'
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-[#143642]" />
              <span>Contact & Support</span>
            </button>

            <button
              onClick={() => handleNavClick('profile-settings')}
              className={`w-full text-left pl-6 pr-3.5 py-2 text-sm font-medium rounded-xl transition-colors flex items-center gap-2 ${
                currentView === 'profile-settings'
                  ? 'bg-[#143642]/5 text-[#143642] font-bold border-l-4 border-[#B76935]'
                  : 'text-[#202A2D] hover:bg-[#F8F6F2]'
              }`}
            >
              <User className="w-3.5 h-3.5 text-[#B76935]" />
              <span>Profile & Account Settings</span>
            </button>

            {/* Mobile Auth Actions */}
            <div className="pt-3 mt-3 border-t border-[#E7E4DE] space-y-2 px-1">
              {currentRole === 'seeker' ? (
                <>
                  <button
                    onClick={() => handleNavClick('login')}
                    className="w-full py-2.5 px-3 text-center text-xs font-semibold text-[#143642] bg-[#F8F6F2] hover:bg-[#EFECE6] rounded-xl flex items-center justify-center gap-2 border border-[#E7E4DE]"
                  >
                    <LogIn className="w-4 h-4 text-[#143642]" />
                    <span>Sign In to MAKAZI</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('signup')}
                    className="w-full py-2.5 px-3 text-center text-xs font-semibold text-white bg-[#B76935] hover:bg-[#a05b2d] rounded-xl flex items-center justify-center gap-2 shadow-xs"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Get Started / Create Account</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleOpenDashboard}
                    className="w-full py-2.5 px-3 text-center text-xs font-semibold text-white bg-[#143642] hover:bg-[#0e2730] rounded-xl flex items-center justify-center gap-2 shadow-xs"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Open Dashboard</span>
                  </button>

                  <button
                    onClick={() => {
                      switchRole('seeker');
                      handleNavClick('home');
                    }}
                    className="w-full py-2 px-3 text-center text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl flex items-center justify-center gap-1.5 border border-red-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
