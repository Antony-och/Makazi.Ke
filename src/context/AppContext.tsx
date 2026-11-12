import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Property,
  PropertyUnit,
  Tenant,
  Lease,
  RentInvoice,
  PaymentRecord,
  MaintenanceTicket,
  ViewingRequest,
  RentalApplication,
  PropertyExpense,
  NotificationItem,
  AuditLogItem,
  LeaseStatus,
  ViewingStatus,
  ApplicationStatus,
  ReportedListingItem,
  PlatformSettingData,
  LocationBenchmark,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PROPERTIES,
  INITIAL_UNITS,
  INITIAL_TENANTS,
  INITIAL_LEASES,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_MAINTENANCE_TICKETS,
  INITIAL_VIEWING_REQUESTS,
  INITIAL_APPLICATIONS,
  INITIAL_EXPENSES,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_REPORTED_LISTINGS,
  INITIAL_PLATFORM_SETTINGS,
  INITIAL_LOCATION_BENCHMARKS,
} from '../data/mockData';

interface AppContextType {
  currentUser: User;
  currentRole: UserRole;
  users: User[];
  properties: Property[];
  units: PropertyUnit[];
  tenants: Tenant[];
  leases: Lease[];
  invoices: RentInvoice[];
  payments: PaymentRecord[];
  maintenanceTickets: MaintenanceTicket[];
  viewingRequests: ViewingRequest[];
  applications: RentalApplication[];
  expenses: PropertyExpense[];
  notifications: NotificationItem[];
  auditLogs: AuditLogItem[];
  favourites: string[];

  // Admin Data
  reportedListings: ReportedListingItem[];
  platformSettings: PlatformSettingData;
  locationBenchmarks: LocationBenchmark[];
  
  // Navigation State
  currentView: string;
  selectedPropertyId: string | null;
  managerTab: string;
  tenantTab: string;
  adminTab: string;

  // Navigation Setters
  setCurrentView: (view: string) => void;
  setSelectedPropertyId: (id: string | null) => void;
  setManagerTab: (tab: string) => void;
  setTenantTab: (tab: string) => void;
  setAdminTab: (tab: string) => void;

  // Actions
  switchRole: (role: UserRole) => void;
  loginAs: (user: User) => void;
  logout: () => void;
  updateCurrentUser: (userData: Partial<User>) => void;
  toggleFavourite: (propertyId: string) => void;
  isFavourite: (propertyId: string) => boolean;

