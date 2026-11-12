import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Users,
  Building2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Activity,
  Settings,
  TrendingUp,
  MapPin,
  Layers,
  Search,
  Lock,
  LogOut,
  RefreshCw,
  Eye,
  Sliders,
  DollarSign,
  Plus,
  Trash2,
  AlertOctagon,
  Download,
  Send,
  Radio,
  Check,
  X,
  Smartphone,
  ShieldCheck,
  Phone,
  Mail,
  UserCheck,
  UserX,
  Tag,
  Sparkles,
  BarChart3,
  Calendar,
  Globe,
  CreditCard,
  Bell,
  Save,
  Info,
  SlidersHorizontal,
  FileCheck,
  Zap,
  Server,
  Clock,
  ArrowUpRight,
  Receipt,
  Shield
} from 'lucide-react';
import { UserRole, Property, User, LocationBenchmark } from '../../types';
import { MAKAZI_LOGO } from '../../data/mockData';

export const AdminControlRoom: React.FC = () => {
  const {
    adminTab,
    setAdminTab,
    users,
    properties,
    units,
    tenants,
    leases,
    payments,
    auditLogs,
    reportedListings,
    platformSettings,
    locationBenchmarks,
    moderateProperty,
    rejectPropertyWithReason,
    toggleUserStatus,
    toggleUserSuspension,
    verifyAgencyOwner,
    addUser,
    updateReportedListingStatus,
    updatePlatformSettings,
    broadcastSystemNotice,
    addLocationBenchmark,
    updateLocationBenchmark,
    deleteLocationBenchmark,
    formatKSh,
    switchRole,
    resetAllData,
  } = useApp();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [listingFilter, setListingFilter] = useState<'all' | 'pending' | 'approved' | 'suspended'>('all');
  const [auditActionFilter, setAuditActionFilter] = useState<string>('all');

  // Platform Settings State
  const [settingsCategory, setSettingsCategory] = useState<'general' | 'financial' | 'kra_etims' | 'tenancy' | 'security' | 'communications' | 'marketplace'>('general');
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // Command Deck Quick Action states
  const [darajaSyncing, setDarajaSyncing] = useState(false);
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);

  const handleTriggerDarajaSync = () => {
    setDarajaSyncing(true);
    setCommandFeedback('Querying Safaricom Daraja C2B/B2C gateway callbacks & ledger...');
    setTimeout(() => {
      setDarajaSyncing(false);
      setCommandFeedback('Safaricom Daraja API Synchronized: 100% payments matched, 0 discrepancies.');
      setTimeout(() => setCommandFeedback(null), 4000);
    }, 1200);
  };

  const handleFastTrackVerified = () => {
    const unapproved = properties.filter((p) => p.moderationStatus === 'pending');
    if (unapproved.length === 0) {
      setCommandFeedback('No pending listings currently in moderation queue.');
      setTimeout(() => setCommandFeedback(null), 3000);
      return;
    }
    unapproved.forEach((p) => moderateProperty(p.id, 'approved'));
    setCommandFeedback(`Fast-tracked & approved ${unapproved.length} pending listing(s) verified against Ardhisasa.`);
    setTimeout(() => setCommandFeedback(null), 4000);
  };

  const handleExportKRACompliance = () => {
    const headers = ['Month', 'Total Rent Volume (KSh)', 'Commission Rate', 'Platform Yield (KSh)', 'Withholding VAT (16%)', 'KRA eTIMS Ref'];
    const rows = [
      ['March 2026', '3200000', '2.5%', '80000', '12800', 'KRA-ETIMS-MKZ-2026-03'],
      ['February 2026', '2950000', '2.5%', '73750', '11800', 'KRA-ETIMS-MKZ-2026-02'],
      ['January 2026', '2800000', '2.5%', '70000', '11200', 'KRA-ETIMS-MKZ-2026-01'],
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `makazi_kra_tax_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCommandFeedback('KRA Tax & eTIMS Compliance Statement exported successfully.');
    setTimeout(() => setCommandFeedback(null), 3500);
  };

  // Modals state
  const [inspectProperty, setInspectProperty] = useState<Property | null>(null);
  const [rejectReasonModalProperty, setRejectReasonModalProperty] = useState<Property | null>(null);
  const [rejectReasonText, setRejectReasonText] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);

  // New User Form State
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    phone: '+254 7',
    role: 'seeker' as UserRole,
    nationalId: '',
    agencyName: '',
    isVerified: true,
  });

  // Broadcast Form State
  const [broadcastForm, setBroadcastForm] = useState({
    targetRole: 'all' as UserRole | 'all',
    title: '',
    message: '',
  });

  // New Location Form State
  const [newLocationForm, setNewLocationForm] = useState({
    county: 'Nairobi',
    neighbourhood: '',
    averageRent2Bed: 75000,
    isPrime: true,
  });

  // KPI Calculations
  const totalUsers = users.length;
  const totalOwners = users.filter((u) => u.role === 'manager').length;
  const totalTenants = users.filter((u) => u.role === 'tenant').length;
  const totalSeekers = users.filter((u) => u.role === 'seeker').length;
  const totalListings = properties.length;
  const publishedListings = properties.filter((p) => p.isPublished && p.moderationStatus === 'approved').length;
  const pendingModeration = properties.filter((p) => p.moderationStatus === 'pending').length;
  const suspendedListings = properties.filter((p) => p.moderationStatus === 'suspended').length;
  const totalManagedUnits = units.length;
  const occupiedUnits = units.filter((u) => u.status === 'Occupied').length;
  const platformRentVolume = payments.reduce((acc, p) => acc + p.amount, 0);
  const platformRevenueYield = Math.round(platformRentVolume * (platformSettings.commissionRatePercent / 100));
  const openReportsCount = reportedListings.filter((r) => r.status === 'Open' || r.status === 'Investigating').length;

  // Navigation Items (all 14 admin modules)
  const adminNav = [
    { id: 'overview', label: 'Overview & Command Deck', icon: Activity },
    { id: 'listings', label: 'Listing Moderation', icon: Building2, badge: pendingModeration > 0 ? pendingModeration : undefined },
    { id: 'reported', label: 'Reported / Fraud Queue', icon: AlertOctagon, badge: openReportsCount > 0 ? openReportsCount : undefined },
    { id: 'users', label: 'User Directory & RBAC', icon: Users, count: totalUsers },
    { id: 'owners', label: 'Property Owners & Agencies', icon: ShieldCheck, count: totalOwners },
    { id: 'tenants', label: 'Tenants Registry', icon: UserCheck, count: totalTenants },
    { id: 'taxonomy', label: 'Categories & Amenities', icon: Tag },
    { id: 'locations', label: 'Locations & Geofence', icon: MapPin, count: locationBenchmarks.length },
    { id: 'analytics', label: 'Platform Analytics & P&L', icon: BarChart3 },
    { id: 'broadcast', label: 'Broadcast Announcements', icon: Radio },
    { id: 'audit', label: 'Security & Audit Logs', icon: ShieldAlert, count: auditLogs.length },
    { id: 'settings', label: 'Platform Settings', icon: Settings },
  ];

  // Handlers
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    addUser({
      name: newUserForm.name,
      email: newUserForm.email,
      phone: newUserForm.phone,
      role: newUserForm.role,
      nationalId: newUserForm.nationalId,
      agencyName: newUserForm.agencyName || undefined,
      isVerified: newUserForm.isVerified,
    });
    setShowAddUserModal(false);
    setNewUserForm({
      name: '',
      email: '',
      phone: '+254 7',
      role: 'seeker',
      nationalId: '',
      agencyName: '',
      isVerified: true,
    });
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    broadcastSystemNotice(broadcastForm.targetRole, broadcastForm.title, broadcastForm.message);
    setShowBroadcastModal(false);
    setBroadcastForm({ targetRole: 'all', title: '', message: '' });
    alert('System announcement dispatched successfully!');
  };

  const handleCreateLocation = (e: React.FormEvent) => {
    e.preventDefault();
    addLocationBenchmark({
      county: newLocationForm.county,
      neighbourhood: newLocationForm.neighbourhood,
      averageRent2Bed: newLocationForm.averageRent2Bed,
      isPrime: newLocationForm.isPrime,
      totalListingsCount: 1,
      status: 'active',
    });
    setShowAddLocationModal(false);
    setNewLocationForm({ county: 'Nairobi', neighbourhood: '', averageRent2Bed: 75000, isPrime: true });
  };

  const handleRejectListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectReasonModalProperty) {
      rejectPropertyWithReason(rejectReasonModalProperty.id, rejectReasonText || 'Non-compliant documentation');
      setRejectReasonModalProperty(null);
      setRejectReasonText('');
    }
  };

  const handleExportAuditCSV = () => {
    const headers = ['Timestamp', 'Actor', 'Role', 'Action', 'Entity', 'Details', 'IP Address'];
    const rows = auditLogs.map((l) => [
      l.timestamp,
      `"${l.userName}"`,
      l.userRole,
      l.action,
      l.entity,
      `"${l.details.replace(/"/g, '""')}"`,
      l.ipAddress,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `makazi_audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] flex flex-col lg:flex-row text-[#202A2D]">
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-68 bg-[#143642] text-white flex-shrink-0 flex flex-col justify-between p-4 border-r border-[#143642]/40">
        <div className="space-y-6">
          
          {/* Header Brand */}
          <div className="px-3 py-2 border-b border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="bg-white px-3 py-1.5 rounded-xl inline-block shadow-2xs">
                <img
                  src={MAKAZI_LOGO}
                  alt="MAKAZI"
                  className="h-6 w-auto object-contain"
                />
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="System Operational" />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#E7E4DE]/80">
              <span className="font-semibold text-white">Platform Administration</span>
              <span className="text-[10px] text-purple-300">HQ Console</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = adminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setAdminTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#B76935] text-white font-semibold shadow-xs'
                      : 'text-[#E7E4DE]/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && !item.badge && (
                    <span className="text-[11px] font-mono text-white/50">{item.count}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => switchRole('seeker')}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-[#E7E4DE]/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Switch to Marketplace</span>
          </button>
        </div>
      </aside>

      {/* Main Command Viewport */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Top Command Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E4DE]">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#687477]">
              <span>Admin Operations</span>
              <span>/</span>
              <span className="font-semibold text-[#143642] capitalize">{adminTab}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#143642] tracking-tight mt-0.5">
              {adminTab === 'overview' && 'Executive Command Deck & Telemetry'}
              {adminTab === 'listings' && 'Listing Moderation & Title Deed Audit'}
              {adminTab === 'reported' && 'Reported Properties & Fraud Resolution'}
              {adminTab === 'users' && 'Platform User Directory & Access Control'}
              {adminTab === 'owners' && 'Property Owners & Registered Agencies'}
              {adminTab === 'tenants' && 'Platform-Wide Tenants Registry'}
              {adminTab === 'taxonomy' && 'Categories, Property Types & Amenities'}
              {adminTab === 'locations' && 'Kenyan Locations & Geofence Benchmarks'}
              {adminTab === 'analytics' && 'Platform Revenue & Performance Analytics'}
              {adminTab === 'broadcast' && 'System Broadcast & Multi-Channel Notices'}
              {adminTab === 'audit' && 'Security Audit Trail & Client IP Logs'}
              {adminTab === 'settings' && 'Global System & M-Pesa Configurations'}
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="px-3.5 py-2 bg-[#143642] hover:bg-[#0e2730] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
            >
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span>Broadcast Notice</span>
            </button>

            {adminTab === 'users' && (
              <button
                onClick={() => setShowAddUserModal(true)}
                className="px-3.5 py-2 bg-[#B76935] hover:bg-[#a05b2d] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add User</span>
              </button>
            )}

            {adminTab === 'locations' && (
              <button
                onClick={() => setShowAddLocationModal(true)}
                className="px-3.5 py-2 bg-[#B76935] hover:bg-[#a05b2d] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Neighbourhood</span>
              </button>
            )}

            <button
              onClick={handleExportAuditCSV}
              className="px-3 py-2 bg-white border border-[#E7E4DE] text-[#202A2D] hover:bg-[#F8F6F2] rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
              title="Download full CSV audit trail"
            >
              <Download className="w-3.5 h-3.5 text-[#687477]" />
              <span>Export CSV</span>
            </button>
          </div>
        </header>

        {/* 1. OVERVIEW & COMMAND DECK */}
        {adminTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Live Operational Telemetry Strip */}
            <div className="bg-[#143642] text-white p-4 sm:p-5 rounded-2xl shadow-sm border border-[#143642]/60 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/10 text-xs">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <div>
                    <span className="font-bold text-sm tracking-tight text-white">MAKAZI Live Telemetry & Microservices</span>
                    <span className="text-[11px] text-white/60 ml-2">All cloud microservices nominal</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[11px] text-[#E7E4DE]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#B76935]" />
                    <span className="font-mono">{new Date().toLocaleTimeString('en-KE', { timeZone: 'Africa/Nairobi' })} EAT</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 font-mono text-[10px] text-emerald-400 font-semibold border border-white/10">
                    {platformSettings.mpesaEnvironment.toUpperCase()} GATEWAY
                  </span>
                </div>
              </div>

              {/* Service Health Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="overflow-hidden">
                    <div className="font-semibold text-white text-[11px] truncate">Daraja M-Pesa C2B</div>
                    <div className="text-[10px] text-emerald-400 font-mono">38ms · 99.98% OK</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="overflow-hidden">
                    <div className="font-semibold text-white text-[11px] truncate">Ardhisasa Title Sync</div>
                    <div className="text-[10px] text-emerald-400 font-mono">Registry Connected</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="overflow-hidden">
                    <div className="font-semibold text-white text-[11px] truncate">KRA eTIMS Engine</div>
                    <div className="text-[10px] text-emerald-400 font-mono">Auto-Vouchers Live</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                  <Server className="w-4 h-4 text-purple-400 shrink-0" />
                  <div className="overflow-hidden">
                    <div className="font-semibold text-white text-[11px] truncate">Fraud Sentinel</div>
                    <div className="text-[10px] text-purple-300 font-mono">Active Monitoring</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Command Deck Actions Bar */}
            <div className="bg-white p-5 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[#B76935] text-white">
                    <Zap className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-[#143642]">Command Deck Executive Triggers</h3>
                    <p className="text-[11px] text-[#687477]">1-click administrative controls and ledger synchronization</p>
                  </div>
                </div>

                {commandFeedback && (
                  <div className="p-2 px-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{commandFeedback}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleTriggerDarajaSync}
                  disabled={darajaSyncing}
                  className="p-3 bg-[#F8F6F2] hover:bg-[#EFECE6] border border-[#E7E4DE] rounded-xl text-left transition-all group flex flex-col justify-between gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <Zap className={`w-4 h-4 text-[#B76935] ${darajaSyncing ? 'animate-spin' : ''}`} />
                    <span className="text-[10px] text-[#687477] font-mono">API</span>
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#143642]">Reconcile Daraja</div>
                    <div className="text-[10px] text-[#687477] mt-0.5">Poll M-Pesa C2B callbacks</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleFastTrackVerified}
                  className="p-3 bg-[#F8F6F2] hover:bg-[#EFECE6] border border-[#E7E4DE] rounded-xl text-left transition-all group flex flex-col justify-between gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-[10px] text-emerald-700 font-mono font-bold">1-Click</span>
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#143642]">Fast-Track Approved</div>
                    <div className="text-[10px] text-[#687477] mt-0.5">Approve verified deeds</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(true)}
                  className="p-3 bg-[#F8F6F2] hover:bg-[#EFECE6] border border-[#E7E4DE] rounded-xl text-left transition-all group flex flex-col justify-between gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <Radio className="w-4 h-4 text-purple-600" />
                    <span className="text-[10px] text-[#687477] font-mono">SMS</span>
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#143642]">Emergency Broadcast</div>
                    <div className="text-[10px] text-[#687477] mt-0.5">SMS & email all tenants</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleExportKRACompliance}
                  className="p-3 bg-[#F8F6F2] hover:bg-[#EFECE6] border border-[#E7E4DE] rounded-xl text-left transition-all group flex flex-col justify-between gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <Receipt className="w-4 h-4 text-[#143642]" />
                    <span className="text-[10px] text-[#687477] font-mono">CSV</span>
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#143642]">KRA Tax Ledger</div>
                    <div className="text-[10px] text-[#687477] mt-0.5">eTIMS compliance export</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const nextMode = !platformSettings.platformMaintenanceMode;
                    updatePlatformSettings({ platformMaintenanceMode: nextMode });
                    setCommandFeedback(nextMode ? 'Platform Maintenance Mode ENGAGED.' : 'Platform Maintenance Mode DISENGAGED.');
                    setTimeout(() => setCommandFeedback(null), 3500);
                  }}
                  className={`p-3 border rounded-xl text-left transition-all flex flex-col justify-between gap-1.5 ${
                    platformSettings.platformMaintenanceMode
                      ? 'bg-red-50 border-red-300 text-red-900'
                      : 'bg-[#F8F6F2] hover:bg-[#EFECE6] border-[#E7E4DE]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <AlertOctagon className={`w-4 h-4 ${platformSettings.platformMaintenanceMode ? 'text-red-600' : 'text-[#687477]'}`} />
                    <span className="text-[10px] font-mono font-bold">
                      {platformSettings.platformMaintenanceMode ? 'ON' : 'OFF'}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#143642]">Maintenance Mode</div>
                    <div className="text-[10px] text-[#687477] mt-0.5">
                      {platformSettings.platformMaintenanceMode ? 'Advisory active' : 'Public live'}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* 8 Metric Cards with Trend Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-semibold text-[#687477] tracking-wider">Total Users</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" /> +14.2%
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-[#143642]">{totalUsers}</div>
                <div className="text-[11px] text-[#687477] truncate">{totalOwners} Owners · {totalTenants} Tenants · {totalSeekers} Seekers</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-semibold text-[#687477] tracking-wider">Active Listings</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" /> +8.5%
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-[#B76935]">{publishedListings}</div>
                <div className="text-[11px] text-amber-700 font-medium">{pendingModeration} pending title deed review</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-semibold text-[#687477] tracking-wider">Managed Units</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" /> +5.1%
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-[#143642]">{totalManagedUnits}</div>
                <div className="text-[11px] text-[#687477]">{occupiedUnits} occupied ({totalManagedUnits > 0 ? Math.round((occupiedUnits / totalManagedUnits) * 100) : 0}% rate)</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-semibold text-[#687477] tracking-wider">Gross M-Pesa Flow</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" /> +18.4%
                  </span>
                </div>
                <div className="text-xl font-bold font-mono text-emerald-700">{formatKSh(platformRentVolume)}</div>
                <div className="text-[11px] text-emerald-600 font-medium">Processed via Daraja C2B Paybill</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-semibold text-[#687477] tracking-wider">Commission Yield</span>
                  <span className="text-[10px] font-mono text-[#687477]">
                    {platformSettings.commissionRatePercent}% Rate
                  </span>
                </div>
                <div className="text-xl font-bold font-mono text-[#143642]">{formatKSh(platformRevenueYield)}</div>
                <div className="text-[11px] text-[#687477]">Net platform earnings on collections</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-semibold text-[#687477] tracking-wider">Collection Rate</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    High
                  </span>
                </div>
                <div className="text-xl font-bold font-mono text-emerald-700">96.4%</div>
                <div className="text-[11px] text-[#687477]">On-time rent settlement rate</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-semibold text-[#687477] tracking-wider">Fraud & Risk Queue</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${openReportsCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-700'}`}>
                    {openReportsCount > 0 ? 'Action Req.' : 'Clean'}
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-amber-700">{openReportsCount}</div>
                <div className="text-[11px] text-amber-700 font-medium">Awaiting administrator review</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-semibold text-[#687477] tracking-wider">Nairobi 2-Bed Avg</span>
                  <span className="text-[10px] text-[#687477]">Prime Index</span>
                </div>
                <div className="text-xl font-bold font-mono text-[#143642]">KSh 88,500</div>
                <div className="text-[11px] text-[#687477]">Kilimani, Westlands & Karen</div>
              </div>
            </div>

            {/* Visual Analytics Strip: Monthly Rent Volume & Regional Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Monthly Flow Chart */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#E7E4DE]">
                  <div>
                    <h3 className="font-bold text-sm text-[#143642]">Platform Gross M-Pesa Rental Volume</h3>
                    <p className="text-xs text-[#687477]">6-month aggregated tenancy payments across Kenya</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      98.4% STK Push Success
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-700">KSh 3.2M MTD</span>
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-3 items-end h-44 pt-6">
                  {[
                    { month: 'Oct', amount: 1800000, height: '55%' },
                    { month: 'Nov', amount: 2100000, height: '65%' },
                    { month: 'Dec', amount: 2400000, height: '72%' },
                    { month: 'Jan', amount: 2800000, height: '84%' },
                    { month: 'Feb', amount: 2950000, height: '88%' },
                    { month: 'Mar', amount: 3200000, height: '96%' },
                  ].map((bar) => (
                    <div key={bar.month} className="flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-[10px] font-mono font-semibold text-[#687477]">
                        {(bar.amount / 1000000).toFixed(1)}M
                      </span>
                      <div className="w-full bg-[#F8F6F2] rounded-t-xl overflow-hidden h-full flex items-end">
                        <div
                          className="w-full bg-[#143642] hover:bg-[#B76935] rounded-t-xl transition-all"
                          style={{ height: bar.height }}
                        />
                      </div>
                      <span className="text-xs font-medium text-[#202A2D]">{bar.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regional Share Breakdown */}
              <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-4">
                <div className="pb-3 border-b border-[#E7E4DE]">
                  <h3 className="font-bold text-sm text-[#143642]">Market Share by County</h3>
                  <p className="text-xs text-[#687477]">Active property listings concentration</p>
                </div>

                <div className="space-y-3 pt-2 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-[#143642]">Nairobi County</span>
                      <span className="font-mono text-[#687477]">65%</span>
                    </div>
                    <div className="w-full bg-[#F8F6F2] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#143642] h-full" style={{ width: '65%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-[#143642]">Kiambu (Ruaka, Ruiru)</span>
                      <span className="font-mono text-[#687477]">18%</span>
                    </div>
                    <div className="w-full bg-[#F8F6F2] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#B76935] h-full" style={{ width: '18%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-[#143642]">Mombasa (Nyali)</span>
                      <span className="font-mono text-[#687477]">10%</span>
                    </div>
                    <div className="w-full bg-[#F8F6F2] h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full" style={{ width: '10%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-[#143642]">Nakuru & Kisumu</span>
                      <span className="font-mono text-[#687477]">7%</span>
                    </div>
                    <div className="w-full bg-[#F8F6F2] h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full" style={{ width: '7%' }} />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E7E4DE]">
                  <button
                    onClick={() => setAdminTab('locations')}
                    className="w-full py-2 bg-[#F8F6F2] hover:bg-[#E7E4DE] text-[#143642] rounded-xl text-xs font-semibold"
                  >
                    Manage Kenyan Geofences
                  </button>
                </div>
              </div>

            </div>

            {/* Live Operational Payment & Activity Stream */}
            <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E4DE]">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#143642]" />
                  <div>
                    <h3 className="font-bold text-sm text-[#143642]">Real-Time Operational Stream</h3>
                    <p className="text-xs text-[#687477]">Live M-Pesa settlements, viewings, and audit security events</p>
                  </div>
                </div>
                <button
                  onClick={() => setAdminTab('audit')}
                  className="text-xs font-semibold text-[#B76935] hover:underline"
                >
                  Full Audit Trail ({auditLogs.length})
                </button>
              </div>

              <div className="space-y-2.5">
                {auditLogs.slice(0, 5).map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-[#E7E4DE] flex items-center justify-center font-bold text-[#143642] shrink-0 text-xs">
                        {log.action.includes('PAYMENT') ? (
                          <Receipt className="w-4 h-4 text-emerald-600" />
                        ) : log.action.includes('MODERATE') ? (
                          <ShieldCheck className="w-4 h-4 text-[#B76935]" />
                        ) : (
                          <UserCheck className="w-4 h-4 text-[#143642]" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#143642]">{log.action}</span>
                          <span className="text-[10px] text-[#687477] font-mono">{log.entity}</span>
                        </div>
                        <p className="text-[#202A2D] text-[11px] mt-0.5">{log.details}</p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between text-[11px] text-[#687477] shrink-0">
                      <span className="font-semibold text-[#143642]">{log.userName}</span>
                      <span className="font-mono text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Moderation Queue */}
            <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E4DE]">
                <div>
                  <h3 className="font-bold text-sm text-[#143642]">Property Moderation Priority Queue</h3>
                  <p className="text-xs text-[#687477]">Audit title deed proof and authorize public visibility</p>
                </div>
                <button
                  onClick={() => setAdminTab('listings')}
                  className="text-xs font-semibold text-[#B76935] hover:underline"
                >
                  View All Listings ({properties.length})
                </button>
              </div>

              <div className="space-y-3">
                {properties.slice(0, 4).map((p) => (
                  <div key={p.id} className="p-4 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="flex items-start gap-3">
                      <img src={p.featuredImage || p.images[0]} alt={p.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-[#143642]">{p.title}</h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            p.moderationStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' : p.moderationStatus === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {p.moderationStatus}
                          </span>
                        </div>
                        <p className="text-[#687477] mt-0.5">{p.address} · Landlord: <strong className="text-[#202A2D]">{p.managerName}</strong></p>
                        <span className="font-mono font-bold text-[#143642] text-[11px] mt-1 block">{formatKSh(p.baseRent)} / month</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setInspectProperty(p)}
                        className="px-3 py-1.5 bg-white border border-[#E7E4DE] hover:bg-[#F8F6F2] text-[#143642] rounded-lg text-xs font-semibold flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#687477]" />
                        <span>Inspect Specs</span>
                      </button>

                      {p.moderationStatus !== 'approved' && (
                        <button
                          onClick={() => moderateProperty(p.id, 'approved')}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold"
                        >
                          Approve
                        </button>
                      )}

                      {p.moderationStatus !== 'suspended' && (
                        <button
                          onClick={() => {
                            setRejectReasonModalProperty(p);
                          }}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold"
                        >
                          Reject / Suspend
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 2. LISTING MODERATION */}
        {adminTab === 'listings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E7E4DE] overflow-hidden shadow-2xs space-y-4">
              <div className="p-4 border-b border-[#E7E4DE] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {(['all', 'pending', 'approved', 'suspended'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setListingFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                        listingFilter === status ? 'bg-[#143642] text-white' : 'bg-[#F8F6F2] text-[#687477] hover:text-[#202A2D]'
                      }`}
                    >
                      {status === 'all' ? `All Listings (${properties.length})` : status}
                    </button>
                  ))}
                </div>

                <div className="relative max-w-xs w-full">
                  <Search className="w-4 h-4 text-[#687477] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by title, neighbourhood, landlord..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#F8F6F2] border border-[#E7E4DE] rounded-xl text-xs focus:outline-hidden focus:border-[#B76935]"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E7E4DE] bg-[#F8F6F2] text-[#687477] font-semibold">
                      <th className="py-3 px-4">Property</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Managing Agent</th>
                      <th className="py-3 px-4 text-right">Rent (KSh)</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E4DE]">
                    {properties
                      .filter((p) => {
                        if (listingFilter !== 'all' && p.moderationStatus !== listingFilter) return false;
                        if (searchTerm) {
                          const q = searchTerm.toLowerCase();
                          return (
                            p.title.toLowerCase().includes(q) ||
                            p.neighbourhood.toLowerCase().includes(q) ||
                            p.managerName.toLowerCase().includes(q)
                          );
                        }
                        return true;
                      })
                      .map((p) => (
                        <tr key={p.id} className="hover:bg-[#F8F6F2] transition-colors">
                          <td className="py-3 px-4 font-bold text-[#143642]">
                            <div className="flex items-center gap-2">
                              <img src={p.featuredImage || p.images[0]} alt={p.title} className="w-8 h-8 rounded-lg object-cover" />
                              <span className="line-clamp-1">{p.title}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-[#202A2D]">{p.neighbourhood}, {p.county}</td>
                          <td className="py-3 px-4 text-[#687477]">{p.managerName}</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-[#143642]">
                            {formatKSh(p.baseRent)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              p.moderationStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' : p.moderationStatus === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {p.moderationStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => setInspectProperty(p)}
                              className="px-2.5 py-1 bg-white border border-[#E7E4DE] text-[#143642] hover:bg-[#F8F6F2] rounded text-[11px] font-semibold"
                            >
                              Inspect
                            </button>
                            {p.moderationStatus !== 'approved' && (
                              <button
                                onClick={() => moderateProperty(p.id, 'approved')}
                                className="px-2.5 py-1 bg-emerald-700 text-white hover:bg-emerald-800 rounded text-[11px] font-semibold"
                              >
                                Approve
                              </button>
                            )}
                            {p.moderationStatus !== 'suspended' && (
                              <button
                                onClick={() => setRejectReasonModalProperty(p)}
                                className="px-2.5 py-1 bg-red-600 text-white hover:bg-red-700 rounded text-[11px] font-semibold"
                              >
                                Reject
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. REPORTED LISTINGS / FRAUD QUEUE */}
        {adminTab === 'reported' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E7E4DE] overflow-hidden shadow-2xs space-y-4">
              <div className="p-4 border-b border-[#E7E4DE] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#143642]">Reported Listings & Fraud Dispute Resolution</h3>
                  <p className="text-xs text-[#687477]">Submitted by public property seekers & verified residents</p>
                </div>
                <span className="text-xs font-mono font-bold text-red-600">
                  {openReportsCount} Pending Investigation
                </span>
              </div>

              <div className="p-6 space-y-4">
                {reportedListings.map((rep) => {
                  const targetProp = properties.find((p) => p.id === rep.propertyId);
                  return (
                    <div key={rep.id} className="p-5 bg-[#F8F6F2] rounded-2xl border border-[#E7E4DE] space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 uppercase">
                              {rep.reason}
                            </span>
                            <h4 className="font-bold text-sm text-[#143642]">{rep.propertyTitle}</h4>
                          </div>
                          <p className="text-[11px] text-[#687477] mt-0.5">
                            Reported by: <strong className="text-[#202A2D]">{rep.reporterName}</strong> ({rep.reporterEmail}) on {new Date(rep.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          rep.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {rep.status}
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-[#E7E4DE] text-xs text-[#202A2D]">
                        <span className="font-semibold text-[#687477] block text-[11px] mb-0.5">Incident Report:</span>
                        "{rep.details}"
                      </div>

                      <div className="pt-2 border-t border-[#E7E4DE] flex items-center justify-between text-xs">
                        <span className="text-[#687477]">
                          Landlord: {targetProp?.managerName || 'Managing Agent'} ({targetProp?.managerPhone})
                        </span>

                        <div className="flex items-center gap-2">
                          {targetProp && (
                            <button
                              onClick={() => {
                                moderateProperty(targetProp.id, 'suspended', `Suspended due to report: ${rep.reason}`);
                                updateReportedListingStatus(rep.id, 'Resolved');
                              }}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold"
                            >
                              Suspend Listing Immediately
                            </button>
                          )}

                          <button
                            onClick={() => updateReportedListingStatus(rep.id, 'Investigating')}
                            className="px-3 py-1 bg-[#143642] hover:bg-[#0e2730] text-white rounded-lg text-xs font-medium"
                          >
                            Mark Investigating
                          </button>

                          <button
                            onClick={() => updateReportedListingStatus(rep.id, 'Dismissed')}
                            className="px-3 py-1 bg-white border border-[#E7E4DE] text-[#202A2D] hover:bg-[#F8F6F2] rounded-lg text-xs"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 4. USER MANAGEMENT & RBAC */}
        {adminTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E7E4DE] overflow-hidden shadow-2xs space-y-4">
              <div className="p-4 border-b border-[#E7E4DE] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {['all', 'seeker', 'manager', 'tenant', 'admin'].map((role) => (
                    <button
                      key={role}
                      onClick={() => setUserRoleFilter(role)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                        userRoleFilter === role ? 'bg-[#143642] text-white' : 'bg-[#F8F6F2] text-[#687477] hover:text-[#202A2D]'
                      }`}
                    >
                      {role === 'all' ? `All (${users.length})` : role}
                    </button>
                  ))}
                </div>

                <div className="relative max-w-xs w-full">
                  <Search className="w-4 h-4 text-[#687477] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search name, phone, national ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#F8F6F2] border border-[#E7E4DE] rounded-xl text-xs focus:outline-hidden focus:border-[#B76935]"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E7E4DE] bg-[#F8F6F2] text-[#687477] font-semibold">
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">National ID</th>
                      <th className="py-3 px-4">Phone & Email</th>
                      <th className="py-3 px-4 text-center">ID Verification</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Access Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E4DE]">
                    {users
                      .filter((u) => {
                        if (userRoleFilter !== 'all' && u.role !== userRoleFilter) return false;
                        if (searchTerm) {
                          const q = searchTerm.toLowerCase();
                          return (
                            u.name.toLowerCase().includes(q) ||
                            u.email.toLowerCase().includes(q) ||
                            u.phone.includes(q) ||
                            (u.nationalId && u.nationalId.includes(q))
                          );
                        }
                        return true;
                      })
                      .map((u) => (
                        <tr key={u.id} className="hover:bg-[#F8F6F2] transition-colors">
                          <td className="py-3 px-4 font-bold text-[#143642]">{u.name}</td>
                          <td className="py-3 px-4 capitalize font-semibold text-[#B76935]">{u.role}</td>
                          <td className="py-3 px-4 font-mono text-[#687477]">{u.nationalId || '—'}</td>
                          <td className="py-3 px-4 text-[#202A2D]">
                            <div>{u.phone}</div>
                            <div className="text-[11px] text-[#687477]">{u.email}</div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              u.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {u.isVerified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              u.status === 'suspended' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {u.status || 'active'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => toggleUserStatus(u.id)}
                              className="px-2 py-1 bg-white border border-[#E7E4DE] text-[#143642] hover:bg-[#F8F6F2] rounded text-[11px]"
                            >
                              Toggle Badge
                            </button>
                            <button
                              onClick={() => toggleUserSuspension(u.id)}
                              className={`px-2 py-1 rounded text-[11px] font-semibold ${
                                u.status === 'suspended' ? 'bg-emerald-700 text-white' : 'bg-red-600 text-white hover:bg-red-700'
                              }`}
                            >
                              {u.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. PROPERTY OWNERS & AGENCIES */}
        {adminTab === 'owners' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E7E4DE] overflow-hidden shadow-2xs space-y-4">
              <div className="p-4 border-b border-[#E7E4DE] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#143642]">Registered Property Owners & Management Firms</h3>
                  <p className="text-xs text-[#687477]">Audit KRA PIN, company registration, and portfolio scale</p>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {users.filter((u) => u.role === 'manager').map((mgr) => {
                  const ownedProps = properties.filter((p) => p.managerName === mgr.name);
                  const managedUnits = units.filter((u) => ownedProps.some((p) => p.id === u.propertyId));
                  return (
                    <div key={mgr.id} className="p-5 bg-[#F8F6F2] rounded-2xl border border-[#E7E4DE] space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-base text-[#143642]">{mgr.agencyName || mgr.name}</h4>
                          <p className="text-xs text-[#687477]">Principal: {mgr.name}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          mgr.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {mgr.isVerified ? 'Licensed & Verified' : 'Unverified'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-[#E7E4DE]">
                        <div>
                          <span className="text-[#687477] text-[11px] block">KRA Tax PIN</span>
                          <span className="font-mono font-bold text-[#143642]">{mgr.kraPin || 'P051289100Z'}</span>
                        </div>
                        <div>
                          <span className="text-[#687477] text-[11px] block">National ID</span>
                          <span className="font-mono font-bold text-[#143642]">{mgr.nationalId}</span>
                        </div>
                        <div>
                          <span className="text-[#687477] text-[11px] block">Managed Properties</span>
                          <span className="font-bold text-[#143642]">{ownedProps.length} Buildings</span>
                        </div>
                        <div>
                          <span className="text-[#687477] text-[11px] block">Total Rentable Units</span>
                          <span className="font-bold text-[#143642]">{managedUnits.length} Units</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#E7E4DE] flex items-center justify-between text-xs">
                        <span className="text-[#687477]">{mgr.phone}</span>
                        <button
                          onClick={() => verifyAgencyOwner(mgr.id, !mgr.isVerified)}
                          className="px-3 py-1 bg-[#143642] hover:bg-[#0e2730] text-white rounded-lg text-xs font-medium"
                        >
                          {mgr.isVerified ? 'Revoke Verification' : 'Grant Verified Agency Badge'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 6. TENANTS REGISTRY */}
        {adminTab === 'tenants' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E7E4DE] overflow-hidden shadow-2xs space-y-4">
              <div className="p-4 border-b border-[#E7E4DE] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#143642]">Central Tenancy Directory</h3>
                  <p className="text-xs text-[#687477]">Cross-platform verified residents and active lease records</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E7E4DE] bg-[#F8F6F2] text-[#687477] font-semibold">
                      <th className="py-3 px-4">Resident</th>
                      <th className="py-3 px-4">Property & Unit</th>
                      <th className="py-3 px-4">National ID</th>
                      <th className="py-3 px-4">Move-in Date</th>
                      <th className="py-3 px-4">Emergency Contact</th>
                      <th className="py-3 px-4 text-right">Rent Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E4DE]">
                    {tenants.map((t) => {
                      const p = properties.find((prop) => prop.id === t.assignedPropertyId);
                      const u = units.find((unit) => unit.id === t.assignedUnitId);
                      return (
                        <tr key={t.id} className="hover:bg-[#F8F6F2] transition-colors">
                          <td className="py-3 px-4 font-bold text-[#143642]">
                            <div>{t.fullName}</div>
                            <div className="text-[11px] text-[#687477]">{t.phone}</div>
                          </td>
                          <td className="py-3 px-4 text-[#202A2D]">
                            <div className="font-semibold">{u?.unitNumber || 'Unit 302'}</div>
                            <div className="text-[11px] text-[#687477]">{p?.title}</div>
                          </td>
                          <td className="py-3 px-4 font-mono text-[#687477]">{t.idNumber}</td>
                          <td className="py-3 px-4 text-[#687477]">{t.moveInDate}</td>
                          <td className="py-3 px-4 text-[#687477]">
                            <div>{t.emergencyContactName}</div>
                            <div className="text-[10px]">{t.emergencyContactPhone}</div>
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold">
                            <span className={t.outstandingBalance > 0 ? 'text-amber-700' : 'text-emerald-700'}>
                              {formatKSh(t.outstandingBalance)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 7. TAXONOMY & AMENITIES */}
        {adminTab === 'taxonomy' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-4">
              <h3 className="font-bold text-base text-[#143642]">Property Categories & Architectural Types</h3>
              <div className="space-y-2 text-xs">
                {['Apartment', 'Villa', 'Townhouse', 'Studio', 'Bedsitter', 'Commercial', 'Duplex Penthouse'].map((t) => (
                  <div key={t} className="p-3 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE] flex items-center justify-between">
                    <span className="font-semibold text-[#143642]">{t}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-4">
              <h3 className="font-bold text-base text-[#143642]">Global Residential Amenities Dictionary</h3>
              <div className="space-y-2 text-xs max-h-96 overflow-y-auto">
                {[
                  'Heated Swimming Pool',
                  'Fully Equipped Gym',
                  'Full Backup Generator',
                  'Borehole Water Supply',
                  '24/7 CCTV & Biometric Access',
                  'Solar Water Heating',
                  'Fibre Internet Ready',
                  'Pet Friendly Compound',
                  'High-Speed Elevators',
                  'Electric Perimeter Wall',
                  'Private Balcony / Terrace'
                ].map((a) => (
                  <div key={a} className="p-3 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE] flex items-center justify-between">
                    <span className="text-[#202A2D]">{a}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">Enabled</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 8. LOCATIONS & GEOFENCE */}
        {adminTab === 'locations' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E7E4DE] overflow-hidden shadow-2xs space-y-4">
              <div className="p-4 border-b border-[#E7E4DE] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#143642]">Kenyan Location Geofences & Rent Benchmarks</h3>
                  <p className="text-xs text-[#687477]">Average 2-bedroom rental benchmarks and hotspot classification</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E7E4DE] bg-[#F8F6F2] text-[#687477] font-semibold">
                      <th className="py-3 px-4">County</th>
                      <th className="py-3 px-4">Neighbourhood</th>
                      <th className="py-3 px-4 text-right">Avg 2-Bed Rent</th>
                      <th className="py-3 px-4 text-center">Market Tier</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E4DE]">
                    {locationBenchmarks.map((loc) => (
                      <tr key={loc.id} className="hover:bg-[#F8F6F2] transition-colors">
                        <td className="py-3 px-4 font-bold text-[#143642]">{loc.county}</td>
                        <td className="py-3 px-4 font-semibold text-[#202A2D]">{loc.neighbourhood}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-[#143642]">
                          {formatKSh(loc.averageRent2Bed)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            loc.isPrime ? 'bg-[#B76935]/15 text-[#B76935]' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {loc.isPrime ? 'Prime Hotspot' : 'Growth Corridor'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            {loc.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => updateLocationBenchmark(loc.id, { isPrime: !loc.isPrime })}
                            className="px-2 py-1 bg-white border border-[#E7E4DE] text-[#143642] rounded text-[11px]"
                          >
                            Toggle Hotspot
                          </button>
                          <button
                            onClick={() => deleteLocationBenchmark(loc.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 9. PLATFORM ANALYTICS & P&L */}
        {adminTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#E7E4DE] pb-4">
                <div>
                  <h3 className="font-bold text-base text-[#143642]">Platform Economics & Financial Yield</h3>
                  <p className="text-xs text-[#687477]">Gross Merchandise Value (GMV) and transaction fee receipts</p>
                </div>
                <button
                  onClick={() => alert('Exporting platform financial audit summary (PDF)...')}
                  className="px-3.5 py-2 bg-[#143642] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-[#0e2730]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Financial Statement</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE]">
                  <span className="text-[#687477] text-[11px] block">Gross Platform Collections</span>
                  <span className="font-mono font-bold text-xl text-[#143642]">{formatKSh(platformRentVolume)}</span>
                  <span className="text-[10px] text-emerald-700 mt-1 block">100% Safaricom Paybill reconciled</span>
                </div>

                <div className="p-4 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE]">
                  <span className="text-[#687477] text-[11px] block">Platform Monetization Fee ({platformSettings.commissionRatePercent}%)</span>
                  <span className="font-mono font-bold text-xl text-emerald-700">{formatKSh(platformRevenueYield)}</span>
                  <span className="text-[10px] text-[#687477] mt-1 block">Auto-deducted at STK payout</span>
                </div>

                <div className="p-4 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE]">
                  <span className="text-[#687477] text-[11px] block">Viewing-to-Lease Conversion</span>
                  <span className="font-mono font-bold text-xl text-[#B76935]">64.2%</span>
                  <span className="text-[10px] text-[#687477] mt-1 block">High commercial engagement</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 10. SYSTEM BROADCAST */}
        {adminTab === 'broadcast' && (
          <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-6 max-w-2xl">
            <div>
              <h3 className="font-bold text-base text-[#143642]">Broadcast System Announcement</h3>
              <p className="text-xs text-[#687477]">Dispatch official notices directly to tenant portals, landlord dashboards, or public seekers</p>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#202A2D] mb-1">Target Audience</label>
                <select
                  value={broadcastForm.targetRole}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, targetRole: e.target.value as any })}
                  className="w-full p-2.5 border border-[#E7E4DE] rounded-xl bg-white"
                >
                  <option value="all">Broadcast to All Users</option>
                  <option value="manager">Property Owners & Managers Only</option>
                  <option value="tenant">Tenants & Residents Only</option>
                  <option value="seeker">Property Seekers Only</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#202A2D] mb-1">Notice Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scheduled Safaricom Daraja Maintenance Notice"
                  value={broadcastForm.title}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                  className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#202A2D] mb-1">Message Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter detailed notice instructions or emergency contact numbers..."
                  value={broadcastForm.message}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                  className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#B76935] hover:bg-[#a05b2d] text-white font-semibold rounded-xl flex items-center gap-2 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Platform Notice</span>
              </button>
            </form>
          </div>
        )}

        {/* 11. AUDIT LOGS */}
        {adminTab === 'audit' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E7E4DE] overflow-hidden shadow-2xs space-y-4">
              <div className="p-4 border-b border-[#E7E4DE] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-sm text-[#143642]">Security & Action Audit Trail</h3>
                  <p className="text-xs text-[#687477]">Immutable audit log with client IP addresses and timestamps</p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={auditActionFilter}
                    onChange={(e) => setAuditActionFilter(e.target.value)}
                    className="p-2 border border-[#E7E4DE] rounded-xl text-xs bg-white"
                  >
                    <option value="all">All Actions ({auditLogs.length})</option>
                    <option value="MODERATE_PROPERTY">MODERATE_PROPERTY</option>
                    <option value="TOGGLE_USER_SUSPENSION">TOGGLE_USER_SUSPENSION</option>
                    <option value="RECORD_PAYMENT">RECORD_PAYMENT</option>
                    <option value="CREATE_USER">CREATE_USER</option>
                    <option value="SYSTEM_BROADCAST">SYSTEM_BROADCAST</option>
                  </select>

                  <button
                    onClick={handleExportAuditCSV}
                    className="px-3 py-2 bg-[#143642] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#E7E4DE] bg-[#F8F6F2] text-[#687477] font-semibold">
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Actor</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Entity</th>
                      <th className="py-3 px-4">Details</th>
                      <th className="py-3 px-4">Client IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E4DE]">
                    {auditLogs
                      .filter((l) => auditActionFilter === 'all' || l.action === auditActionFilter)
                      .map((log) => (
                        <tr key={log.id} className="hover:bg-[#F8F6F2] transition-colors">
                          <td className="py-3 px-4 text-[#687477] whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </td>
                          <td className="py-3 px-4 font-bold text-[#143642]">{log.userName}</td>
                          <td className="py-3 px-4 text-[#B76935] font-bold">{log.action}</td>
                          <td className="py-3 px-4 text-[#687477]">{log.entity}</td>
                          <td className="py-3 px-4 text-[#202A2D] max-w-sm truncate">{log.details}</td>
                          <td className="py-3 px-4 text-[#687477]">{log.ipAddress}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 12. PLATFORM SETTINGS */}
        {adminTab === 'settings' && (
          <div className="space-y-6">
            {/* Header & Category Sub-navigation */}
            <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E7E4DE]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#143642] text-white">
                      <Settings className="w-4 h-4" />
                    </span>
                    <h3 className="font-bold text-lg text-[#143642]">Global Platform Governance & Policies</h3>
                  </div>
                  <p className="text-xs text-[#687477] mt-1">
                    Configure national Kenyan payment gateways, Ardhisasa land title checks, statutory tenancy rules, and platform parameters.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {settingsSavedToast && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Settings Saved & Synced</span>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setSettingsSavedToast(true);
                      setTimeout(() => setSettingsSavedToast(false), 3000);
                    }}
                    className="px-4 py-2 bg-[#B76935] hover:bg-[#a05b2d] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Changes</span>
                  </button>
                </div>
              </div>

              {/* Sub-tabs bar */}
              <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 text-xs font-medium">
                <button
                  onClick={() => setSettingsCategory('general')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap ${
                    settingsCategory === 'general'
                      ? 'bg-[#143642] text-white font-bold shadow-2xs'
                      : 'text-[#687477] hover:bg-[#F8F6F2] hover:text-[#143642]'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>General & Branding</span>
                </button>

                <button
                  onClick={() => setSettingsCategory('financial')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                    settingsCategory === 'financial'
                      ? 'bg-[#143642] text-white font-bold shadow-2xs'
                      : 'text-[#687477] hover:bg-[#F8F6F2] hover:text-[#143642]'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>M-Pesa & Financials</span>
                </button>

                <button
                  onClick={() => setSettingsCategory('kra_etims')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                    settingsCategory === 'kra_etims'
                      ? 'bg-[#143642] text-white font-bold shadow-2xs'
                      : 'text-[#687477] hover:bg-[#F8F6F2] hover:text-[#143642]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>KRA eTIMS & Tax</span>
                </button>

                <button
                  onClick={() => setSettingsCategory('tenancy')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                    settingsCategory === 'tenancy'
                      ? 'bg-[#143642] text-white font-bold shadow-2xs'
                      : 'text-[#687477] hover:bg-[#F8F6F2] hover:text-[#143642]'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Tenancy & Leases</span>
                </button>

                <button
                  onClick={() => setSettingsCategory('security')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                    settingsCategory === 'security'
                      ? 'bg-[#143642] text-white font-bold shadow-2xs'
                      : 'text-[#687477] hover:bg-[#F8F6F2] hover:text-[#143642]'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Security & Compliance</span>
                </button>

                <button
                  onClick={() => setSettingsCategory('communications')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                    settingsCategory === 'communications'
                      ? 'bg-[#143642] text-white font-bold shadow-2xs'
                      : 'text-[#687477] hover:bg-[#F8F6F2] hover:text-[#143642]'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Alerts & Notifications</span>
                </button>

                <button
                  onClick={() => setSettingsCategory('marketplace')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                    settingsCategory === 'marketplace'
                      ? 'bg-[#143642] text-white font-bold shadow-2xs'
                      : 'text-[#687477] hover:bg-[#F8F6F2] hover:text-[#143642]'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Marketplace Rules</span>
                </button>
              </div>
            </div>

            {/* Sub-tab 1: GENERAL & BRANDING */}
            {settingsCategory === 'general' && (
              <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-6 text-xs">
                <div className="border-b border-[#E7E4DE] pb-4">
                  <h4 className="font-bold text-sm text-[#143642]">Platform Identity & Regional Defaults</h4>
                  <p className="text-[11px] text-[#687477] mt-0.5">Core brand metadata, primary timezone, and corporate presence.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Platform Brand Name</label>
                    <input
                      type="text"
                      value={platformSettings.platformName}
                      onChange={(e) => updatePlatformSettings({ platformName: e.target.value })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-bold text-[#143642]"
                    />
                    <p className="text-[11px] text-[#687477] mt-1">Displayed in public header, emails, and SMS alerts.</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Official Tagline</label>
                    <input
                      type="text"
                      value={platformSettings.platformTagline}
                      onChange={(e) => updatePlatformSettings({ platformTagline: e.target.value })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl text-[#202A2D]"
                    />
                    <p className="text-[11px] text-[#687477] mt-1">Appears on homepage hero and search index tags.</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Operational Currency</label>
                    <select
                      value={platformSettings.defaultCurrency}
                      onChange={(e) => updatePlatformSettings({ defaultCurrency: e.target.value })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl bg-white font-mono"
                    >
                      <option value="KSh">KSh (Kenya Shilling)</option>
                      <option value="USD">USD (United States Dollar)</option>
                      <option value="UGX">UGX (Ugandan Shilling)</option>
                      <option value="TZS">TZS (Tanzanian Shilling)</option>
                    </select>
                    <p className="text-[11px] text-[#687477] mt-1">Default denomination for property listings & rent ledger.</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">System Timezone</label>
                    <input
                      type="text"
                      value={platformSettings.timezone}
                      onChange={(e) => updatePlatformSettings({ timezone: e.target.value })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono text-[#202A2D]"
                    />
                    <p className="text-[11px] text-[#687477] mt-1">Standard East Africa Time (UTC+03:00) for timestamps.</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-semibold text-[#202A2D] mb-1">Corporate Physical Headquarters</label>
                    <input
                      type="text"
                      value={platformSettings.supportPhysicalAddress}
                      onChange={(e) => updatePlatformSettings({ supportPhysicalAddress: e.target.value })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl text-[#202A2D]"
                    />
                    <p className="text-[11px] text-[#687477] mt-1">Required for statutory tenancy agreements and Kenya Data Protection Act filings.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 2: M-PESA & FINANCIALS */}
            {settingsCategory === 'financial' && (
              <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-6 text-xs">
                <div className="border-b border-[#E7E4DE] pb-4">
                  <h4 className="font-bold text-sm text-[#143642]">Safaricom Daraja M-Pesa Gateway & Financial Rules</h4>
                  <p className="text-[11px] text-[#687477] mt-0.5">Automate C2B rent collections, B2C landlord disbursements, and late penalties.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Daraja Environment</label>
                    <select
                      value={platformSettings.mpesaEnvironment}
                      onChange={(e) => updatePlatformSettings({ mpesaEnvironment: e.target.value as any })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl bg-white font-medium"
                    >
                      <option value="production">Production Daraja Gateway</option>
                      <option value="sandbox">Sandbox Test API</option>
                    </select>
                    <p className="text-[11px] text-[#687477] mt-1">Production connects directly to Safaricom Daraja API.</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Business Paybill Number</label>
                    <input
                      type="text"
                      value={platformSettings.mpesaPaybill}
                      onChange={(e) => updatePlatformSettings({ mpesaPaybill: e.target.value })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono text-[#143642] font-bold"
                    />
                    <p className="text-[11px] text-[#687477] mt-1">MAKAZI collection shortcode shown on tenant invoices.</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">B2C Disbursement Account</label>
                    <input
                      type="text"
                      value={platformSettings.b2cAccount}
                      onChange={(e) => updatePlatformSettings({ b2cAccount: e.target.value })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono"
                    />
                    <p className="text-[11px] text-[#687477] mt-1">Shortcode used for automated landlord net payouts.</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Platform Commission Fee (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="15"
                      value={platformSettings.commissionRatePercent}
                      onChange={(e) => updatePlatformSettings({ commissionRatePercent: Number(e.target.value) })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono text-sm font-bold text-[#B76935]"
                    />
                    <p className="text-[11px] text-[#687477] mt-1">Platform retention fee per rent transaction.</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">STK Push Handshake Timeout (s)</label>
                    <input
                      type="number"
                      value={platformSettings.stkPushTimeoutSeconds}
                      onChange={(e) => updatePlatformSettings({ stkPushTimeoutSeconds: Number(e.target.value) })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono"
                    />
                    <p className="text-[11px] text-[#687477] mt-1">Seconds before tenant STK prompt expires.</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Statutory Late Penalty (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={platformSettings.latePaymentPenaltyPercent}
                      onChange={(e) => updatePlatformSettings({ latePaymentPenaltyPercent: Number(e.target.value) })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono"
                    />
                    <p className="text-[11px] text-[#687477] mt-1">Applied after the grace period expires.</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Rent Default Grace Period (Days)</label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={platformSettings.latePaymentGraceDays}
                      onChange={(e) => updatePlatformSettings({ latePaymentGraceDays: Number(e.target.value) })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono"
                    />
                    <p className="text-[11px] text-[#687477] mt-1">Buffer days before late penalties are added to invoices.</p>
                  </div>
                </div>

                {/* Toggles */}
                <div className="p-4 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-semibold text-[#143642]">Allow Partial Rent Payments</h5>
                      <p className="text-[11px] text-[#687477]">Allows tenants to pay in installments (e.g., 50% on 1st, 50% on 15th).</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={platformSettings.allowPartialPayments}
                      onChange={(e) => updatePlatformSettings({ allowPartialPayments: e.target.checked })}
                      className="w-4 h-4 rounded text-[#B76935]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E7E4DE]">
                    <div>
                      <h5 className="font-semibold text-[#143642]">Instant Digital M-Pesa Receipts & PDF Invoices</h5>
                      <p className="text-[11px] text-[#687477]">Automatically stamp and deliver digital receipts with KRA eTIMS reference.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={platformSettings.instantReceiptGeneration}
                      onChange={(e) => updatePlatformSettings({ instantReceiptGeneration: e.target.checked })}
                      className="w-4 h-4 rounded text-[#B76935]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab: KRA eTIMS & TAX GOVERNANCE */}
            {settingsCategory === 'kra_etims' && (
              <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-6 text-xs">
                <div className="border-b border-[#E7E4DE] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#143642] text-white">
                      <FileText className="w-4 h-4" />
                    </span>
                    <h4 className="font-bold text-sm text-[#143642]">Kenya Revenue Authority (KRA) eTIMS & Tax Policy</h4>
                  </div>
                  <p className="text-[11px] text-[#687477] mt-1">
                    Statutory electronic tax invoice compliance, residential rental income withholding tax, and corporate PIN controls.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Corporate KRA Tax PIN</label>
                    <input
                      type="text"
                      value={platformSettings.kraPin}
                      onChange={(e) => updatePlatformSettings({ kraPin: e.target.value })}
                      placeholder="P051982341Z"
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono font-bold text-[#143642]"
                    />
                    <p className="text-[11px] text-[#687477] mt-1">Verified with KRA iTax portal.</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Standard VAT Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="30"
                      value={platformSettings.etimsVatPercent}
                      onChange={(e) => updatePlatformSettings({ etimsVatPercent: Number(e.target.value) })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono"
                    />
                    <p className="text-[11px] text-[#687477] mt-1">Applied to platform commission fees.</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Rent Withholding Tax (WHT %)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="20"
                      value={platformSettings.withholdingTaxPercent}
                      onChange={(e) => updatePlatformSettings({ withholdingTaxPercent: Number(e.target.value) })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono"
                    />
                    <p className="text-[11px] text-[#687477] mt-1">Section 35 of the Kenya Income Tax Act.</p>
                  </div>
                </div>

                {/* Compliance Toggles */}
                <div className="p-4 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-semibold text-[#143642]">Automated eTIMS Fiscal Electronic Invoicing</h5>
                      <p className="text-[11px] text-[#687477]">Generates certified KRA fiscal signature and verification QR code on all invoices.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={platformSettings.etimsAutomaticInvoicing}
                      onChange={(e) => updatePlatformSettings({ etimsAutomaticInvoicing: e.target.checked })}
                      className="w-4 h-4 rounded text-[#B76935]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E7E4DE]">
                    <div>
                      <h5 className="font-semibold text-[#143642]">Monthly Landlord Withholding Tax Certificates</h5>
                      <p className="text-[11px] text-[#687477]">Auto-dispatches KRA Form ITX-01 certificates on the 20th of every month.</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      ACTIVE (KRA API v2.4)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab: TENANCY & LEASE STANDARDS */}
            {settingsCategory === 'tenancy' && (
              <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-6 text-xs">
                <div className="border-b border-[#E7E4DE] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#143642] text-white">
                      <FileCheck className="w-4 h-4" />
                    </span>
                    <h4 className="font-bold text-sm text-[#143642]">Tenancy Governance & Credit Standards</h4>
                  </div>
                  <p className="text-[11px] text-[#687477] mt-1">
                    Statutory Kenyan tenancy lease numbering, maximum security deposits, and CRB screening baselines.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Lease Numbering Code Prefix</label>
                    <input
                      type="text"
                      value={platformSettings.leasePrefix}
                      onChange={(e) => updatePlatformSettings({ leasePrefix: e.target.value })}
                      placeholder="MKZ-LS"
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono font-bold"
                    />
                    <p className="text-[11px] text-[#687477] mt-1">Generated as e.g. {platformSettings.leasePrefix}-2026-0042.</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Max Deposit Cap (Months)</label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={platformSettings.maxDepositMonths}
                      onChange={(e) => updatePlatformSettings({ maxDepositMonths: Number(e.target.value) })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono"
                    />
                    <p className="text-[11px] text-[#687477] mt-1">Standard Nairobi tenancy ceiling (usually 1-2 months).</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Min CRB Credit Score Benchmark</label>
                    <input
                      type="number"
                      min="300"
                      max="850"
                      value={platformSettings.minTenantCreditScore}
                      onChange={(e) => updatePlatformSettings({ minTenantCreditScore: Number(e.target.value) })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono"
                    />
                    <p className="text-[11px] text-[#687477] mt-1">Metropol / TransUnion Kenya scale (300-850).</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Auto-Archive Inactive Listings (Days)</label>
                    <input
                      type="number"
                      min="7"
                      max="180"
                      value={platformSettings.autoArchiveExpiredListingsDays}
                      onChange={(e) => updatePlatformSettings({ autoArchiveExpiredListingsDays: Number(e.target.value) })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono"
                    />
                    <p className="text-[11px] text-[#687477] mt-1">Days with no viewing activity before listing goes to archive.</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Tenancy Dispute Resolution Window (Days)</label>
                    <input
                      type="number"
                      min="3"
                      max="60"
                      value={platformSettings.disputeResolutionWindowDays}
                      onChange={(e) => updatePlatformSettings({ disputeResolutionWindowDays: Number(e.target.value) })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono"
                    />
                    <p className="text-[11px] text-[#687477] mt-1">Tribunal appeal timeframe under Kenyan Rent Restriction Act.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 3: SECURITY & COMPLIANCE */}
            {settingsCategory === 'security' && (
              <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-6 text-xs">
                <div className="border-b border-[#E7E4DE] pb-4">
                  <h4 className="font-bold text-sm text-[#143642]">Security, Title Deed Verification & Ardhisasa</h4>
                  <p className="text-[11px] text-[#687477] mt-0.5">Enforce fraud prevention, landlord deed audits, and system maintenance switches.</p>
                </div>

                <div className="p-4 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-semibold text-[#143642]">Enforce Ardhisasa Land Title Deed Verification</h5>
                      <p className="text-[11px] text-[#687477]">Blocks all new properties from appearing publicly until verified against Ministry of Lands records.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={platformSettings.requireLandlordVerification}
                      onChange={(e) => updatePlatformSettings({ requireLandlordVerification: e.target.checked })}
                      className="w-4 h-4 rounded text-[#B76935]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#E7E4DE]">
                    <div>
                      <h5 className="font-semibold text-[#143642]">Enforce Tenant National ID / Passport Upload</h5>
                      <p className="text-[11px] text-[#687477]">Mandates tenant identity document verification prior to lease signing.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={platformSettings.enforceTenantIdUpload}
                      onChange={(e) => updatePlatformSettings({ enforceTenantIdUpload: e.target.checked })}
                      className="w-4 h-4 rounded text-[#B76935]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#E7E4DE]">
                    <div>
                      <h5 className="font-semibold text-[#143642]">Auto-Approve Verified Licensed Real Estate Agencies</h5>
                      <p className="text-[11px] text-[#687477]">Fast-tracks listings submitted by EARB-registered estate management firms.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={platformSettings.autoApproveVerifiedAgencies}
                      onChange={(e) => updatePlatformSettings({ autoApproveVerifiedAgencies: e.target.checked })}
                      className="w-4 h-4 rounded text-[#B76935]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#E7E4DE]">
                    <div>
                      <h5 className="font-semibold text-[#143642]">Two-Factor Authentication (2FA) for Managers & Admins</h5>
                      <p className="text-[11px] text-[#687477]">Sends SMS OTP verification code upon login to protect property management consoles.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={platformSettings.enableTwoFactorAuth}
                      onChange={(e) => updatePlatformSettings({ enableTwoFactorAuth: e.target.checked })}
                      className="w-4 h-4 rounded text-[#B76935]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#E7E4DE]">
                    <div>
                      <h5 className="font-semibold text-red-700">Platform Maintenance Mode</h5>
                      <p className="text-[11px] text-[#687477]">Suspends public marketplace viewing and displays maintenance advisory banner.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={platformSettings.platformMaintenanceMode}
                      onChange={(e) => updatePlatformSettings({ platformMaintenanceMode: e.target.checked })}
                      className="w-4 h-4 rounded text-red-600"
                    />
                  </div>
                </div>

                {/* Enhanced Security Parameters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Session Inactivity Timeout</label>
                    <select
                      value={platformSettings.sessionTimeoutMinutes}
                      onChange={(e) => updatePlatformSettings({ sessionTimeoutMinutes: Number(e.target.value) })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono text-xs"
                    >
                      <option value={15}>15 Minutes</option>
                      <option value={30}>30 Minutes</option>
                      <option value={60}>60 Minutes (Standard)</option>
                      <option value={120}>120 Minutes</option>
                    </select>
                    <p className="text-[11px] text-[#687477] mt-1">Automatic lock upon idle inactivity.</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Max Failed Login Attempts</label>
                    <input
                      type="number"
                      min="3"
                      max="10"
                      value={platformSettings.maxLoginAttempts}
                      onChange={(e) => updatePlatformSettings({ maxLoginAttempts: Number(e.target.value) })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono text-xs"
                    />
                    <p className="text-[11px] text-[#687477] mt-1">Triggers account lockout & SMS challenge.</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Data Retention Period (Years)</label>
                    <input
                      type="number"
                      min="1"
                      max="15"
                      value={platformSettings.kycDocumentRetentionYears}
                      onChange={(e) => updatePlatformSettings({ kycDocumentRetentionYears: Number(e.target.value) })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono text-xs"
                    />
                    <p className="text-[11px] text-[#687477] mt-1">Kenya Data Protection Act statutory ceiling.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Data Protection Officer (DPO) Email</label>
                    <input
                      type="email"
                      value={platformSettings.dataProtectionOfficerEmail}
                      onChange={(e) => updatePlatformSettings({ dataProtectionOfficerEmail: e.target.value })}
                      placeholder="dpo@makazi.co.ke"
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono text-xs"
                    />
                    <p className="text-[11px] text-[#687477] mt-1">Registered with the Office of the Data Protection Commissioner (ODPC).</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Minimum Password Length</label>
                    <input
                      type="number"
                      min="6"
                      max="24"
                      value={platformSettings.passwordMinLength}
                      onChange={(e) => updatePlatformSettings({ passwordMinLength: Number(e.target.value) })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono text-xs"
                    />
                    <p className="text-[11px] text-[#687477] mt-1">Enforced across all user roles upon signup.</p>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#202A2D] mb-1">Maintenance Advisory Notice</label>
                  <textarea
                    rows={2}
                    value={platformSettings.maintenanceModeNotice}
                    onChange={(e) => updatePlatformSettings({ maintenanceModeNotice: e.target.value })}
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl text-xs"
                    placeholder="MAKAZI is undergoing scheduled maintenance to upgrade our M-Pesa gateway..."
                  />
                  <p className="text-[11px] text-[#687477] mt-1">Displayed to public users when maintenance mode is engaged.</p>
                </div>
              </div>
            )}

            {/* Sub-tab 4: COMMUNICATIONS & ALERTS */}
            {settingsCategory === 'communications' && (
              <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-6 text-xs">
                <div className="border-b border-[#E7E4DE] pb-4">
                  <h4 className="font-bold text-sm text-[#143642]">Multi-Channel Notifications & Contact Desks</h4>
                  <p className="text-[11px] text-[#687477] mt-0.5">Automated SMS, WhatsApp API, email rent reminders, and support hotlines.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Primary SMS Gateway</label>
                    <select
                      value={platformSettings.smsGatewayProvider}
                      onChange={(e) => updatePlatformSettings({ smsGatewayProvider: e.target.value as any })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-medium text-xs bg-white"
                    >
                      <option value="safaricom_direct">Safaricom Direct (Daraja Bulk SMS)</option>
                      <option value="africastalking">Africa's Talking Gateway</option>
                      <option value="advanta">Advanta Africa SMS</option>
                    </select>
                    <p className="text-[11px] text-[#687477] mt-1">Direct tier-1 telecommunications route.</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Registered SMS Sender ID</label>
                    <input
                      type="text"
                      value={platformSettings.smsSenderId}
                      onChange={(e) => updatePlatformSettings({ smsSenderId: e.target.value })}
                      placeholder="MAKAZI"
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono font-bold"
                    />
                    <p className="text-[11px] text-[#687477] mt-1">CAK licensed alphanumeric sender tag.</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Rent Reminder Lead Days</label>
                    <input
                      type="number"
                      min="1"
                      max="14"
                      value={platformSettings.rentReminderDaysBefore}
                      onChange={(e) => updatePlatformSettings({ rentReminderDaysBefore: Number(e.target.value) })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono"
                    />
                    <p className="text-[11px] text-[#687477] mt-1">Days before 1st of month to trigger push.</p>
                  </div>
                </div>

                <div className="p-4 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-semibold text-[#143642]">Safaricom Bulk SMS Notifications</h5>
                      <p className="text-[11px] text-[#687477]">Send instant SMS alerts for rent receipts, viewing bookings, and maintenance updates.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={platformSettings.enableSmsAlerts}
                      onChange={(e) => updatePlatformSettings({ enableSmsAlerts: e.target.checked })}
                      className="w-4 h-4 rounded text-[#B76935]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E7E4DE]">
                    <div>
                      <h5 className="font-semibold text-[#143642]">Automated Email Dispatch</h5>
                      <p className="text-[11px] text-[#687477]">Delivers monthly PDF invoices, statement summaries, and lease agreements.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={platformSettings.enableEmailAlerts}
                      onChange={(e) => updatePlatformSettings({ enableEmailAlerts: e.target.checked })}
                      className="w-4 h-4 rounded text-[#B76935]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E7E4DE]">
                    <div>
                      <h5 className="font-semibold text-[#143642]">WhatsApp Cloud API Integration</h5>
                      <p className="text-[11px] text-[#687477]">Send conversational rent reminders with 1-tap M-Pesa STK push links on WhatsApp.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={platformSettings.enableWhatsAppAlerts}
                      onChange={(e) => updatePlatformSettings({ enableWhatsAppAlerts: e.target.checked })}
                      className="w-4 h-4 rounded text-[#B76935]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Rent Reminder Schedule (Days Before)</label>
                    <input
                      type="number"
                      min="1"
                      max="14"
                      value={platformSettings.rentReminderDaysBefore}
                      onChange={(e) => updatePlatformSettings({ rentReminderDaysBefore: Number(e.target.value) })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono font-bold"
                    />
                    <p className="text-[11px] text-[#687477] mt-1">Days before the 1st of the month when reminders trigger.</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Rapid Emergency Helpline</label>
                    <input
                      type="tel"
                      value={platformSettings.supportEmergencyPhone}
                      onChange={(e) => updatePlatformSettings({ supportEmergencyPhone: e.target.value })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono"
                    />
                    <p className="text-[11px] text-[#687477] mt-1">Displayed in tenant portal for plumbing/security emergencies.</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Compliance & Dispute Desk Email</label>
                    <input
                      type="email"
                      value={platformSettings.supportEmail}
                      onChange={(e) => updatePlatformSettings({ supportEmail: e.target.value })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl"
                    />
                    <p className="text-[11px] text-[#687477] mt-1">Direct destination for listing dispute escalation.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 5: MARKETPLACE RULES */}
            {settingsCategory === 'marketplace' && (
              <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-6 text-xs">
                <div className="border-b border-[#E7E4DE] pb-4">
                  <h4 className="font-bold text-sm text-[#143642]">Marketplace Listing & Deposit Policies</h4>
                  <p className="text-[11px] text-[#687477] mt-0.5">Listing quality benchmarks, photo rules, and consumer deposit ceilings.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Max Photos Allowed Per Property</label>
                    <input
                      type="number"
                      min="3"
                      max="30"
                      value={platformSettings.maxPhotosPerListing}
                      onChange={(e) => updatePlatformSettings({ maxPhotosPerListing: Number(e.target.value) })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono font-bold"
                    />
                    <p className="text-[11px] text-[#687477] mt-1">High-resolution property images allowed per listing upload.</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#202A2D] mb-1">Security Deposit Ceiling (Months)</label>
                    <input
                      type="number"
                      min="1"
                      max="3"
                      value={platformSettings.maxDepositMonths}
                      onChange={(e) => updatePlatformSettings({ maxDepositMonths: Number(e.target.value) })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono font-bold"
                    />
                    <p className="text-[11px] text-[#687477] mt-1">Protects seekers against exorbitant upfront rental deposits.</p>
                  </div>
                </div>

                <div className="p-4 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-semibold text-[#143642]">Watermark Public Listing Photos</h5>
                      <p className="text-[11px] text-[#687477]">Applies "MAKAZI Verified" watermark to prevent rogue broker re-uploads.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={platformSettings.watermarkListingPhotos}
                      onChange={(e) => updatePlatformSettings({ watermarkListingPhotos: e.target.checked })}
                      className="w-4 h-4 rounded text-[#B76935]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Sticky Action Bar */}
            <div className="p-4 bg-[#F8F6F2] rounded-2xl border border-[#E7E4DE] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#687477]">
                <Info className="w-4 h-4 text-[#143642]" />
                <span>All changes take immediate effect across public marketplace and dashboards.</span>
              </div>
              <button
                onClick={() => {
                  setSettingsSavedToast(true);
                  setTimeout(() => setSettingsSavedToast(false), 3000);
                }}
                className="px-5 py-2.5 bg-[#143642] text-white font-semibold rounded-xl hover:bg-[#0e2730] transition-colors flex items-center gap-2 shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save All Platform Settings</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* INSPECT PROPERTY DRAWER / MODAL */}
      {inspectProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E7E4DE] space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E7E4DE] pb-3">
              <div>
                <h3 className="font-bold text-base text-[#143642]">Audit Property Specifications</h3>
                <p className="text-xs text-[#687477]">{inspectProperty.title}</p>
              </div>
              <button onClick={() => setInspectProperty(null)} className="text-xs text-[#687477] hover:text-[#202A2D]">
                Close
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="aspect-16/9 rounded-xl overflow-hidden bg-[#F8F6F2]">
                <img src={inspectProperty.featuredImage || inspectProperty.images[0]} alt={inspectProperty.title} className="w-full h-full object-cover" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F8F6F2] p-3 rounded-xl border border-[#E7E4DE]">
                <div>
                  <span className="text-[#687477] text-[11px] block">Location</span>
                  <span className="font-bold text-[#143642]">{inspectProperty.neighbourhood}, {inspectProperty.county}</span>
                </div>
                <div>
                  <span className="text-[#687477] text-[11px] block">Base Monthly Rent</span>
                  <span className="font-mono font-bold text-emerald-700">{formatKSh(inspectProperty.baseRent)}</span>
                </div>
                <div>
                  <span className="text-[#687477] text-[11px] block">Bedrooms / Baths</span>
                  <span className="font-bold text-[#143642]">{inspectProperty.bedrooms} Bed · {inspectProperty.bathrooms} Bath</span>
                </div>
                <div>
                  <span className="text-[#687477] text-[11px] block">Title Deed Ref</span>
                  <span className="font-mono font-bold text-[#143642]">{inspectProperty.titleDeedNumber || 'IR-91823/NBI'}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#143642] mb-1">Description</h4>
                <p className="text-[#202A2D] leading-relaxed bg-[#F8F6F2] p-3 rounded-xl border border-[#E7E4DE]">
                  {inspectProperty.description}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#143642] mb-1">Managing Agent Contact</h4>
                <div className="p-3 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE] flex justify-between">
                  <span>Name: <strong className="text-[#202A2D]">{inspectProperty.managerName}</strong></span>
                  <span>Phone: <strong className="text-[#202A2D]">{inspectProperty.managerPhone}</strong></span>
                  <span>Email: <strong className="text-[#202A2D]">{inspectProperty.managerEmail}</strong></span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E7E4DE] flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    moderateProperty(inspectProperty.id, 'approved');
                    setInspectProperty(null);
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl"
                >
                  Approve & Publish Listing
                </button>
                <button
                  onClick={() => {
                    setInspectProperty(null);
                    setRejectReasonModalProperty(inspectProperty);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl"
                >
                  Reject with Reason
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REJECT LISTING WITH REASON MODAL */}
      {rejectReasonModalProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E7E4DE] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7E4DE] pb-2">
              <h3 className="font-bold text-base text-red-600">Reject Property Listing</h3>
              <button onClick={() => setRejectReasonModalProperty(null)} className="text-xs text-[#687477]">Close</button>
            </div>

            <form onSubmit={handleRejectListing} className="space-y-3 text-xs">
              <p className="text-[#687477]">
                Provide an audit reason for rejecting <strong>{rejectReasonModalProperty.title}</strong>. This feedback will be delivered directly to {rejectReasonModalProperty.managerName}.
              </p>

              <div>
                <label className="block font-semibold mb-1">Standard Rejection Category</label>
                <select
                  onChange={(e) => setRejectReasonText(e.target.value)}
                  className="w-full p-2.5 border border-[#E7E4DE] rounded-xl bg-white"
                >
                  <option value="">Select a reason or write custom below...</option>
                  <option value="Title deed registration reference could not be verified on Ardhisasa.">Ardhisasa Title Deed Unverified</option>
                  <option value="Deposit requirement exceeds Kenya Landlord & Tenant Act ceiling.">Unlawful Deposit Terms</option>
                  <option value="Low resolution photographs or watermarked competitor images.">Image Quality Non-Compliance</option>
                  <option value="Suspected broker sublet without registered owner power of attorney.">Unlicensed Broker Sublet</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Detailed Rejection Notes</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain required changes before resubmission..."
                  value={rejectReasonText}
                  onChange={(e) => setRejectReasonText(e.target.value)}
                  className="w-full p-2.5 border border-[#E7E4DE] rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectReasonModalProperty(null)}
                  className="px-3 py-2 bg-[#F8F6F2] text-[#202A2D] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700"
                >
                  Confirm Rejection & Unlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROVISION USER MODAL */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E7E4DE] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7E4DE] pb-2">
              <h3 className="font-bold text-base text-[#143642]">Provision New User Account</h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-xs text-[#687477]">Close</button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samuel Karanja"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  className="w-full p-2.5 border border-[#E7E4DE] rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Role Assignment</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as any })}
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl bg-white"
                  >
                    <option value="seeker">Property Seeker</option>
                    <option value="manager">Property Owner / Manager</option>
                    <option value="tenant">Tenant</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">National ID</label>
                  <input
                    type="text"
                    required
                    placeholder="32891045"
                    value={newUserForm.nationalId}
                    onChange={(e) => setNewUserForm({ ...newUserForm, nationalId: e.target.value })}
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl"
                  />
                </div>
              </div>

              {newUserForm.role === 'manager' && (
                <div>
                  <label className="block font-semibold mb-1">Company / Agency Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Westlands Asset Realtors Ltd"
                    value={newUserForm.agencyName}
                    onChange={(e) => setNewUserForm({ ...newUserForm, agencyName: e.target.value })}
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl"
                  />
                </div>
              )}

              <button type="submit" className="w-full py-2.5 bg-[#B76935] hover:bg-[#a05b2d] text-white font-semibold rounded-xl">
                Provision Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* BROADCAST MODAL */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E7E4DE] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7E4DE] pb-2">
              <h3 className="font-bold text-base text-[#143642]">Broadcast Platform Announcement</h3>
              <button onClick={() => setShowBroadcastModal(false)} className="text-xs text-[#687477]">Close</button>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Target Audience</label>
                <select
                  value={broadcastForm.targetRole}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, targetRole: e.target.value as any })}
                  className="w-full p-2.5 border border-[#E7E4DE] rounded-xl bg-white"
                >
                  <option value="all">All Platform Users</option>
                  <option value="manager">Property Managers Only</option>
                  <option value="tenant">Tenants Only</option>
                  <option value="seeker">Seekers Only</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paybill Settlement Notice"
                  value={broadcastForm.title}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                  className="w-full p-2.5 border border-[#E7E4DE] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Message</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Type message content..."
                  value={broadcastForm.message}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                  className="w-full p-2.5 border border-[#E7E4DE] rounded-xl"
                />
              </div>

              <button type="submit" className="w-full py-2.5 bg-[#143642] text-white font-semibold rounded-xl">
                Dispatch Broadcast
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD LOCATION BENCHMARK MODAL */}
      {showAddLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E7E4DE] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7E4DE] pb-2">
              <h3 className="font-bold text-base text-[#143642]">Add Location Geofence</h3>
              <button onClick={() => setShowAddLocationModal(false)} className="text-xs text-[#687477]">Close</button>
            </div>

            <form onSubmit={handleCreateLocation} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">County</label>
                  <select
                    value={newLocationForm.county}
                    onChange={(e) => setNewLocationForm({ ...newLocationForm, county: e.target.value })}
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl bg-white"
                  >
                    <option value="Nairobi">Nairobi</option>
                    <option value="Kiambu">Kiambu</option>
                    <option value="Mombasa">Mombasa</option>
                    <option value="Nakuru">Nakuru</option>
                    <option value="Kisumu">Kisumu</option>
                    <option value="Machakos">Machakos</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Neighbourhood</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Parklands / Kitisuru"
                    value={newLocationForm.neighbourhood}
                    onChange={(e) => setNewLocationForm({ ...newLocationForm, neighbourhood: e.target.value })}
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Benchmark 2-Bed Rent (KSh)</label>
                <input
                  type="number"
                  required
                  value={newLocationForm.averageRent2Bed}
                  onChange={(e) => setNewLocationForm({ ...newLocationForm, averageRent2Bed: Number(e.target.value) })}
                  className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="primeCheck"
                  checked={newLocationForm.isPrime}
                  onChange={(e) => setNewLocationForm({ ...newLocationForm, isPrime: e.target.checked })}
                  className="w-4 h-4 rounded text-[#B76935]"
                />
                <label htmlFor="primeCheck" className="text-xs text-[#202A2D]">Mark as Prime Real Estate Hotspot</label>
              </div>

              <button type="submit" className="w-full py-2.5 bg-[#B76935] hover:bg-[#a05b2d] text-white font-semibold rounded-xl">
                Save Location
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
