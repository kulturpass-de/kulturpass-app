/* eslint-disable max-len */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/**
 * Address
 * Request body fields required and optional to operate on address data. The DTO is in XML or .json format
 */
export interface Address {
  /** Cellphone number */
  cellphone?: string
  /** Company Name */
  companyName?: string
  /** Country where address is located */
  country?: Country
  /** Boolean flag if address is default */
  defaultAddress?: boolean
  /** District name */
  district?: string
  /** Email address */
  email?: string
  /** First name of the address person */
  firstName: string
  /** Boolean flag if address is formatted */
  formattedAddress?: string
  /** Unique id value of the address which is optional while creating new address. While performing other address operations this value is the key */
  id?: string
  /** Last name of the address person */
  lastName: string
  /** First line of the address */
  line1: string
  /** Second line of the address */
  line2?: string
  /** Phone number */
  phone?: string
  /** Postal code of the address */
  postalCode: string
  /** Region where address belongs to */
  region?: Region
  /** Boolean flag if address is for shipping */
  shippingAddress?: boolean
  /** Title of the address person */
  title?: string
  /** Code of the title */
  titleCode: string
  /** Town, field required */
  town: string
  /** Boolean flag if address is visible in the Address Book */
  visibleInAddressBook?: boolean
}

/**
 * AddressList
 * Representation of an Address list
 */
export interface AddressList {
  /** List of addresses */
  addresses?: Address[]
}

/**
 * AddressValidation
 * Representation of an Address Validation
 */
export interface AddressValidation {
  /** Decision */
  decision?: string
  /** List of errors */
  errors?: ErrorList
  /** List of suggested addresses */
  suggestedAddresses?: Address[]
}

/** Assessment */
export interface Assessment {
  code?: string
  label?: string
  response?: string
  type?: string
}

/** Assessments */
export interface Assessments {
  assessments?: Assessment[]
}

/** Balance */
export interface Balance {
  /** Representation of a Price */
  availableBalance?: Price
  /** Representation of a Price */
  grantedBalance?: Price
  hasEntitlement?: boolean
  /** Representation of a Price */
  reservedBalance?: Price
}

/**
 * BaseOption
 * Representation of a Base Option
 */
export interface BaseOption {
  /** List of all variant options */
  options?: VariantOption[]
  /** Variant option selected */
  selected?: VariantOption
  /** Variant type of base option */
  variantType?: string
}

/**
 * BaseSite
 * Representation of a Base Site
 */
export interface BaseSite {
  /** Channel */
  channel?: string
  /** Default language for Basesite */
  defaultLanguage?: Language
  /** Default preview catalog id */
  defaultPreviewCatalogId?: string
  /** Default preview category code */
  defaultPreviewCategoryCode?: string
  /** Default preview product code */
  defaultPreviewProductCode?: string
  /** Locale data for Basesite */
  locale?: string
  /** Name of Basesite */
  name?: string
  /** List of Basestores */
  stores?: BaseStore[]
  /** Theme of Basesite */
  theme?: string
  /** Unique identifier of Basesite */
  uid?: string
  /** List of url encoding attributes */
  urlEncodingAttributes?: string[]
  /** List of url patterns */
  urlPatterns?: string[]
}

/**
 * BaseSiteList
 * Representation of a Base Site List
 */
export interface BaseSiteList {
  /** List of basesites */
  baseSites?: BaseSite[]
}

/**
 * BaseStore
 * Representation of a Base Store
 */
export interface BaseStore {
  /** Create return process code */
  createReturnProcessCode?: string
  /** List of currencies */
  currencies?: Currency[]
  /** Default currency */
  defaultCurrency?: Currency
  /** Point of service being default delivery origin */
  defaultDeliveryOrigin?: PointOfService
  /** Default language */
  defaultLanguage?: Language
  /** List of delivery countries */
  deliveryCountries?: Country[]
  /** List of delivery modes */
  deliveryModes?: DeliveryModeList
  /** Flag specifying whether the express checkout option is enabled */
  expressCheckoutEnabled?: boolean
  /** Flag defining is external tax is enabled */
  externalTaxEnabled?: boolean
  /** List of languages */
  languages?: Language[]
  /**
   * Maximum radius for searching point of service
   * @format double
   */
  maxRadiusForPosSearch?: number
  /** Base store name */
  name?: string
  /** Payment provider */
  paymentProvider?: string
  /** List of points of service */
  pointsOfService?: PointOfService[]
  /** Submit order process code */
  submitOrderProcessCode?: string
}

/**
 * Breadcrumb
 * Representation of a Breadcrumb
 */
export interface Breadcrumb {
  /** Code of the facet */
  facetCode?: string
  /** Name of the facet */
  facetName?: string
  /** Value code of the facet */
  facetValueCode?: string
  /** Value name of the facet */
  facetValueName?: string
  /** Remove query */
  removeQuery?: SearchState
  /** Truncate query */
  truncateQuery?: SearchState
}

/**
 * CancellationRequestEntryInput
 * Representation of a cancellation request entry input for an order
 */
export interface CancellationRequestEntryInput {
  /**
   * Order entry number of the cancelled product
   * @format int32
   * @example 1
   */
  orderEntryNumber: number
  /**
   * Quantity of the product which belongs to the order entry and is requested to be cancelled
   * @format int64
   * @example 5
   */
  quantity: number
}

/**
 * CancellationRequestEntryInputList
 * Representation of a cancellation request entry input list for an order
 */
export interface CancellationRequestEntryInputList {
  /** Cancellation request entry inputs which contain information about the order entries which are requested to be cancelled */
  cancellationRequestEntryInputs: CancellationRequestEntryInput[]
}

/**
 * CardType
 * Representation of a Card Type
 */
export interface CardType {
  /** Card type code */
  code?: string
  /** Card type name */
  name?: string
}

/**
 * CardTypeList
 * Representation of a Card Type List
 */
export interface CardTypeList {
  /** List of card types */
  cardTypes?: CardType[]
}

/**
 * Cart
 * Representation of a Cart
 */
export interface Cart {
  /** List of applied order promotions */
  appliedOrderPromotions?: PromotionResult[]
  /** List of applied product promotions */
  appliedProductPromotions?: PromotionResult[]
  /** List of applied vouchers */
  appliedVouchers?: Voucher[]
  /** Flag showing if order is calculated */
  calculated?: boolean
  /** Code number of order */
  code?: string
  /** Delivery address */
  deliveryAddress?: Address
  /** Delivery cost */
  deliveryCost?: Price
  /**
   * Quantity of delivery items
   * @format int64
   */
  deliveryItemsQuantity?: number
  /** Delivery mode information */
  deliveryMode?: DeliveryMode
  /** List of delivery order entries group */
  deliveryOrderGroups?: DeliveryOrderEntryGroup[]
  /** Description of the cart */
  description?: string
  /** List of order entries */
  entries?: OrderEntry[]
  /** List of entry groups */
  entryGroups?: EntryGroup[]
  /**
   * Date of cart expiration time
   * @format date-time
   */
  expirationTime?: string
  /** Guest user id identifier */
  guid?: string
  /** Name of the cart */
  name?: string
  /** Flag stating iv value is net-value */
  net?: boolean
  /** Order discounts */
  orderDiscounts?: Price
  /** Payment information */
  paymentInfo?: PaymentDetails
  /**
   * Quantity of pickup items
   * @format int64
   */
  pickupItemsQuantity?: number
  /** List of pickup order entry group */
  pickupOrderGroups?: PickupOrderEntryGroup[]
  /** List of potential order promotions for cart */
  potentialOrderPromotions?: PromotionResult[]
  /** List of potential product promotions for cart */
  potentialProductPromotions?: PromotionResult[]
  /** Product discounts */
  productDiscounts?: Price
  /**
   * Date of saving cart
   * @format date-time
   */
  saveTime?: string
  /** Information about person who saved cart */
  savedBy?: Principal
  /** Site */
  site?: string
  /** Store */
  store?: string
  /** Subtotal price */
  subTotal?: Price
  /** Total discounts */
  totalDiscounts?: Price
  /** @format int32 */
  totalItems?: number
  /** Total price value */
  totalPrice?: Price
  /** Total price with tax */
  totalPriceWithTax?: Price
  /** Total tax price */
  totalTax?: Price
  /**
   * Total unit count
   * @format int32
   */
  totalUnitCount?: number
  /** User information */
  user?: Principal
}

