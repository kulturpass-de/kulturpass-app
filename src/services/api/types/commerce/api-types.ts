/* eslint-disable max-len */
/* tslint:disable */

type File = any

/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** Address object */
export interface Address {
  /** Unique id value of the address which is optional while creating new address. While performing other address operations this value is the key */
  id?: string
  /** Title of the address person */
  title?: string
  /** Code of the title */
  titleCode: string
  /** First name of the address person */
  firstName: string
  /** Last name of the address person */
  lastName: string
  /** Company Name */
  companyName?: string
  /** First line of the address */
  line1: string
  /** Second line of the address */
  line2?: string
  /** Town, field required */
  town: string
  /** Response body fields which will be returned while fetching the list of country's regions. */
  region?: Region
  /** District name */
  district?: string
  /** Postal code of the address */
  postalCode: string
  /** Phone number */
  phone?: string
  /** Cellphone number */
  cellphone?: string
  /** Email address */
  email?: string
  /** Response body fields which will be returned while fetching the list of countries. The DTO is in XML or .json format */
  country?: Country
  /** Boolean flag if address is for shipping */
  shippingAddress?: boolean
  /** Boolean flag if address is default */
  defaultAddress?: boolean
  /** Boolean flag if address is visible in the Address Book */
  visibleInAddressBook?: boolean
  /** Boolean flag if address is formatted */
  formattedAddress?: string
}

/** Representation of an Address list */
export interface AddressList {
  /** List of addresses */
  addresses?: Address[]
}

/** Representation of an Address Validation */
export interface AddressValidation {
  /** List of errors */
  errors?: ErrorList
  /** Decision */
  decision?: string
  /** List of suggested addresses */
  suggestedAddresses?: Address[]
}

export interface Assessment {
  code?: string
  label?: string
  response?: string
  type?: string
}

export interface Assessments {
  assessments?: Assessment[]
}

/** Representation of a Base Option */
export interface BaseOption {
  /** Variant type of base option */
  variantType?: string
  /** List of all variant options */
  options?: VariantOption[]
  /** Representation of a Variant Option */
  selected?: VariantOption
}

/** Representation of a Base Site */
export interface BaseSite {
  /** Unique identifier of Basesite */
  uid?: string
  /** Name of Basesite */
  name?: string
  /** List of Basestores */
  stores?: BaseStore[]
  /** Theme of Basesite */
  theme?: string
  /** Representation of a Language */
  defaultLanguage?: Language
  /** Locale data for Basesite */
  locale?: string
  /** Channel */
  channel?: string
  /** List of url encoding attributes */
  urlEncodingAttributes?: string[]
  /** List of url patterns */
  urlPatterns?: string[]
  /** Default preview catalog id */
  defaultPreviewCatalogId?: string
  /** Default preview category code */
  defaultPreviewCategoryCode?: string
  /** Default preview product code */
  defaultPreviewProductCode?: string
  /** Indicates whether customer data isolation is enabled for this site. If true, customer can get site information after registration, For example registerd username is name@sap.com, returned uid will be name@sap.com|baseSiteUid */
  isolated?: boolean
  /** Configuration information of captcha */
  captchaConfig?: CaptchaConfig
}

/** Representation of a Base Site List */
export interface BaseSiteList {
  /** List of basesites */
  baseSites?: BaseSite[]
}

/** Representation of a Base Store */
export interface BaseStore {
  /** Base store name */
  name?: string
  /** Flag defining is external tax is enabled */
  externalTaxEnabled?: boolean
  /** Payment provider */
  paymentProvider?: string
  /** Create return process code */
  createReturnProcessCode?: string
  /**
   * Maximum radius for searching point of service
   * @format double
   */
  maxRadiusForPosSearch?: number
  /** Submit order process code */
  submitOrderProcessCode?: string
  /** List of currencies */
  currencies?: Currency[]
  /** Representation of a Currency */
  defaultCurrency?: Currency
  /** Representation of a Point of service */
  defaultDeliveryOrigin?: PointOfService
  /** Representation of a Language */
  defaultLanguage?: Language
  /** List of delivery countries */
  deliveryCountries?: Country[]
  /** Representation of a Delivery mode list */
  deliveryModes?: DeliveryModeList
  /** List of languages */
  languages?: Language[]
  /** List of points of service */
  pointsOfService?: PointOfService[]
  /** Flag specifying whether the express checkout option is enabled */
  expressCheckoutEnabled?: boolean
}

/** Representation of a Breadcrumb */
export interface Breadcrumb {
  /** Code of the facet */
  facetCode?: string
  /** Name of the facet */
  facetName?: string
  /** Value code of the facet */
  facetValueCode?: string
  /** Value name of the facet */
  facetValueName?: string
  /** Representation of a Search State */
  removeQuery?: SearchState
  /** Representation of a Search State */
  truncateQuery?: SearchState
}

/** Representation of a cancellation request entry input for an order */
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

/** Cancellation request input list for the current order. */
export interface CancellationRequestEntryInputList {
  /** Cancellation request entry inputs which contain information about the order entries which are requested to be cancelled */
  cancellationRequestEntryInputs: CancellationRequestEntryInput[]
}

/** Configuration information of captcha */
export interface CaptchaConfig {
  /**
   * Indicates if the captcha is enabled or not
   * @example true
   */
  enabled?: boolean
  /**
   * The public key used in captcha validation
   * @example "6LdeF6tgAAAAAE_T55TB0nmg--qmbnkwqC4LPQbg"
   */
  publicKey?: string
}

/** Representation of a Card Type */
export interface CardType {
  /** Card type code */
  code?: string
  /** Card type name */
  name?: string
}

/** Representation of a Card Type List */
export interface CardTypeList {
  /** List of card types */
  cardTypes?: CardType[]
}

/** Representation of a Cart */
export interface Cart {
  /** Code number of order */
  code?: string
  /** Flag stating iv value is net-value */
  net?: boolean
  /** Representation of a Price */
  totalPriceWithTax?: Price
  /** Representation of a Price */
  totalPrice?: Price
  /** Representation of a Price */
  totalTax?: Price
  /** Representation of a Price */
  subTotal?: Price
  /** Representation of a Price */
  deliveryCost?: Price
  /** List of order entries */
  entries?: OrderEntry[]
  /** List of entry groups */
  entryGroups?: EntryGroup[]
  /** @format int32 */
  totalItems?: number
  /** Representation of a Delivery mode */
  deliveryMode?: DeliveryMode
  /** Address object */
  deliveryAddress?: Address
  /** Payment details object */
  paymentInfo?: PaymentDetails
  /** List of applied order promotions */
  appliedOrderPromotions?: PromotionResult[]
  /** List of applied product promotions */
  appliedProductPromotions?: PromotionResult[]
  /** Representation of a Price */
  productDiscounts?: Price
  /** Representation of a Price */
  orderDiscounts?: Price
  /** Representation of a Price */
  totalDiscounts?: Price
  /** Site */
  site?: string
  /** Store */
  store?: string
  /** Guest user id identifier */
  guid?: string
  /** Flag showing if order is calculated */
  calculated?: boolean
  /** List of applied vouchers */
  appliedVouchers?: Voucher[]
  /** Representation of a Principal webservice DTO used for defining User data types */
  user?: Principal
  /** List of pickup order entry group */
  pickupOrderGroups?: PickupOrderEntryGroup[]
  /** List of delivery order entries group */
  deliveryOrderGroups?: DeliveryOrderEntryGroup[]
  /**
   * Quantity of pickup items
   * @format int64
   */
  pickupItemsQuantity?: number
  /**
   * Quantity of delivery items
   * @format int64
   */
  deliveryItemsQuantity?: number
  /** Customer requested date for order retrieval */
  requestedRetrievalAt?: string
  /**
   * Total unit count
   * @format int32
   */
  totalUnitCount?: number
  /** List of potential order promotions for cart */
  potentialOrderPromotions?: PromotionResult[]
  /** List of potential product promotions for cart */
  potentialProductPromotions?: PromotionResult[]
  /** Name of the cart */
  name?: string
  /** Description of the cart */
  description?: string
  /**
   * Date of cart expiration time
   * @format date-time
   * @example "2023-08-11T10:19:07Z"
   */
  expirationTime?: string
  /**
   * Date of saving cart
   * @format date-time
   * @example "2023-08-11T10:19:07Z"
   */
  saveTime?: string
  /** Representation of a Principal webservice DTO used for defining User data types */
  savedBy?: Principal
  /** Earliest possible retrieval date available for order */
  earliestRetrievalAt?: string
}

