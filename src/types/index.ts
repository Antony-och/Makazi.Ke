/**
 * MAKAZI Platform Types
 * Roles: Seeker, Property Owner/Manager, Tenant, Platform Admin
 */

export type UserRole = 'seeker' | 'manager' | 'tenant' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  organizationId?: string;
  avatar?: string;
  nationalId?: string;
  isVerified?: boolean;
  status?: 'active' | 'suspended';
  agencyName?: string;
  kraPin?: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  type: 'Property Owner' | 'Real Estate Agency' | 'Property Management Firm';
  phone: string;
  email: string;
  address: string;
  city: string;
  county: string;
  logo?: string;
  isVerified: boolean;
  registrationNumber?: string;
  kraPin?: string;
  createdAt: string;
}

export type PropertyType = 
  | 'Apartment'
  | 'Bedsitter'
  | 'Studio'
  | 'House'
  | 'Villa'
  | 'Townhouse'
  | 'Commercial';

export type FurnishingStatus = 'unfurnished' | 'semi-furnished' | 'furnished';

export interface Property {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  county: string;
  city: string;
  neighbourhood: string;
  estate: string;
  address: string;
  baseRent: number; // in KSh
  securityDeposit: number; // in KSh
  bedrooms: number;
  bathrooms: number;
  sizeSqFt?: number;
  furnishing: FurnishingStatus;
  parkingSlots: number;
  amenities: string[];
  images: string[];
  featuredImage: string;
  isFeatured: boolean;
  isPublished: boolean;
  moderationStatus: 'approved' | 'pending' | 'rejected' | 'suspended';
  titleDeedNumber?: string;
  moderationNotes?: string;
  rejectionReason?: string;
  isReported?: boolean;
  reportedReason?: string;
  managerName: string;
  managerPhone: string;
  managerEmail: string;
  createdAt: string;
}

export type UnitStatus = 'Vacant' | 'Occupied' | 'Reserved' | 'Under Maintenance' | 'Unavailable';

export interface PropertyUnit {
  id: string;
  propertyId: string;
  unitNumber: string;
  floor?: string;
  rentAmount: number; // KSh
  depositAmount: number; // KSh
  bedrooms: number;
  bathrooms: number;
  status: UnitStatus;
  currentTenantId?: string;
  activeLeaseId?: string;
}

export interface Tenant {
  id: string;
  userId: string;
  organizationId: string;
  fullName: string;
  email: string;
  phone: string;
  idNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  assignedPropertyId: string;
  assignedUnitId: string;
  leaseId?: string;
  moveInDate: string;
  notes?: string;
  outstandingBalance: number; // KSh
}

export type LeaseStatus = 
  | 'Draft'
  | 'Pending Signature'
  | 'Active'
  | 'Expiring Soon'
  | 'Expired'
  | 'Terminated';

export interface Lease {
  id: string;
  organizationId: string;
  propertyId: string;
  unitId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  rentAmount: number; // KSh
  depositAmount: number; // KSh
  rentDueDay: number; // Day of month (e.g. 5th)
  paymentFrequency: 'Monthly' | 'Quarterly' | 'Biannual' | 'Annual';
  agreementUrl?: string;
  signatureStatus: 'Signed' | 'Pending' | 'Draft';
  status: LeaseStatus;
}

export type InvoiceStatus = 'Paid' | 'Partially Paid' | 'Pending' | 'Overdue' | 'Failed' | 'Refunded';

export interface RentInvoice {
  id: string;
  invoiceNumber: string;
  organizationId: string;
  propertyId: string;
  unitId: string;
  tenantId: string;
  leaseId: string;
  period: string; // e.g. "November 2026"
  amountDue: number; // KSh
  amountPaid: number; // KSh
  balance: number; // KSh
  dueDate: string;
  status: InvoiceStatus;
  createdAt: string;
}

export type PaymentMethod = 'M-Pesa' | 'Bank Transfer' | 'Card' | 'Manual';

export interface PaymentRecord {
  id: string;
  receiptNumber: string;
  invoiceId: string;
  organizationId: string;
  tenantId: string;
  amount: number; // KSh
  paymentMethod: PaymentMethod;
  mpesaReceiptNumber?: string;
  phoneNumber?: string;
  paymentDate: string;
  status: 'Completed' | 'Pending' | 'Failed';
  notes?: string;
}

export type MaintenanceUrgency = 'Low' | 'Medium' | 'High' | 'Emergency';
export type MaintenanceStatus = 'Open' | 'Acknowledged' | 'In Progress' | 'Awaiting Parts' | 'Resolved' | 'Closed';
export type MaintenanceCategory = 'Plumbing' | 'Electrical' | 'Carpentry' | 'Painting' | 'Appliances' | 'Security' | 'General';

