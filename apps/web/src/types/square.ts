/**
 * TypeScript types for Square API integration
 * Based on Square SDK v43.x
 */

export interface SquareConfig {
  accessToken: string;
  environment: 'Production' | 'Sandbox';
  locationId?: string;
}

export interface SquareBooking {
  id: string;
  version?: number;
  status?: 'PENDING' | 'CANCELLED_BY_CUSTOMER' | 'CANCELLED_BY_SELLER' | 'DECLINED' | 'ACCEPTED' | 'NO_SHOW';
  createdAt?: string;
  updatedAt?: string;
  startAt?: string;
  locationId?: string;
  customerId?: string;
  customerNote?: string;
  sellerNote?: string;
  appointmentSegments?: AppointmentSegment[];
  transitionTimeMinutes?: number;
  allDay?: boolean;
  locationType?: 'BUSINESS_LOCATION' | 'CUSTOMER_LOCATION' | 'PHONE' | 'VIDEO';
  creatorDetails?: CreatorDetails;
  source?: 'FIRST_PARTY_MERCHANT' | 'FIRST_PARTY_BUYER' | 'THIRD_PARTY_BUYER' | 'API';
}

export interface AppointmentSegment {
  durationMinutes?: number;
  serviceVariationId?: string;
  teamMemberId?: string;
  serviceVariationVersion?: bigint;
  intermissionMinutes?: number;
  anyTeamMember?: boolean;
  resourceIds?: string[];
}

export interface CreatorDetails {
  creatorType?: 'TEAM_MEMBER' | 'CUSTOMER';
  teamMemberId?: string;
  customerId?: string;
}

export interface SquareCustomer {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  givenName?: string;
  familyName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  referenceId?: string;
  note?: string;
  preferences?: CustomerPreferences;
  creationSource?: 'INSTANT_PROFILE' | 'TERMINAL' | 'THIRD_PARTY' | 'THIRD_PARTY_IMPORT' | 'UNMERGE' | 'MERGE' | 'DIRECTORY' | 'APPOINTMENTS' | 'INVOICES' | 'LOYALTY' | 'MARKETING' | 'MERGE_CUSTOMER' | 'OTHER';
  groupIds?: string[];
  segmentIds?: string[];
  version?: bigint;
  taxIds?: CustomerTaxIds;
}

export interface CustomerPreferences {
  emailUnsubscribed?: boolean;
}

export interface CustomerTaxIds {
  euVat?: string;
}

export interface SquarePayment {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  amountMoney?: Money;
  tipMoney?: Money;
  totalMoney?: Money;
  appFeeMoney?: Money;
  approvedMoney?: Money;
  processingFee?: ProcessingFee[];
  refundedMoney?: Money;
  status?: 'APPROVED' | 'PENDING' | 'COMPLETED' | 'CANCELED' | 'FAILED';
  delayDuration?: string;
  delayAction?: 'CANCEL' | 'COMPLETE';
  delayedUntil?: string;
  sourceType?: 'CARD' | 'BANK_ACCOUNT' | 'WALLET' | 'BUY_NOW_PAY_LATER' | 'CASH' | 'EXTERNAL';
  cardDetails?: CardPaymentDetails;
  cashDetails?: CashPaymentDetails;
  bankAccountDetails?: BankAccountPaymentDetails;
  externalDetails?: ExternalPaymentDetails;
  walletDetails?: DigitalWalletDetails;
  buyNowPayLaterDetails?: BuyNowPayLaterDetails;
  locationId?: string;
  orderId?: string;
  referenceId?: string;
  customerId?: string;
  employeeId?: string;
  teamMemberId?: string;
  refundIds?: string[];
  riskEvaluation?: RiskEvaluation;
  buyerEmailAddress?: string;
  billingAddress?: Address;
  shippingAddress?: Address;
  note?: string;
  statementDescriptionIdentifier?: string;
  capabilities?: ('EDIT_TIP' | 'EDIT_AMOUNT')[];
  receiptNumber?: string;
  receiptUrl?: string;
  deviceDetails?: DeviceDetails;
  applicationDetails?: ApplicationDetails;
  versionToken?: string;
}

export interface Money {
  amount?: bigint;
  currency?: string;
}

export interface ProcessingFee {
  effectiveAt?: string;
  type?: string;
  amountMoney?: Money;
}

export interface CardPaymentDetails {
  status?: string;
  card?: Card;
  entryMethod?: string;
  cvvStatus?: string;
  avsStatus?: string;
  authResultCode?: string;
  applicationIdentifier?: string;
  applicationName?: string;
  applicationCryptogram?: string;
  verificationMethod?: string;
  verificationResults?: string;
  statementDescription?: string;
  deviceDetails?: DeviceDetails;
  cardPaymentTimeline?: CardPaymentTimeline;
  refundRequiresCardPresence?: boolean;
  errors?: Error[];
}