/** Representation of a Cart list */
export interface CartList {
  /** List of carts */
  carts?: Cart[]
}

/** Representation of a Cart modification */
export interface CartModification {
  /** Status code of cart modification */
  statusCode?: string
  /**
   * Quantity added with cart modification
   * @format int64
   */
  quantityAdded?: number
  /**
   * Final quantity after cart modification
   * @format int64
   */
  quantity?: number
  /**
   * Request body parameter that contains details such as the quantity of product (quantity), and the pickup store name (deliveryPointOfService.name)
   *
   * The DTO is in XML or .json format.
   */
  entry?: OrderEntry
  /** Delivery mode changed */
  deliveryModeChanged?: boolean
  /** Status message */
  statusMessage?: string
}

/** Representation of a Cart modification list */
export interface CartModificationList {
  /** List of cart modifications */
  cartModifications?: CartModification[]
}

/** Representation of a Catalog */
export interface Catalog {
  /** Identifier of abstract catalog item */
  id?: string
  /**
   * Date of last modification
   * @format date-time
   * @example "2023-08-11T10:19:10Z"
   */
  lastModified?: string
  /** Name of abstract catalog item */
  name?: string
  /** Url address of abstract catalog item */
  url?: string
  /** List of versions of catalog */
  catalogVersions?: CatalogVersion[]
}

/** Representation of a Catalog List */
export interface CatalogList {
  /** List of catalog items */
  catalogs?: Catalog[]
}

/** Representation of a Catalog Version */
export interface CatalogVersion {
  /** Identifier of abstract catalog item */
  id?: string
  /**
   * Date of last modification
   * @format date-time
   * @example "2023-08-11T10:19:10Z"
   */
  lastModified?: string
  /** Name of abstract catalog item */
  name?: string
  /** Url address of abstract catalog item */
  url?: string
  /** List of category hierarchies */
  categories?: CategoryHierarchy[]
}

/** Representation of a Category */
export interface Category {
  /** Code of the category */
  code?: string
  /** Name of the category */
  name?: string
  /** URL of the category */
  url?: string
  /** Representation of an Image */
  image?: Image
}

/** Representation of a Category Hierarchy */
export interface CategoryHierarchy {
  /** Identifier of abstract catalog item */
  id?: string
  /**
   * Date of last modification
   * @format date-time
   * @example "2023-08-11T10:19:10Z"
   */
  lastModified?: string
  /** Name of abstract catalog item */
  name?: string
  /** Url address of abstract catalog item */
  url?: string
  /** List of subcategory hierarchies */
  subcategories?: CategoryHierarchy[]
}

/** Representation of a Category List */
export interface CategoryList {
  /** List of categories */
  categories?: Category[]
}

/** Representation of a Classification */
export interface Classification {
  /** Code of the classification */
  code?: string
  /** Name of the classification */
  name?: string
  /** List of features for given classification */
  features?: Feature[]
}

/** List of Component identifiers */
export interface ComponentIDList {
  idList?: string[]
}

/** Representation of a Configuration Info */
export interface ConfigurationInfo {
  /** Type of configuration info */
  configuratorType?: string
  /** Status of configuration info */
  status?: string
  /** Label of configuration info */
  configurationLabel?: string
  /** Value of configuration info */
  configurationValue?: string
}

/** Representation of a Consent */
export interface Consent {
  /** Code of consent */
  code?: string
  /**
   * Date of consenting
   * @format date-time
   * @example "2023-08-11T10:19:08Z"
   */
  consentGivenDate?: string
  /**
   * Consent withdrawn date
   * @format date-time
   * @example "2023-08-11T10:19:08Z"
   */
  consentWithdrawnDate?: string
}

/** Representation of a Consent Template */
export interface ConsentTemplate {
  /** Consent template identifier */
  id?: string
  /** Consent template name */
  name?: string
  /** Consent template description */
  description?: string
  /**
   * Consent template version
   * @format int32
   */
  version?: number
  /** Representation of a Consent */
  currentConsent?: Consent
}

/** Representation of a Consent Template List */
export interface ConsentTemplateList {
  /** List of consent templates */
  consentTemplates?: ConsentTemplate[]
}

/** Representation of a Consignment */
export interface Consignment {
  /** Consignment code */
  code?: string
  /** Consignment tracking identifier */
  trackingID?: string
  /** Consignment status */
  status?: string
  /** Consignment status display */
  statusDisplay?: string
  /**
   * Consignment status date
   * @format date-time
   * @example "2023-08-11T10:19:07Z"
   */
  statusDate?: string
  /** List of consignment entries */
  entries?: ConsignmentEntry[]
  /** Address object */
  shippingAddress?: Address
  /** Representation of a Point of service */
  deliveryPointOfService?: PointOfService
  /** Label of shipping's type */
  shippingModeLabel?: string
  /** Order's state */
  marketplaceStatus?: string
  /** Reason's label of the order state */
  marketplaceStatusLabel?: string
  /** Indicates if the order can be evaluated by the customer */
  canEvaluate?: boolean
  /** Indicates if the customer can write a message */
  canWriteMessage?: boolean
  /** All the documents available on the order */
  documents?: Document[]
  /** Indicates if the customer has been debited */
  customerDebited?: boolean
}

/** Representation of a Consignment Entry */
export interface ConsignmentEntry {
  /**
   * Request body parameter that contains details such as the quantity of product (quantity), and the pickup store name (deliveryPointOfService.name)
   *
   * The DTO is in XML or .json format.
   */
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
  /** The mirakl order line's identifier */
  miraklOrderLineId?: string
  /** The consignment code */
  consignmentCode?: string
  /** Order line's state */
  miraklOrderLineStatus?: string
  /** Reason's label of the order line's state */
  miraklOrderLineStatusLabel?: string
  /** Indicate if an incident can be opened on the order line */
  canOpenIncident?: boolean
}

/** Response body fields which will be returned while fetching the list of countries. The DTO is in XML or .json format */
export interface Country {
  /** Country code in iso format */
  isocode?: string
  /** Name of the country */
  name?: string
}

/** List of countries */
export interface CountryList {
  /** This is the list of Country fields that should be returned in the response body */
  countries?: Country[]
}

/** Create thread message DTO */
export interface CreateThreadMessage {
  /** Thread topic */
  topic: string
  /** Message body, min length: 3 - max length: 50000 */
  body: string
  /** Message recipient: OPERATOR, SHOP or CUSTOMER, comma-separated. */
  to: string
  /** List of attachments */
  attachments?: File[]
}

/** Representation of a Currency */
export interface Currency {
  /** Code of the currency in iso format */
  isocode?: string
  /** Name of the currency */
  name?: string
  /** Boolean flag whether currency is active */
  active?: boolean
  /** Symbol of the currency */
  symbol?: string
}