  // Property Actions
  addProperty: (property: Omit<Property, 'id' | 'createdAt'>) => void;
  updateProperty: (id: string, property: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  togglePublishProperty: (id: string) => void;
  toggleFeaturedProperty: (id: string) => void;

  // Unit Actions
  addUnit: (unit: Omit<PropertyUnit, 'id'>) => void;
  updateUnit: (id: string, unit: Partial<PropertyUnit>) => void;
  deleteUnit: (id: string) => void;

  // Tenant Actions
  addTenant: (tenant: Omit<Tenant, 'id'>) => void;
  updateTenant: (id: string, tenant: Partial<Tenant>) => void;

  // Lease Actions
  createLease: (lease: Omit<Lease, 'id'>) => void;
  updateLeaseStatus: (id: string, status: LeaseStatus) => void;

  // Invoices & Payments
  createInvoice: (invoice: Omit<RentInvoice, 'id' | 'invoiceNumber' | 'createdAt'>) => void;
  recordPayment: (payment: Omit<PaymentRecord, 'id' | 'receiptNumber'>) => void;
  processMpesaPayment: (
    invoiceId: string,
    phone: string,
    amount: number
  ) => Promise<{ success: boolean; mpesaReceipt: string; message: string }>;

  // Maintenance Actions
  submitMaintenanceTicket: (ticket: Omit<MaintenanceTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt'>) => void;
  updateMaintenanceTicket: (id: string, update: Partial<MaintenanceTicket>) => void;

  // Viewing & Application Actions
  requestViewing: (viewing: Omit<ViewingRequest, 'id' | 'createdAt'>) => void;
  updateViewingStatus: (id: string, status: ViewingStatus) => void;
  submitApplication: (app: Omit<RentalApplication, 'id' | 'createdAt'>) => void;
  updateApplicationStatus: (id: string, status: ApplicationStatus, managerNotes?: string) => void;

  // Expense Actions
  addExpense: (expense: Omit<PropertyExpense, 'id'>) => void;
  deleteExpense: (id: string) => void;

  // Moderation & Admin Actions
  moderateProperty: (propertyId: string, status: 'approved' | 'rejected' | 'suspended', reason?: string) => void;
  rejectPropertyWithReason: (propertyId: string, reason: string) => void;
  toggleUserStatus: (userId: string) => void;
  toggleUserSuspension: (userId: string) => void;
  verifyAgencyOwner: (userId: string, isVerified: boolean) => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateReportedListingStatus: (id: string, status: 'Open' | 'Investigating' | 'Resolved' | 'Dismissed') => void;
  updatePlatformSettings: (settings: Partial<PlatformSettingData>) => void;
  broadcastSystemNotice: (targetRole: UserRole | 'all', title: string, message: string) => void;
  addLocationBenchmark: (loc: Omit<LocationBenchmark, 'id'>) => void;
  updateLocationBenchmark: (id: string, update: Partial<LocationBenchmark>) => void;
  deleteLocationBenchmark: (id: string) => void;

  // Notification Actions
  markNotificationAsRead: (id: string) => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => void;

  // Utilities
  formatKSh: (amount: number) => string;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'makazi_db_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or fallback to defaults
  const loadInitial = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  };

  const [users, setUsers] = useState<User[]>(() => loadInitial('users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<User>(() => loadInitial('currentUser', INITIAL_USERS[0]));
  const [currentRole, setCurrentRole] = useState<UserRole>(() => loadInitial('currentRole', 'seeker'));

  const [properties, setProperties] = useState<Property[]>(() => loadInitial('properties', INITIAL_PROPERTIES));
  const [units, setUnits] = useState<PropertyUnit[]>(() => loadInitial('units', INITIAL_UNITS));
  const [tenants, setTenants] = useState<Tenant[]>(() => loadInitial('tenants', INITIAL_TENANTS));
  const [leases, setLeases] = useState<Lease[]>(() => loadInitial('leases', INITIAL_LEASES));
  const [invoices, setInvoices] = useState<RentInvoice[]>(() => loadInitial('invoices', INITIAL_INVOICES));
  const [payments, setPayments] = useState<PaymentRecord[]>(() => loadInitial('payments', INITIAL_PAYMENTS));
  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>(() => loadInitial('maintenance', INITIAL_MAINTENANCE_TICKETS));
  const [viewingRequests, setViewingRequests] = useState<ViewingRequest[]>(() => loadInitial('viewings', INITIAL_VIEWING_REQUESTS));
  const [applications, setApplications] = useState<RentalApplication[]>(() => loadInitial('applications', INITIAL_APPLICATIONS));
  const [expenses, setExpenses] = useState<PropertyExpense[]>(() => loadInitial('expenses', INITIAL_EXPENSES));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadInitial('notifications', INITIAL_NOTIFICATIONS));
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => loadInitial('auditLogs', INITIAL_AUDIT_LOGS));
  const [favourites, setFavourites] = useState<string[]>(() => loadInitial('favourites', ['prop_the_aura_kilimani', 'prop_karen_solitude_villa']));
  const [reportedListings, setReportedListings] = useState<ReportedListingItem[]>(() => loadInitial('reportedListings', INITIAL_REPORTED_LISTINGS));
  const [platformSettings, setPlatformSettings] = useState<PlatformSettingData>(() => {
    const loaded = loadInitial<Partial<PlatformSettingData>>('platformSettings', INITIAL_PLATFORM_SETTINGS);
    return { ...INITIAL_PLATFORM_SETTINGS, ...loaded };
  });
  const [locationBenchmarks, setLocationBenchmarks] = useState<LocationBenchmark[]>(() => loadInitial('locationBenchmarks', INITIAL_LOCATION_BENCHMARKS));

  // Navigation state
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [managerTab, setManagerTab] = useState<string>('overview');
  const [tenantTab, setTenantTab] = useState<string>('overview');
  const [adminTab, setAdminTab] = useState<string>('overview');

  // Sync to local storage
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'currentUser', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'currentRole', JSON.stringify(currentRole)); }, [currentRole]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'properties', JSON.stringify(properties)); }, [properties]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'units', JSON.stringify(units)); }, [units]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'tenants', JSON.stringify(tenants)); }, [tenants]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'leases', JSON.stringify(leases)); }, [leases]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'invoices', JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'payments', JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'maintenance', JSON.stringify(maintenanceTickets)); }, [maintenanceTickets]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'viewings', JSON.stringify(viewingRequests)); }, [viewingRequests]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'applications', JSON.stringify(applications)); }, [applications]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'auditLogs', JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'favourites', JSON.stringify(favourites)); }, [favourites]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'reportedListings', JSON.stringify(reportedListings)); }, [reportedListings]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'platformSettings', JSON.stringify(platformSettings)); }, [platformSettings]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'locationBenchmarks', JSON.stringify(locationBenchmarks)); }, [locationBenchmarks]);

  // Role routing helper
  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'seeker') {
      setCurrentView('home');
    } else if (role === 'manager') {
      setCurrentView('manager-dashboard');
      setManagerTab('overview');
    } else if (role === 'tenant') {
      setCurrentView('tenant-portal');
      setTenantTab('overview');
    } else if (role === 'admin') {
      setCurrentView('admin-control-room');
      setAdminTab('overview');
    }
  };

  const loginAs = (user: User) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'currentUser', JSON.stringify(user));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'currentRole', JSON.stringify(user.role));
    } catch {}

    if (user.role === 'manager') {
      setCurrentView('manager-dashboard');
      setManagerTab('overview');
    } else if (user.role === 'tenant') {
      setCurrentView('tenant-portal');
      setTenantTab('overview');
    } else if (user.role === 'admin') {
      setCurrentView('admin-control-room');
      setAdminTab('overview');
    } else {
      setCurrentView('home');
    }

    addAuditLog('LOGIN', 'UserSession', `User ${user.name} (${user.email}) logged in successfully as ${user.role}`);
  };

  const logout = () => {
    const guestUser: User = {
      id: 'guest_user',
      name: '',
      email: '',
      phone: '',
      role: 'seeker',
      status: 'active',
      isVerified: false,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(guestUser);
    setCurrentRole('seeker');
    setCurrentView('home');
    setSelectedPropertyId(null);
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'currentUser', JSON.stringify(guestUser));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'currentRole', JSON.stringify('seeker'));
    } catch {}
    addAuditLog('LOGOUT', 'UserSession', 'Signed out from session');
  };

  const updateCurrentUser = (userData: Partial<User>) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...userData };
      setUsers(currentUsers =>
        currentUsers.map(u => (u.id === prev.id ? updated : u))
      );
      addAuditLog('UPDATE_PROFILE', 'UserProfile', `Updated profile credentials for ${updated.name}`);
      return updated;
    });
  };

  const toggleFavourite = (propertyId: string) => {
    setFavourites(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId) 
        : [...prev, propertyId]
    );
  };

  const isFavourite = (propertyId: string) => favourites.includes(propertyId);

  const addAuditLog = (action: string, entity: string, details: string) => {
    const newLog: AuditLogItem = {
      id: 'audit_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentRole,
      action,
      entity,
      details,
      ipAddress: '105.160.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255),
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: NotificationItem = {
      ...notif,
      id: 'notif_' + Date.now(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Property CRUD
  const addProperty = (data: Omit<Property, 'id' | 'createdAt'>) => {
    const newProp: Property = {
      ...data,
      id: 'prop_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setProperties(prev => [newProp, ...prev]);
    addAuditLog('CREATE_PROPERTY', 'Property', `Created property "${newProp.title}"`);
    addNotification({
      roleTarget: 'admin',
      title: 'New Property Created',
      message: `${currentUser.name} created "${newProp.title}".`,
      type: 'system',
    });
  };

  const updateProperty = (id: string, update: Partial<Property>) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, ...update } : p));
    addAuditLog('UPDATE_PROPERTY', 'Property', `Updated property ${id}`);
  };

  const deleteProperty = (id: string) => {
    const prop = properties.find(p => p.id === id);
    setProperties(prev => prev.filter(p => p.id !== id));
    addAuditLog('DELETE_PROPERTY', 'Property', `Deleted property "${prop?.title || id}"`);
  };

  const togglePublishProperty = (id: string) => {
    setProperties(prev => prev.map(p => {
      if (p.id === id) {
        const nextState = !p.isPublished;
        addAuditLog('TOGGLE_PUBLISH', 'Property', `${nextState ? 'Published' : 'Unpublished'} property "${p.title}"`);
        return { ...p, isPublished: nextState };
      }
      return p;
    }));
  };

  const toggleFeaturedProperty = (id: string) => {
    setProperties(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, isFeatured: !p.isFeatured };
      }
      return p;
    }));
  };

  // Units CRUD
  const addUnit = (data: Omit<PropertyUnit, 'id'>) => {
    const newUnit: PropertyUnit = {
      ...data,
      id: 'unit_' + Date.now(),
    };
    setUnits(prev => [...prev, newUnit]);
    addAuditLog('CREATE_UNIT', 'PropertyUnit', `Added unit ${newUnit.unitNumber}`);
  };

  const updateUnit = (id: string, update: Partial<PropertyUnit>) => {
    setUnits(prev => prev.map(u => u.id === id ? { ...u, ...update } : u));
    addAuditLog('UPDATE_UNIT', 'PropertyUnit', `Updated unit ${id}`);
  };

  const deleteUnit = (id: string) => {
    setUnits(prev => prev.filter(u => u.id !== id));
    addAuditLog('DELETE_UNIT', 'PropertyUnit', `Deleted unit ${id}`);
  };

  // Tenants CRUD
  const addTenant = (data: Omit<Tenant, 'id'>) => {
    const newTenant: Tenant = {
      ...data,
      id: 'tenant_' + Date.now(),
    };
    setTenants(prev => [...prev, newTenant]);
    // update unit to Occupied
    if (newTenant.assignedUnitId) {
      updateUnit(newTenant.assignedUnitId, {
        status: 'Occupied',
        currentTenantId: newTenant.id,
      });
    }
    addAuditLog('CREATE_TENANT', 'Tenant', `Added tenant ${newTenant.fullName}`);
  };

  const updateTenant = (id: string, update: Partial<Tenant>) => {
    setTenants(prev => prev.map(t => t.id === id ? { ...t, ...update } : t));
    addAuditLog('UPDATE_TENANT', 'Tenant', `Updated tenant ${id}`);
  };

  // Leases
  const createLease = (data: Omit<Lease, 'id'>) => {
    const newLease: Lease = {
      ...data,
      id: 'lease_' + Date.now(),
    };
    setLeases(prev => [...prev, newLease]);
    if (newLease.tenantId) {
      updateTenant(newLease.tenantId, { leaseId: newLease.id });
    }
    addAuditLog('CREATE_LEASE', 'Lease', `Created lease for unit ${newLease.unitId}`);
    addNotification({
      roleTarget: 'tenant',
      title: 'New Lease Agreement Ready',
      message: 'Your tenancy agreement has been generated by property management.',
      type: 'lease',
    });
  };

  const updateLeaseStatus = (id: string, status: LeaseStatus) => {
    setLeases(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    addAuditLog('UPDATE_LEASE_STATUS', 'Lease', `Updated lease ${id} status to ${status}`);
  };

  // Invoices & Payments
  const createInvoice = (data: Omit<RentInvoice, 'id' | 'invoiceNumber' | 'createdAt'>) => {
    const newInv: RentInvoice = {
      ...data,
      id: 'inv_' + Date.now(),
      invoiceNumber: 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
    };
    setInvoices(prev => [newInv, ...prev]);
  };

  const recordPayment = (data: Omit<PaymentRecord, 'id' | 'receiptNumber'>) => {
    const newPayment: PaymentRecord = {
      ...data,
      id: 'pay_' + Date.now(),
      receiptNumber: 'REC-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
    };
    setPayments(prev => [newPayment, ...prev]);

    // Update corresponding invoice
    if (newPayment.invoiceId) {
      setInvoices(prev => prev.map(inv => {
        if (inv.id === newPayment.invoiceId) {
          const newPaid = inv.amountPaid + newPayment.amount;
          const newBal = Math.max(0, inv.amountDue - newPaid);
          const newStatus = newBal === 0 ? 'Paid' : newPaid > 0 ? 'Partially Paid' : 'Pending';
          return {
            ...inv,
            amountPaid: newPaid,
            balance: newBal,
            status: newStatus,
          };
        }
        return inv;
      }));
    }

    addAuditLog('RECORD_PAYMENT', 'PaymentRecord', `Recorded payment of KSh ${data.amount.toLocaleString()} via ${data.paymentMethod}`);
    addNotification({
      roleTarget: 'manager',
      title: 'Payment Received',
      message: `Payment of KSh ${data.amount.toLocaleString()} received via ${data.paymentMethod}.`,
      type: 'payment',
    });
  };

  // M-Pesa STK Push Simulation
  const processMpesaPayment = async (
    invoiceId: string,
    phone: string,
    amount: number
  ): Promise<{ success: boolean; mpesaReceipt: string; message: string }> => {
    // Generate realistic Safaricom transaction reference e.g. QKH918231
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'QK';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return new Promise(resolve => {
      setTimeout(() => {
        const inv = invoices.find(i => i.id === invoiceId);
        recordPayment({
          invoiceId,
          organizationId: inv?.organizationId || 'org_makazi_prime',
          tenantId: inv?.tenantId || currentUser.id,
          amount,
          paymentMethod: 'M-Pesa',
          mpesaReceiptNumber: code,
          phoneNumber: phone,
          paymentDate: new Date().toISOString(),
          status: 'Completed',
          notes: `Safaricom M-Pesa STK Push verified. Paybill: 4082200. TransID: ${code}`,
        });

        resolve({
          success: true,
          mpesaReceipt: code,
          message: `Confirmed. KSh ${amount.toLocaleString()} sent to MAKAZI PROPERTIES. M-Pesa Ref: ${code}`,
        });
      }, 2000);
    });
  };

  // Maintenance
  const submitMaintenanceTicket = (data: Omit<MaintenanceTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt'>) => {
    const newTicket: MaintenanceTicket = {
      ...data,
      id: 'maint_' + Date.now(),
      ticketNumber: 'MT-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMaintenanceTickets(prev => [newTicket, ...prev]);
    addAuditLog('SUBMIT_MAINTENANCE', 'MaintenanceTicket', `New ticket: ${newTicket.title}`);
    addNotification({
      roleTarget: 'manager',
      title: 'New Maintenance Request',
      message: `${newTicket.urgency} urgency ticket: "${newTicket.title}"`,
      type: 'maintenance',
    });
  };

  const updateMaintenanceTicket = (id: string, update: Partial<MaintenanceTicket>) => {
    setMaintenanceTickets(prev => prev.map(t => t.id === id ? { ...t, ...update, updatedAt: new Date().toISOString() } : t));
    addAuditLog('UPDATE_MAINTENANCE', 'MaintenanceTicket', `Updated maintenance ticket ${id}`);
  };

  // Viewing
  const requestViewing = (data: Omit<ViewingRequest, 'id' | 'createdAt'>) => {
    const newViewing: ViewingRequest = {
      ...data,
      id: 'view_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setViewingRequests(prev => [newViewing, ...prev]);
    addAuditLog('REQUEST_VIEWING', 'ViewingRequest', `Viewing requested for ${newViewing.preferredDate} by ${newViewing.applicantName}`);
    addNotification({
      roleTarget: 'manager',
      title: 'New Property Viewing Request',
      message: `${newViewing.applicantName} requested viewing for ${newViewing.preferredDate} at ${newViewing.preferredTime}.`,
      type: 'viewing',
    });
  };

  const updateViewingStatus = (id: string, status: ViewingStatus) => {
    setViewingRequests(prev => prev.map(v => v.id === id ? { ...v, status } : v));
    addAuditLog('UPDATE_VIEWING', 'ViewingRequest', `Updated viewing ${id} status to ${status}`);
  };

  // Application
  const submitApplication = (data: Omit<RentalApplication, 'id' | 'createdAt'>) => {
    const newApp: RentalApplication = {
      ...data,
      id: 'app_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setApplications(prev => [newApp, ...prev]);
    addAuditLog('SUBMIT_APPLICATION', 'RentalApplication', `Application submitted by ${newApp.applicantName}`);
    addNotification({
      roleTarget: 'manager',
      title: 'New Rental Application',
      message: `${newApp.applicantName} submitted a rental application.`,
      type: 'application',
    });
  };

  const updateApplicationStatus = (id: string, status: ApplicationStatus, managerNotes?: string) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status, managerNotes: managerNotes || a.managerNotes } : a));
    addAuditLog('UPDATE_APPLICATION', 'RentalApplication', `Updated application ${id} status to ${status}`);
  };

  // Expenses
  const addExpense = (data: Omit<PropertyExpense, 'id'>) => {
    const newExp: PropertyExpense = {
      ...data,
      id: 'exp_' + Date.now(),
    };
    setExpenses(prev => [newExp, ...prev]);
    addAuditLog('ADD_EXPENSE', 'PropertyExpense', `Added expense KSh ${data.amount.toLocaleString()} (${data.category})`);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    addAuditLog('DELETE_EXPENSE', 'PropertyExpense', `Deleted expense ${id}`);
  };

  // Admin moderation & controls
  const moderateProperty = (propertyId: string, status: 'approved' | 'rejected' | 'suspended', reason?: string) => {
    setProperties(prev => prev.map(p => p.id === propertyId ? {
      ...p,
      moderationStatus: status,
      isPublished: status === 'approved',
      rejectionReason: status === 'rejected' ? reason : undefined,
    } : p));
    addAuditLog('MODERATE_PROPERTY', 'Property', `Set status of listing ${propertyId} to ${status}${reason ? ` (${reason})` : ''}`);
    addNotification({
      roleTarget: 'manager',
      title: `Listing Moderation: ${status.toUpperCase()}`,
      message: `Your property listing status has been updated to "${status}".${reason ? ` Reason: ${reason}` : ''}`,
      type: 'system',
    });
  };

  const rejectPropertyWithReason = (propertyId: string, reason: string) => {
    moderateProperty(propertyId, 'rejected', reason);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isVerified: !u.isVerified } : u));
    addAuditLog('TOGGLE_USER_STATUS', 'User', `Toggled verification status of user ${userId}`);
  };

  const toggleUserSuspension = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'suspended' ? 'active' : 'suspended';
        addAuditLog('TOGGLE_USER_SUSPENSION', 'User', `${nextStatus === 'suspended' ? 'Suspended' : 'Reactivated'} account of ${u.name}`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const verifyAgencyOwner = (userId: string, isVerified: boolean) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isVerified } : u));
    addAuditLog('VERIFY_AGENCY_OWNER', 'User', `${isVerified ? 'Verified' : 'Revoked verification badge for'} agency manager ${userId}`);
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: 'user_' + Date.now(),
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [newUser, ...prev]);
    addAuditLog('CREATE_USER', 'User', `Provisioned new account for ${newUser.name} as ${newUser.role}`);
  };

  const updateReportedListingStatus = (id: string, status: 'Open' | 'Investigating' | 'Resolved' | 'Dismissed') => {
    setReportedListings(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    addAuditLog('UPDATE_REPORTED_LISTING', 'ReportedListing', `Updated report ${id} status to ${status}`);
  };

  const updatePlatformSettings = (settingsUpdate: Partial<PlatformSettingData>) => {
    setPlatformSettings(prev => {
      const updated = { ...prev, ...settingsUpdate };
      try {
        localStorage.setItem(STORAGE_KEY_PREFIX + 'platformSettings', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to persist settings', err);
      }
      return updated;
    });
    addAuditLog('UPDATE_PLATFORM_SETTINGS', 'PlatformSettings', `Persisted global platform parameters: ${Object.keys(settingsUpdate).join(', ')}`);
  };

  const broadcastSystemNotice = (targetRole: UserRole | 'all', title: string, message: string) => {
    addNotification({
      roleTarget: targetRole,
      title,
      message,
      type: 'system',
    });
    addAuditLog('SYSTEM_BROADCAST', 'Notification', `Dispatched broadcast to [${targetRole}]: "${title}"`);
  };

  const addLocationBenchmark = (loc: Omit<LocationBenchmark, 'id'>) => {
    const newLoc: LocationBenchmark = {
      ...loc,
      id: 'loc_' + Date.now(),
    };
    setLocationBenchmarks(prev => [...prev, newLoc]);
    addAuditLog('ADD_LOCATION', 'LocationBenchmark', `Added location benchmark for ${newLoc.neighbourhood}, ${newLoc.county}`);
  };

  const updateLocationBenchmark = (id: string, update: Partial<LocationBenchmark>) => {
    setLocationBenchmarks(prev => prev.map(l => l.id === id ? { ...l, ...update } : l));
    addAuditLog('UPDATE_LOCATION', 'LocationBenchmark', `Updated location benchmark ${id}`);
  };

  const deleteLocationBenchmark = (id: string) => {
    setLocationBenchmarks(prev => prev.filter(l => l.id !== id));
    addAuditLog('DELETE_LOCATION', 'LocationBenchmark', `Deleted location benchmark ${id}`);
  };

  const formatKSh = (amount: number) => {
    return 'KSh ' + (amount || 0).toLocaleString('en-KE');
  };

  const resetAllData = () => {
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setCurrentRole('seeker');
    setProperties(INITIAL_PROPERTIES);
    setUnits(INITIAL_UNITS);
    setTenants(INITIAL_TENANTS);
    setLeases(INITIAL_LEASES);
    setInvoices(INITIAL_INVOICES);
    setPayments(INITIAL_PAYMENTS);
    setMaintenanceTickets(INITIAL_MAINTENANCE_TICKETS);
    setViewingRequests(INITIAL_VIEWING_REQUESTS);
    setApplications(INITIAL_APPLICATIONS);
    setExpenses(INITIAL_EXPENSES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setFavourites(['prop_the_aura_kilimani', 'prop_karen_solitude_villa']);
    setReportedListings(INITIAL_REPORTED_LISTINGS);
    setPlatformSettings(INITIAL_PLATFORM_SETTINGS);
    setLocationBenchmarks(INITIAL_LOCATION_BENCHMARKS);
    setCurrentView('home');
    setSelectedPropertyId(null);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        users,
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
        auditLogs,
        favourites,
        reportedListings,
        platformSettings,
        locationBenchmarks,
        currentView,
        selectedPropertyId,
        managerTab,
        tenantTab,
        adminTab,
        setCurrentView,
        setSelectedPropertyId,
        setManagerTab,
        setTenantTab,
        setAdminTab,
        switchRole,
        loginAs,
        logout,
        updateCurrentUser,
        toggleFavourite,
        isFavourite,
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
        createInvoice,
        recordPayment,
        processMpesaPayment,
        submitMaintenanceTicket,
        updateMaintenanceTicket,
        requestViewing,
        updateViewingStatus,
        submitApplication,
        updateApplicationStatus,
        addExpense,
        deleteExpense,
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
        markNotificationAsRead,
        addNotification,
        formatKSh,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