/**
 * CartList
 * Representation of a Cart list
 */
export interface CartList {
  /** List of carts */
  carts?: Cart[]
}

/**
 * CartModification
 * Representation of a Cart modification
 */
export interface CartModification {
  /** Delivery mode changed */
  deliveryModeChanged?: boolean
  /** Order entry */
  entry?: OrderEntry
  /**
   * Final quantity after cart modification
   * @format int64
   */
  quantity?: number
  /**
   * Quantity added with cart modification
   * @format int64
   */
  quantityAdded?: number
  /** Status code of cart modification */
  statusCode?: string
  /** Status message */
  statusMessage?: string
}

/**
 * CartModificationList
 * Representation of a Cart modification list
 */
export interface CartModificationList {
  /** List of cart modifications */
  cartModifications?: CartModification[]
}

/**
 * Catalog
 * Representation of an Catalog
 */
export interface Catalog {
  /** List of versions of catalog */
  catalogVersions?: CatalogVersion[]
  /** Identifier of abstract catalog item */
  id?: string
  /**
   * Date of last modification
   * @format date-time
   */
  lastModified?: string
  /** Name of abstract catalog item */
  name?: string
  /** Url address of abstract catalog item */
  url?: string
}

/**
 * CatalogList
 * Representation of a Catalog List
 */
export interface CatalogList {
  /** List of catalog items */
  catalogs?: Catalog[]
}

/**
 * CatalogVersion
 * Representation of a Catalog Version
 */
export interface CatalogVersion {
  /** List of category hierarchies */
  categories?: CategoryHierarchy[]
  /** Identifier of abstract catalog item */
  id?: string
  /**
   * Date of last modification
   * @format date-time
   */
  lastModified?: string
  /** Name of abstract catalog item */
  name?: string
  /** Url address of abstract catalog item */
  url?: string
}

/**
 * Category
 * Representation of a Category
 */
export interface Category {
  /** Code of the category */
  code?: string
  /** Category image */
  image?: Image
  /** Name of the category */
  name?: string
  /** URL of the category */
  url?: string
}

/**
 * CategoryHierarchy
 * Representation of a Category Hierarchy
 */
export interface CategoryHierarchy {
  /** Identifier of abstract catalog item */
  id?: string
  /**
   * Date of last modification
   * @format date-time
   */
  lastModified?: string
  /** Name of abstract catalog item */
  name?: string
  /** List of subcategory hierarchies */
  subcategories?: CategoryHierarchy[]
  /** Url address of abstract catalog item */
  url?: string
}

/**
 * CategoryList
 * Representation of a Category List
 */
export interface CategoryList {
  /** List of categories */
  categories?: Category[]
}

/**
 * Classification
 * Representation of a Classification
 */
export interface Classification {
  /** Code of the classification */
  code?: string
  /** List of features for given classification */
  features?: Feature[]
  /** Name of the classification */
  name?: string
}

/** ComponentAdaptedData */
export type ComponentAdaptedData = object

/** ComponentIDList */
export interface ComponentIDList {
  idList?: string[]
}

/**
 * ConfigurationInfo
 * Representation of a Configuration Info
 */
export interface ConfigurationInfo {
  /** Label of configuration info */
  configurationLabel?: string
  /** Value of configuration info */
  configurationValue?: string
  /** Type of configuration info */
  configuratorType?: string
  /** Status of configuration info */
  status?: string
}

/**
 * Consent
 * Representation of a Consent
 */
export interface Consent {
  /** Code of consent */
  code?: string
  /**
   * Date of consenting
   * @format date-time
   */
  consentGivenDate?: string
  /**
   * Consent withdrawn date
   * @format date-time
   */
  consentWithdrawnDate?: string
}

/**
 * ConsentTemplate
 * Representation of a Consent Template
 */
export interface ConsentTemplate {
  /** Current consent */
  currentConsent?: Consent
  /** Consent template description */
  description?: string
  /** Consent template identifier */
  id?: string
  /** Consent template name */
  name?: string
  /**
   * Consent template version
   * @format int32
   */
  version?: number
}

/**
 * ConsentTemplateList
 * Representation of a Consent Template List
 */
export interface ConsentTemplateList {
  /** List of consent templates */
  consentTemplates?: ConsentTemplate[]
}

/**
 * Consignment
 * Representation of a Consignment
 */
export interface Consignment {
  /** Indicates if the order can be evaluated by the customer */
  canEvaluate?: boolean
  /** Indicates if the customer can write a message */
  canWriteMessage?: boolean
  /** Consignment code */
  code?: string
  /** Indicates if the customer has been debited */
  customerDebited?: boolean
  /** Delivery point of service */
  deliveryPointOfService?: PointOfService
  /** All the documents available on the order */
  documents?: Document[]
  /** List of consignment entries */
  entries?: ConsignmentEntry[]
  /** Order's state */
  marketplaceStatus?: string
  /** Reason's label of the order state */
  marketplaceStatusLabel?: string
  /** Shipping address */
  shippingAddress?: Address
  /** Label of shipping's type */
  shippingModeLabel?: string
  /** Consignment status */
  status?: string
  /**
   * Consignment status date
   * @format date-time
   */
  statusDate?: string
  /** Consignment status display */
  statusDisplay?: string
  /** Consignment tracking identifier */
  trackingID?: string
}

/**
 * ConsignmentEntry
 * Representation of a Consignment Entry
 */
export interface ConsignmentEntry {
  /** Indicate if an incident can be opened on the order line */
  canOpenIncident?: boolean
  /** The consignment code */
  consignmentCode?: string
  /** The mirakl order line's identifier */
  miraklOrderLineId?: string
  /** Order line's state */
  miraklOrderLineStatus?: string
  /** Reason's label of the order line's state */
  miraklOrderLineStatusLabel?: string
  /** Order entry of Consignment entry */
  orderEntry?: OrderEntry
  /**
   * Quantity value of Consignment entry
   * @format int64
   */
  quantity?: number
  /**
   * Shipped quantity
   * @format int64
   */
  shippedQuantity?: number
}

/**
 * Country
 * Response body fields which will be returned while fetching the list of countries. The DTO is in XML or .json format
 */
export interface Country {
  /** Country code in iso format */
  isocode?: string
  /** Name of the country */
  name?: string
}

/**
 * CountryList
 * List of countries
 */
export interface CountryList {
  /** This is the list of Country fields that should be returned in the response body */
  countries?: Country[]
}

/**
 * Currency
 * Representation of a Currency
 */
export interface Currency {
  /** Boolean flag whether currency is active */
  active?: boolean
  /** Code of the currency in iso format */
  isocode?: string
  /** Name of the currency */
  name?: string
  /** Symbol of the currency */
  symbol?: string
}

/**
 * CurrencyList
 * Representation of a Currency List
 */
export interface CurrencyList {
  /** List of currencies */
  currencies?: Currency[]
}

/**
 * DeliveryMode
 * Representation of a Delivery mode
 */
export interface DeliveryMode {
  /** Code of the delivery mode */
  code?: string
  /** Cost of the delivery */
  deliveryCost?: Price
  /** Description of the delivery mode */
  description?: string
  /** Name of the delivery mode */
  name?: string
}

/**
 * DeliveryModeList
 * Representation of a Delivery mode list
 */
export interface DeliveryModeList {
  /** List of delivery modes */
  deliveryModes?: DeliveryMode[]
}

/**
 * DeliveryOrderEntryGroup
 * Representation of a Delivery Order Entry Group
 */