/** Representation of a Currency List */
export interface CurrencyList {
  /** List of currencies */
  currencies?: Currency[]
}

/** Indicates balance values */
export interface CustomerBalance {
  /** Representation of a Price */
  grantedBalance?: Price
  /** Representation of a Price */
  reservedBalance?: Price
  /** Representation of a Price */
  availableBalance?: Price
  expired?: boolean
  /**
   * @format date-time
   * @example "2023-08-11T10:19:07Z"
   */
  expirationDate?: string
}

/** Indicates preferences */
export interface CustomerPreferences {
  preferredPostalCode?: string
  preferredProductCategoryId1?: string
  preferredProductCategoryId2?: string
  preferredProductCategoryId3?: string
  preferredProductCategoryId4?: string
}

/** Representation of a Delivery mode */
export interface DeliveryMode {
  /** Code of the delivery mode */
  code?: string
  /** Name of the delivery mode */
  name?: string
  /** Description of the delivery mode */
  description?: string
  /** Representation of a Price */
  deliveryCost?: Price
}

/** Representation of a Delivery mode list */
export interface DeliveryModeList {
  /** List of delivery modes */
  deliveryModes?: DeliveryMode[]
}

/** Representation of a Delivery Order Entry Group */
export interface DeliveryOrderEntryGroup {
  /** Representation of a Price */
  totalPriceWithTax?: Price
  /** List of order entries */
  entries?: OrderEntry[]
  /**
   * Quantity of order entries in a group
   * @format int64
   */
  quantity?: number
  /** Address object */
  deliveryAddress?: Address
  /** The shop identifier */
  shopId?: string
  /** The shop name */
  shopName?: string
  /** Representation of a Delivery mode */
  selectedShippingOption?: DeliveryMode
  /** The available shipping options */
  availableShippingOptions?: DeliveryMode[]
  /**
   * The lead time to shop
   * @format int32
   */
  leadTimeToShip?: number
}

/** All the documents available on the order */
export interface Document {
  /**
   * @format date-time
   * @example "2023-08-11T10:19:07Z"
   */
  dateUploaded?: string
  fileName?: string
  /** @format int64 */
  fileSize?: number
  code?: string
  type?: string
}

/** Representation of an Entry Group */
export interface EntryGroup {
  /** List of order entries */
  entries?: OrderEntry[]
  /** List of child entry groups */
  entryGroups?: EntryGroup[]
  /**
   * Identifier of the entry group
   * @format int32
   * @example 1
   */
  entryGroupNumber?: number
  /**
   * Label for the entry group
   * @example "Photo On The Go Package"
   */
  label?: string
  /**
   * Indicates if the entry group is in an error state
   * @example true
   */
  erroneous?: boolean
  /**
   * Indicates type of the group, possible values are STANDALONE, CONFIGURABLEBUNDLE or any customer implemented type for any new provider
   * @example "STANDALONE"
   */
  type?: string
}

export interface EvaluationPage {
  evaluations?: Evaluation[]
  /** @format int32 */
  evaluationPageCount?: number
}

/** The evaluation */
export interface Evaluation {
  assessments?: Assessment[]
  comment?: string
  /**
   * @format date-time
   * @example "2023-08-11T10:19:07Z"
   */
  date?: string
  firstName?: string
  lastName?: string
  /** @format int32 */
  grade?: number
}

/** Representation of a Facet */
export interface Facet {
  /** Name of the facet */
  name?: string
  /**
   * Priority value of the facet
   * @format int32
   */
  priority?: number
  /** Flag stating if facet is category facet */
  category?: boolean
  /** Flag stating if facet is multiSelect */
  multiSelect?: boolean
  /** Flag stating if facet is visible */
  visible?: boolean
  /** List of top facet values */
  topValues?: FacetValue[]
  /** List of all facet values */
  values?: FacetValue[]
}

/** Representation of a Facet Value */
export interface FacetValue {
  /** Name of the facet value */
  name?: string
  /**
   * Count of the facet value
   * @format int64
   */
  count?: number
  /** Representation of a Search State */
  query?: SearchState
  /** Flag stating if facet value is selected */
  selected?: boolean
}

export interface FavouritesEntryList {
  favouritesItems?: FavouritesEntry[]
}

export interface FavouritesEntry {
  productCode?: string
  /** Representation of a Product */
  product?: Product
  cartId?: string
  /** @format int32 */
  entryNumber?: number
}

/** Representation of a Feature */
export interface Feature {
  /** Code of the feature */
  code?: string
  /** Name of the feature */
  name?: string
  /** Description of the feature */
  description?: string
  /** Type of the feature */
  type?: string
  /** Range number of the feature */
  range?: boolean
  /** Flag defining it feature is comparable */
  comparable?: boolean
  /** Representation of a Feature Unit */
  featureUnit?: FeatureUnit
  /** List of feature values */
  featureValues?: FeatureValue[]
}

/** Representation of a Feature Unit */
export interface FeatureUnit {
  /** Symbol of the feature unit */
  symbol?: string
  /** Name of the feature unit */
  name?: string
  /** Type of the feature unit */
  unitType?: string
}

/** Representation of a Feature Value */
export interface FeatureValue {
  /** Value of the feature */
  value?: string
}

/** Representation of a Future Stock */
export interface FutureStock {
  /** Representation of a Stock */
  stock?: Stock
  /**
   * Date of future stock
   * @format date-time
   * @example "2023-08-11T10:19:07Z"
   */
  date?: string
  /**
   * Date of future stock expressed in text value
   * @example "31/12/2056"
   */
  formattedDate?: string
}

/** Representation of a GeoPoint */
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

/** Representation of an Image */
export interface Image {
  /** Type of the image, can be PRIMARY or GALLERY */
  imageType?: 'PRIMARY' | 'GALLERY'
  /** Format of the image, can be zoom, product, thumbnail, store, cartIcon, etc. */
  format?: string
  /** URL address of the image */
  url?: string
  /** Tooltip content which is visible while image mouse hovering */
  altText?: string
  /**
   * Index of the image while displayed in gallery
   * @format int32
   */
  galleryIndex?: number
}

/** Representation of a Language */
export interface Language {
  /** iso code of the language */
  isocode?: string
  /** name of the language */
  name?: string
  /** name the language in native form */
  nativeName?: string
  /** true/false indicator when the language is active */
  active?: boolean
}

/** Lists all available languages (all languages used for a particular store). If the list of languages for a base store is empty, a list of all languages available in the system will be returned */
export interface LanguageList {
  /** This is the list of Language fields that should be returned in the response body */
  languages?: Language[]
}

export interface ListAdaptedComponents {
  component?: any[]
  /** Pagination info */
  pagination?: Pagination
  sorts?: Sort[]
}

export interface ListAdaptedPages {
  page?: any[]
  /** Pagination info */
  pagination?: Pagination
  sorts?: Sort[]
}

/** List of users to assign to customer group. */
export interface MemberList {
  /** List of member */
  members?: Principal[]
}

export interface MiraklThreadCreated {
  /** @format uuid */
  messageId?: string
  /** @format uuid */
  threadId?: string
}

export interface MiraklThreadReplyCreated {
  /** @format uuid */
  messageId?: string
  /** @format uuid */
  threadId?: string
}

export interface OfferList {
  offers?: Offer[]
}

export interface OfferOverview {
  code?: string
  shopId?: string
  shopName?: string
  /** @format double */
  shopGrade?: number
  /** Representation of a Price */
  price?: Price
  /** Representation of a Price */
  originPrice?: Price
  /** Representation of a Price */
  totalPrice?: Price
  /** Representation of a Price */
  minShippingPrice?: Price
  /** @format int32 */
  quantity?: number
  /** @format int32 */
  minPurchasableQty?: number
  stateCode?: string
  allOfferPricingsJSON?: string
}

