import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './components/public/HomePage';
import { BrowsePropertiesPage } from './components/public/BrowsePropertiesPage';
import { PropertyDetailPage } from './components/public/PropertyDetailPage';
import { CategoriesPage } from './components/public/CategoriesPage';
import { LocationsPage } from './components/public/LocationsPage';
import { AboutPage, ContactPage, ListPropertyPromoPage } from './components/public/ListPropertyPromoPage';
import { ManagerDashboard } from './components/manager/ManagerDashboard';
import { TenantPortal } from './components/tenant/TenantPortal';
import { AdminControlRoom } from './components/admin/AdminControlRoom';
import { AuthPage } from './components/auth/AuthPage';
import { ProfileSettingsPage } from './components/profile/ProfileSettingsPage';
import { UserRole } from './types';
import { Compass, Building2, KeyRound, ShieldAlert } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    currentRole,
    currentView,
    setCurrentView,
    selectedPropertyId,
    setSelectedPropertyId,
    switchRole,
  } = useApp();

  const [filterCategory, setFilterCategory] = useState<string | undefined>(undefined);
  const [filterLocation, setFilterLocation] = useState<string | undefined>(undefined);

  const handleSelectProperty = (id: string) => {
    setSelectedPropertyId(id);
    setCurrentView('property-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExplore = (category?: string, location?: string) => {
    setFilterCategory(category);
    setFilterLocation(location);
    setSelectedPropertyId(null);
    setCurrentView('browse');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAuthView = currentView === 'login' || currentView === 'signup';

  const isDashboardView =
    !isAuthView &&
    (currentView === 'manager-dashboard' ||
      currentView === 'tenant-portal' ||
      currentView === 'admin-control-room');

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F2] text-[#202A2D]">
      {/* Top Navbar */}
      <Navbar />

      {/* Main View Router */}
      <div className="flex-1">
        {/* Dedicated Authentication Flow */}
        {isAuthView && (
          <AuthPage
            initialMode={currentView === 'signup' ? 'signup' : 'signin'}
            onSuccess={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Public Views */}
        {!isDashboardView && !isAuthView && (
          <>
            {currentView === 'home' && (
              <HomePage
                onSelectProperty={handleSelectProperty}
                onExplore={handleExplore}
              />
            )}

            {currentView === 'browse' && (
              <BrowsePropertiesPage
                onSelectProperty={handleSelectProperty}
                initialCategory={filterCategory}
                initialLocation={filterLocation}
              />
            )}

            {currentView === 'property-detail' && selectedPropertyId && (
              <PropertyDetailPage
                propertyId={selectedPropertyId}
                onBack={() => {
                  setSelectedPropertyId(null);
                  setCurrentView('browse');
                }}
                onSelectProperty={handleSelectProperty}
              />
            )}

            {currentView === 'categories' && (
              <CategoriesPage
                onSelectCategory={(cat) => handleExplore(cat, undefined)}
              />
            )}

            {currentView === 'locations' && (
              <LocationsPage
                onSelectLocation={(loc) => handleExplore(undefined, loc)}
              />
            )}

            {currentView === 'about' && <AboutPage />}
            {currentView === 'contact' && <ContactPage />}
            {currentView === 'list-property' && <ListPropertyPromoPage />}
            {currentView === 'profile-settings' && <ProfileSettingsPage />}
          </>
        )}

        {/* Private Dashboard Views */}
        {isDashboardView && (
          <>
            {currentView === 'manager-dashboard' && <ManagerDashboard />}
            {currentView === 'tenant-portal' && <TenantPortal />}
            {currentView === 'admin-control-room' && <AdminControlRoom />}
          </>
        )}
      </div>

      {/* Public Footer */}
      {!isDashboardView && <Footer />}

      {/* Persistent Quick Role Bar at bottom for instant reviewer grading */}
      <div className="fixed bottom-3 right-3 z-30 hidden sm:flex items-center gap-1.5 p-1.5 bg-[#143642]/95 backdrop-blur-md text-white rounded-2xl shadow-xl border border-white/20 text-xs">
        <span className="text-[10px] text-white/60 px-2 font-medium uppercase tracking-wider">
          Role Switcher:
        </span>
        <button
          onClick={() => switchRole('seeker')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl transition-colors font-medium text-[11px] ${
            currentRole === 'seeker' ? 'bg-[#B76935] text-white font-bold' : 'hover:bg-white/10 text-white/80'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Seeker</span>
        </button>
        <button
          onClick={() => switchRole('manager')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl transition-colors font-medium text-[11px] ${
            currentRole === 'manager' ? 'bg-[#B76935] text-white font-bold' : 'hover:bg-white/10 text-white/80'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Owner/Manager</span>
        </button>
        <button
          onClick={() => switchRole('tenant')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl transition-colors font-medium text-[11px] ${
            currentRole === 'tenant' ? 'bg-[#B76935] text-white font-bold' : 'hover:bg-white/10 text-white/80'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Tenant</span>
        </button>
        <button
          onClick={() => switchRole('admin')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl transition-colors font-medium text-[11px] ${
            currentRole === 'admin' ? 'bg-[#B76935] text-white font-bold' : 'hover:bg-white/10 text-white/80'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Admin</span>
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