export interface DeliveryOrderEntryGroup {
  /** The available shipping options */
  availableShippingOptions?: DeliveryMode[]
  /** Delivery address for order entry group */
  deliveryAddress?: Address
  /** List of order entries */
  entries?: OrderEntry[]
  /**
   * The lead time to shop
   * @format int32
   */
  leadTimeToShip?: number
  /**
   * Quantity of order entries in a group
   * @format int64
   */
  quantity?: number
  /** The selected shipping options */
  selectedShippingOption?: DeliveryMode
  /** The shop identifier */
  shopId?: string
  /** The shop name */
  shopName?: string
  /** Total price with tax */
  totalPriceWithTax?: Price
}

/** Document */
export interface Document {
  code?: string
  /** @format date-time */
  dateUploaded?: string
  fileName?: string
  /** @format int64 */
  fileSize?: number
  type?: string
}

/**
 * EntryGroup
 * Representation of an Entry Group
 */
export interface EntryGroup {
  /** List of order entries */
  entries?: OrderEntry[]
  /**
   * Identifier of the entry group
   * @format int32
   * @example 1
   */
  entryGroupNumber?: number
  /** List of child entry groups */
  entryGroups?: EntryGroup[]
  /**
   * Indicates if the entry group is in an error state
   * @example true
   */
  erroneous?: boolean
  /**
   * Label for the entry group
   * @example "Photo On The Go Package"
   */
  label?: string
  /**
   * Indicates type of the group, possible values are STANDALONE, CONFIGURABLEBUNDLE or any customer implemented type for any new provider
   * @example "STANDALONE"
   */
  type?: string
}

/** Evaluation */
export interface Evaluation {
  assessments?: Assessment[]
  comment?: string
  /** @format date-time */
  date?: string
  firstName?: string
  /** @format int32 */
  grade?: number
  lastName?: string
}

/** EvaluationPage */
export interface EvaluationPage {
  /** @format int32 */
  evaluationPageCount?: number
  evaluations?: Evaluation[]
}

/**
 * Facet
 * Representation of a Facet
 */
export interface Facet {
  /** Flag stating if facet is category facet */
  category?: boolean
  /** Flag stating if facet is multiSelect */
  multiSelect?: boolean
  /** Name of the facet */
  name?: string
  /**
   * Priority value of the facet
   * @format int32
   */
  priority?: number
  /** List of top facet values */
  topValues?: FacetValue[]
  /** List of all facet values */
  values?: FacetValue[]
  /** Flag stating if facet is visible */
  visible?: boolean
}

/**
 * FacetValue
 * Representation of a Facet Value
 */
export interface FacetValue {
  /**
   * Count of the facet value
   * @format int64
   */
  count?: number
  /** Name of the facet value */
  name?: string
  /** Query of the facet value */
  query?: SearchState
  /** Flag stating if facet value is selected */
  selected?: boolean
}

/**
 * Feature
 * Representation of a Feature
 */
export interface Feature {
  /** Code of the feature */
  code?: string
  /** Flag defining it feature is comparable */
  comparable?: boolean
  /** Description of the feature */
  description?: string
  /** Feature unit */
  featureUnit?: FeatureUnit
  /** List of feature values */
  featureValues?: FeatureValue[]
  /** Name of the feature */
  name?: string
  /** Range number of the feature */
  range?: boolean
  /** Type of the feature */
  type?: string
}

/**
 * FeatureUnit
 * Representation of a Feature Unit
 */
export interface FeatureUnit {
  /** Name of the feature unit */
  name?: string
  /** Symbol of the feature unit */
  symbol?: string
  /** Type of the feature unit */
  unitType?: string
}

/**
 * FeatureValue
 * Representation of a Feature Value
 */
export interface FeatureValue {
  /** Value of the feature */
  value?: string
}

/**
 * FutureStock
 * Representation of a Future Stock
 */
export interface FutureStock {
  /**
   * Date of future stock
   * @format date-time
   * @example "2056-12-31T09:00:00+0000"
   */
  date?: string
  /**
   * Date of future stock expressed in text value
   * @example "31/12/2056"
   */
  formattedDate?: string
  /** Stock information of future stock */
  stock?: Stock
}

/**
 * GeoPoint
 * Representation of a GeoPoint
 */
export interface GeoPoint {
  /**
   * Geopoint latitude
   * @format double
   */
  latitude?: number
  /**
   * Geopoint longitude
   * @format double
   */
  longitude?: number
}

/**
 * Image
 * Representation of an Image
 */
export interface Image {
  /** Tooltip content which is visible while image mouse hovering */
  altText?: string
  /** Format of the image, can be zoom, product, thumbnail, store, cartIcon, etc. */
  format?: string
  /**
   * Index of the image while displayed in gallery
   * @format int32
   */
  galleryIndex?: number
  /** Type of the image, can be PRIMARY or GALLERY */
  imageType?: 'PRIMARY' | 'GALLERY'
  /** URL address of the image */
  url?: string
}

/**
 * Language
 * Representation of a Language
 */
export interface Language {
  /** true/false indicator when the language is active */
  active?: boolean
  /** iso code of the language */
  isocode?: string
  /** name of the language */
  name?: string
  /** name the language in native form */
  nativeName?: string
}

/**
 * LanguageList
 * Lists all available languages (all languages used for a particular store). If the list of languages for a base store is empty, a list of all languages available in the system will be returned
 */
export interface LanguageList {
  /** This is the list of Language fields that should be returned in the response body */
  languages?: Language[]
}

/** ListAdaptedComponents */
export interface ListAdaptedComponents {
  component?: ComponentAdaptedData[]
  /** Pagination info */
  pagination?: Pagination
  sorts?: Sort[]
}

/** ListAdaptedPages */
export interface ListAdaptedPages {
  page?: PageAdaptedData[]
  /** Pagination info */
  pagination?: Pagination
  sorts?: Sort[]
}

/**
 * MemberList
 * Representation of a Member List
 */
export interface MemberList {
  /** List of member */
  members?: Principal[]
}

/** MiraklThreadCreated */
export interface MiraklThreadCreated {
  /** @format uuid */
  messageId?: string
  /** @format uuid */
  threadId?: string
}

/** MiraklThreadReplyCreated */
export interface MiraklThreadReplyCreated {
  /** @format uuid */
  messageId?: string
  /** @format uuid */
  threadId?: string
}

/** Offer */
export interface Offer {
  /** @format date-time */
  availableEndDate?: string
  /** @format date-time */
  availableStartDate?: string
  code?: string
  description?: string
  /** @format date-time */
  discountEndDate?: string
  /** Representation of a Price */
  discountPrice?: Price
  /** @format date-time */
  discountStartDate?: string
  id?: string
  /** @format int32 */
  leadTimeToShip?: number
  /** @format int32 */
  maxOrderQuantity?: number
  /** @format int32 */
  minOrderQuantity?: number
  /** Representation of a Price */
  minShippingPrice?: Price
  /** Representation of a Price */
  minShippingPriceAdditional?: Price
  /** Representation of a Price */
  originPrice?: Price
  /** @format int32 */
  packageQuantity?: number
  /** Representation of a Price */
  price?: Price
  priceAdditionalInfo?: string
  productCode?: string
  /** @format int32 */
  quantity?: number
  shopAddress?: ShopAddress
  /** @format double */
  shopDistance?: number
  /** @format int32 */
  shopEvaluationCount?: number
  /** @format double */
  shopGrade?: number
  shopId?: string
  shopName?: string
  stateLabel?: string
  /** Representation of a Price */
  totalPrice?: Price
  volumeOriginPrices?: Price[]
  volumePrices?: Price[]
  /** Shop accessibility */
  accessibilityWheelchairShop?: boolean
  accessibilityToiletShop?: boolean
  accessibilityOffer?: string
  accessibilityOfferOthers?: string
}

/** OfferList */
export interface OfferList {
  offers?: Offer[]
}

/** OfferOverview */
export interface OfferOverview {
  allOfferPricingsJSON?: string
  code?: string
  /** @format int32 */
  minPurchasableQty?: number
  /** Representation of a Price */
  minShippingPrice?: Price
  /** Representation of a Price */
  originPrice?: Price
  /** Representation of a Price */
  price?: Price
  /** @format int32 */
  quantity?: number
  /** @format double */
  shopGrade?: number
  shopId?: string
  shopName?: string
  stateCode?: string
  /** Representation of a Price */
  totalPrice?: Price
}