export interface OfferStateSummary {
  stateCode?: string
  stateLabel?: string
  /** @format int64 */
  offerCount?: number
  /** Representation of a Price */
  minPrice?: Price
}

export interface Offer {
  id?: string
  code?: string
  productCode?: string
  /** Representation of a Price */
  minShippingPrice?: Price
  /** Representation of a Price */
  minShippingPriceAdditional?: Price
  /** Representation of a Price */
  price?: Price
  /** Representation of a Price */
  totalPrice?: Price
  /** Representation of a Price */
  originPrice?: Price
  priceAdditionalInfo?: string
  /** @format int32 */
  quantity?: number
  description?: string
  stateLabel?: string
  /**
   * @format date-time
   * @example "2023-08-11T10:19:07Z"
   */
  discountStartDate?: string
  /**
   * @format date-time
   * @example "2023-08-11T10:19:07Z"
   */
  discountEndDate?: string
  /** Representation of a Price */
  discountPrice?: Price
  /**
   * @format date-time
   * @example "2023-08-11T10:19:07Z"
   */
  availableStartDate?: string
  /**
   * @format date-time
   * @example "2023-08-11T10:19:07Z"
   */
  availableEndDate?: string
  /** @format int32 */
  leadTimeToShip?: number
  shopId?: string
  shopName?: string
  /** @format double */
  shopGrade?: number
  /** @format int32 */
  shopEvaluationCount?: number
  volumePrices?: Price[]
  volumeOriginPrices?: Price[]
  /** @format int32 */
  packageQuantity?: number
  /** @format int32 */
  minOrderQuantity?: number
  /** @format int32 */
  maxOrderQuantity?: number
  /** @format double */
  shopDistance?: number
  shopAddress?: ShopAddress
  accessibilityWheelchairShop?: boolean
  accessibilityToiletShop?: boolean
  accessibilityOffer?: string
  accessibilityOfferOthers?: string
}

/** Offers summary for this product */
export interface OffersSummary {
  bestOffer?: OfferOverview
  states?: OfferStateSummary[]
  /** @format int32 */
  offerCount?: number
}

/** Representation of an Opening schedule */
export interface OpeningSchedule {
  /** Name of the opening schedule */
  name?: string
  /** Code of the opening schedule */
  code?: string
  /** List of weekday opening days */
  weekDayOpeningList?: WeekdayOpeningDay[]
  /** List of special opening days */
  specialDayOpeningList?: SpecialOpeningDay[]
}

/** Representation of an Order */
export interface Order {
  /** Code number of order */
  code?: string
  /** Flag stating iv value is net-value */
  net?: boolean
  /** Representation of a Price */
  totalPriceWithTax?: Price
  /** Representation of a Price */
  totalPrice?: Price
  /** Representation of a Price */
  totalTax?: Price
  /** Representation of a Price */
  subTotal?: Price
  /** Representation of a Price */
  deliveryCost?: Price
  /** List of order entries */
  entries?: OrderEntry[]
  /** List of entry groups */
  entryGroups?: EntryGroup[]
  /** @format int32 */
  totalItems?: number
  /** Representation of a Delivery mode */
  deliveryMode?: DeliveryMode
  /** Address object */
  deliveryAddress?: Address
  /** Payment details object */
  paymentInfo?: PaymentDetails
  /** List of applied order promotions */
  appliedOrderPromotions?: PromotionResult[]
  /** List of applied product promotions */
  appliedProductPromotions?: PromotionResult[]
  /** Representation of a Price */
  productDiscounts?: Price
  /** Representation of a Price */
  orderDiscounts?: Price
  /** Representation of a Price */
  totalDiscounts?: Price
  /** Site */
  site?: string
  /** Store */
  store?: string
  /** Guest user id identifier */
  guid?: string
  /** Flag showing if order is calculated */
  calculated?: boolean
  /** List of applied vouchers */
  appliedVouchers?: Voucher[]
  /** Representation of a Principal webservice DTO used for defining User data types */
  user?: Principal
  /** List of pickup order entry group */
  pickupOrderGroups?: PickupOrderEntryGroup[]
  /** List of delivery order entries group */
  deliveryOrderGroups?: DeliveryOrderEntryGroup[]
  /**
   * Quantity of pickup items
   * @format int64
   */
  pickupItemsQuantity?: number
  /**
   * Quantity of delivery items
   * @format int64
   */
  deliveryItemsQuantity?: number
  /** Customer requested date for order retrieval */
  requestedRetrievalAt?: string
  /**
   * Date of order creation
   * @format date-time
   * @example "2023-08-11T10:19:07Z"
   */
  created?: string
  /** Status of order */
  status?: string
  /** Status display */
  statusDisplay?: string
  /** Flag showing if customer is Guest customer */
  guestCustomer?: boolean
  /** List of consignment */
  consignments?: Consignment[]
  /** Order delivery status */
  deliveryStatus?: string
  /** Order delivery status display */
  deliveryStatusDisplay?: string
  /** List of unconsigned order entries */
  unconsignedEntries?: OrderEntry[]
  /**
   * Boolean flag showing if order is cancellable
   * @example true
   */
  cancellable?: boolean
  /**
   * Boolean flag showing if order is returnable
   * @example true
   */
  returnable?: boolean
  refunds?: Refunds
}

/**
 * Request body parameter that contains details such as the quantity of product (quantity), and the pickup store name (deliveryPointOfService.name)
 *
 * The DTO is in XML or .json format.
 */
export interface OrderEntry {
  /**
   * Entry number of the order entry
   * @format int32
   */
  entryNumber?: number
  /**
   * Quantity number of items in order entry
   * @format int64
   */
  quantity?: number
  /** Representation of a Price */
  basePrice?: Price
  /** Representation of a Price */
  totalPrice?: Price
  /** Representation of a Product */
  product?: Product
  /** Flag defining if order entry item is updateable */
  updateable?: boolean
  /** Representation of a Delivery mode */
  deliveryMode?: DeliveryMode
  /** Configuration info of order entry */
  configurationInfos?: ConfigurationInfo[]
  /** List of aggregated status information per entry, relevant if the entry is configurable and its configuration contains one or many issues in different severities. Note that configurators typically raise such issues only in case the parent document is changeable. In this case the issues (depending on their severity) need to be fixed before a checkout can be done. This means this segment can be present for a cart entry, for order entries it will always be empty */
  statusSummaryList?: StatusSummary[]
  /** Representation of a Point of service */
  deliveryPointOfService?: PointOfService
  /** Representation of a Price */
  cancelledItemsPrice?: Price
  /**
   * Quantity number of cancellable items in order entry
   * @format int64
   * @example 5
   */
  cancellableQuantity?: number
  /** Representation of a Price */
  returnedItemsPrice?: Price
  /**
   * Quantity number of returnable items in order entry
   * @format int64
   * @example 5
   */
  returnableQuantity?: number
  /** Identifier of the offer */
  offerId?: string
  /** Identifier of the shop which proposes the offer */
  shopId?: string
  /** Name of the shop which proposes the offer */
  shopName?: string
  /**
   * Total Line Shipping Price
   * @format double
   */
  lineShippingPrice?: number
  /** Selected Shipping Code */
  lineShippingCode?: string
  /** Selected Shipping Label */
  lineShippingLabel?: string
  shopAddress?: ShopAddress
  deliveryScenario?: string
  voucherCode?: string
  voucherRedemptionUrl?: string
  voucherValidTo?: string
  voucherIsValid?: boolean
  barcodeData?: string
  barcodeDisplayType?: string
  /** Representation of a Price */
  refundAmount?: Price
}

