import { User as SupabaseUser } from '@supabase/supabase-js';
import { User as CustomUser } from '@/lib/platform/types/types';

/**
 * Converts a Supabase User to our custom User type
 * Handles the type mismatch between Supabase's User and our extended User type
 */
export function convertSupabaseUserToCustomUser(
  supabaseUser: SupabaseUser | null
): CustomUser | null {
  if (!supabaseUser) return null;

  const userMetadata = supabaseUser.user_metadata || {};
  const appMetadata = supabaseUser.app_metadata || {};

  // Extract initials from email or name
  const getInitials = (email: string, name?: string): string => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  const customUser: CustomUser = {
    id: supabaseUser.id,
    uid: supabaseUser.id,
    email: supabaseUser.email || '',
    name: userMetadata.name || supabaseUser.email?.split('@')[0] || '',
    displayName:
      userMetadata.displayName || userMetadata.name || supabaseUser.email?.split('@')[0] || '',
    phoneNumber: userMetadata.phoneNumber || supabaseUser.phone,
    avatarUrl: userMetadata.avatarUrl || userMetadata.avatar_url,
    role: appMetadata.role || 'Patient',
    initials: getInitials(supabaseUser.email || '', userMetadata.name),
    createdAt: supabaseUser.created_at,

    // Profile Information
    bio: userMetadata.bio,
    location: userMetadata.location,
    dateOfBirth: userMetadata.dateOfBirth || userMetadata.birthday,
    gender: userMetadata.gender,
    emergencyContact: userMetadata.emergencyContact,

    // Additional Profile Info
    birthday: userMetadata.birthday || userMetadata.dateOfBirth,
    preferences: userMetadata.preferences,

    settings: userMetadata.settings,

    // Therapist-only visible fields
    therapistVisible: userMetadata.therapistVisible,
    therapistNotes: userMetadata.therapistNotes,
    followUpReminders: userMetadata.followUpReminders,

    // Therapist-specific fields
    therapistProfile: userMetadata.therapistProfile,

    // Privacy & Visibility Settings
    profileVisibility: userMetadata.profileVisibility,

    // Account Status
    accountStatus: (supabaseUser.email_confirmed_at
      ? 'active'
      : 'pending') as CustomUser['accountStatus'],
    lastLoginAt: supabaseUser.last_sign_in_at,
    profileCompleteness: userMetadata.profileCompleteness || 0,

    goal: userMetadata.goal,
    personalizationCompleted: userMetadata.personalizationCompleted || false,
    personalization: userMetadata.personalization,

    // User Activity Tracking & Behavioral Data
    activityData: userMetadata.activityData,

    // Personalized Recommendations
    recommendations: userMetadata.recommendations,

    // Personalized Messages & Feedback
    personalizedContent: userMetadata.personalizedContent,
    dashboardWidgets: userMetadata.dashboardWidgets,

    // Subscription Status
    subscriptionType: userMetadata.subscriptionType || 'Free',
    isLoyal: userMetadata.isLoyal || false,
    loyalTier: userMetadata.loyalTier,
    loyalSince: userMetadata.loyalSince,
    loyalExpiresAt: userMetadata.loyalExpiresAt,
    loyalBenefits: userMetadata.loyalBenefits,

    // VIP Status
    isVip: userMetadata.isVip || false,
    vipTier: userMetadata.vipTier,
    vipSince: userMetadata.vipSince,
    vipExpiresAt: userMetadata.vipExpiresAt,
    vipBenefits: userMetadata.vipBenefits,

    // Donation Related
    isDonor: userMetadata.isDonor || false,
    isDonationSeeker: userMetadata.isDonationSeeker || false,
    isDonationSeekerApplicationPending: userMetadata.isDonationSeekerApplicationPending || false,
    totalDonated: userMetadata.totalDonated || 0,
    totalReceived: userMetadata.totalReceived || 0,
    donationSeekerApproved: userMetadata.donationSeekerApproved,
    donationSeekerReason: userMetadata.donationSeekerReason,

    // Loyalty Points
    loyaltyPoints: userMetadata.loyaltyPoints,

    // Relationships
    linkedChildren: userMetadata.linkedChildren,
    linkedParent: userMetadata.linkedParent,
    linkedTherapist: userMetadata.linkedTherapist,

    // Additional metadata
    squareCustomerId: userMetadata.squareCustomerId,
    preferredLanguage: userMetadata.preferredLanguage,
    timezone: userMetadata.timezone,
  };

  return customUser;
}

/**
 * Converts our custom User type to Supabase user metadata format
 * Useful for updating user metadata in Supabase
 */