/** OfferStateSummary */
export interface OfferStateSummary {
  /** Representation of a Price */
  minPrice?: Price
  /** @format int64 */
  offerCount?: number
  stateCode?: string
  stateLabel?: string
}

/** OffersSummary */
export interface OffersSummary {
  bestOffer?: OfferOverview
  /** @format int32 */
  offerCount?: number
  states?: OfferStateSummary[]
}

/**
 * OpeningSchedule
 * Representation of an Opening schedule
 */
export interface OpeningSchedule {
  /** Code of the opening schedule */
  code?: string
  /** Name of the opening schedule */
  name?: string
  /** List of special opening days */
  specialDayOpeningList?: SpecialOpeningDay[]
  /** List of weekday opening days */
  weekDayOpeningList?: WeekdayOpeningDay[]
}

/**
 * Order
 * Representation of an Order
 */
export interface Order {
  /** List of applied order promotions */
  appliedOrderPromotions?: PromotionResult[]
  /** List of applied product promotions */
  appliedProductPromotions?: PromotionResult[]
  /** List of applied vouchers */
  appliedVouchers?: Voucher[]
  /** Flag showing if order is calculated */
  calculated?: boolean
  /**
   * Boolean flag showing if order is cancellable
   * @example true
   */
  cancellable?: boolean
  /** Code number of order */
  code?: string
  /** List of consignment */
  consignments?: Consignment[]
  /**
   * Date of order creation
   * @format date-time
   */
  created?: string
  /** Delivery address */
  deliveryAddress?: Address
  /** Delivery cost */
  deliveryCost?: Price
  /**
   * Quantity of delivery items
   * @format int64
   */
  deliveryItemsQuantity?: number
  /** Delivery mode information */
  deliveryMode?: DeliveryMode
  /** List of delivery order entries group */
  deliveryOrderGroups?: DeliveryOrderEntryGroup[]
  /** Order delivery status */
  deliveryStatus?: string
  /** Order delivery status display */
  deliveryStatusDisplay?: string
  /** List of order entries */
  entries?: OrderEntry[]
  /** List of entry groups */
  entryGroups?: EntryGroup[]
  /** Flag showing if customer is Guest customer */
  guestCustomer?: boolean
  /** Guest user id identifier */
  guid?: string
  /** Flag stating iv value is net-value */
  net?: boolean
  /** Order discounts */
  orderDiscounts?: Price
  /** Payment information */
  paymentInfo?: PaymentDetails
  /**
   * Quantity of pickup items
   * @format int64
   */
  pickupItemsQuantity?: number
  /** List of pickup order entry group */
  pickupOrderGroups?: PickupOrderEntryGroup[]
  /** Product discounts */
  productDiscounts?: Price
  /**
   * Boolean flag showing if order is returnable
   * @example true
   */
  returnable?: boolean
  /** Site */
  site?: string
  /** Status of order */
  status?: string
  /** Status display */
  statusDisplay?: string
  /** Store */
  store?: string
  /** Subtotal price */
  subTotal?: Price
  /** Total discounts */
  totalDiscounts?: Price
  /** @format int32 */
  totalItems?: number
  /** Total price value */
  totalPrice?: Price
  /** Total price value */
  total?: Price
  /** Total price with tax */
  totalPriceWithTax?: Price
  /** Total tax price */
  totalTax?: Price
  /** Refund */
  refunds?: Refunds
  /** List of unconsigned order entries */
  unconsignedEntries?: OrderEntry[]
  /** User information */
  user?: Principal
}

/**
 * Refunds
 * Representation of Refunds
 */
export interface Refunds {
  refundAmount: Price
  totalWithoutRefunds: Price
}

/**
 * OrderEntry
 * Representation of an Order entry
 */
export interface OrderEntry {
  barcodeData?: string
  barcodeDisplayType?: string
  /** Base price of order entry item */
  basePrice?: Price
  /**
   * Quantity number of cancellable items in order entry
   * @format int64
   * @example 5
   */
  cancellableQuantity?: number
  /** Total price of cancelled items which belong to the order entry item */
  cancelledItemsPrice?: Price
  /** Configuration info of order entry */
  configurationInfos?: ConfigurationInfo[]
  /** Delivery mode */
  deliveryMode?: DeliveryMode
  /** Point of service associated with order entry */
  deliveryPointOfService?: PointOfService
  deliveryScenario?: string
  /**
   * Entry number of the order entry
   * @format int32
   */
  entryNumber?: number
  /** Selected Shipping Code */
  lineShippingCode?: string
  /** Selected Shipping Label */
  lineShippingLabel?: string
  /**
   * Total Line Shipping Price
   * @format double
   */
  lineShippingPrice?: number
  /** Identifier of the offer */
  offerId?: string
  /** Product details of order entry */
  product?: Product
  /**
   * Quantity number of items in order entry
   * @format int64
   */
  quantity?: number
  /**
   * Quantity number of returnable items in order entry
   * @format int64
   * @example 5
   */
  returnableQuantity?: number
  /** Total price of returned items which belong to the order entry item */
  returnedItemsPrice?: Price
  shopAddress?: ShopAddress
  /** Identifier of the shop which proposes the offer */
  shopId?: string
  /** Name of the shop which proposes the offer */
  shopName?: string
  /** List of aggregated status information per entry, relevant if the entry is configurable and its configuration contains one or many issues in different severities. Note that configurators typically raise such issues only in case the parent document is changeable. In this case the issues (depending on their severity) need to be fixed before a checkout can be done. This means this segment can be present for a cart entry, for order entries it will always be empty */
  statusSummaryList?: StatusSummary[]
  /** Total price of order entry item */
  totalPrice?: Price
  /** Flag defining if order entry item is updateable */
  updateable?: boolean
  voucherCode?: string
  voucherIsValid?: boolean
  voucherRedemptionUrl?: string
  voucherValidTo?: string
}

/**
 * OrderEntryList
 * Representation of an Order entry list consumed
 */
export interface OrderEntryList {
  /** List of order entries */
  orderEntries?: OrderEntry[]
}

/**
 * OrderHistory
 * Representation of an Order History
 */
export interface OrderHistory {
  /** Code of Order History */
  code?: string
  entries?: OrderEntry[]
  /** Guest user identifier */
  guid?: string
  /**
   * Date of placing order
   * @format date-time
   */
  placed?: string
  /** Status of Order History */
  status?: string
  /** Status display */
  statusDisplay?: string
  /** Total price */
  total?: Price
}

/**
 * OrderHistoryList
 * Representation of an Order History List
 */
export interface OrderHistoryList {
  /** List of order history items */
  orders?: OrderHistory[]
  /** Pagination items */
  pagination?: DeprecatedPagination
  /** List of sorts */
  sorts?: Sort[]
}

/**
 * OrderStatusUpdateElement
 * Representation of an Order Status Update Element
 */
export interface OrderStatusUpdateElement {
  /** BaseSite identifier */
  baseSiteId?: string
  /** Code of update element of order status */
  code?: string
  /** Status of update element */
  status?: string
}

/**
 * OrderStatusUpdateElementList
 * Representation of an Order Status Update Element List
 */
export interface OrderStatusUpdateElementList {
  /** List of order status update elements */
  orderStatusUpdateElements?: OrderStatusUpdateElement[]
}

/** PageAdaptedData */
export type PageAdaptedData = object

/**
 * PaymentDetails
 * Representation of a Payment Details
 */
export interface PaymentDetails {
  /** Name of account holder */
  accountHolderName?: string
  /** Address details to be considered as billing address */
  billingAddress?: Address
  /** Payment card number */
  cardNumber?: string
  /** Type of payment card */
  cardType?: CardType
  /** Flag to mark if payment the default one */
  defaultPayment?: boolean
  /** Month of expiration of payment */
  expiryMonth?: string
  /** Year of expiration of payment */
  expiryYear?: string
  /** Unique identifier of payment detail */
  id?: string
  /** Issue number */
  issueNumber?: string
  /** Flag to mark if payment is saved one */
  saved?: boolean
  /** Start month from which payment is valid */
  startMonth?: string
  /** Start year from which payment is valid */
  startYear?: string
  /** Identifier of subscription */
  subscriptionId?: string
}