/** Representation of an Order entry list consumed */
export interface OrderEntryList {
  /** List of order entries */
  orderEntries?: OrderEntry[]
}

/** Representation of an Order History */
export interface OrderHistory {
  /** Code of Order History */
  code?: string
  /** Status of Order History */
  status?: string
  /** Status display */
  statusDisplay?: string
  /**
   * Date of placing order
   * @format date-time
   * @example "2023-08-11T10:19:09Z"
   */
  placed?: string
  /** Guest user identifier */
  guid?: string
  /** Representation of a Price */
  total?: Price
  entries?: OrderEntry[]
}

/** Representation of an Order History List */
export interface OrderHistoryList {
  /** List of order history items */
  orders?: OrderHistory[]
  /** List of sorts */
  sorts?: Sort[]
  /** Representation of a search results pagination */
  pagination?: DeprecatedPagination
}

/** Representation of an Order Status Update Element */
export interface OrderStatusUpdateElement {
  /** Code of update element of order status */
  code?: string
  /** Status of update element */
  status?: string
  /** BaseSite identifier */
  baseSiteId?: string
}

/** Representation of an Order Status Update Element List */
export interface OrderStatusUpdateElementList {
  /** List of order status update elements */
  orderStatusUpdateElements?: OrderStatusUpdateElement[]
}

/** Payment details object */
export interface PaymentDetails {
  /** Unique identifier of payment detail */
  id?: string
  /** Name of account holder */
  accountHolderName?: string
  /** Representation of a Card Type */
  cardType?: CardType
  /** Payment card number */
  cardNumber?: string
  /** Start month from which payment is valid */
  startMonth?: string
  /** Start year from which payment is valid */
  startYear?: string
  /** Month of expiration of payment */
  expiryMonth?: string
  /** Year of expiration of payment */
  expiryYear?: string
  /** Issue number */
  issueNumber?: string
  /** Identifier of subscription */
  subscriptionId?: string
  /** Flag to mark if payment is saved one */
  saved?: boolean
  /** Flag to mark if payment the default one */
  defaultPayment?: boolean
  /** Address object */
  billingAddress?: Address
}

/** Representation of a Payment details list */
export interface PaymentDetailsList {
  /** List of payment details */
  payments?: PaymentDetails[]
}

/** Representation of a Payment Mode */
export interface PaymentMode {
  /** Payment mode code */
  code?: string
  /** Payment mode name */
  name?: string
  /** Payment mode description */
  description?: string
}

/** Representation of a Payment Mode List */
export interface PaymentModeList {
  /** List of payment modes */
  paymentModes?: PaymentMode[]
}

export interface PaymentRequest {
  postUrl?: string
  parameters?: Record<string, string>
  mappingLabels?: Record<string, string>
}

/** Representation of a Pickup Order Entry Group */
export interface PickupOrderEntryGroup {
  /** Representation of a Price */
  totalPriceWithTax?: Price
  /** List of order entries */
  entries?: OrderEntry[]
  /**
   * Quantity of order entries in a group
   * @format int64
   */
  quantity?: number
  /** Representation of a Point of service */
  deliveryPointOfService?: PointOfService
  /**
   * Distance calculated to pickup place
   * @format double
   */
  distance?: number
}

/** Representation of a Point of service */
export interface PointOfService {
  /**
   * Name of the point of service
   * @example "Misato"
   */
  name?: string
  /** Display name of the point of service */
  displayName?: string
  /** Url address of the point of service */
  url?: string
  /** Description of the point of service */
  description?: string
  /** Representation of an Opening schedule */
  openingHours?: OpeningSchedule
  /** Store content of given point of service */
  storeContent?: string
  /** List of features for a given point of service */
  features?: Record<string, string>
  /** Representation of a GeoPoint */
  geoPoint?: GeoPoint
  /** Distance to the point of service as text value */
  formattedDistance?: string
  /**
   * Distance to the point of service as number value
   * @format double
   */
  distanceKm?: number
  /** Representation of an Image */
  mapIcon?: Image
  /** Address object */
  address?: Address
  /** Collection of images associated with a point of service */
  storeImages?: Image[]
  /** Instructions used for picking up an order in store */
  pickUpInStoreInstructions?: string
}

/** Representation of a Point of Service List */
export interface PointOfServiceList {
  /** List of points of service */
  pointOfServices?: PointOfService[]
}

/** Representation of a Point Of Service Stock */
export interface PointOfServiceStock {
  /**
   * Name of the point of service
   * @example "Misato"
   */
  name?: string
  /** Display name of the point of service */
  displayName?: string
  /** Url address of the point of service */
  url?: string
  /** Description of the point of service */
  description?: string
  /** Representation of an Opening schedule */
  openingHours?: OpeningSchedule
  /** Store content of given point of service */
  storeContent?: string
  /** List of features for a given point of service */
  features?: Record<string, string>
  /** Representation of a GeoPoint */
  geoPoint?: GeoPoint
  /** Distance to the point of service as text value */
  formattedDistance?: string
  /**
   * Distance to the point of service as number value
   * @format double
   */
  distanceKm?: number
  /** Representation of an Image */
  mapIcon?: Image
  /** Address object */
  address?: Address
  /** Collection of images associated with a point of service */
  storeImages?: Image[]
  /** Instructions used for picking up an order in store */
  pickUpInStoreInstructions?: string
  /** Representation of a Stock */
  stockInfo?: Stock
}

/** Representation of a Price */
export interface Price {
  /** Currency iso format */
  currencyIso?: string
  /** Value of price in BigDecimal format */
  value?: number
  /** Type of the price */
  priceType?: 'BUY' | 'FROM'
  /** Value of price formatted */
  formattedValue?: string
  /**
   * Minimum quantity of the price value
   * @format int64
   */
  minQuantity?: number
  /**
   * Maximum quantity of the price value
   * @format int64
   */
  maxQuantity?: number
}

/** Representation of a Price Range */
export interface PriceRange {
  /** Representation of a Price */
  maxPrice?: Price
  /** Representation of a Price */
  minPrice?: Price
}

/** Representation of a Principal webservice DTO used for defining User data types */
export interface Principal {
  /** Unique user identifier */
  uid?: string
  /** Name of the user */
  name?: string
}

/** Representation of a Product */
export interface Product {
  /** Code of the product */
  code?: string
  /** Name of the product */
  name?: string
  /** Url address of the product */
  url?: string
  /** Description of the product */
  description?: string
  /** Flag defining if product is purchasable */
  purchasable?: boolean
  /** Representation of a Stock */
  stock?: Stock
  /** List of future stocks */
  futureStocks?: FutureStock[]
  /** Flag defining if product is available for pickup */
  availableForPickup?: boolean
  /**
   * Rating number of average value
   * @format double
   */
  averageRating?: number
  /**
   * Number of reviews associated with the product
   * @format int32
   */
  numberOfReviews?: number
  /** Product summary */
  summary?: string
  /** Data of product manufacturer */
  manufacturer?: string
  /** Variant type of the product */
  variantType?: string
  /** Representation of a Price */
  price?: Price
  /** Information about base product */
  baseProduct?: string
  /** List of images linked to product */
  images?: Image[]
  /** List of categories product belongs to */
  categories?: Category[]
  /** List of reviews associated with the product */
  reviews?: Review[]
  /** List of classifications related to the product */
  classifications?: Classification[]
  /** List of potential promotions related to the product */
  potentialPromotions?: Promotion[]
  /** List of variant options related to the product */
  variantOptions?: VariantOption[]
  /** List of base options related to the product */
  baseOptions?: BaseOption[]
  /** Flag stating if volume price should be displayed */
  volumePricesFlag?: boolean
  /** List of volume prices */
  volumePrices?: Price[]
  /** List of product references */
  productReferences?: ProductReference[]
  /** List of variant matrixes associated with the product */
  variantMatrix?: VariantMatrixElement[]
  /** Representation of a Price Range */
  priceRange?: PriceRange
  /** Flag stating if product is multidimensional */
  multidimensional?: boolean
  /** Configurator type related to the product */
  configuratorType?: string
  /** Flag stating if product is configurable */
  configurable?: boolean
  /**
   * Tags associated with the product
   * @uniqueItems true
   */
  tags?: string[]
  /** Offers summary for this product */
  offersSummary?: OffersSummary
  offers?: Offer[]
  leafCategoryName?: string
  topCategoryName?: string
  itemType?: string
  /** @format int32 */
  offerCount?: number
  /** @format double */
  shopDistance?: number
  eventStartDate?: string
  eventEndDate?: string
  venueName?: string
  /** @format double */
  lowestOfferPrice?: number
  seller?: string
  fulfillmentOption?: string
}

