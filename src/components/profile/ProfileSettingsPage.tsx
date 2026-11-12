import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Shield,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  Bell,
  Smartphone,
  Mail,
  Building2,
  FileText,
  Clock,
  Lock,
  Save,
  AlertCircle,
  Camera,
  MapPin,
  Check,
  Eye,
  EyeOff,
  LogOut,
  ArrowLeft
} from 'lucide-react';

export const ProfileSettingsPage: React.FC = () => {
  const { currentUser, currentRole, updateCurrentUser, setCurrentView, platformSettings, formatKSh } = useApp();

  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'notifications' | 'activity'>('personal');

  // Personal Info Form State
  const [name, setName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [nationalId, setNationalId] = useState(currentUser.nationalId || '');
  const [agencyName, setAgencyName] = useState(currentUser.agencyName || '');
  const [kraPin, setKraPin] = useState(currentUser.kraPin || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar || '');

  // Notification Preferences
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [emailStatements, setEmailStatements] = useState(true);
  const [marketingAlerts, setMarketingAlerts] = useState(false);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);

  // Status feedback
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);
  const [securitySuccessToast, setSecuritySuccessToast] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      name,
      email,
      phone,
      nationalId,
      agencyName: currentRole === 'manager' ? agencyName : undefined,
      kraPin: currentRole === 'manager' ? kraPin : undefined,
      avatar: avatarUrl || undefined,
    });
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setSecuritySuccessToast(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSecuritySuccessToast(false), 3500);
  };

  const getRoleBadge = () => {
    switch (currentRole) {
      case 'admin':
        return { label: 'Platform Administrator', bg: 'bg-purple-100 text-purple-900 border-purple-200' };
      case 'manager':
        return { label: 'Property Owner / Manager', bg: 'bg-[#143642]/10 text-[#143642] border-[#143642]/20' };
      case 'tenant':
        return { label: 'Verified Resident / Tenant', bg: 'bg-emerald-100 text-emerald-900 border-emerald-200' };
      default:
        return { label: 'Public Property Seeker', bg: 'bg-amber-100 text-amber-900 border-amber-200' };
    }
  };

  const roleInfo = getRoleBadge();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setCurrentView('home')}
            className="inline-flex items-center gap-1.5 text-xs text-[#687477] hover:text-[#143642] font-medium mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#143642] tracking-tight">
            Account & Profile Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#687477] mt-1">
            Manage your personal identity credentials, contact details, security controls, and Kenya communication channels.
          </p>
        </div>

        {/* Success toast notification */}
        {saveSuccessToast && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold shadow-xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile credentials updated successfully!</span>
          </div>
        )}
      </div>

      {/* Main Profile Summary Card */}
      <div className="bg-white rounded-3xl border border-[#E7E4DE] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={currentUser.name}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#E7E4DE] shadow-xs"
              />
            ) : (
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#143642] text-white flex items-center justify-center font-bold text-2xl shadow-xs">
                {currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : 'MK'}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-lg border border-[#E7E4DE] text-[#687477] shadow-2xs">
              <Camera className="w-3.5 h-3.5 text-[#B76935]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-[#143642]">{currentUser.name}</h2>
              {currentUser.isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Verified Kenyan ID</span>
                </span>
              )}
            </div>
            <p className="text-xs text-[#687477] flex items-center gap-2">
              <span>{currentUser.email}</span>
              <span>·</span>
              <span>{currentUser.phone}</span>
            </p>
            <div className="pt-0.5">
              <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${roleInfo.bg}`}>
                {roleInfo.label}
              </span>
            </div>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-4 sm:pt-0 border-[#E7E4DE] text-right">
          <span className="text-[11px] text-[#687477] block">Account Status:</span>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Active & Compliant
          </span>
          <span className="text-[10px] text-[#687477] mt-1 block">
            Joined: {new Date(currentUser.createdAt || '2026-01-10').toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E7E4DE] pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('personal')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'personal'
              ? 'bg-[#143642] text-white shadow-xs'
              : 'text-[#687477] hover:bg-white hover:text-[#143642]'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Personal Information & KYC</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'security'
              ? 'bg-[#143642] text-white shadow-xs'
              : 'text-[#687477] hover:bg-white hover:text-[#143642]'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Security & Passwords</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'notifications'
              ? 'bg-[#143642] text-white shadow-xs'
              : 'text-[#687477] hover:bg-white hover:text-[#143642]'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Notifications & SMS</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'activity'
              ? 'bg-[#143642] text-white shadow-xs'
              : 'text-[#687477] hover:bg-white hover:text-[#143642]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Session Log & Data</span>
        </button>
      </div>

      {/* TAB 1: PERSONAL INFORMATION & KYC */}
      {activeTab === 'personal' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl border border-[#E7E4DE] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-[#E7E4DE] pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#143642]">Identity & Contact Information</h3>
              <p className="text-xs text-[#687477] mt-0.5">
                Official details used for automated rental agreements, Safaricom M-Pesa receipts, and identity verification.
              </p>
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#B76935] hover:bg-[#a05a2d] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Full Legal Name */}
            <div className="space-y-1.5">
              <label className="block font-semibold text-[#202A2D]">Full Legal Name (as per National ID)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 bg-white border border-[#E7E4DE] rounded-xl text-xs font-medium text-[#202A2D] focus:outline-hidden focus:border-[#B76935]"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block font-semibold text-[#202A2D]">Email Address (Primary Account Login)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#687477] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-3 bg-white border border-[#E7E4DE] rounded-xl text-xs font-medium text-[#202A2D] focus:outline-hidden focus:border-[#B76935]"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="block font-semibold text-[#202A2D]">Phone Number (M-Pesa Registered)</label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-[#687477] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+254 7XX XXX XXX"
                  className="w-full pl-9 pr-3 py-3 bg-white border border-[#E7E4DE] rounded-xl text-xs font-mono font-medium text-[#202A2D] focus:outline-hidden focus:border-[#B76935]"
                />
              </div>
            </div>

            {/* National ID / Alien ID */}
            <div className="space-y-1.5">
              <label className="block font-semibold text-[#202A2D]">Kenyan National ID / Passport Number</label>
              <div className="relative">
                <Shield className="w-4 h-4 text-[#687477] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  placeholder="e.g. 32489102"
                  className="w-full pl-9 pr-3 py-3 bg-white border border-[#E7E4DE] rounded-xl text-xs font-mono font-medium text-[#202A2D] focus:outline-hidden focus:border-[#B76935]"
                />
              </div>
            </div>

            {/* Role Specific: Manager Agency Details */}
            {currentRole === 'manager' && (
              <>
                <div className="space-y-1.5">
                  <label className="block font-semibold text-[#202A2D]">Registered Agency / Trading Name</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-[#687477] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      placeholder="e.g. Prime Heritage Properties Ltd"
                      className="w-full pl-9 pr-3 py-3 bg-white border border-[#E7E4DE] rounded-xl text-xs font-medium text-[#202A2D] focus:outline-hidden focus:border-[#B76935]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-semibold text-[#202A2D]">KRA Tax PIN</label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-[#687477] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={kraPin}
                      onChange={(e) => setKraPin(e.target.value)}
                      placeholder="e.g. P051289100Z"
                      className="w-full pl-9 pr-3 py-3 bg-white border border-[#E7E4DE] rounded-xl text-xs font-mono font-medium text-[#202A2D] focus:outline-hidden focus:border-[#B76935]"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Profile Avatar Image URL */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="block font-semibold text-[#202A2D]">Avatar Image URL (Optional)</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-3 bg-white border border-[#E7E4DE] rounded-xl text-xs font-medium text-[#202A2D] focus:outline-hidden focus:border-[#B76935]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E7E4DE] flex items-center justify-between text-xs text-[#687477]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Protected by Kenya Data Protection Act 2019 standards</span>
            </span>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#B76935] hover:bg-[#a05a2d] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Update Profile</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: SECURITY & PASSWORDS */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <form onSubmit={handleUpdatePassword} className="bg-white rounded-3xl border border-[#E7E4DE] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-[#E7E4DE] pb-4">
              <h3 className="text-base font-bold text-[#143642]">Password & Authentication</h3>
              <p className="text-xs text-[#687477] mt-0.5">Ensure your account uses a secure password with at least 8 characters.</p>
            </div>

            {securitySuccessToast && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Password changed successfully. Your session remains secure.</span>
              </div>
            )}

            {passwordError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
              <div className="space-y-1.5">
                <label className="block font-semibold text-[#202A2D]">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full p-3 bg-white border border-[#E7E4DE] rounded-xl text-xs focus:outline-hidden focus:border-[#B76935]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-[#202A2D]">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="At least 8 characters"
                    className="w-full p-3 bg-white border border-[#E7E4DE] rounded-xl text-xs focus:outline-hidden focus:border-[#B76935]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-[#202A2D]">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Repeat new password"
                    className="w-full p-3 bg-white border border-[#E7E4DE] rounded-xl text-xs focus:outline-hidden focus:border-[#B76935]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-[#687477] hover:text-[#143642] flex items-center gap-1.5 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showPassword ? 'Hide Passwords' : 'Show Passwords'}</span>
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#143642] hover:bg-[#0e2730] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>Update Password</span>
              </button>
            </div>
          </form>

          {/* Two-Factor Authentication Box */}
          <div className="bg-white rounded-3xl border border-[#E7E4DE] p-6 sm:p-8 shadow-xs flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-sm text-[#143642]">Two-Factor Authentication (2FA)</h4>
              </div>
              <p className="text-xs text-[#687477]">
                Require an SMS verification code sent to {currentUser.phone} whenever signing in from a new browser.
              </p>
            </div>

            <button
              onClick={() => setTwoFactorAuth(!twoFactorAuth)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                twoFactorAuth ? 'bg-[#B76935]' : 'bg-[#E7E4DE]'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  twoFactorAuth ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: NOTIFICATIONS & ALERTS */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-3xl border border-[#E7E4DE] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-[#E7E4DE] pb-4">
            <h3 className="text-base font-bold text-[#143642]">Communication Channels & Dispatch Preferences</h3>
            <p className="text-xs text-[#687477] mt-0.5">Control how MAKAZI notifies you about rent invoices, viewings, and maintenance.</p>
          </div>

          <div className="space-y-4">
            {/* SMS Alerts */}
            <div className="flex items-center justify-between p-4 bg-[#F8F6F2] rounded-2xl border border-[#E7E4DE]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white text-[#B76935] border border-[#E7E4DE]">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#143642]">Safaricom SMS Receipts & Alerts</h4>
                  <p className="text-[11px] text-[#687477]">Instant SMS confirmations for M-Pesa payments and viewing schedules.</p>
                </div>
              </div>
              <button
                onClick={() => setSmsAlerts(!smsAlerts)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                  smsAlerts ? 'bg-[#B76935]' : 'bg-gray-300'
                }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${smsAlerts ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            {/* WhatsApp Updates */}
            <div className="flex items-center justify-between p-4 bg-[#F8F6F2] rounded-2xl border border-[#E7E4DE]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white text-emerald-600 border border-[#E7E4DE]">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#143642]">WhatsApp Lease & Notice Dispatch</h4>
                  <p className="text-[11px] text-[#687477]">Receive downloadable rent receipts and maintenance work status directly via WhatsApp.</p>
                </div>
              </div>
              <button
                onClick={() => setWhatsappAlerts(!whatsappAlerts)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                  whatsappAlerts ? 'bg-[#B76935]' : 'bg-gray-300'
                }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${whatsappAlerts ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            {/* Email Statements */}
            <div className="flex items-center justify-between p-4 bg-[#F8F6F2] rounded-2xl border border-[#E7E4DE]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white text-[#143642] border border-[#E7E4DE]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#143642]">Monthly Electronic Invoices & Statements</h4>
                  <p className="text-[11px] text-[#687477]">PDF financial statements dispatched on the 1st of every month.</p>
                </div>
              </div>
              <button
                onClick={() => setEmailStatements(!emailStatements)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                  emailStatements ? 'bg-[#B76935]' : 'bg-gray-300'
                }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${emailStatements ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SESSION LOG & AUDIT */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-3xl border border-[#E7E4DE] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-[#E7E4DE] pb-4">
            <h3 className="text-base font-bold text-[#143642]">Active Security Sessions & Device Log</h3>
            <p className="text-xs text-[#687477] mt-0.5">Real-time log of IP addresses and authentication tokens active on this account.</p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#E7E4DE] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <div className="text-xs font-bold text-[#143642]">Current Browser Session (Active Now)</div>
                  <div className="text-[11px] text-[#687477]">Nairobi, Kenya · IP: 105.160.44.82 · Chrome macOS</div>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                This Device
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E7E4DE] flex items-center justify-between opacity-80">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                <div>
                  <div className="text-xs font-bold text-[#143642]">Safaricom Mobile Browser</div>
                  <div className="text-[11px] text-[#687477]">Nairobi, Westlands · IP: 197.232.14.90 · Logged in 2 days ago</div>
                </div>
              </div>
              <button
                onClick={() => alert('Session revoked')}
                className="text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer"
              >
                Revoke Access
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
