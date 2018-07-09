interface UserUpdate {
  walletId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  tagline?: string;
  taglineStatus?: boolean;
  userSearchable?: boolean;
  status?: string;
  verificationService?: string;
  verificationStatus?: string;
  verificationReference?: string;
  investorClassification?: string;
}