export interface Card {
  id?: string;
  cardBrand?: string;
  last4?: string;
  expMonth?: bigint;
  expYear?: bigint;
  cardholderName?: string;
  billingAddress?: Address;
  fingerprint?: string;
  cardType?: string;
  prepaidType?: string;
  bin?: string;
}

export interface Address {
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  locality?: string;
  sublocality?: string;
  sublocality2?: string;
  sublocality3?: string;
  administrativeDistrictLevel1?: string;
  administrativeDistrictLevel2?: string;
  administrativeDistrictLevel3?: string;
  postalCode?: string;
  country?: string;
  firstName?: string;
  lastName?: string;
}

export interface DeviceDetails {
  deviceId?: string;
  deviceInstallationId?: string;
  deviceName?: string;
}

export interface CardPaymentTimeline {
  authorizedAt?: string;
  capturedAt?: string;
  voidedAt?: string;
}

export interface CashPaymentDetails {
  buyerSuppliedMoney?: Money;
  changeBackMoney?: Money;
}

export interface BankAccountPaymentDetails {
  bankName?: string;
  transferType?: string;
  accountOwnershipType?: string;
  fingerprint?: string;
  country?: string;
  statementDescription?: string;
  achDetails?: ACHDetails;
  errors?: Error[];
}

export interface ACHDetails {
  routingNumber?: string;
  accountNumberSuffix?: string;
  accountType?: string;
}

export interface ExternalPaymentDetails {
  type?: string;
  source?: string;
  sourceId?: string;
  sourceFeeMoney?: Money;
}

export interface DigitalWalletDetails {
  status?: string;
  brand?: string;
  cashAppDetails?: CashAppDetails;
}

export interface CashAppDetails {
  buyerFullName?: string;
  buyerCountryCode?: string;
  buyerCashtag?: string;
}

export interface BuyNowPayLaterDetails {
  brand?: string;
  afterpayDetails?: AfterPayDetails;
  clearpayDetails?: ClearPayDetails;
}

export interface AfterPayDetails {
  emailAddress?: string;
}

export interface ClearPayDetails {
  emailAddress?: string;
}

export interface RiskEvaluation {
  createdAt?: string;
  riskLevel?: 'PENDING' | 'NORMAL' | 'MODERATE' | 'HIGH';
}

export interface ApplicationDetails {
  squareProduct?: string;
  applicationId?: string;
}

export interface Error {
  category?: string;
  code?: string;
  detail?: string;
  field?: string;
}

export interface SquareLocation {
  id?: string;
  name?: string;
  address?: Address;
  timezone?: string;
  capabilities?: string[];
  status?: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  merchantId?: string;
  country?: string;
  languageCode?: string;
  currency?: string;
  phoneNumber?: string;
  businessName?: string;
  type?: 'PHYSICAL' | 'MOBILE';
  websiteUrl?: string;
  businessHours?: BusinessHours;
  businessEmail?: string;
  description?: string;
  twitterUsername?: string;
  instagramUsername?: string;
  facebookUrl?: string;
  coordinates?: Coordinates;
  logoUrl?: string;
  posBackgroundUrl?: string;
  mcc?: string;
  fullFormatLogoUrl?: string;
  taxIds?: TaxIds;
}

export interface BusinessHours {
  periods?: BusinessHoursPeriod[];
}

export interface BusinessHoursPeriod {
  dayOfWeek?: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
  startLocalTime?: string;
  endLocalTime?: string;
}

export interface Coordinates {
  latitude?: number;
  longitude?: number;
}

export interface TaxIds {
  euVat?: string;
  frSiret?: string;
  frNaf?: string;
  esNif?: string;
}

export interface SquareCatalogItem {
  id?: string;
  type?: 'ITEM' | 'IMAGE' | 'CATEGORY' | 'ITEM_VARIATION' | 'TAX' | 'DISCOUNT' | 'MODIFIER_LIST' | 'MODIFIER' | 'PRICING_RULE' | 'PRODUCT_SET' | 'TIME_PERIOD' | 'MEASUREMENT_UNIT' | 'SUBSCRIPTION_PLAN' | 'ITEM_OPTION' | 'ITEM_OPTION_VAL' | 'CUSTOM_ATTRIBUTE_DEFINITION' | 'QUICK_AMOUNTS_SETTINGS';
  updatedAt?: string;
  version?: bigint;
  isDeleted?: boolean;
  customAttributeValues?: Record<string, CustomAttributeValue>;
  catalogV1Ids?: CatalogV1Id[];
  presentAtAllLocations?: boolean;
  presentAtLocationIds?: string[];
  absentAtLocationIds?: string[];
  itemData?: CatalogItem;
}

