import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Property,
  PropertyUnit,
  Tenant,
  Lease,
  RentInvoice,
  PaymentRecord,
  MaintenanceTicket,
  PropertyExpense,
  RentalApplication,
  ViewingRequest,
} from '../../types';
import {
  LayoutDashboard,
  Building2,
  Layers,
  Users,
  FileText,
  Calendar,
  CreditCard,
  Wrench,
  Receipt,
  PieChart,
  MessageSquare,
  Bell,
  Settings,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Trash2,
  Edit,
  ArrowUpRight,
  TrendingUp,
  Download,
  Filter,
  Check,
  X,
  Phone,
  Mail,
  Smartphone,
  ChevronRight,
  LogOut,
  Building
} from 'lucide-react';
import { MpesaModal } from '../common/MpesaModal';
import { MAKAZI_LOGO } from '../../data/mockData';

export const ManagerDashboard: React.FC = () => {
  const {
    currentUser,
    managerTab,
    setManagerTab,
    properties,
    units,
    tenants,
    leases,
    invoices,
    payments,
    maintenanceTickets,
    viewingRequests,
    applications,
    expenses,
    notifications,
    addProperty,
    updateProperty,
    deleteProperty,
    togglePublishProperty,
    toggleFeaturedProperty,
    addUnit,
    updateUnit,
    deleteUnit,
    addTenant,
    updateTenant,
    createLease,
    updateLeaseStatus,
    recordPayment,
    updateMaintenanceTicket,
    updateViewingStatus,
    updateApplicationStatus,
    addExpense,
    deleteExpense,
    formatKSh,
    switchRole,
  } = useApp();

  // State for modals
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [showCreateLeaseModal, setShowCreateLeaseModal] = useState(false);
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [selectedInvoiceForMpesa, setSelectedInvoiceForMpesa] = useState<RentInvoice | null>(null);

  // Filter/Search inside views
  const [propertyFilter, setPropertyFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // 1. DYNAMIC KPI CALCULATIONS (Database driven)
  const totalProperties = properties.length;
  const totalUnits = units.length;
  const occupiedUnits = units.filter((u) => u.status === 'Occupied').length;
  const vacantUnits = units.filter((u) => u.status === 'Vacant').length;
  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
  const totalTenants = tenants.length;

  const expectedMonthlyRent = units.reduce((acc, u) => acc + (u.rentAmount || 0), 0);
  const rentCollected = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
  const outstandingRent = invoices.reduce((acc, inv) => acc + (inv.balance || 0), 0);
  const overdueInvoices = invoices.filter((inv) => inv.status === 'Overdue' || (inv.balance > 0 && new Date(inv.dueDate) < new Date())).length;
  const pendingApplications = applications.filter((a) => a.status === 'Submitted' || a.status === 'Under Review').length;
  const openMaintenance = maintenanceTickets.filter((m) => m.status === 'Open' || m.status === 'In Progress' || m.status === 'Acknowledged').length;

  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netRentalIncome = rentCollected - totalExpenses;

  // New Property Form State
  const [propForm, setPropForm] = useState({
    title: '',
    propertyType: 'Apartment' as any,
    county: 'Nairobi',
    city: 'Nairobi',
    neighbourhood: 'Kilimani',
    estate: '',
    address: '',
    baseRent: 80000,
    securityDeposit: 80000,
    bedrooms: 2,
    bathrooms: 2,
    sizeSqFt: 1400,
    furnishing: 'unfurnished' as any,
    parkingSlots: 2,
    description: '',
  });

  // New Unit Form State
  const [unitForm, setUnitForm] = useState({
    propertyId: properties[0]?.id || '',
    unitNumber: '',
    floor: '1st Floor',
    rentAmount: 80000,
    depositAmount: 80000,
    bedrooms: 2,
    bathrooms: 2,
    status: 'Vacant' as any,
  });

  // New Tenant Form State
  const [tenantForm, setTenantForm] = useState({
    fullName: '',
    email: '',
    phone: '+254 7',
    idNumber: '',
    emergencyContactName: '',
    emergencyContactPhone: '+254 7',
    assignedPropertyId: properties[0]?.id || '',
    assignedUnitId: '',
    moveInDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // New Lease Form State
  const [leaseForm, setLeaseForm] = useState({
    propertyId: properties[0]?.id || '',
    unitId: '',
    tenantId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 365).toISOString().split('T')[0],
    rentAmount: 85000,
    depositAmount: 85000,
    rentDueDay: 5,
    paymentFrequency: 'Monthly' as any,
  });

  // Manual Payment Form State
  const [paymentForm, setPaymentForm] = useState({
    invoiceId: invoices[0]?.id || '',
    tenantId: tenants[0]?.id || '',
    amount: 50000,
    paymentMethod: 'M-Pesa' as any,
    mpesaReceiptNumber: 'QKJ' + Math.floor(1000000 + Math.random() * 9000000),
    phoneNumber: '+254 701 456 789',
    notes: 'Direct M-Pesa Paybill settlement',
  });

  // New Expense Form State
  const [expenseForm, setExpenseForm] = useState({
    propertyId: properties[0]?.id || '',
    category: 'Repairs' as any,
    description: '',
    amount: 5000,
    vendor: '',
    expenseDate: new Date().toISOString().split('T')[0],
  });

  // Sidebar Menu Definition (all 14 official sections)
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'properties', label: 'Properties', icon: Building2, count: totalProperties },
    { id: 'units', label: 'Units', icon: Layers, count: totalUnits },
    { id: 'tenants', label: 'Tenants', icon: Users, count: totalTenants },
    { id: 'applications', label: 'Applications', icon: FileText, badge: pendingApplications > 0 ? pendingApplications : undefined },
    { id: 'viewings', label: 'Viewings', icon: Calendar },
    { id: 'leases', label: 'Leases', icon: CheckCircle2 },
    { id: 'payments', label: 'Rent & Payments', icon: CreditCard, badge: overdueInvoices > 0 ? overdueInvoices : undefined },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench, badge: openMaintenance > 0 ? openMaintenance : undefined },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'reports', label: 'Reports', icon: PieChart },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: notifications.filter(n => !n.read).length || undefined },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F2] flex flex-col lg:flex-row text-[#202A2D]">
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-[#143642] text-white flex-shrink-0 flex flex-col justify-between p-4 border-r border-[#143642]/40">
        <div className="space-y-6">
          {/* Organisation Brand Banner */}
          <div className="px-3 py-2 border-b border-white/10 space-y-2">
            <div className="bg-white px-3 py-1.5 rounded-xl inline-block shadow-2xs">
              <img
                src={MAKAZI_LOGO}
                alt="MAKAZI"
                className="h-6 w-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#E7E4DE]/80">
              <span className="font-semibold text-white">Manager Workspace</span>
              <span className="text-[10px] text-amber-300">Prime Heritage</span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = managerTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setManagerTab(item.id)}
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
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && !item.badge && (
                    <span className="text-[11px] font-mono text-white/50">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card & Switcher in Sidebar bottom */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xs text-white">
              DK
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-emerald-400">Property Manager (Verified)</p>
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

      {/* Main Content Viewport */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Top Header Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E4DE]">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#687477]">
              <span>Management Console</span>
              <span>/</span>
              <span className="font-semibold text-[#143642] capitalize">{managerTab}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#143642] tracking-tight mt-0.5">
              {managerTab === 'overview' && 'Executive Management Overview'}
              {managerTab === 'properties' && 'Properties Portfolio'}
              {managerTab === 'units' && 'Rentable Units Schedule'}
              {managerTab === 'tenants' && 'Registered Tenants'}
              {managerTab === 'leases' && 'Active Leases & Contracts'}
              {managerTab === 'payments' && 'Rent Invoices & M-Pesa Collections'}
              {managerTab === 'maintenance' && 'Maintenance Tickets & Contractors'}
              {managerTab === 'applications' && 'Rental Screening Applications'}
              {managerTab === 'viewings' && 'Property Viewing Appointments'}
              {managerTab === 'expenses' && 'Operating Expenses & Outflows'}
              {managerTab === 'reports' && 'Financial & Performance Analytics'}
              {managerTab === 'messages' && 'Tenant Inquiries & Conversations'}
              {managerTab === 'notifications' && 'System & Notification Feed'}
              {managerTab === 'settings' && 'Organisation & M-Pesa Setup'}
            </h1>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {managerTab === 'properties' && (
              <button
                onClick={() => setShowAddPropertyModal(true)}
                className="px-3.5 py-2 bg-[#B76935] hover:bg-[#a05b2d] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Property</span>
              </button>
            )}

            {managerTab === 'units' && (
              <button
                onClick={() => setShowAddUnitModal(true)}
                className="px-3.5 py-2 bg-[#143642] hover:bg-[#0e2730] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Unit</span>
              </button>
            )}

            {managerTab === 'tenants' && (
              <button
                onClick={() => setShowAddTenantModal(true)}
                className="px-3.5 py-2 bg-[#B76935] hover:bg-[#a05b2d] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tenant</span>
              </button>
            )}

            {managerTab === 'leases' && (
              <button
                onClick={() => setShowCreateLeaseModal(true)}
                className="px-3.5 py-2 bg-[#143642] hover:bg-[#0e2730] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Lease</span>
              </button>
            )}

            {managerTab === 'payments' && (
              <button
                onClick={() => setShowRecordPaymentModal(true)}
                className="px-3.5 py-2 bg-[#143642] hover:bg-[#0e2730] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Record Manual Payment</span>
              </button>
            )}

            {managerTab === 'expenses' && (
              <button
                onClick={() => setShowAddExpenseModal(true)}
                className="px-3.5 py-2 bg-[#B76935] hover:bg-[#a05b2d] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Record Expense</span>
              </button>
            )}
          </div>
        </header>

        {/* TAB 1: OVERVIEW WITH REAL CALCULATED STATS */}
        {managerTab === 'overview' && (
          <div className="space-y-8">
            
            {/* 12 Required KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              
              <div className="bg-white p-4 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#687477] font-semibold">Total Properties</span>
                <div className="text-2xl font-bold font-mono text-[#143642]">{totalProperties}</div>
                <span className="text-[11px] text-emerald-700 font-medium">All active & managed</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#687477] font-semibold">Total Units</span>
                <div className="text-2xl font-bold font-mono text-[#143642]">{totalUnits}</div>
                <span className="text-[11px] text-[#687477]">{vacantUnits} vacant · {occupiedUnits} occupied</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#687477] font-semibold">Occupancy Rate</span>
                <div className="text-2xl font-bold font-mono text-[#B76935]">{occupancyRate}%</div>
                <div className="w-full bg-[#E7E4DE] h-1.5 rounded-full overflow-hidden mt-1">
                  <div className="bg-[#B76935] h-full" style={{ width: `${occupancyRate}%` }} />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#687477] font-semibold">Total Tenants</span>
                <div className="text-2xl font-bold font-mono text-[#143642]">{totalTenants}</div>
                <span className="text-[11px] text-emerald-700 font-medium">With active leases</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#687477] font-semibold">Expected Monthly Rent</span>
                <div className="text-xl font-bold font-mono text-[#143642]">{formatKSh(expectedMonthlyRent)}</div>
                <span className="text-[11px] text-[#687477]">Gross portfolio potential</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#687477] font-semibold">Rent Collected</span>
                <div className="text-xl font-bold font-mono text-emerald-700">{formatKSh(rentCollected)}</div>
                <span className="text-[11px] text-emerald-600 font-medium">Via Safaricom & EFT</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#687477] font-semibold">Outstanding Rent</span>
                <div className="text-xl font-bold font-mono text-amber-700">{formatKSh(outstandingRent)}</div>
                <span className="text-[11px] text-amber-700 font-medium">Invoiced balance pending</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#687477] font-semibold">Overdue Invoices</span>
                <div className="text-2xl font-bold font-mono text-red-600">{overdueInvoices}</div>
                <span className="text-[11px] text-red-600 font-medium">Past due date</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#687477] font-semibold">Pending Applications</span>
                <div className="text-2xl font-bold font-mono text-[#143642]">{pendingApplications}</div>
                <span className="text-[11px] text-[#687477]">Requiring screening</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#687477] font-semibold">Open Maintenance</span>
                <div className="text-2xl font-bold font-mono text-[#143642]">{openMaintenance}</div>
                <span className="text-[11px] text-[#687477]">Tickets in progress</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#687477] font-semibold">Total Expenses</span>
                <div className="text-xl font-bold font-mono text-slate-700">{formatKSh(totalExpenses)}</div>
                <span className="text-[11px] text-[#687477]">Security, KPLC & repairs</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#687477] font-semibold">Net Rental Income</span>
                <div className="text-xl font-bold font-mono text-emerald-800">{formatKSh(netRentalIncome)}</div>
                <span className="text-[11px] text-emerald-700 font-medium">Collected minus expenses</span>
              </div>

            </div>

            {/* Visual Rent Collection Progress & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Financial Progress & Breakdown */}
              <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#E7E4DE]">
                  <h3 className="font-bold text-sm text-[#143642]">Rent Collection Velocity</h3>
                  <span className="text-xs font-mono font-semibold text-[#687477]">March 2026</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-[#687477]">Collection Progress:</span>
                      <span className="font-mono font-bold text-[#143642]">
                        {expectedMonthlyRent > 0 ? Math.round((rentCollected / (expectedMonthlyRent * 2)) * 100) : 0}% of target
                      </span>
                    </div>
                    <div className="w-full bg-[#F8F6F2] h-3 rounded-full overflow-hidden border border-[#E7E4DE]">
                      <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: '78%' }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE]">
                      <span className="text-[#687477] text-[11px] block">M-Pesa STK Share</span>
                      <span className="font-mono font-bold text-[#143642] text-sm">65%</span>
                    </div>
                    <div className="p-3 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE]">
                      <span className="text-[#687477] text-[11px] block">Bank EFT Share</span>
                      <span className="font-mono font-bold text-[#143642] text-sm">35%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setManagerTab('payments')}
                    className="w-full py-2 bg-[#F8F6F2] hover:bg-[#E7E4DE] text-[#143642] font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
                  >
                    <span>View All Invoices & Ledger</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Recent Safaricom Payments */}
              <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E7E4DE]">
                  <h3 className="font-bold text-sm text-[#143642]">Recent M-Pesa & Bank Transactions</h3>
                  <button
                    onClick={() => setManagerTab('payments')}
                    className="text-xs font-semibold text-[#B76935] hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {payments.slice(0, 4).map((pay) => (
                    <div key={pay.id} className="flex items-center justify-between p-3 rounded-xl bg-[#F8F6F2] border border-[#E7E4DE] text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#143642] font-mono">{pay.mpesaReceiptNumber || pay.receiptNumber}</span>
                          <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-semibold">
                            {pay.paymentMethod}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#687477]">
                          {pay.phoneNumber || 'Electronic Transfer'} · {new Date(pay.paymentDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold font-mono text-emerald-700 text-sm">
                          +{formatKSh(pay.amount)}
                        </div>
                        <span className="text-[10px] text-emerald-600 font-medium">Verified</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Recent Maintenance & Upcoming Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Applications & Viewings strip */}
              <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E7E4DE]">
                  <h3 className="font-bold text-sm text-[#143642]">Recent Rental Inquiries & Viewings</h3>
                  <button onClick={() => setManagerTab('applications')} className="text-xs text-[#B76935] font-semibold hover:underline">
                    Manage
                  </button>
                </div>

                <div className="space-y-3">
                  {applications.slice(0, 3).map((app) => (
                    <div key={app.id} className="p-3 rounded-xl bg-[#F8F6F2] border border-[#E7E4DE] text-xs flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-[#143642]">{app.applicantName}</h4>
                        <p className="text-[11px] text-[#687477]">
                          {app.employer} · Income: <span className="font-mono text-[#202A2D]">{formatKSh(app.monthlyIncome)}</span>
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Maintenance Snapshot */}
              <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E7E4DE]">
                  <h3 className="font-bold text-sm text-[#143642]">Active Maintenance Tickets</h3>
                  <button onClick={() => setManagerTab('maintenance')} className="text-xs text-[#B76935] font-semibold hover:underline">
                    Dispatch
                  </button>
                </div>

                <div className="space-y-3">
                  {maintenanceTickets.slice(0, 3).map((tick) => (
                    <div key={tick.id} className="p-3 rounded-xl bg-[#F8F6F2] border border-[#E7E4DE] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#143642]">{tick.title}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          tick.urgency === 'High' || tick.urgency === 'Emergency' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {tick.urgency}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#687477] line-clamp-1">{tick.description}</p>
                      <div className="text-[10px] text-[#687477] pt-1">
                        Assigned: <strong className="text-[#202A2D]">{tick.assignedContractor || 'Unassigned'}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: PROPERTIES CRUD */}
        {managerTab === 'properties' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 text-[#687477] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-[#E7E4DE] rounded-xl text-xs focus:outline-hidden focus:border-[#B76935]"
                />
              </div>

              <div className="text-xs text-[#687477]">
                Showing {properties.length} managed properties
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((prop) => {
                const propUnitsList = units.filter((u) => u.propertyId === prop.id);
                return (
                  <div key={prop.id} className="bg-white rounded-2xl border border-[#E7E4DE] overflow-hidden shadow-2xs space-y-4 p-5 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-[#F8F6F2]">
                        <img src={prop.featuredImage || prop.images[0]} alt={prop.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 flex gap-1">
                          <button
                            onClick={() => togglePublishProperty(prop.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              prop.isPublished ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-white'
                            }`}
                          >
                            {prop.isPublished ? 'Published' : 'Draft'}
                          </button>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-[11px] text-[#687477]">
                          <span>{prop.neighbourhood}, {prop.county}</span>
                          <span>·</span>
                          <span>{prop.propertyType}</span>
                        </div>
                        <h3 className="font-bold text-base text-[#143642] mt-0.5 line-clamp-1">{prop.title}</h3>
                        <p className="text-xs text-[#687477] mt-1 line-clamp-2">{prop.description}</p>
                      </div>

                      <div className="p-3 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE] text-xs flex justify-between">
                        <div>
                          <span className="text-[10px] text-[#687477] block">Base Rent</span>
                          <span className="font-mono font-bold text-[#143642]">{formatKSh(prop.baseRent)}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#687477] block">Units Total</span>
                          <span className="font-mono font-bold text-[#143642]">{propUnitsList.length} Units</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#687477] block">Status</span>
                          <span className="text-[10px] font-semibold text-emerald-700 capitalize">{prop.moderationStatus}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E7E4DE] flex items-center justify-between text-xs">
                      <button
                        onClick={() => toggleFeaturedProperty(prop.id)}
                        className={`text-[11px] font-medium ${prop.isFeatured ? 'text-[#B76935]' : 'text-[#687477]'}`}
                      >
                        {prop.isFeatured ? '★ Featured' : '☆ Mark Featured'}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (confirm(`Delete property ${prop.title}?`)) {
                              deleteProperty(prop.id);
                            }
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: UNITS CRUD */}
        {managerTab === 'units' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E7E4DE] overflow-hidden shadow-2xs">
              <div className="p-4 border-b border-[#E7E4DE] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="font-bold text-sm text-[#143642]">All Rentable Units ({units.length})</h3>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#687477]">Filter Property:</span>
                  <select
                    value={propertyFilter}
                    onChange={(e) => setPropertyFilter(e.target.value)}
                    className="p-1.5 bg-[#F8F6F2] border border-[#E7E4DE] rounded-lg text-xs"
                  >
                    <option value="">All Properties</option>
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E7E4DE] bg-[#F8F6F2] text-[#687477] font-semibold">
                      <th className="py-3 px-4">Unit Number</th>
                      <th className="py-3 px-4">Property</th>
                      <th className="py-3 px-4">Floor</th>
                      <th className="py-3 px-4">Beds / Baths</th>
                      <th className="py-3 px-4 text-right">Rent Amount</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E4DE]">
                    {units
                      .filter((u) => !propertyFilter || u.propertyId === propertyFilter)
                      .map((u) => {
                        const prop = properties.find((p) => p.id === u.propertyId);
                        return (
                          <tr key={u.id} className="hover:bg-[#F8F6F2] transition-colors">
                            <td className="py-3 px-4 font-bold text-[#143642]">{u.unitNumber}</td>
                            <td className="py-3 px-4 text-[#202A2D]">{prop?.title || 'Unknown'}</td>
                            <td className="py-3 px-4 text-[#687477]">{u.floor || 'Standard'}</td>
                            <td className="py-3 px-4 text-[#202A2D]">{u.bedrooms} Bed · {u.bathrooms} Bath</td>
                            <td className="py-3 px-4 text-right font-mono font-bold text-[#143642]">
                              {formatKSh(u.rentAmount)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <select
                                value={u.status}
                                onChange={(e) => updateUnit(u.id, { status: e.target.value as any })}
                                className="p-1 rounded-lg border border-[#E7E4DE] text-[11px] font-semibold bg-white"
                              >
                                <option value="Vacant">Vacant</option>
                                <option value="Occupied">Occupied</option>
                                <option value="Reserved">Reserved</option>
                                <option value="Under Maintenance">Under Maintenance</option>
                                <option value="Unavailable">Unavailable</option>
                              </select>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => {
                                  if (confirm(`Delete unit ${u.unitNumber}?`)) {
                                    deleteUnit(u.id);
                                  }
                                }}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
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

        {/* TAB 4: TENANTS MANAGEMENT */}
        {managerTab === 'tenants' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E7E4DE] overflow-hidden shadow-2xs">
              <div className="p-4 border-b border-[#E7E4DE] flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#143642]">Tenants Directory ({tenants.length})</h3>
                <span className="text-xs text-[#687477]">Kenyan National ID Screened</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E7E4DE] bg-[#F8F6F2] text-[#687477] font-semibold">
                      <th className="py-3 px-4">Full Name</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Assigned Unit</th>
                      <th className="py-3 px-4">National ID</th>
                      <th className="py-3 px-4">Emergency Contact</th>
                      <th className="py-3 px-4 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E4DE]">
                    {tenants.map((t) => {
                      const prop = properties.find((p) => p.id === t.assignedPropertyId);
                      const unit = units.find((u) => u.id === t.assignedUnitId);
                      return (
                        <tr key={t.id} className="hover:bg-[#F8F6F2] transition-colors">
                          <td className="py-3 px-4 font-bold text-[#143642]">{t.fullName}</td>
                          <td className="py-3 px-4 text-[#202A2D]">
                            <div>{t.phone}</div>
                            <div className="text-[11px] text-[#687477]">{t.email}</div>
                          </td>
                          <td className="py-3 px-4 text-[#202A2D]">
                            <div className="font-semibold">{unit?.unitNumber || 'Unassigned'}</div>
                            <div className="text-[11px] text-[#687477]">{prop?.title}</div>
                          </td>
                          <td className="py-3 px-4 font-mono text-[#687477]">{t.idNumber}</td>
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

        {/* TAB 5: LEASES MANAGEMENT */}
        {managerTab === 'leases' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E7E4DE] overflow-hidden shadow-2xs">
              <div className="p-4 border-b border-[#E7E4DE] flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#143642]">Active Residential Leases ({leases.length})</h3>
                <span className="text-xs text-[#687477]">Compliant with Kenya Landlord & Tenant Act</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E7E4DE] bg-[#F8F6F2] text-[#687477] font-semibold">
                      <th className="py-3 px-4">Lease ID</th>
                      <th className="py-3 px-4">Tenant</th>
                      <th className="py-3 px-4">Unit & Property</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4 text-right">Rent / Month</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E4DE]">
                    {leases.map((l) => {
                      const tenant = tenants.find((t) => t.id === l.tenantId);
                      const unit = units.find((u) => u.id === l.unitId);
                      const prop = properties.find((p) => p.id === l.propertyId);
                      return (
                        <tr key={l.id} className="hover:bg-[#F8F6F2] transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-[#143642]">{l.id}</td>
                          <td className="py-3 px-4 font-semibold text-[#202A2D]">{tenant?.fullName || 'Tenant'}</td>
                          <td className="py-3 px-4 text-[#202A2D]">
                            <div>{unit?.unitNumber}</div>
                            <div className="text-[11px] text-[#687477]">{prop?.title}</div>
                          </td>
                          <td className="py-3 px-4 text-[#687477]">
                            {l.startDate} to {l.endDate}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-[#143642]">
                            {formatKSh(l.rentAmount)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                              {l.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => alert(`Certificate of Tenancy Lease: ${l.id}\nRent: ${formatKSh(l.rentAmount)}\nTenant: ${tenant?.fullName}\nDue Day: ${l.rentDueDay}th of every month`)}
                              className="px-2.5 py-1 bg-[#F8F6F2] hover:bg-[#E7E4DE] text-[#143642] rounded-lg text-[11px] font-medium"
                            >
                              View Summary
                            </button>
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

        {/* TAB 6: RENT & PAYMENTS MANAGEMENT */}
        {managerTab === 'payments' && (
          <div className="space-y-8">
            {/* Invoices Table */}
            <div className="bg-white rounded-2xl border border-[#E7E4DE] overflow-hidden shadow-2xs space-y-4">
              <div className="p-4 border-b border-[#E7E4DE] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#143642]">Recurring Monthly Rent Invoices</h3>
                  <p className="text-xs text-[#687477]">Automatically generated from active leases</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E7E4DE] bg-[#F8F6F2] text-[#687477] font-semibold">
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">Tenant</th>
                      <th className="py-3 px-4">Period</th>
                      <th className="py-3 px-4 text-right">Due</th>
                      <th className="py-3 px-4 text-right">Paid</th>
                      <th className="py-3 px-4 text-right">Balance</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E4DE]">
                    {invoices.map((inv) => {
                      const t = tenants.find((tenant) => tenant.id === inv.tenantId);
                      return (
                        <tr key={inv.id} className="hover:bg-[#F8F6F2] transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-[#143642]">{inv.invoiceNumber}</td>
                          <td className="py-3 px-4 font-semibold text-[#202A2D]">{t?.fullName || 'Resident'}</td>
                          <td className="py-3 px-4 text-[#687477]">{inv.period}</td>
                          <td className="py-3 px-4 text-right font-mono font-medium text-[#202A2D]">{formatKSh(inv.amountDue)}</td>
                          <td className="py-3 px-4 text-right font-mono text-emerald-700 font-semibold">{formatKSh(inv.amountPaid)}</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-amber-700">{formatKSh(inv.balance)}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : inv.status === 'Partially Paid' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {inv.balance > 0 ? (
                              <button
                                onClick={() => {
                                  setSelectedInvoiceForMpesa(inv);
                                  setShowMpesaModal(true);
                                }}
                                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 ml-auto"
                              >
                                <Smartphone className="w-3 h-3" />
                                <span>Trigger STK</span>
                              </button>
                            ) : (
                              <span className="text-emerald-700 text-[11px] font-medium">Cleared</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payments Ledger */}
            <div className="bg-white rounded-2xl border border-[#E7E4DE] overflow-hidden shadow-2xs space-y-4">
              <div className="p-4 border-b border-[#E7E4DE] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#143642]">M-Pesa & Bank Receipts Ledger</h3>
                  <p className="text-xs text-[#687477]">Direct Safaricom transaction refs</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E7E4DE] bg-[#F8F6F2] text-[#687477] font-semibold">
                      <th className="py-3 px-4">Receipt #</th>
                      <th className="py-3 px-4">M-Pesa Ref</th>
                      <th className="py-3 px-4">Method</th>
                      <th className="py-3 px-4">Phone / Account</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E4DE]">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-[#F8F6F2] transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#143642]">{p.receiptNumber}</td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-800">{p.mpesaReceiptNumber || 'EFT'}</td>
                        <td className="py-3 px-4 text-[#202A2D]">{p.paymentMethod}</td>
                        <td className="py-3 px-4 text-[#687477]">{p.phoneNumber || 'NCBA Bank EFT'}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                          {formatKSh(p.amount)}
                        </td>
                        <td className="py-3 px-4 text-[#687477]">{new Date(p.paymentDate).toLocaleString()}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: MAINTENANCE DISPATCH */}
        {managerTab === 'maintenance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E7E4DE] overflow-hidden shadow-2xs">
              <div className="p-4 border-b border-[#E7E4DE] flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#143642]">Maintenance Tickets & Repair Orders</h3>
                <span className="text-xs text-[#687477]">Track contractor costs and resolution</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E7E4DE] bg-[#F8F6F2] text-[#687477] font-semibold">
                      <th className="py-3 px-4">Ticket</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Unit</th>
                      <th className="py-3 px-4">Urgency</th>
                      <th className="py-3 px-4">Contractor</th>
                      <th className="py-3 px-4 text-right">Cost (KSh)</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E4DE]">
                    {maintenanceTickets.map((m) => {
                      const u = units.find((unit) => unit.id === m.unitId);
                      return (
                        <tr key={m.id} className="hover:bg-[#F8F6F2] transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-[#143642]">{m.title}</div>
                            <div className="text-[11px] text-[#687477]">{m.ticketNumber}</div>
                          </td>
                          <td className="py-3 px-4 text-[#202A2D]">{m.category}</td>
                          <td className="py-3 px-4 font-semibold text-[#143642]">{u?.unitNumber || 'Unit'}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              m.urgency === 'Emergency' ? 'bg-red-100 text-red-800' : m.urgency === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                            }`}>
                              {m.urgency}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#202A2D]">{m.assignedContractor || 'Pending Assignment'}</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-[#143642]">
                            {m.actualCost ? formatKSh(m.actualCost) : m.estimatedCost ? formatKSh(m.estimatedCost) : '—'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <select
                              value={m.status}
                              onChange={(e) => updateMaintenanceTicket(m.id, { status: e.target.value as any })}
                              className="p-1 rounded-lg border border-[#E7E4DE] text-[11px] font-semibold bg-white"
                            >
                              <option value="Open">Open</option>
                              <option value="Acknowledged">Acknowledged</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Awaiting Parts">Awaiting Parts</option>
                              <option value="Resolved">Resolved</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                const newCont = prompt('Assign Contractor name:', m.assignedContractor || 'Mwangi Precision Repairs');
                                if (newCont) {
                                  updateMaintenanceTicket(m.id, { assignedContractor: newCont });
                                }
                              }}
                              className="px-2 py-1 bg-[#F8F6F2] hover:bg-[#E7E4DE] text-[#143642] rounded text-[11px]"
                            >
                              Assign
                            </button>
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

        {/* TAB 8: APPLICATIONS SCREENING */}
        {managerTab === 'applications' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E7E4DE] overflow-hidden shadow-2xs">
              <div className="p-4 border-b border-[#E7E4DE] flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#143642]">Rental Screening Applications ({applications.length})</h3>
                <span className="text-xs text-[#687477]">Income & Tenancy Screening</span>
              </div>

              <div className="p-6 space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="p-5 bg-[#F8F6F2] rounded-2xl border border-[#E7E4DE] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-base text-[#143642]">{app.applicantName}</h4>
                        <div className="text-xs text-[#687477] flex items-center gap-3 mt-0.5">
                          <span>{app.applicantPhone}</span>
                          <span>·</span>
                          <span>{app.applicantEmail}</span>
                          <span>·</span>
                          <span className="font-mono">ID: {app.nationalIdNumber}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          app.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : app.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white p-3 rounded-xl border border-[#E7E4DE]">
                      <div>
                        <span className="text-[#687477] block text-[11px]">Employer</span>
                        <span className="font-bold text-[#143642]">{app.employer}</span>
                      </div>
                      <div>
                        <span className="text-[#687477] block text-[11px]">Monthly Income</span>
                        <span className="font-mono font-bold text-emerald-700">{formatKSh(app.monthlyIncome)}</span>
                      </div>
                      <div>
                        <span className="text-[#687477] block text-[11px]">Occupants</span>
                        <span className="font-bold text-[#143642]">{app.occupantsCount} Persons</span>
                      </div>
                      <div>
                        <span className="text-[#687477] block text-[11px]">Move-in Date</span>
                        <span className="font-bold text-[#143642]">{app.preferredMoveInDate}</span>
                      </div>
                    </div>

                    {app.additionalNotes && (
                      <p className="text-xs text-[#687477] italic">Note: "{app.additionalNotes}"</p>
                    )}

                    <div className="pt-2 border-t border-[#E7E4DE] flex items-center justify-end gap-2">
                      <button
                        onClick={() => updateApplicationStatus(app.id, 'Approved', 'Verified with HR department.')}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold"
                      >
                        Approve & Issue Lease
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(app.id, 'Rejected')}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: VIEWINGS CALENDAR */}
        {managerTab === 'viewings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E7E4DE] overflow-hidden shadow-2xs">
              <div className="p-4 border-b border-[#E7E4DE] flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#143642]">Accompanied Viewing Appointments ({viewingRequests.length})</h3>
                <span className="text-xs text-[#687477]">Calendar Appointments</span>
              </div>

              <div className="p-6 space-y-4">
                {viewingRequests.map((v) => (
                  <div key={v.id} className="p-4 rounded-xl bg-[#F8F6F2] border border-[#E7E4DE] flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#143642]">{v.applicantName}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          {v.status}
                        </span>
                      </div>
                      <p className="text-[#687477]">
                        Date: <strong className="text-[#202A2D]">{v.preferredDate}</strong> at <strong className="text-[#202A2D]">{v.preferredTime}</strong>
                      </p>
                      <p className="text-[#687477]">Contact: {v.applicantPhone} · {v.applicantEmail}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateViewingStatus(v.id, 'Confirmed')}
                        className="px-3 py-1.5 bg-[#143642] text-white rounded-lg text-xs font-medium hover:bg-[#0e2730]"
                      >
                        Confirm Appointment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: EXPENSES & NET INCOME */}
        {managerTab === 'expenses' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E7E4DE] overflow-hidden shadow-2xs space-y-4">
              <div className="p-4 border-b border-[#E7E4DE] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#143642]">Operational Outflows & Expenses</h3>
                  <p className="text-xs text-[#687477]">Track guard security, KPLC token power, and common repairs</p>
                </div>
                <div className="font-mono font-bold text-red-600 text-sm">
                  Total: -{formatKSh(totalExpenses)}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E7E4DE] bg-[#F8F6F2] text-[#687477] font-semibold">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Vendor</th>
                      <th className="py-3 px-4 text-right">Amount (KSh)</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E4DE]">
                    {expenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-[#F8F6F2] transition-colors">
                        <td className="py-3 px-4 text-[#687477]">{exp.expenseDate}</td>
                        <td className="py-3 px-4 font-semibold text-[#143642]">{exp.category}</td>
                        <td className="py-3 px-4 text-[#202A2D]">{exp.description}</td>
                        <td className="py-3 px-4 text-[#687477]">{exp.vendor || 'Local Vendor'}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-red-600">
                          -{formatKSh(exp.amount)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => deleteExpense(exp.id)}
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

        {/* TAB 11: REPORTS */}
        {managerTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#E7E4DE] pb-4">
                <div>
                  <h3 className="font-bold text-base text-[#143642]">Financial Statement & Portfolio P&L</h3>
                  <p className="text-xs text-[#687477]">Consolidated gross rent, M-Pesa settlements and operating expenses</p>
                </div>
                <button
                  onClick={() => alert('Exporting full portfolio audit spreadsheet (CSV)...')}
                  className="px-3.5 py-2 bg-[#143642] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-[#0e2730]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV Ledger</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE]">
                  <span className="text-[#687477] block text-[11px]">Gross Rent Invoiced</span>
                  <span className="font-mono font-bold text-lg text-[#143642]">{formatKSh(expectedMonthlyRent)}</span>
                </div>
                <div className="p-4 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE]">
                  <span className="text-[#687477] block text-[11px]">Actual Collections</span>
                  <span className="font-mono font-bold text-lg text-emerald-700">{formatKSh(rentCollected)}</span>
                </div>
                <div className="p-4 bg-[#F8F6F2] rounded-xl border border-[#E7E4DE]">
                  <span className="text-[#687477] block text-[11px]">Net Operating Profit</span>
                  <span className="font-mono font-bold text-lg text-emerald-800">{formatKSh(netRentalIncome)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 12: NOTIFICATIONS */}
        {managerTab === 'notifications' && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-4">
              <h3 className="font-bold text-base text-[#143642]">System Activity & Alerts</h3>
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3.5 rounded-xl bg-[#F8F6F2] border border-[#E7E4DE] text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#143642]">{n.title}</span>
                      <span className="text-[10px] text-[#687477]">{new Date(n.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-[#687477]">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 13: SETTINGS & MESSAGES */}
        {(managerTab === 'settings' || managerTab === 'messages') && (
          <div className="bg-white p-6 rounded-2xl border border-[#E7E4DE] shadow-2xs space-y-6 max-w-2xl">
            <h3 className="font-bold text-base text-[#143642]">Organisation Profile & M-Pesa Daraja Config</h3>
            
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#202A2D] mb-1">Company / Agency Name</label>
                <input
                  type="text"
                  defaultValue="Prime Heritage Properties Ltd"
                  className="w-full p-2.5 border border-[#E7E4DE] rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#202A2D] mb-1">Safaricom Paybill Number</label>
                  <input
                    type="text"
                    defaultValue="4082200"
                    disabled
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono bg-[#F8F6F2]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#202A2D] mb-1">Settlement Account</label>
                  <input
                    type="text"
                    defaultValue="NCBA Bank - Upper Hill"
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#202A2D] mb-1">Contact Email for Rental Notifications</label>
                <input
                  type="email"
                  defaultValue="manager@makaziproperties.co.ke"
                  className="w-full p-2.5 border border-[#E7E4DE] rounded-xl"
                />
              </div>

              <button
                onClick={() => alert('Settings updated and synced to database.')}
                className="px-4 py-2.5 bg-[#143642] text-white font-semibold rounded-xl"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}

      </main>

      {/* MODAL: ADD PROPERTY */}
      {showAddPropertyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E7E4DE] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E7E4DE] pb-2">
              <h3 className="font-bold text-base text-[#143642]">Add Property to Portfolio</h3>
              <button onClick={() => setShowAddPropertyModal(false)} className="text-xs text-[#687477]">Close</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addProperty({
                  ...propForm,
                  organizationId: currentUser.organizationId || 'org_makazi_prime',
                  images: [
                    '/src/assets/images/property_kilimani_luxury_suite_1794387610317.jpg',
                    '/src/assets/images/hero_nairobi_modern_apartment_1794387609458.jpg'
                  ],
                  featuredImage: '/src/assets/images/property_kilimani_luxury_suite_1794387610317.jpg',
                  isFeatured: false,
                  isPublished: true,
                  moderationStatus: 'approved',
                  managerName: currentUser.name,
                  managerPhone: currentUser.phone,
                  managerEmail: currentUser.email,
                  amenities: ['CCTV Security', 'Borehole Water', 'Backup Generator', 'High Speed Lifts'],
                });
                setShowAddPropertyModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">Property Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amber Court Residences"
                  value={propForm.title}
                  onChange={(e) => setPropForm({ ...propForm, title: e.target.value })}
                  className="w-full p-2.5 border border-[#E7E4DE] rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={propForm.propertyType}
                    onChange={(e) => setPropForm({ ...propForm, propertyType: e.target.value as any })}
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl"
                  >
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>Townhouse</option>
                    <option>Studio</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Neighbourhood</label>
                  <input
                    type="text"
                    required
                    value={propForm.neighbourhood}
                    onChange={(e) => setPropForm({ ...propForm, neighbourhood: e.target.value })}
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Base Monthly Rent (KSh)</label>
                  <input
                    type="number"
                    required
                    value={propForm.baseRent}
                    onChange={(e) => setPropForm({ ...propForm, baseRent: Number(e.target.value) })}
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={propForm.bedrooms}
                    onChange={(e) => setPropForm({ ...propForm, bedrooms: Number(e.target.value) })}
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={propForm.description}
                  onChange={(e) => setPropForm({ ...propForm, description: e.target.value })}
                  className="w-full p-2.5 border border-[#E7E4DE] rounded-xl"
                />
              </div>

              <button type="submit" className="w-full py-2.5 bg-[#B76935] text-white font-semibold rounded-xl">
                Create & Save Property
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD UNIT */}
      {showAddUnitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E7E4DE] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7E4DE] pb-2">
              <h3 className="font-bold text-base text-[#143642]">Add Rentable Unit</h3>
              <button onClick={() => setShowAddUnitModal(false)} className="text-xs text-[#687477]">Close</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addUnit({
                  propertyId: unitForm.propertyId,
                  unitNumber: unitForm.unitNumber,
                  floor: unitForm.floor,
                  rentAmount: unitForm.rentAmount,
                  depositAmount: unitForm.depositAmount,
                  bedrooms: unitForm.bedrooms,
                  bathrooms: unitForm.bathrooms,
                  status: unitForm.status,
                });
                setShowAddUnitModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">Select Property</label>
                <select
                  value={unitForm.propertyId}
                  onChange={(e) => setUnitForm({ ...unitForm, propertyId: e.target.value })}
                  className="w-full p-2.5 border border-[#E7E4DE] rounded-xl"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Unit Number / Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apt 402"
                    value={unitForm.unitNumber}
                    onChange={(e) => setUnitForm({ ...unitForm, unitNumber: e.target.value })}
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Floor</label>
                  <input
                    type="text"
                    placeholder="e.g. 4th Floor"
                    value={unitForm.floor}
                    onChange={(e) => setUnitForm({ ...unitForm, floor: e.target.value })}
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Monthly Rent (KSh)</label>
                  <input
                    type="number"
                    required
                    value={unitForm.rentAmount}
                    onChange={(e) => setUnitForm({ ...unitForm, rentAmount: Number(e.target.value) })}
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Status</label>
                  <select
                    value={unitForm.status}
                    onChange={(e) => setUnitForm({ ...unitForm, status: e.target.value as any })}
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl"
                  >
                    <option value="Vacant">Vacant</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Reserved">Reserved</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full py-2.5 bg-[#143642] text-white font-semibold rounded-xl">
                Save Unit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD TENANT */}
      {showAddTenantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E7E4DE] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E7E4DE] pb-2">
              <h3 className="font-bold text-base text-[#143642]">Register New Tenant</h3>
              <button onClick={() => setShowAddTenantModal(false)} className="text-xs text-[#687477]">Close</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addTenant({
                  userId: 'user_t_' + Date.now(),
                  organizationId: currentUser.organizationId || 'org_makazi_prime',
                  fullName: tenantForm.fullName,
                  email: tenantForm.email,
                  phone: tenantForm.phone,
                  idNumber: tenantForm.idNumber,
                  emergencyContactName: tenantForm.emergencyContactName,
                  emergencyContactPhone: tenantForm.emergencyContactPhone,
                  assignedPropertyId: tenantForm.assignedPropertyId,
                  assignedUnitId: tenantForm.assignedUnitId || units[0]?.id || '',
                  moveInDate: tenantForm.moveInDate,
                  notes: tenantForm.notes,
                  outstandingBalance: 0,
                });
                setShowAddTenantModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sharon Wanjiku"
                  value={tenantForm.fullName}
                  onChange={(e) => setTenantForm({ ...tenantForm, fullName: e.target.value })}
                  className="w-full p-2.5 border border-[#E7E4DE] rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={tenantForm.phone}
                    onChange={(e) => setTenantForm({ ...tenantForm, phone: e.target.value })}
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">National ID</label>
                  <input
                    type="text"
                    required
                    value={tenantForm.idNumber}
                    onChange={(e) => setTenantForm({ ...tenantForm, idNumber: e.target.value })}
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={tenantForm.email}
                  onChange={(e) => setTenantForm({ ...tenantForm, email: e.target.value })}
                  className="w-full p-2.5 border border-[#E7E4DE] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Assign Unit</label>
                <select
                  value={tenantForm.assignedUnitId}
                  onChange={(e) => setTenantForm({ ...tenantForm, assignedUnitId: e.target.value })}
                  className="w-full p-2.5 border border-[#E7E4DE] rounded-xl"
                >
                  <option value="">Select vacant unit...</option>
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>{u.unitNumber} ({formatKSh(u.rentAmount)}/mo)</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="w-full py-2.5 bg-[#B76935] text-white font-semibold rounded-xl">
                Save & Assign Tenant
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECORD EXPENSE */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E7E4DE] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7E4DE] pb-2">
              <h3 className="font-bold text-base text-[#143642]">Record Operating Expense</h3>
              <button onClick={() => setShowAddExpenseModal(false)} className="text-xs text-[#687477]">Close</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addExpense({
                  organizationId: currentUser.organizationId || 'org_makazi_prime',
                  propertyId: expenseForm.propertyId,
                  category: expenseForm.category,
                  description: expenseForm.description,
                  amount: expenseForm.amount,
                  vendor: expenseForm.vendor,
                  expenseDate: expenseForm.expenseDate,
                });
                setShowAddExpenseModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">Category</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value as any })}
                  className="w-full p-2.5 border border-[#E7E4DE] rounded-xl"
                >
                  <option>Repairs</option>
                  <option>Security</option>
                  <option>Electricity</option>
                  <option>Water</option>
                  <option>Cleaning</option>
                  <option>Management</option>
                  <option>Insurance</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kenya Power common lighting tokens"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  className="w-full p-2.5 border border-[#E7E4DE] rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Amount (KSh)</label>
                  <input
                    type="number"
                    required
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Vendor / Payee</label>
                  <input
                    type="text"
                    placeholder="e.g. KPLC / Contractor"
                    value={expenseForm.vendor}
                    onChange={(e) => setExpenseForm({ ...expenseForm, vendor: e.target.value })}
                    className="w-full p-2.5 border border-[#E7E4DE] rounded-xl"
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-2.5 bg-[#B76935] text-white font-semibold rounded-xl">
                Record Outflow
              </button>
            </form>
          </div>
        </div>
      )}

      {/* M-Pesa STK Push Simulation Trigger Modal */}
      {selectedInvoiceForMpesa && (
        <MpesaModal
          isOpen={showMpesaModal}
          onClose={() => {
            setShowMpesaModal(false);
            setSelectedInvoiceForMpesa(null);
          }}
          invoiceId={selectedInvoiceForMpesa.id}
          defaultAmount={selectedInvoiceForMpesa.balance}
          unitLabel={`Invoice ${selectedInvoiceForMpesa.invoiceNumber}`}
        />
      )}

    </div>
  );
};