/**
 * PaymentDetailsList
 * Representation of a Payment details list
 */
export interface PaymentDetailsList {
  /** List of payment details */
  payments?: PaymentDetails[]
}

/**
 * PaymentMode
 * Representation of a Payment Mode
 */
export interface PaymentMode {
  /** Payment mode code */
  code?: string
  /** Payment mode description */
  description?: string
  /** Payment mode name */
  name?: string
}

/**
 * PaymentModeList
 * Representation of a Payment Mode List
 */
export interface PaymentModeList {
  /** List of payment modes */
  paymentModes?: PaymentMode[]
}

/** PaymentRequest */
export interface PaymentRequest {
  mappingLabels?: Record<string, string>
  parameters?: Record<string, string>
  postUrl?: string
}

/**
 * PickupOrderEntryGroup
 * Representation of a Pickup Order Entry Group
 */
export interface PickupOrderEntryGroup {
  /** Delivery point of service */
  deliveryPointOfService?: PointOfService
  /**
   * Distance calculated to pickup place
   * @format double
   */
  distance?: number
  /** List of order entries */
  entries?: OrderEntry[]
  /**
   * Quantity of order entries in a group
   * @format int64
   */
  quantity?: number
  /** Total price with tax */
  totalPriceWithTax?: Price
}

/**
 * PointOfService
 * Representation of a Point of service
 */
export interface PointOfService {
  /** Address information of point of service */
  address?: Address
  /** Description of the point of service */
  description?: string
  /** Display name of the point of service */
  displayName?: string
  /**
   * Distance to the point of service as number value
   * @format double
   */
  distanceKm?: number
  /** List of features for a given point of service */
  features?: Record<string, string>
  /** Distance to the point of service as text value */
  formattedDistance?: string
  /** Geopoint localization info about point of service */
  geoPoint?: GeoPoint
  /** Image associated with the point of service */
  mapIcon?: Image
  /** Name of the point of service */
  name?: string
  /** Opening hours of point of service */
  openingHours?: OpeningSchedule
  /** Store content of given point of service */
  storeContent?: string
  /** Collection of images associated with a point of service */
  storeImages?: Image[]
  /** Url address of the point of service */
  url?: string
}

/**
 * PointOfServiceList
 * Representation of a Point of Service List
 */
export interface PointOfServiceList {
  /** List of points of service */
  pointOfServices?: PointOfService[]
}

/**
 * PointOfServiceStock
 * Representation of a Point Of Service Stock
 */
export interface PointOfServiceStock {
  /** Address information of point of service */
  address?: Address
  /** Description of the point of service */
  description?: string
  /** Display name of the point of service */
  displayName?: string
  /**
   * Distance to the point of service as number value
   * @format double
   */
  distanceKm?: number
  /** List of features for a given point of service */
  features?: Record<string, string>
  /** Distance to the point of service as text value */
  formattedDistance?: string
  /** Geopoint localization info about point of service */
  geoPoint?: GeoPoint
  /** Image associated with the point of service */
  mapIcon?: Image
  /** Name of the point of service */
  name?: string
  /** Opening hours of point of service */
  openingHours?: OpeningSchedule
  /** Stock information about point of service */
  stockInfo?: Stock
  /** Store content of given point of service */
  storeContent?: string
  /** Collection of images associated with a point of service */
  storeImages?: Image[]
  /** Url address of the point of service */
  url?: string
}

/**
 * Price
 * Representation of a Price
 */
export interface Price {
  /** Currency iso format */
  currencyIso?: string
  /** Value of price formatted */
  formattedValue?: string
  /**
   * Maximum quantity of the price value
   * @format int64
   */
  maxQuantity?: number
  /**
   * Minimum quantity of the price value
   * @format int64
   */
  minQuantity?: number
  /** Type of the price */
  priceType?: 'BUY' | 'FROM'
  /** Value of price in BigDecimal format */
  value?: number
}

/**
 * PriceRange
 * Representation of a Price Range
 */
export interface PriceRange {
  /** Maximum value of the Price Range */
  maxPrice?: Price
  /** Minium value of the Price Range */
  minPrice?: Price
}

/**
 * Principal
 * Representation of a Principal webservice DTO used for defining User data types
 */
export interface Principal {
  /** Name of the user */
  name?: string
  /** Unique user identifier */
  uid?: string
}

/**
 * FavouritesItem
 * Representation of a FavouritesItem
 */
export interface FavouritesItem {
  product: Product
  /** The Cart identifier of the wishlist cart */
  cartId: string
  /** The entry number of the product in the wishlist cart */
  entryNumber: number
}

/**
 * Product
 * Representation of a Product
 */
export interface Product {
  /** Flag defining if product is available for pickup */
  availableForPickup?: boolean
  /**
   * Rating number of average value
   * @format double
   */
  averageRating?: number
  /** List of base options related to the product */
  baseOptions?: BaseOption[]
  /** Information about base product */
  baseProduct?: string
  /** List of categories product belongs to */
  categories?: Category[]
  /** List of classifications related to the product */
  classifications?: Classification[]
  /** Code of the product */
  code?: string
  /** Flag stating if product is configurable */
  configurable?: boolean
  /** Configurator type related to the product */
  configuratorType?: string
  /** Description of the product */
  description?: string
  /** @format date-time */
  eventEndDate?: string
  /** @format date-time */
  eventStartDate?: string
  /** List of future stocks */
  futureStocks?: FutureStock[]
  /** List of images linked to product */
  images?: Image[]
  /** The type of product */
  itemType?:
    | 'AudioProduct'
    | 'VideoProduct'
    | 'BookProduct'
    | 'SheetMusicProduct'
    | 'StagedEventProduct'
    | 'ExhibitProduct'
    | 'CinemaProduct'
    | 'MusicInstrumentProduct'
  leafCategoryName?: string
  /** @format double */
  lowestOfferPrice?: number
  /** Data of product manufacturer */
  manufacturer?: string
  /** Flag stating if product is multidimensional */
  multidimensional?: boolean
  /** Name of the product */
  name?: string
  /**
   * Number of reviews associated with the product
   * @format int32
   */
  numberOfReviews?: number
  /** @format int32 */
  offerCount?: number
  offers?: Offer[]
  /** Offers summary for this product */
  offersSummary?: OffersSummary
  /** List of potential promotions related to the product */
  potentialPromotions?: Promotion[]
  /** Price of the product */
  price?: Price
  /** Price range assigned to the product */
  priceRange?: PriceRange
  /** List of product references */
  productReferences?: ProductReference[]
  /** Flag defining if product is purchasable */
  purchasable?: boolean
  /** List of reviews associated with the product */
  reviews?: Review[]
  /** @format double */
  shopDistance?: number
  /** Stock value of the product */
  stock?: Stock
  /** Product summary */
  summary?: string
  /** Tags associated with the product */
  tags?: string[]
  topCategoryName?: string
  /** Url address of the product */
  url?: string
  /** List of variant matrixes associated with the product */
  variantMatrix?: VariantMatrixElement[]
  /** List of variant options related to the product */
  variantOptions?: VariantOption[]
  /** Variant type of the product */
  variantType?: string
  /** The name of the location of the event - populated only for stagedEvent and exhibit products */
  venueName?: string
  /** List of volume prices */
  volumePrices?: Price[]
  /** Flag stating if volume price should be displayed */
  volumePricesFlag?: boolean
  /** Name of the seller of the offer (if offer count = 1) */
  seller?: string
}

/**
 * ProductExpressUpdateElement
 * Representation of a Product Express Update Element
 */
export interface ProductExpressUpdateElement {
  /** Catalog identifier */
  catalogId?: string
  /** Catalog version */
  catalogVersion?: string
  /** Code of product express update element */
  code?: string
}

/**
 * ProductExpressUpdateElementList
 * Representation of a Product Express Update Element List
 */
export interface ProductExpressUpdateElementList {
  /** List of product express update element */
  productExpressUpdateElements?: ProductExpressUpdateElement[]
}