export interface CustomAttributeValue {
  name?: string;
  stringValue?: string;
  customAttributeDefinitionId?: string;
  type?: string;
  numberValue?: string;
  booleanValue?: boolean;
  selectionUidValues?: string[];
  key?: string;
}

export interface CatalogV1Id {
  catalogV1Id?: string;
  locationId?: string;
}

export interface CatalogItem {
  name?: string;
  description?: string;
  abbreviation?: string;
  labelColor?: string;
  availableOnline?: boolean;
  availableForPickup?: boolean;
  availableElectronically?: boolean;
  categoryId?: string;
  taxIds?: string[];
  modifierListInfo?: CatalogItemModifierListInfo[];
  variations?: CatalogObject[];
  productType?: 'REGULAR' | 'GIFT_CARD' | 'APPOINTMENTS_SERVICE' | 'RETAIL' | 'RESTAURANT';
  skipModifierScreen?: boolean;
  itemOptions?: CatalogItemOptionForItem[];
  imageIds?: string[];
  sortName?: string;
  descriptionHtml?: string;
  descriptionPlaintext?: string;
}

export interface CatalogItemModifierListInfo {
  modifierListId?: string;
  modifierOverrides?: CatalogModifierOverride[];
  minSelectedModifiers?: number;
  maxSelectedModifiers?: number;
  enabled?: boolean;
}

export interface CatalogModifierOverride {
  modifierId?: string;
  onByDefault?: boolean;
}

export interface CatalogObject {
  type?: string;
  id?: string;
  updatedAt?: string;
  version?: bigint;
  isDeleted?: boolean;
  customAttributeValues?: Record<string, CustomAttributeValue>;
  catalogV1Ids?: CatalogV1Id[];
}

export interface CatalogItemOptionForItem {
  itemOptionId?: string;
}

export interface SquareWebhookEvent {
  merchantId?: string;
  locationId?: string;
  type?: string;
  eventId?: string;
  createdAt?: string;
  data?: {
    type?: string;
    id?: string;
    object?: any;
  };
}

export interface CreateBookingRequest {
  idempotencyKey: string;
  booking: {
    startAt?: string;
    locationId?: string;
    customerId?: string;
    customerNote?: string;
    sellerNote?: string;
    appointmentSegments?: AppointmentSegment[];
  };
}

export interface UpdateBookingRequest {
  idempotencyKey?: string;
  booking: Partial<SquareBooking>;
}

export interface CancelBookingRequest {
  idempotencyKey?: string;
  bookingVersion?: number;
}

export interface CreatePaymentRequest {
  sourceId: string;
  idempotencyKey: string;
  amountMoney: Money;
  tipMoney?: Money;
  appFeeMoney?: Money;
  delayDuration?: string;
  delayAction?: 'CANCEL' | 'COMPLETE';
  autocomplete?: boolean;
  orderId?: string;
  customerId?: string;
  locationId?: string;
  teamMemberId?: string;
  referenceId?: string;
  verificationToken?: string;
  acceptPartialAuthorization?: boolean;
  buyerEmailAddress?: string;
  billingAddress?: Address;
  shippingAddress?: Address;
  note?: string;
  statementDescriptionIdentifier?: string;
  cashDetails?: CashPaymentDetails;
  externalDetails?: ExternalPaymentDetails;
}

export interface SearchCustomersRequest {
  cursor?: string;
  limit?: bigint;
  query?: {
    filter?: {
      creationSource?: {
        values?: string[];
        rule?: 'INCLUDE' | 'EXCLUDE';
      };
      createdAt?: {
        startAt?: string;
        endAt?: string;
      };
      updatedAt?: {
        startAt?: string;
        endAt?: string;
      };
      emailAddress?: {
        exact?: string;
        fuzzy?: string;
      };
      phoneNumber?: {
        exact?: string;
        fuzzy?: string;
      };
      referenceId?: {
        exact?: string;
        fuzzy?: string;
      };
      groupIds?: {
        all?: string[];
        any?: string[];
        none?: string[];
      };
      customAttribute?: Record<string, any>;
      segmentIds?: {
        all?: string[];
        any?: string[];
        none?: string[];
      };
    };
    sort?: {
      field?: 'DEFAULT' | 'CREATED_AT' | 'UPDATED_AT';
      order?: 'ASC' | 'DESC';
    };
  };
}

export interface ListBookingsRequest {
  limit?: number;
  cursor?: string;
  customerId?: string;
  teamMemberId?: string;
  locationId?: string;
  startAtMin?: string;
  startAtMax?: string;
}

export interface NormalizedBooking {
  id: string;
  userId: string | null;
  therapistId: string | null;
  date: string;
  status: string;
  source: 'square';
  locationId: string | null;
  serviceName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  durationMinutes: number | null;
  raw: any;
}
