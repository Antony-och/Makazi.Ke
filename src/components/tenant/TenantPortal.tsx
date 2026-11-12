import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Wrench,
  Bell,
  User,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Plus,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  LogOut
} from 'lucide-react';
import { MpesaModal } from '../common/MpesaModal';
import { MAKAZI_LOGO } from '../../data/mockData';
import { MaintenanceCategory, MaintenanceUrgency } from '../../types';

export const TenantPortal: React.FC = () => {
  const {
    currentUser,
    tenantTab,
    setTenantTab,
    tenants,
    properties,
    units,
    leases,
    invoices,
    payments,
    maintenanceTickets,
    submitMaintenanceTicket,
    formatKSh,
    switchRole,
  } = useApp();

  // Find tenant record for current logged-in user
  const tenant = tenants.find((t) => t.email === currentUser.email || t.userId === currentUser.id) || tenants[0];
  const property = properties.find((p) => p.id === tenant?.assignedPropertyId);
  const unit = units.find((u) => u.id === tenant?.assignedUnitId);
  const lease = leases.find((l) => l.tenantId === tenant?.id && l.status === 'Active') || leases[0];

  // Invoices & payments specifically for this tenant
  const tenantInvoices = invoices.filter((i) => i.tenantId === tenant?.id);
  const tenantPayments = payments.filter((p) => p.tenantId === tenant?.id);
  const tenantTickets = maintenanceTickets.filter((m) => m.tenantId === tenant?.id);

  // Unpaid or pending invoice
  const pendingInvoice = tenantInvoices.find((i) => i.balance > 0) || tenantInvoices[0];
  const outstandingBalance = tenantInvoices.reduce((acc, i) => acc + (i.balance || 0), 0);

  // M-Pesa modal state
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);

  // New Maintenance Ticket Form
  const [ticketForm, setTicketForm] = useState({
    title: '',
    category: 'Plumbing' as MaintenanceCategory,
    urgency: 'Medium' as MaintenanceUrgency,
    description: '',
  });
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMaintenanceTicket({
      organizationId: property?.organizationId || 'org_makazi_prime',
      propertyId: property?.id || '',
      unitId: unit?.id || '',
      tenantId: tenant?.id || '',
      title: ticketForm.title,
      category: ticketForm.category,
      urgency: ticketForm.urgency,
      description: ticketForm.description,
      status: 'Open',
    });
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setShowNewTicketModal(false);
      setTicketForm({
        title: '',
        category: 'Plumbing',
        urgency: 'Medium',
        description: '',
      });
    }, 2000);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'lease', label: 'My Lease Agreement', icon: FileText },
    { id: 'payments', label: 'Rent & Payments', icon: CreditCard, badge: outstandingBalance > 0 ? 'Due' : undefined },
    { id: 'maintenance', label: 'Maintenance Requests', icon: Wrench, count: tenantTickets.length },
    { id: 'notices', label: 'Notices & Building Info', icon: Bell },
    { id: 'profile', label: 'Resident Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F2] flex flex-col lg:flex-row text-[#202A2D]">
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-[#143642] text-white flex-shrink-0 flex flex-col justify-between p-4 border-r border-[#143642]/40">
        <div className="space-y-6">
          <div className="px-3 py-2 border-b border-white/10 space-y-2">
            <div className="bg-white px-3 py-1.5 rounded-xl inline-block shadow-2xs">
              <img
                src={MAKAZI_LOGO}
                alt="MAKAZI"
                className="h-6 w-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#E7E4DE]/80">
              <span className="font-semibold text-white">Resident Portal</span>
              <span className="text-[10px] text-emerald-400 font-mono">{unit?.unitNumber || 'Apt 302'}</span>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = tenantTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTenantTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#B76935] text-white font-semibold shadow-xs'
                      : 'text-[#E7E4DE]/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
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

        <div className="pt-4 border-t border-white/10 space-y-2">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xs text-white">
              BO
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{tenant?.fullName || currentUser.name}</p>
              <p className="text-[10px] text-[#E7E4DE]/70">Verified Resident</p>
            </div>
          </div>
          <button
            onClick={() => switchRole('seeker')}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-[#E7E4DE]/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Switch to Marketplace</span>
          </button>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E4DE]">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#687477]">
              <span>Resident Portal</span>
              <span>/</span>
              <span className="font-semibold text-[#143642] capitalize">{tenantTab}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#143642] tracking-tight mt-0.5">
              Welcome home, {tenant?.fullName.split(' ')[0]}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMpesaModal(true)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Pay Rent via M-Pesa</span>
            </button>

            <button
              onClick={() => setShowNewTicketModal(true)}
              className="px-3.5 py-2 bg-[#143642] hover:bg-[#0e2730] text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Request Repair</span>
            </button>
          </div>
        </header>

        {/* TAB 1: OVERVIEW */}
        {tenantTab === 'overview' && (
          <div className="space-y-8">
            
            {/* 6 Required Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              
              <div className="bg-white p-4 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-1">
                <span className="text-[10px] uppercase font-semibold text-[#687477] tracking-wider block">Current Property</span>
                <div className="font-bold text-sm text-[#143642] truncate">{property?.title || 'The Aura Residences'}</div>
                <span className="text-[11px] text-[#687477]">{property?.neighbourhood || 'Kilimani'}</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-1">
                <span className="text-[10px] uppercase font-semibold text-[#687477] tracking-wider block">Unit Number</span>
                <div className="text-lg font-bold font-mono text-[#143642]">{unit?.unitNumber || 'Apt 302'}</div>
                <span className="text-[11px] text-[#687477]">{unit?.floor || '3rd Floor'}</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-1">
                <span className="text-[10px] uppercase font-semibold text-[#687477] tracking-wider block">Monthly Rent</span>
                <div className="text-lg font-bold font-mono text-[#143642]">{formatKSh(unit?.rentAmount || 85000)}</div>
                <span className="text-[11px] text-[#687477]">Due 5th of month</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-1">
                <span className="text-[10px] uppercase font-semibold text-[#687477] tracking-wider block">Next Due Date</span>
                <div className="text-sm font-bold text-[#143642]">05 Apr 2026</div>
                <span className="text-[11px] text-emerald-700 font-medium">Auto-invoice generated</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-1">
                <span className="text-[10px] uppercase font-semibold text-[#687477] tracking-wider block">Outstanding Balance</span>
                <div className={`text-lg font-bold font-mono ${outstandingBalance > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {formatKSh(outstandingBalance)}
                </div>
                <span className="text-[11px] font-medium text-[#687477]">
                  {outstandingBalance === 0 ? 'Rent up to date' : 'Payment pending'}
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-1">
                <span className="text-[10px] uppercase font-semibold text-[#687477] tracking-wider block">Lease Expiry</span>
                <div className="text-sm font-bold text-[#143642]">{lease?.endDate || '31 Jan 2027'}</div>
                <span className="text-[11px] text-emerald-700 font-medium">10 months remaining</span>
              </div>

            </div>

            {/* Quick Rent Action Banner */}
            <div className="bg-gradient-to-r from-[#143642] to-[#1c4b5c] rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
              <div className="space-y-1">
                <span className="text-xs uppercase font-semibold text-emerald-400 tracking-wider">
                  Safaricom M-Pesa Integrated Rent Gateway
                </span>
                <h3 className="text-xl font-bold">Fast & Verified M-Pesa Payment</h3>
                <p className="text-xs text-[#E7E4DE]/80 max-w-lg">
                  Pay directly to Paybill 4082200 using your mobile phone. Instant electronic receipt sent to your phone and saved on your profile.
                </p>
              </div>

              <button
                onClick={() => setShowMpesaModal(true)}
                className="px-5 py-2.5 bg-[#B76935] hover:bg-[#a05b2d] text-white font-bold text-xs rounded-xl shadow-md whitespace-nowrap transition-all"
              >
                Pay With M-Pesa STK Push
              </button>
            </div>

            {/* Recent Payments & Active Maintenance 2-Col */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Payment Receipts History */}
              <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E7E4DE]">
                  <h3 className="font-bold text-sm text-[#143642]">Recent Payment Receipts</h3>
                  <button onClick={() => setTenantTab('payments')} className="text-xs font-semibold text-[#B76935] hover:underline">
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {tenantPayments.map((p) => (
                    <div key={p.id} className="p-3.5 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE] flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#143642]">{p.mpesaReceiptNumber || p.receiptNumber}</span>
                          <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded text-[10px] font-semibold">
                            {p.paymentMethod}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#687477]">{new Date(p.paymentDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-emerald-700 text-sm block">
                          {formatKSh(p.amount)}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-semibold">Confirmed</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Maintenance Tracker */}
              <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E7E4DE]">
                  <h3 className="font-bold text-sm text-[#143642]">Maintenance Tickets</h3>
                  <button onClick={() => setShowNewTicketModal(true)} className="text-xs font-semibold text-[#B76935] hover:underline">
                    + New Request
                  </button>
                </div>

                <div className="space-y-3">
                  {tenantTickets.map((t) => (
                    <div key={t.id} className="p-3.5 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE] text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#143642]">{t.title}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          t.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                      <p className="text-[#687477] text-[11px] line-clamp-2">{t.description}</p>
                      <div className="text-[10px] text-[#687477] flex items-center justify-between pt-1">
                        <span>Category: {t.category}</span>
                        <span>Contractor: <strong className="text-[#202A2D]">{t.assignedContractor || 'Assigned'}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: MY LEASE AGREEMENT */}
        {tenantTab === 'lease' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-6 max-w-3xl">
            <div className="flex items-center justify-between border-b border-[#E7E4DE] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#143642]">Residential Tenancy Agreement</h3>
                <p className="text-xs text-[#687477]">Registered Lease Ref: {lease?.id || 'lease_brian_001'}</p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-full">
                {lease?.signatureStatus || 'Signed & Executed'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE]">
                <span className="text-[#687477] block text-[11px]">Lease Start Date</span>
                <span className="font-bold text-[#143642] text-sm">{lease?.startDate}</span>
              </div>
              <div className="p-3 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE]">
                <span className="text-[#687477] block text-[11px]">Lease End Date</span>
                <span className="font-bold text-[#143642] text-sm">{lease?.endDate}</span>
              </div>
              <div className="p-3 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE]">
                <span className="text-[#687477] block text-[11px]">Payment Cadence</span>
                <span className="font-bold text-[#143642] text-sm">{lease?.paymentFrequency}</span>
              </div>
              <div className="p-3 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE]">
                <span className="text-[#687477] block text-[11px]">Monthly Rent</span>
                <span className="font-mono font-bold text-sm text-[#143642]">{formatKSh(lease?.rentAmount || 85000)}</span>
              </div>
              <div className="p-3 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE]">
                <span className="text-[#687477] block text-[11px]">Security Deposit Held</span>
                <span className="font-mono font-bold text-sm text-[#143642]">{formatKSh(lease?.depositAmount || 85000)}</span>
              </div>
              <div className="p-3 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE]">
                <span className="text-[#687477] block text-[11px]">Rent Due Date</span>
                <span className="font-bold text-sm text-[#143642]">{lease?.rentDueDay}th of each month</span>
              </div>
            </div>

            <div className="p-4 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE] text-xs space-y-2">
              <h4 className="font-bold text-[#143642]">Key Kenyan Tenancy Clauses</h4>
              <ul className="list-disc list-inside text-[#687477] space-y-1 leading-relaxed">
                <li>Rent is payable strictly in advance on or before the 5th day of each calendar month.</li>
                <li>Refundable security deposit is retained in an escrow account and released within 14 days of move-out inspection.</li>
                <li>Tenant is entitled to quiet enjoyment, standard wear & tear exclusions, and 24/7 security services.</li>
                <li>Two months written notice required prior to lease expiration for renewal or vacation.</li>
              </ul>
            </div>

            <button
              onClick={() => alert(`Official Lease Agreement Document (PDF) downloaded for ${tenant.fullName}`)}
              className="px-4 py-2.5 bg-[#143642] text-white rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-[#0e2730]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Digital Lease Agreement (PDF)</span>
            </button>
          </div>
        )}

        {/* TAB 3: RENT & PAYMENTS */}
        {tenantTab === 'payments' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E7E4DE] pb-4">
                <div>
                  <h3 className="font-bold text-base text-[#143642]">Rent Payment Invoices</h3>
                  <p className="text-xs text-[#687477]">Monthly invoices issued by Prime Heritage Properties</p>
                </div>
                <button
                  onClick={() => setShowMpesaModal(true)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Pay Active Balance</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E7E4DE] bg-[#F8F6F2] text-[#687477] font-semibold">
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">Period</th>
                      <th className="py-3 px-4 text-right">Amount Due</th>
                      <th className="py-3 px-4 text-right">Paid</th>
                      <th className="py-3 px-4 text-right">Balance</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E4DE]">
                    {tenantInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-[#F8F6F2] transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#143642]">{inv.invoiceNumber}</td>
                        <td className="py-3 px-4 text-[#202A2D]">{inv.period}</td>
                        <td className="py-3 px-4 text-right font-mono text-[#202A2D]">{formatKSh(inv.amountDue)}</td>
                        <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-700">{formatKSh(inv.amountPaid)}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-amber-700">{formatKSh(inv.balance)}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {inv.balance > 0 ? (
                            <button
                              onClick={() => setShowMpesaModal(true)}
                              className="px-2.5 py-1 bg-emerald-700 text-white rounded-lg text-[11px] font-semibold"
                            >
                              Pay Now
                            </button>
                          ) : (
                            <button
                              onClick={() => alert(`Official Receipt for ${inv.invoiceNumber}\nAmount: ${formatKSh(inv.amountPaid)}\nStatus: Settled via Safaricom M-Pesa`)}
                              className="px-2 py-1 bg-[#F8F6F2] hover:bg-[#E7E4DE] text-[#143642] rounded text-[11px]"
                            >
                              Receipt
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

        {/* TAB 4: MAINTENANCE REQUESTS */}
        {tenantTab === 'maintenance' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E7E4DE] pb-4">
                <div>
                  <h3 className="font-bold text-base text-[#143642]">Maintenance & Repairs Log</h3>
                  <p className="text-xs text-[#687477]">Submit plumbing, electrical, or structural issues for your unit</p>
                </div>
                <button
                  onClick={() => setShowNewTicketModal(true)}
                  className="px-4 py-2 bg-[#B76935] hover:bg-[#a05b2d] text-white font-semibold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Submit Ticket</span>
                </button>
              </div>

              <div className="space-y-4">
                {tenantTickets.map((t) => (
                  <div key={t.id} className="p-4 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE] text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#687477]">{t.ticketNumber}</span>
                        <h4 className="font-bold text-sm text-[#143642]">{t.title}</h4>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        t.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {t.status}
                      </span>
                    </div>

                    <p className="text-[#202A2D] leading-relaxed">{t.description}</p>

                    <div className="pt-2 border-t border-[#E7E4DE] flex items-center justify-between text-[11px] text-[#687477]">
                      <span>Category: <strong className="text-[#202A2D]">{t.category}</strong></span>
                      <span>Assigned: <strong className="text-[#202A2D]">{t.assignedContractor || 'Dispatch in queue'}</strong></span>
                      <span>Submitted: {new Date(t.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: NOTICES & BUILDING INFO */}
        {tenantTab === 'notices' && (
          <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-4 max-w-2xl">
            <h3 className="font-bold text-base text-[#143642]">Building Announcements & Guidelines</h3>
            
            <div className="space-y-3 text-xs">
              <div className="p-4 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE] space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#B76935]">Scheduled Maintenance</span>
                <h4 className="font-bold text-[#143642]">Rooftop Solar & Borehole Pressure Flush</h4>
                <p className="text-[#687477]">
                  Facility management will carry out quarterly servicing on Saturday between 9:00 AM and 11:30 AM. Water backup will remain active on secondary reserve tanks.
                </p>
              </div>

              <div className="p-4 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE] space-y-1">
                <span className="text-[10px] font-bold uppercase text-emerald-700">Security Protocols</span>
                <h4 className="font-bold text-[#143642]">Visitor Gate Passes & Deliveries</h4>
                <p className="text-[#687477]">
                  Delivery motorbikes (Glovo, Jumia, UberEats) should report to the guardhouse at Dennis Pritt gate for resident intercom verification.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PROFILE */}
        {tenantTab === 'profile' && (
          <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-4 max-w-xl">
            <h3 className="font-bold text-base text-[#143642]">Resident Profile Details</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#687477] mb-1">Full Legal Name</label>
                <input type="text" disabled value={tenant.fullName} className="w-full p-2.5 bg-[#F8F6F2] border border-[#E7E4DE] rounded-xl font-medium" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#687477] mb-1">Phone Number</label>
                  <input type="text" disabled value={tenant.phone} className="w-full p-2.5 bg-[#F8F6F2] border border-[#E7E4DE] rounded-xl font-mono font-medium" />
                </div>
                <div>
                  <label className="block text-[#687477] mb-1">National ID Number</label>
                  <input type="text" disabled value={tenant.idNumber} className="w-full p-2.5 bg-[#F8F6F2] border border-[#E7E4DE] rounded-xl font-mono font-medium" />
                </div>
              </div>

              <div>
                <label className="block text-[#687477] mb-1">Registered Email Address</label>
                <input type="email" disabled value={tenant.email} className="w-full p-2.5 bg-[#F8F6F2] border border-[#E7E4DE] rounded-xl font-medium" />
              </div>

              <div className="pt-2">
                <h4 className="font-bold text-[#143642] mb-2">Emergency Contact</h4>
                <div className="p-3 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE] flex justify-between">
                  <span className="font-medium text-[#202A2D]">{tenant.emergencyContactName}</span>
                  <span className="font-mono text-[#687477]">{tenant.emergencyContactPhone}</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* M-PESA PAYMENT MODAL */}
      {pendingInvoice && (
        <MpesaModal
          isOpen={showMpesaModal}
          onClose={() => setShowMpesaModal(false)}
          invoiceId={pendingInvoice.id}
          defaultAmount={pendingInvoice.balance > 0 ? pendingInvoice.balance : pendingInvoice.amountDue}
          unitLabel={`${unit?.unitNumber || 'Unit 302'} (${property?.title || 'The Aura'})`}
        />
      )}

      {/* SUBMIT MAINTENANCE TICKET MODAL */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E7E4DE] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7E4DE] pb-2">
              <h3 className="font-bold text-base text-[#143642]">Submit Maintenance Request</h3>
              <button onClick={() => setShowNewTicketModal(false)} className="text-xs text-[#687477]">Close</button>
            </div>

            {ticketSubmitted ? (
              <div className="py-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base text-[#143642]">Ticket Dispatched to Caretaker</h4>
                <p className="text-xs text-[#687477]">Your property manager has received this ticket and will assign a contractor.</p>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Issue Headline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master bathroom tap dripping"
                    value={ticketForm.title}
                    onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold mb-1">Category</label>
                    <select
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value as any })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                    >
                      <option>Plumbing</option>
                      <option>Electrical</option>
                      <option>Carpentry</option>
                      <option>Painting</option>
                      <option>Appliances</option>
                      <option>Security</option>
                      <option>General</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Urgency</label>
                    <select
                      value={ticketForm.urgency}
                      onChange={(e) => setTicketForm({ ...ticketForm, urgency: e.target.value as any })}
                      className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Emergency</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Detailed Description</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the issue, location inside the unit, and best access time..."
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                  />
                </div>

                <button type="submit" className="w-full py-2.5 bg-[#143642] text-white font-semibold rounded-xl hover:bg-[#0e2730]">
                  Submit Ticket
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