/** Representation of a Product Express Update Element */
export interface ProductExpressUpdateElement {
  /** Code of product express update element */
  code?: string
  /** Catalog identifier */
  catalogId?: string
  /** Catalog version */
  catalogVersion?: string
}

/** Representation of a Product Express Update Element List */
export interface ProductExpressUpdateElementList {
  /** List of product express update element */
  productExpressUpdateElements?: ProductExpressUpdateElement[]
}

/** Representation of a Product Future Stocks */
export interface ProductFutureStocks {
  /**
   * Product identifier
   * @example "3318057"
   */
  productCode?: string
  /** List of future stocks */
  futureStocks?: FutureStock[]
}

/** Representation of a Product Future Stocks List */
export interface ProductFutureStocksList {
  /** List of product future stocks */
  productFutureStocks?: ProductFutureStocks[]
}

/** Representation of a Product List */
export interface ProductList {
  /** List of products */
  products?: Product[]
  /** Catalog of product list */
  catalog?: string
  /** Version of product list */
  version?: string
  /**
   * Total product count
   * @format int32
   */
  totalProductCount?: number
  /**
   * Total page count
   * @format int32
   */
  totalPageCount?: number
  /**
   * Number of current page
   * @format int32
   */
  currentPage?: number
}

/** Representation of a Product Reference */
export interface ProductReference {
  /** Reference type */
  referenceType?: string
  /** Reference description */
  description?: string
  /**
   * Reference quantity
   * @format int32
   */
  quantity?: number
  /** Representation of a Product */
  target?: Product
  /** Flag stating if product reference is preselected */
  preselected?: boolean
}

/** Representation of a Product Reference List */
export interface ProductReferenceList {
  /** List of product references */
  references?: ProductReference[]
}

/** Representation of a Product Search Page */
export interface ProductSearchPage {
  /** Free text search */
  freeTextSearch?: string
  /** Code of category */
  categoryCode?: string
  /** Redirect url address keyword */
  keywordRedirectUrl?: string
  /** Representation of a Spell Checker Suggestion */
  spellingSuggestion?: SpellingSuggestion
  /** List of products */
  products?: Product[]
  /** List of sorts */
  sorts?: Sort[]
  /** Representation of a search results pagination */
  pagination?: DeprecatedPagination
  /** Representation of a Search State */
  currentQuery?: SearchState
  /** List of breadcrumbs info */
  breadcrumbs?: Breadcrumb[]
  /** List of facets */
  facets?: Facet[]
}

/** Representation of a Promotion */
export interface Promotion {
  /** Code of the promotion */
  code?: string
  /** Promotion title */
  title?: string
  /** Type of the promotion */
  promotionType?: string
  /**
   * The initial date of the promotion
   * @format date-time
   * @example "2023-08-11T10:19:07Z"
   */
  startDate?: string
  /**
   * Last date of validity of the promotion
   * @format date-time
   * @example "2023-08-11T10:19:07Z"
   */
  endDate?: string
  /** Description of the promotion */
  description?: string
  /** Message about promotion which is displayed when planning potential promotion. This field has higher priority over promotion description */
  couldFireMessages?: string[]
  /** Message fired while the promotion is active. This is info how much you will get when applying the promotion */
  firedMessages?: string[]
  /** Representation of an Image */
  productBanner?: Image
  /** Boolean flag if promotion is enabled */
  enabled?: boolean
  /**
   * Priority index as numeric value of the promotion. Higher number means higher priority
   * @format int32
   */
  priority?: number
  /** Group of the promotion */
  promotionGroup?: string
  /** List of promotion restrictions */
  restrictions?: PromotionRestriction[]
}

/** Representation of a Promotion list */
export interface PromotionList {
  /** List of promotions */
  promotions?: Promotion[]
}

/** Representation of a Promotion order entry consumed */
export interface PromotionOrderEntryConsumed {
  /** Order entry code */
  code?: string
  /**
   * Adjusted unit price for promotion order entry
   * @format double
   */
  adjustedUnitPrice?: number
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

/** Representation of a Promotion Restriction */
export interface PromotionRestriction {
  /** Type of the promotion restriction */
  restrictionType?: string
  /** Description of the promotion restriction */
  description?: string
}

/** Representation of a Promotion result */
export interface PromotionResult {
  /** Description of promotion result */
  description?: string
  /** Representation of a Promotion */
  promotion?: Promotion
  /** List of promotion order entries consumed */
  consumedEntries?: PromotionOrderEntryConsumed[]
}

/** Representation of a Promotion result list */
export interface PromotionResultList {
  /** List of promotion results */
  promotions?: PromotionResult[]
}

export interface ReasonList {
  reasons?: Reason[]
}

export interface Reason {
  code?: string
  label?: string
}

export interface Refunds {
  /** Representation of a Price */
  refundAmount?: Price
  /** Representation of a Price */
  totalWithoutRefunds?: Price
}

/** Response body fields which will be returned while fetching the list of country's regions. */
export interface Region {
  /** Country and Region code in iso format */
  isocode?: string
  /** Region code in short iso form */
  isocodeShort?: string
  /** Country code in iso format */
  countryIso?: string
  /** Name of the region */
  name?: string
}

/** List of Regions */
export interface RegionList {
  /** This is the list of Region fields that should be returned in the response body */
  regions?: Region[]
}

/** Request body parameter that contains details such as token and new password */
export interface ResetPassword {
  /** token value which will be generated as unique string that will be sent with email to allow user for completing reset-password operation */
  token: string
  /** new password string which is required to complete process of resetting password */
  newPassword: string
}

/** Representation of a return request for an order */
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
   * @example "2023-08-11T10:19:07Z"
   */
  creationTime?: string
  /** Representation of a Price */
  deliveryCost?: Price
  /** Representation of an Order */
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
  /** Representation of a Price */
  subTotal?: Price
  /** Representation of a Price */
  totalPrice?: Price
}

/** Representation of a return request entry which contains information about the returned product */
export interface ReturnRequestEntry {
  /**
   * Request body parameter that contains details such as the quantity of product (quantity), and the pickup store name (deliveryPointOfService.name)
   *
   * The DTO is in XML or .json format.
   */
  orderEntry?: OrderEntry
  /**
   * Quantity which is expected to be returned for this return request entry
   * @format int64
   * @example 5
   */
  expectedQuantity?: number
  /** Representation of a Price */
  refundAmount?: Price
}

/** Representation of a return request entry input for an order */
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

/** Return request input list for the current order. */
export interface ReturnRequestEntryInputList {
  /**
   * Code of the order which return request is related to
   * @example "00000001"
   */
  orderCode: string
  /** Return request entry inputs which contain information about the order entries which are requested to be returned */
  returnRequestEntryInputs: ReturnRequestEntryInput[]
}