/**
 * ProductFutureStocks
 * Representation of a Product Future Stocks
 */
export interface ProductFutureStocks {
  /** List of future stocks */
  futureStocks?: FutureStock[]
  /**
   * Product identifier
   * @example 3318057
   */
  productCode?: string
}

/**
 * ProductFutureStocksList
 * Representation of a Product Future Stocks List
 */
export interface ProductFutureStocksList {
  /** List of product future stocks */
  productFutureStocks?: ProductFutureStocks[]
}

/**
 * ProductList
 * Representation of a Product List
 */
export interface ProductList {
  /** Catalog of product list */
  catalog?: string
  /**
   * Number of current page
   * @format int32
   */
  currentPage?: number
  /** List of products */
  products?: Product[]
  /**
   * Total page count
   * @format int32
   */
  totalPageCount?: number
  /**
   * Total product count
   * @format int32
   */
  totalProductCount?: number
  /** Version of product list */
  version?: string
}

/**
 * ProductReference
 * Representation of a Product Reference
 */
export interface ProductReference {
  /** Reference description */
  description?: string
  /** Flag stating if product reference is preselected */
  preselected?: boolean
  /**
   * Reference quantity
   * @format int32
   */
  quantity?: number
  /** Reference type */
  referenceType?: string
  /** Target product */
  target?: Product
}

/**
 * ProductReferenceList
 * Representation of a Product Reference List
 */
export interface ProductReferenceList {
  /** List of product references */
  references?: ProductReference[]
}

/**
 * ProductSearchPage
 * Representation of a Product Search Page
 */
export interface ProductSearchPage {
  /** List of breadcrumbs info */
  breadcrumbs?: Breadcrumb[]
  /** Code of category */
  categoryCode?: string
  /** Current query */
  currentQuery?: SearchState
  /** List of facets */
  facets?: Facet[]
  /** Free text search */
  freeTextSearch?: string
  /** Redirect url address keyword */
  keywordRedirectUrl?: string
  /** Pagination number */
  pagination?: DeprecatedPagination
  /** List of products */
  products?: Product[]
  /** List of sorts */
  sorts?: Sort[]
  /** Spelling suggestion */
  spellingSuggestion?: SpellingSuggestion
}

/**
 * Promotion
 * Representation of a Promotion
 */
export interface Promotion {
  /** Code of the promotion */
  code?: string
  /** Message about promotion which is displayed when planning potential promotion. This field has higher priority over promotion description */
  couldFireMessages?: string[]
  /** Description of the promotion */
  description?: string
  /** Boolean flag if promotion is enabled */
  enabled?: boolean
  /**
   * Last date of validity of the promotion
   * @format date-time
   */
  endDate?: string
  /** Message fired while the promotion is active. This is info how much you will get when applying the promotion */
  firedMessages?: string[]
  /**
   * Priority index as numeric value of the promotion. Higher number means higher priority
   * @format int32
   */
  priority?: number
  /** Image banner of the promotion */
  productBanner?: Image
  /** Group of the promotion */
  promotionGroup?: string
  /** Type of the promotion */
  promotionType?: string
  /** List of promotion restrictions */
  restrictions?: PromotionRestriction[]
  /**
   * The initial date of the promotion
   * @format date-time
   */
  startDate?: string
  /** Promotion title */
  title?: string
}

/**
 * PromotionList
 * Representation of a Promotion list
 */
export interface PromotionList {
  /** List of promotions */
  promotions?: Promotion[]
}

/**
 * PromotionOrderEntryConsumed
 * Representation of a Promotion order entry consumed
 */
export interface PromotionOrderEntryConsumed {
  /**
   * Adjusted unit price for promotion order entry
   * @format double
   */
  adjustedUnitPrice?: number
  /** Order entry code */
  code?: string
  /**
   * Order entry number
   * @format int32
   */
  orderEntryNumber?: number
  /**
   * Quantity of promotion order entry
   * @format int64
   */
  quantity?: number
}

/**
 * PromotionRestriction
 * Representation of a Promotion Restriction
 */
export interface PromotionRestriction {
  /** Description of the promotion restriction */
  description?: string
  /** Type of the promotion restriction */
  restrictionType?: string
}

/**
 * PromotionResult
 * Representation of a Promotion result
 */
export interface PromotionResult {
  /** List of promotion order entries consumed */
  consumedEntries?: PromotionOrderEntryConsumed[]
  /** Description of promotion result */
  description?: string
  /** Promotion information for given promotion result */
  promotion?: Promotion
}

/**
 * PromotionResultList
 * Representation of a Promotion result list
 */
export interface PromotionResultList {
  /** List of promotion results */
  promotions?: PromotionResult[]
}

/** Reason */
export interface Reason {
  code?: string
  label?: string
}

/** ReasonList */
export interface ReasonList {
  reasons?: Reason[]
}

/**
 * Region
 * Response body fields which will be returned while fetching the list of country's regions.
 */
export interface Region {
  /** Country code in iso format */
  countryIso?: string
  /** Country and Region code in iso format */
  isocode?: string
  /** Region code in short iso form */
  isocodeShort?: string
  /** Name of the region */
  name?: string
}

/**
 * RegionList
 * List of Regions
 */
export interface RegionList {
  /** This is the list of Region fields that should be returned in the response body */
  regions?: Region[]
}

/**
 * ResetPassword
 * Representation of a Reset Password
 */
export interface ResetPassword {
  /** new password string which is required to complete process of resetting password */
  newPassword: string
  /** token value which will be generated as unique string that will be sent with email to allow user for completing reset-password operation */
  token: string
}

/**
 * ReturnRequest
 * Representation of a return request for an order
 */
export interface ReturnRequest {
  /**
   * Boolean flag for whether the return request is cancellable
   * @example true
   */
  cancellable?: boolean
  /**
   * Return request code
   * @example "00000001"
   */
  code?: string
  /**
   * Date of the return request creation
   * @format date-time
   * @example "2020-12-31T09:00:00+0000"
   */
  creationTime?: string
  /** Delivery cost */
  deliveryCost?: Price
  /** Order related to the return request */
  order?: Order
  /**
   * Boolean flag for whether there is a delivery cost for refund
   * @example false
   */
  refundDeliveryCost?: boolean
  /** Entries of the return request which contains information about the returned product */
  returnEntries?: ReturnRequestEntry[]
  /** URL of the return label */
  returnLabelDownloadUrl?: string
  /**
   * Return merchandise authorization number
   * @example "00000001"
   */
  rma?: string
  /** Status of return request */
  status?: string
  /** Subtotal price */
  subTotal?: Price
  /** Total price */
  totalPrice?: Price
}

/**
 * ReturnRequestEntry
 * Representation of a return request entry which contains information about the returned product
 */
export interface ReturnRequestEntry {
  /**
   * Quantity which is expected to be returned for this return request entry
   * @format int64
   * @example 5
   */
  expectedQuantity?: number
  /** Order entry related to the return request entry */
  orderEntry?: OrderEntry
  /** Refund amount of the entry */
  refundAmount?: Price
}

/**
 * ReturnRequestEntryInput
 * Representation of a return request entry input for an order
 */
export interface ReturnRequestEntryInput {
  /**
   * Order entry number of the returned product
   * @format int32
   * @example 1
   */
  orderEntryNumber: number
  /**
   * Quantity of the product which belongs to the order entry and is requested to be returned
   * @format int64
   * @example 5
   */
  quantity: number
}

/**
 * ReturnRequestEntryInputList
 * Representation of a return request entry input list for an order
 */
export interface ReturnRequestEntryInputList {
  /**
   * Code of the order which return request is related to
   * @example "00000001"
   */
  orderCode: string
  /** Return request entry inputs which contain information about the order entries which are requested to be returned */
  returnRequestEntryInputs: ReturnRequestEntryInput[]
}

/**
 * ReturnRequestList
 * Representation of an Order Return Request List
 */
export interface ReturnRequestList {
  /** Pagination items */
  pagination?: DeprecatedPagination
  /** List of order return requests */
  returnRequests?: ReturnRequest[]
  /** List of sorts */
  sorts?: Sort[]
}