export interface MaintenanceTicket {
  id: string;
  ticketNumber: string;
  organizationId: string;
  propertyId: string;
  unitId: string;
  tenantId: string;
  title: string;
  category: MaintenanceCategory;
  description: string;
  urgency: MaintenanceUrgency;
  status: MaintenanceStatus;
  photoUrl?: string;
  assignedContractor?: string;
  internalNotes?: string;
  estimatedCost?: number;
  actualCost?: number;
  createdAt: string;
  updatedAt: string;
}

export type ViewingStatus = 'Submitted' | 'Confirmed' | 'Rescheduled' | 'Completed' | 'Cancelled' | 'Rejected';

export interface ViewingRequest {
  id: string;
  propertyId: string;
  unitId?: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  status: ViewingStatus;
  createdAt: string;
}

export type ApplicationStatus = 'Submitted' | 'Under Review' | 'More Information Required' | 'Approved' | 'Rejected' | 'Withdrawn';

export interface RentalApplication {
  id: string;
  propertyId: string;
  unitId?: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  employmentStatus: string;
  employer: string;
  monthlyIncome: number; // KSh
  preferredMoveInDate: string;
  occupantsCount: number;
  nationalIdNumber: string;
  additionalNotes?: string;
  status: ApplicationStatus;
  managerNotes?: string;
  createdAt: string;
}

export interface PropertyExpense {
  id: string;
  organizationId: string;
  propertyId: string;
  category: 'Repairs' | 'Security' | 'Cleaning' | 'Water' | 'Electricity' | 'Management' | 'Insurance' | 'Taxes' | 'Other';
  description: string;
  amount: number; // KSh
  expenseDate: string;
  vendor?: string;
  receiptNumber?: string;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  roleTarget: UserRole | 'all';
  title: string;
  message: string;
  type: 'rent' | 'payment' | 'maintenance' | 'application' | 'viewing' | 'lease' | 'system';
  read: boolean;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entity: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface ReportedListingItem {
  id: string;
  propertyId: string;
  propertyTitle: string;
  reporterName: string;
  reporterEmail: string;
  reason: 'Duplicate Listing' | 'Incorrect Pricing / Rent Fraud' | 'Landlord Impersonation' | 'Misleading Photos' | 'Unavailable Property';
  details: string;
  status: 'Open' | 'Investigating' | 'Resolved' | 'Dismissed';
  createdAt: string;
}

export interface PlatformSettingData {
  platformName: string;
  platformTagline: string;
  defaultCurrency: string;
  timezone: string;
  supportPhysicalAddress: string;
  commissionRatePercent: number;
  mpesaEnvironment: 'sandbox' | 'production';
  mpesaPaybill: string;
  b2cAccount: string;
  stkPushTimeoutSeconds: number;
  allowPartialPayments: boolean;
  latePaymentGraceDays: number;
  latePaymentPenaltyPercent: number;
  instantReceiptGeneration: boolean;
  requireLandlordVerification: boolean;
  enforceTenantIdUpload: boolean;
  autoApproveVerifiedAgencies: boolean;
  enableTwoFactorAuth: boolean;
  platformMaintenanceMode: boolean;
  maintenanceModeNotice: string;
  supportEmergencyPhone: string;
  supportEmail: string;
  enableSmsAlerts: boolean;
  enableEmailAlerts: boolean;
  enableWhatsAppAlerts: boolean;
  rentReminderDaysBefore: number;
  maxPhotosPerListing: number;
  maxDepositMonths: number;
  watermarkListingPhotos: boolean;

  // Expanded Enterprise & Kenyan Statutory Settings
  kraPin: string;
  etimsVatPercent: number;
  withholdingTaxPercent: number;
  etimsAutomaticInvoicing: boolean;
  smsSenderId: string;
  smsGatewayProvider: 'africastalking' | 'advanta' | 'safaricom_direct';
  sessionTimeoutMinutes: number;
  passwordMinLength: number;
  maxLoginAttempts: number;
  leasePrefix: string;
  autoArchiveExpiredListingsDays: number;
  minTenantCreditScore: number;
  kycDocumentRetentionYears: number;
  dataProtectionOfficerEmail: string;
  enableArdhisasaLandVerification: boolean;
  disputeResolutionWindowDays: number;
}

export interface LocationBenchmark {
  id: string;
  county: string;
  neighbourhood: string;
  isPrime: boolean;
  averageRent2Bed: number;
  totalListingsCount: number;
  status: 'active' | 'inactive';
}