/** Representation of an Order Return Request List */
export interface ReturnRequestList {
  /** List of order return requests */
  returnRequests?: ReturnRequest[]
  /** List of sorts */
  sorts?: Sort[]
  /** Representation of a search results pagination */
  pagination?: DeprecatedPagination
}

/** Return request modification object. */
export interface ReturnRequestModification {
  /** Status of the return request */
  status?: 'CANCELLING'
}

/** Object contains review details like : rating, alias, headline, comment */
export interface Review {
  /** Identifier of review */
  id?: string
  /** Review headline */
  headline?: string
  /** Review comment */
  comment?: string
  /**
   * Review rating value
   * @format double
   */
  rating?: number
  /**
   * Date of the review
   * @format date-time
   * @example "2023-08-11T10:19:07Z"
   */
  date?: string
  /** Alias name for the review */
  alias?: string
  /** User's object. */
  principal?: User
}

/** Representation of a Review List */
export interface ReviewList {
  /** List of reviews */
  reviews?: Review[]
}

/** Representation of an Invoice */
export interface SAPInvoice {
  /**
   * Invoice Id
   * @example "9560887"
   */
  invoiceId?: string
  /**
   * Invoice creation date
   * @format date-time
   * @example "2020-09-16T04:55:09.505Z"
   */
  createdAt?: string
  /** Representation of a Price */
  totalAmount?: Price
  /** Representation of a Price */
  netAmount?: Price
  /**
   * External system identifier where the invoice resides.
   * @example "S4SALES"
   */
  externalSystemId?: string
}

/** Representation of an Invoice List */
export interface SAPInvoiceList {
  /** list of invoice */
  invoices?: SAPInvoice[]
  /** sorting information */
  sorts?: Sort[]
  /** Pagination info */
  pagination?: Pagination
}

/** Representation of a Save Cart Result */
export interface SaveCartResult {
  /** Representation of a Cart */
  savedCartData?: Cart
}

/** Representation of a Search Query */
export interface SearchQuery {
  /** Value of search query */
  value?: string
}

/** Representation of a Search State */
export interface SearchState {
  /** Url address of search state */
  url?: string
  /** Representation of a Search Query */
  query?: SearchQuery
}

export interface ShopAddress {
  street?: string
  city?: string
  postalCode?: string
  countryIso?: string
  /** @format double */
  latitude?: number
  /** @format double */
  longitude?: number
}

export interface Shop {
  id?: string
  name?: string
  premium?: boolean
  /** @format double */
  grade?: number
  /** @format int32 */
  evaluationCount?: number
  /**
   * @format date-time
   * @example "2023-08-11T10:19:09Z"
   */
  registrationDate?: string
  /** @format int64 */
  approvalDelay?: number
  /** @format double */
  approvalRate?: number
  shippingCountry?: string
  availableShippingOptions?: DeliveryMode[]
  description?: string
  returnPolicy?: string
  logo?: string
  banner?: string
  offersPageUrl?: string
}

/** Representation a Sort option */
export interface Sort {
  /** Code of Sort */
  code?: string
  /** Name of Sort */
  name?: string
  /** Flag stating when Sort is selected */
  selected?: boolean
}

/** Representation of a special opening day */
export interface SpecialOpeningDay {
  /** Representation of a Time */
  openingTime?: Time
  /** Representation of a Time */
  closingTime?: Time
  /**
   * Date of special opening day
   * @format date-time
   * @example "2023-08-11T10:19:07Z"
   */
  date?: string
  /** Text representation of the date of special opening day */
  formattedDate?: string
  /** Flag stating if special opening day is closed */
  closed?: boolean
  /** Name of the special opening day event */
  name?: string
  /** Comment field */
  comment?: string
}

/** Representation of a Spell Checker Suggestion */
export interface SpellingSuggestion {
  /** Spelling suggestion */
  suggestion?: string
  /** Query for spelling suggestion */
  query?: string
}

/** Representation of a status summary, an aggregated view on issues for a specific status or severity. These issues are attached to configurations of products or order entries */
export interface StatusSummary {
  /**
   * Status or severity indicator, can be one of ERROR, WARNING, INFO or SUCCESS
   * @example "ERROR"
   */
  status?: string
  /**
   * Number of issues per status
   * @format int32
   * @example 3
   */
  numberOfIssues?: number
}

/** Representation of a Stock */
export interface Stock {
  /**
   * Status of stock level
   * @example "inStock"
   */
  stockLevelStatus?: string
  /**
   * Stock level expressed as number
   * @format int64
   * @example 25
   */
  stockLevel?: number
  /**
   * Indicate whether Stock level value is rounded
   * @example false
   */
  isValueRounded?: boolean
}

/** Representation of a Store Count */
export interface StoreCount {
  /** Type of store count */
  type?: string
  /** Name of store count */
  name?: string
  /** Iso code of store */
  isoCode?: string
  /**
   * Count
   * @format int32
   */
  count?: number
  /** List of store counts */
  storeCountDataList?: StoreCount[]
}

/** Representation of a Store Count List */
export interface StoreCountList {
  /** List of store counts */
  countriesAndRegionsStoreCount?: StoreCount[]
}

/** Representation of a Store finder search page */
export interface StoreFinderSearchPage {
  /** List of stores */
  stores?: PointOfService[]
  /** List of sortings */
  sorts?: Sort[]
  /** Representation of a search results pagination */
  pagination?: DeprecatedPagination
  /** Location text */
  locationText?: string
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
  /**
   * Bound north latitude
   * @format double
   */
  boundNorthLatitude?: number
  /**
   * Bound east longitude
   * @format double
   */
  boundEastLongitude?: number
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
}

/** Representation of a Store Finder Stock Search Page */
export interface StoreFinderStockSearchPage {
  /** List of stores */
  stores?: PointOfServiceStock[]
  /** List of sorts */
  sorts?: Sort[]
  /** Representation of a search results pagination */
  pagination?: DeprecatedPagination
  /** Location text */
  locationText?: string
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
  /**
   * Bound to north latitude
   * @format double
   */
  boundNorthLatitude?: number
  /**
   * Bound to east longitude
   * @format double
   */
  boundEastLongitude?: number
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
  /** Representation of a Product */
  product?: Product
}

/** Representation of a Suggestion */
export interface Suggestion {
  /** Suggestion value */
  value?: string
}

/** Representation of a Suggestion List */
export interface SuggestionList {
  /** List of suggestions */
  suggestions?: Suggestion[]
}

export interface ThreadDetails {
  id?: string
  topic?: ThreadTopic
  authorizedParticipants?: ThreadRecipient[]
  selectableParticipants?: ThreadRecipient[]
  currentParticipants?: ThreadRecipient[]
  currentParticipantsDisplayValue?: string
  /**
   * @format date-time
   * @example "2023-08-11T10:19:09Z"
   */
  dateCreated?: string
  /**
   * @format date-time
   * @example "2023-08-11T10:19:09Z"
   */
  dateUpdated?: string
  entityType?: string
  entityLabel?: string
  entityId?: string
  messages?: ThreadMessage[]
}

export interface ThreadList {
  threads?: Thread[]
  nextPageToken?: string
  previousPageToken?: string
  consignmentCode?: string
}

export interface ThreadMessageAttachment {
  id?: string
  name?: string
  /** @format int64 */
  size?: number
}

export interface ThreadMessage {
  senderType?: string
  senderDisplayName?: string
  body?: string
  /**
   * @format date-time
   * @example "2023-08-11T10:19:09Z"
   */
  dateCreated?: string
  attachments?: ThreadMessageAttachment[]
  to?: ThreadRecipient[]
  isFromCustomer?: boolean
}