export function convertCustomUserToMetadata(customUser: Partial<CustomUser>): Record<string, any> {
  const metadata: Record<string, any> = {};

  // Map all custom user fields to metadata
  if (customUser.name !== undefined) metadata.name = customUser.name;
  if (customUser.displayName !== undefined) metadata.displayName = customUser.displayName;
  if (customUser.phoneNumber !== undefined) metadata.phoneNumber = customUser.phoneNumber;
  if (customUser.avatarUrl !== undefined) metadata.avatarUrl = customUser.avatarUrl;
  if (customUser.bio !== undefined) metadata.bio = customUser.bio;
  if (customUser.location !== undefined) metadata.location = customUser.location;
  if (customUser.dateOfBirth !== undefined) metadata.dateOfBirth = customUser.dateOfBirth;
  if (customUser.gender !== undefined) metadata.gender = customUser.gender;
  if (customUser.emergencyContact !== undefined)
    metadata.emergencyContact = customUser.emergencyContact;
  if (customUser.birthday !== undefined) metadata.birthday = customUser.birthday;
  if (customUser.preferences !== undefined) metadata.preferences = customUser.preferences;
  if (customUser.settings !== undefined) metadata.settings = customUser.settings;
  if (customUser.therapistVisible !== undefined)
    metadata.therapistVisible = customUser.therapistVisible;
  if (customUser.therapistNotes !== undefined) metadata.therapistNotes = customUser.therapistNotes;
  if (customUser.followUpReminders !== undefined)
    metadata.followUpReminders = customUser.followUpReminders;
  if (customUser.therapistProfile !== undefined)
    metadata.therapistProfile = customUser.therapistProfile;
  if (customUser.profileVisibility !== undefined)
    metadata.profileVisibility = customUser.profileVisibility;
  if (customUser.profileCompleteness !== undefined)
    metadata.profileCompleteness = customUser.profileCompleteness;
  if (customUser.goal !== undefined) metadata.goal = customUser.goal;
  if (customUser.personalizationCompleted !== undefined)
    metadata.personalizationCompleted = customUser.personalizationCompleted;
  if (customUser.personalization !== undefined)
    metadata.personalization = customUser.personalization;
  if (customUser.activityData !== undefined) metadata.activityData = customUser.activityData;
  if (customUser.recommendations !== undefined)
    metadata.recommendations = customUser.recommendations;
  if (customUser.personalizedContent !== undefined)
    metadata.personalizedContent = customUser.personalizedContent;
  if (customUser.dashboardWidgets !== undefined)
    metadata.dashboardWidgets = customUser.dashboardWidgets;
  if (customUser.subscriptionType !== undefined)
    metadata.subscriptionType = customUser.subscriptionType;
  if (customUser.isLoyal !== undefined) metadata.isLoyal = customUser.isLoyal;
  if (customUser.loyalTier !== undefined) metadata.loyalTier = customUser.loyalTier;
  if (customUser.loyalSince !== undefined) metadata.loyalSince = customUser.loyalSince;
  if (customUser.loyalExpiresAt !== undefined) metadata.loyalExpiresAt = customUser.loyalExpiresAt;
  if (customUser.loyalBenefits !== undefined) metadata.loyalBenefits = customUser.loyalBenefits;
  if (customUser.isVip !== undefined) metadata.isVip = customUser.isVip;
  if (customUser.vipTier !== undefined) metadata.vipTier = customUser.vipTier;
  if (customUser.vipSince !== undefined) metadata.vipSince = customUser.vipSince;
  if (customUser.vipExpiresAt !== undefined) metadata.vipExpiresAt = customUser.vipExpiresAt;
  if (customUser.vipBenefits !== undefined) metadata.vipBenefits = customUser.vipBenefits;
  if (customUser.isDonor !== undefined) metadata.isDonor = customUser.isDonor;
  if (customUser.isDonationSeeker !== undefined)
    metadata.isDonationSeeker = customUser.isDonationSeeker;
  if (customUser.isDonationSeekerApplicationPending !== undefined)
    metadata.isDonationSeekerApplicationPending = customUser.isDonationSeekerApplicationPending;
  if (customUser.totalDonated !== undefined) metadata.totalDonated = customUser.totalDonated;
  if (customUser.totalReceived !== undefined) metadata.totalReceived = customUser.totalReceived;
  if (customUser.donationSeekerApproved !== undefined)
    metadata.donationSeekerApproved = customUser.donationSeekerApproved;
  if (customUser.donationSeekerReason !== undefined)
    metadata.donationSeekerReason = customUser.donationSeekerReason;
  if (customUser.loyaltyPoints !== undefined) metadata.loyaltyPoints = customUser.loyaltyPoints;
  if (customUser.linkedChildren !== undefined) metadata.linkedChildren = customUser.linkedChildren;
  if (customUser.linkedParent !== undefined) metadata.linkedParent = customUser.linkedParent;
  if (customUser.linkedTherapist !== undefined)
    metadata.linkedTherapist = customUser.linkedTherapist;
  if (customUser.squareCustomerId !== undefined)
    metadata.squareCustomerId = customUser.squareCustomerId;
  if (customUser.preferredLanguage !== undefined)
    metadata.preferredLanguage = customUser.preferredLanguage;
  if (customUser.timezone !== undefined) metadata.timezone = customUser.timezone;

  return metadata;
}