/**
 * ReturnRequestModification
 * Representation of modifications for a return request
 */
export interface ReturnRequestModification {
  /** Status of the return request */
  status?: 'CANCELLING'
}

/**
 * Review
 * Representation of a Review
 */
export interface Review {
  /** Alias name for the review */
  alias?: string
  /** Review comment */
  comment?: string
  /**
   * Date of the review
   * @format date-time
   */
  date?: string
  /** Review headline */
  headline?: string
  /** Identifier of review */
  id?: string
  /** Person related to the review */
  principal?: User
  /**
   * Review rating value
   * @format double
   */
  rating?: number
}

/**
 * ReviewList
 * Representation of a Review List
 */
export interface ReviewList {
  /** List of reviews */
  reviews?: Review[]
}

/**
 * SaveCartResult
 * Representation of a Save Cart Result
 */
export interface SaveCartResult {
  /** Cart data information for saved cart */
  savedCartData?: Cart
}

/**
 * SearchQuery
 * Representation of a Search Query
 */
export interface SearchQuery {
  /** Value of search query */
  value?: string
}

/**
 * SearchState
 * Representation of a Search State
 */
export interface SearchState {
  /** Query of search state */
  query?: SearchQuery
  /** Url address of search state */
  url?: string
}

/** Shop */
export interface Shop {
  /** @format int64 */
  approvalDelay?: number
  /** @format double */
  approvalRate?: number
  availableShippingOptions?: DeliveryMode[]
  banner?: string
  description?: string
  /** @format int32 */
  evaluationCount?: number
  /** @format double */
  grade?: number
  id?: string
  logo?: string
  name?: string
  offersPageUrl?: string
  premium?: boolean
  /** @format date-time */
  registrationDate?: string
  returnPolicy?: string
  shippingCountry?: string
}

/** ShopAddress */
export interface ShopAddress {
  city?: string
  countryIso?: string
  /** @format double */
  latitude?: number
  /** @format double */
  longitude?: number
  postalCode?: string
  street?: string
}

/**
 * Sort
 * Representation a Sort option
 */
export interface Sort {
  /** Code of Sort */
  code?: string
  /** Name of Sort */
  name?: string
  /** Flag stating when Sort is selected */
  selected?: boolean
}

/**
 * SpecialOpeningDay
 * Representation of a special opening day
 */
export interface SpecialOpeningDay {
  /** Flag stating if special opening day is closed */
  closed?: boolean
  /** Closing time of opening day */
  closingTime?: Time
  /** Comment field */
  comment?: string
  /**
   * Date of special opening day
   * @format date-time
   */
  date?: string
  /** Text representation of the date of special opening day */
  formattedDate?: string
  /** Name of the special opening day event */
  name?: string
  /** Starting time of opening day */
  openingTime?: Time
}

/**
 * SpellingSuggestion
 * Representation of a Spell Checker Suggestion
 */
export interface SpellingSuggestion {
  /** Query for spelling suggestion */
  query?: string
  /** Spelling suggestion */
  suggestion?: string
}

/**
 * StatusSummary
 * Representation of a status summary, an aggregated view on issues for a specific status or severity. These issues are attached to configurations of products or order entries
 */
export interface StatusSummary {
  /**
   * Number of issues per status
   * @format int32
   * @example 3
   */
  numberOfIssues?: number
  /**
   * Status or severity indicator, can be one of ERROR, WARNING, INFO or SUCCESS
   * @example "ERROR"
   */
  status?: string
}

/**
 * Stock
 * Representation of a Stock
 */
export interface Stock {
  /**
   * Indicate whether Stock level value is rounded
   * @example false
   */
  isValueRounded?: boolean
  /**
   * Stock level expressed as number
   * @format int64
   * @example 25
   */
  stockLevel?: number
  /**
   * Status of stock level
   * @example "inStock"
   */
  stockLevelStatus?: string
}

/**
 * StoreCount
 * Representation of a Store Count
 */
export interface StoreCount {
  /**
   * Count
   * @format int32
   */
  count?: number
  /** Iso code of store */
  isoCode?: string
  /** Name of store count */
  name?: string
  /** List of store counts */
  storeCountDataList?: StoreCount[]
  /** Type of store count */
  type?: string
}

/**
 * StoreCountList
 * Representation of a Store Count List
 */
export interface StoreCountList {
  /** List of store counts */
  countriesAndRegionsStoreCount?: StoreCount[]
}

/**
 * StoreFinderSearchPage
 * Representation of a Store finder search page
 */
export interface StoreFinderSearchPage {
  /**
   * Bound east longitude
   * @format double
   */
  boundEastLongitude?: number
  /**
   * Bound north latitude
   * @format double
   */
  boundNorthLatitude?: number
  /**
   * Bound south latitude
   * @format double
   */
  boundSouthLatitude?: number
  /**
   * Bound west longitude
   * @format double
   */
  boundWestLongitude?: number
  /** Location text */
  locationText?: string
  /** Pagination */
  pagination?: DeprecatedPagination
  /** List of sortings */
  sorts?: Sort[]
  /**
   * Source latitude
   * @format double
   */
  sourceLatitude?: number
  /**
   * Source longitude
   * @format double
   */
  sourceLongitude?: number
  /** List of stores */
  stores?: PointOfService[]
}

/**
 * StoreFinderStockSearchPage
 * Representation of a Store Finder Stock Search Page
 */
export interface StoreFinderStockSearchPage {
  /**
   * Bound to east longitude
   * @format double
   */
  boundEastLongitude?: number
  /**
   * Bound to north latitude
   * @format double
   */
  boundNorthLatitude?: number
  /**
   * Bound to south latitude
   * @format double
   */
  boundSouthLatitude?: number
  /**
   * Bound to west longitude
   * @format double
   */
  boundWestLongitude?: number
  /** Location text */
  locationText?: string
  /** Pagination */
  pagination?: DeprecatedPagination
  /** Product */
  product?: Product
  /** List of sorts */
  sorts?: Sort[]
  /**
   * Source latitude
   * @format double
   */
  sourceLatitude?: number
  /**
   * Source longitude
   * @format double
   */
  sourceLongitude?: number
  /** List of stores */
  stores?: PointOfServiceStock[]
}

/**
 * Suggestion
 * Representation of a Suggestion
 */
export interface Suggestion {
  /** Suggestion value */
  value?: string
}

/**
 * SuggestionList
 * Representation of a Suggestion List
 */
export interface SuggestionList {
  /** List of suggestions */
  suggestions?: Suggestion[]
}

/** Thread */
export interface Thread {
  authorizedParticipants?: ThreadRecipient[]
  currentParticipants?: ThreadRecipient[]
  currentParticipantsDisplayValue?: string
  /** @format date-time */
  dateCreated?: string
  /** @format date-time */
  dateUpdated?: string
  entityId?: string
  entityLabel?: string
  entityType?: string
  id?: string
  selectableParticipants?: ThreadRecipient[]
  topic?: ThreadTopic
}

/** ThreadDetails */
export interface ThreadDetails {
  authorizedParticipants?: ThreadRecipient[]
  currentParticipants?: ThreadRecipient[]
  currentParticipantsDisplayValue?: string
  /** @format date-time */
  dateCreated?: string
  /** @format date-time */
  dateUpdated?: string
  entityId?: string
  entityLabel?: string
  entityType?: string
  id?: string
  messages?: ThreadMessage[]
  selectableParticipants?: ThreadRecipient[]
  topic?: ThreadTopic
}

/** ThreadList */
export interface ThreadList {
  consignmentCode?: string
  nextPageToken?: string
  previousPageToken?: string
  threads?: Thread[]
}

/** ThreadMessage */
export interface ThreadMessage {
  attachments?: ThreadMessageAttachment[]
  body?: string
  /** @format date-time */
  dateCreated?: string
  isFromCustomer?: boolean
  senderDisplayName?: string
  senderType?: string
  to?: ThreadRecipient[]
}

/** ThreadMessageAttachment */
export interface ThreadMessageAttachment {
  id?: string
  name?: string
  /** @format int64 */
  size?: number
}