export interface ThreadRecipient {
  id?: string
  type?: string
  displayName?: string
}

export interface ThreadTopic {
  code?: string
  displayValue?: string
}

export interface Thread {
  id?: string
  topic?: ThreadTopic
  authorizedParticipants?: ThreadRecipient[]
  selectableParticipants?: ThreadRecipient[]
  currentParticipants?: ThreadRecipient[]
  currentParticipantsDisplayValue?: string
  /**
   * @format date-time
   * @example "2023-08-11T10:19:09Z"
   */
  dateCreated?: string
  /**
   * @format date-time
   * @example "2023-08-11T10:19:09Z"
   */
  dateUpdated?: string
  entityType?: string
  entityLabel?: string
  entityId?: string
}

/** Representation of a Time */
export interface Time {
  /**
   * Hour part of the time data
   * @format byte
   */
  hour?: string
  /**
   * Minute part of the time data
   * @format byte
   */
  minute?: string
  /** Formatted hour */
  formattedHour?: string
}

/** Representation of a Title */
export interface Title {
  /** Title code */
  code?: string
  /** Title name */
  name?: string
}

/** Representation of a Title List */
export interface TitleList {
  /** List of titles */
  titles?: Title[]
}

/** User's object. */
export interface User {
  /** Unique user identifier */
  uid?: string
  /** Name of the user */
  name?: string
  /** Address object */
  defaultAddress?: Address
  /** User title code */
  titleCode?: string
  /** User title */
  title?: string
  /** User first name */
  firstName?: string
  /** User last name */
  lastName?: string
  /** Representation of a Currency */
  currency?: Currency
  /** Representation of a Language */
  language?: Language
  /** User identifier */
  displayUid?: string
  /** Customer identifier */
  customerId?: string
  /**
   * Deactivation date
   * @format date-time
   * @example "2023-08-11T10:19:07Z"
   */
  deactivationDate?: string
  /**
   * Name of the default pick up location
   * @example "Misato"
   */
  defaultPointOfServiceName?: string
  /** Indicates preferences */
  preferences?: CustomerPreferences
  /** Indicates identification status */
  identificationStatus?: string
  /** Indicates balance status */
  balanceStatus?: 'NOT_ENTITLED' | 'NOT_YET_ENTITLED' | 'ENTITLED'
  /** Indicates balance values */
  balance?: CustomerBalance
}

/** User group object with id and name. */
export interface UserGroup {
  /** Unique user identifier */
  uid?: string
  /** Name of the user */
  name?: string
  /** List of members */
  members?: Principal[]
  /** List of subgroups */
  subGroups?: UserGroup[]
  /**
   * Number of members
   * @format int32
   */
  membersCount?: number
}

/** Representation of a User Group List */
export interface UserGroupList {
  /** List of user groups */
  userGroups?: UserGroup[]
  /**
   * Total number
   * @format int32
   */
  totalNumber?: number
  /**
   * Page size
   * @format int32
   */
  pageSize?: number
  /**
   * Number of pages
   * @format int32
   */
  numberOfPages?: number
  /**
   * Current page
   * @format int32
   */
  currentPage?: number
}

/** User's object. */
export interface UserSignUp {
  /** user id, unique string required to create new user. It can be email */
  uid: string
  /** first name of the user */
  firstName: string
  /** last name of the user */
  lastName: string
  titleCode?: string
  /** user password */
  password: string
}

/** Representation of a Variant Category */
export interface VariantCategory {
  /** Variant category name */
  name?: string
  /** Flag if varian category has image assigned */
  hasImage?: boolean
  /**
   * Priority number of variant category
   * @format int32
   */
  priority?: number
}

/** Representation of a Variant Matrix Element */
export interface VariantMatrixElement {
  /** Representation of a Variant Value Category */
  variantValueCategory?: VariantValueCategory
  /** Representation of a Variant Category */
  parentVariantCategory?: VariantCategory
  /** Representation of a Variant Option */
  variantOption?: VariantOption
  /** List of elements with the type of variant matrix element */
  elements?: VariantMatrixElement[]
  isLeaf?: boolean
}

/** Representation of a Variant Option */
export interface VariantOption {
  /** Code of the variant option */
  code?: string
  /** Representation of a Stock */
  stock?: Stock
  /** Url address of the variant option */
  url?: string
  /** Representation of a Price */
  priceData?: Price
  /** List of variant option qualifiers */
  variantOptionQualifiers?: VariantOptionQualifier[]
}

/** Representation of a Variant Option Qualifier */
export interface VariantOptionQualifier {
  /** Qualifier */
  qualifier?: string
  /** Name of variant option qualifier */
  name?: string
  /** Value of variant option qualifier */
  value?: string
  /** Representation of an Image */
  image?: Image
}

/** Representation of a Variant Value Category */
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

/** Representation of a Voucher */
export interface Voucher {
  /** The identifier of the Voucher. This is the first part of voucher code which holds first 3 letters, like: 123 */
  code?: string
  /** Voucher code, is the holder for keeping specific occasional voucher related to business usage. It can be generated and looks like: 123-H8BC-Y3D5-34AL */
  voucherCode?: string
  /** Name of the voucher */
  name?: string
  /** Description of the voucher */
  description?: string
  /**
   * Value of the voucher. Example of such value is: 15.0d
   * @format double
   */
  value?: number
  /** Formatted value of the voucher */
  valueFormatted?: string
  /** The value of the voucher to display. Example: 15.0% */
  valueString?: string
  /** Specifies if the order this voucher is applied to is shipped for free (true) or not (false). Defaults to false. */
  freeShipping?: boolean
  /** Representation of a Currency */
  currency?: Currency
  /** Representation of a Price */
  appliedValue?: Price
}

/** Representation of a Voucher List */
export interface VoucherList {
  /** List of vouchers */
  vouchers?: Voucher[]
}

/** Representation of a Weekday Opening Day */
export interface WeekdayOpeningDay {
  /** Representation of a Time */
  openingTime?: Time
  /** Representation of a Time */
  closingTime?: Time
  /** Text representation of week day opening day */
  weekDay?: string
  /** Flag stating if weekday opening day is closed */
  closed?: boolean
}

/** Representation of a search results pagination */
export interface DeprecatedPagination {
  /**
   * The number of results per page. A page may have less results if there are less than a full page of results, only on the last page in the results
   * @format int32
   */
  pageSize?: number
  /**
   * The current page number. The first page is number zero (0), the second page is number one (1), and so on
   * @format int32
   */
  currentPage?: number
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

/** Error message */
export interface Error {
  /** Type of the error e.g. 'LowStockError'. */
  type?: string
  /** Additional classification specific for each error type e.g. 'noStock'. */
  reason?: string
  /** Descriptive, human readable error message. */
  message?: string
  /** Type of the object related to the error e.g. 'entry'. */
  subjectType?: string
  /** Identifier of the related object e.g. '1'. */
  subject?: string
  /** Error code */
  errorCode?: string
  /** @example "English" */
  language?: string
  /**
   * @format int32
   * @example 1
   */
  position?: number
  exceptionMessage?: string
}

/** List of errors */
export interface ErrorList {
  errors?: Error[]
}

/** Pagination info */
export interface Pagination {
  /**
   * Number of elements on this page
   * @format int32
   */
  count?: number
  /**
   * Total number of elements
   * @format int64
   */
  totalCount?: number
  /**
   * Current page number
   * @format int32
   */
  page?: number
  /**
   * Total number of pages
   * @format int32
   */
  totalPages?: number
  /** Indicates if there is next page */
  hasNext?: boolean
  /** Indicates if there is previous page */
  hasPrevious?: boolean
}

/** Sort option */
export interface Sort {
  code?: string
  asc?: boolean
}
