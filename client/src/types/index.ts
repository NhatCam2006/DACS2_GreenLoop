export type UserRole = "DONOR" | "COLLECTOR" | "ADMIN";

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  points: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  street: string;
  ward?: string;
  district?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  source: "MANUAL" | "GEOCODED";
  isPrimary: boolean;
  manualAddress?: ManualAddress;
  createdAt: string;
  updatedAt: string;
}

export interface ManualAddress {
  id: string;
  addressId: string;
  note?: string;
  placeHints?: string;
  contactName?: string;
}

export interface WasteCategory {
  id: string;
  name: string;
  description?: string;
  pointsPerKg: number;
  isActive: boolean;
  iconUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type DonationStatus = "PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED";

export interface DonationRequest {
  id: string;
  donorId: string;
  donor?: Partial<User>;
  wasteCategoryId: string;
  wasteCategory?: WasteCategory;
  estimatedWeight: number;
  actualWeight?: number;
  status: DonationStatus;
  imageUrls: string[];
  addressId: string;
  address?: Address;
  notes?: string;
  preferredDate?: string;
  collection?: Collection;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  donationRequestId: string;
  collectorId: string;
  collector?: Partial<User>;
  collectedAt?: string;
  verificationNotes?: string;
  verificationImages: string[];
  verificationCode?: string;
  pointsAwarded?: number;
  createdAt: string;
  updatedAt: string;
}

export type TransactionType = "EARN" | "REDEEM";

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  relatedId?: string;
  createdAt: string;
}

export interface Reward {
  id: string;
  name: string;
  description?: string;
  pointsCost: number;
  imageUrl?: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType =
  | "DONATION_ACCEPTED"
  | "DONATION_COMPLETED"
  | "REWARD_REDEEMED"
  | "POINTS_EARNED"
  | "SYSTEM";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  relatedId?: string;
  createdAt: string;
}

// API Response types
export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  error: string;
}