/** ThreadRecipient */
export interface ThreadRecipient {
  displayName?: string
  id?: string
  type?: string
}

/** ThreadTopic */
export interface ThreadTopic {
  code?: string
  displayValue?: string
}

/**
 * Time
 * Representation of a Time
 */
export interface Time {
  /** Formatted hour */
  formattedHour?: string
  /**
   * Hour part of the time data
   * @format int32
   * @min -128
   * @max 127
   */
  hour?: number
  /**
   * Minute part of the time data
   * @format int32
   * @min -128
   * @max 127
   */
  minute?: number
}

/**
 * Title
 * Representation of a Title
 */
export interface Title {
  /** Title code */
  code?: string
  /** Title name */
  name?: string
}

/**
 * TitleList
 * Representation of a Title List
 */
export interface TitleList {
  /** List of titles */
  titles?: Title[]
}

/**
 * User
 * Representation of an User
 */
export interface User {
  /** User preferred currency */
  currency?: Currency
  /** Customer identifier */
  customerId?: string
  /**
   * Deactivation date
   * @format date-time
   */
  deactivationDate?: string
  /** User address */
  defaultAddress?: Address
  /** User identifier */
  displayUid?: string
  /** User first name */
  firstName?: string
  /** User preferred language */
  language?: Language
  /** User last name */
  lastName?: string
  /** Name of the user */
  name?: string
  /** User title */
  title?: string
  /** User title code */
  titleCode?: string
  /** Unique user identifier */
  uid?: string
}

/**
 * UserGroup
 * Representation of an User Group
 */
export interface UserGroup {
  /** List of members */
  members?: Principal[]
  /**
   * Number of members
   * @format int32
   */
  membersCount?: number
  /** Name of the user */
  name?: string
  /** List of subgroups */
  subGroups?: UserGroup[]
  /** Unique user identifier */
  uid?: string
}

/**
 * UserGroupList
 * Representation of an User Group List
 */
export interface UserGroupList {
  /**
   * Current page
   * @format int32
   */
  currentPage?: number
  /**
   * Number of pages
   * @format int32
   */
  numberOfPages?: number
  /**
   * Page size
   * @format int32
   */
  pageSize?: number
  /**
   * Total number
   * @format int32
   */
  totalNumber?: number
  /** List of user groups */
  userGroups?: UserGroup[]
}

/**
 * UserSignUp
 * Representation of an UserSignUp. Consists of fields required to register new customer
 */
export interface UserSignUp {
  /** first name of the user */
  firstName: string
  /** last name of the user */
  lastName: string
  /** user password */
  password: string
  titleCode?: string
  /** user id, unique string required to create new user. It can be email */
  uid: string
}

/**
 * VariantCategory
 * Representation of a Variant Category
 */
export interface VariantCategory {
  /** Flag if varian category has image assigned */
  hasImage?: boolean
  /** Variant category name */
  name?: string
  /**
   * Priority number of variant category
   * @format int32
   */
  priority?: number
}

/**
 * VariantMatrixElement
 * Representation of a Variant Matrix Element
 */
export interface VariantMatrixElement {
  /** List of elements with the type of variant matrix element */
  elements?: VariantMatrixElement[]
  isLeaf?: boolean
  /** Parent variant category for variant matrix element */
  parentVariantCategory?: VariantCategory
  /** Variant option for variant matrix element */
  variantOption?: VariantOption
  /** Variant value category for variant matrix element */
  variantValueCategory?: VariantValueCategory
}

/**
 * VariantOption
 * Representation of a Variant Option
 */
export interface VariantOption {
  /** Code of the variant option */
  code?: string
  /** Price data information of the variant option */
  priceData?: Price
  /** Stock value of the variant option */
  stock?: Stock
  /** Url address of the variant option */
  url?: string
  /** List of variant option qualifiers */
  variantOptionQualifiers?: VariantOptionQualifier[]
}

/**
 * VariantOptionQualifier
 * Representation of a Variant Option Qualifier
 */
export interface VariantOptionQualifier {
  /** Image associated with variant option qualifier */
  image?: Image
  /** Name of variant option qualifier */
  name?: string
  /** Qualifier */
  qualifier?: string
  /** Value of variant option qualifier */
  value?: string
}

/**
 * VariantValueCategory
 * Representation of a Variant Value Category
 */
export interface VariantValueCategory {
  /** Name of the variant value category */
  name?: string
  /**
   * Sequence number of variant value category
   * @format int32
   */
  sequence?: number
  /** Parent category of variant value category */
  superCategories?: VariantCategory[]
}

/**
 * Voucher
 * Representation of a Voucher
 */
export interface Voucher {
  /** Applied value when using this voucher */
  appliedValue?: Price
  /** The identifier of the Voucher. This is the first part of voucher code which holds first 3 letters, like: 123 */
  code?: string
  /** Currency of the voucher */
  currency?: Currency
  /** Description of the voucher */
  description?: string
  /** Specifies if the order this voucher is applied to is shipped for free (true) or not (false). Defaults to false. */
  freeShipping?: boolean
  /** Name of the voucher */
  name?: string
  /**
   * Value of the voucher. Example of such value is: 15.0d
   * @format double
   */
  value?: number
  /** Formatted value of the voucher */
  valueFormatted?: string
  /** The value of the voucher to display. Example: 15.0% */
  valueString?: string
  /** Voucher code, is the holder for keeping specific occasional voucher related to business usage. It can be generated and looks like: 123-H8BC-Y3D5-34AL */
  voucherCode?: string
}

/**
 * VoucherList
 * Representation of a Voucher List
 */
export interface VoucherList {
  /** List of vouchers */
  vouchers?: Voucher[]
}

/**
 * WeekdayOpeningDay
 * Representation of a Weekday Opening Day
 */
export interface WeekdayOpeningDay {
  /** Flag stating if weekday opening day is closed */
  closed?: boolean
  /** Closing time of opening day */
  closingTime?: Time
  /** Starting time of opening day */
  openingTime?: Time
  /** Text representation of week day opening day */
  weekDay?: string
}

/**
 * deprecatedPagination
 * Representation of a search results pagination
 */
export interface DeprecatedPagination {
  /**
   * The current page number. The first page is number zero (0), the second page is number one (1), and so on
   * @format int32
   */
  currentPage?: number
  /**
   * The number of results per page. A page may have less results if there are less than a full page of results, only on the last page in the results
   * @format int32
   */
  pageSize?: number
  /** The selected sort code */
  sort?: string
  /**
   * The total number of pages. This is the number of pages, each of pageSize, required to display the totalResults.
   * @format int32
   */
  totalPages?: number
  /**
   * The total number of matched results across all pages
   * @format int64
   */
  totalResults?: number
}

/**
 * error
 * Error message
 */
export interface Error {
  /** Error code */
  errorCode?: string
  exceptionMessage?: string
  /** @example "English" */
  language?: string
  /** Descriptive, human readable error message. */
  message?: string
  /**
   * @format int32
   * @example 1
   */
  position?: number
  /** Additional classification specific for each error type e.g. 'noStock'. */
  reason?: string
  /** Identifier of the related object e.g. '1'. */
  subject?: string
  /** Type of the object related to the error e.g. 'entry'. */
  subjectType?: string
  /** Type of the error e.g. 'LowStockError'. */
  type?: string
}

/**
 * errorList
 * List of errors
 */
export interface ErrorList {
  errors?: Error[]
}

/**
 * pagination
 * Pagination info
 */
export interface Pagination {
  /**
   * Number of elements on this page
   * @format int32
   */
  count?: number
  /** Indicates if there is next page */
  hasNext?: boolean
  /** Indicates if there is previous page */
  hasPrevious?: boolean
  /**
   * Current page number
   * @format int32
   */
  page?: number
  /**
   * Total number of elements
   * @format int64
   */
  totalCount?: number
  /**
   * Total number of pages
   * @format int32
   */
  totalPages?: number
}

/**
 * sort
 * Sort option
 */
export interface Sort {
  asc?: boolean
  code?: string
}
