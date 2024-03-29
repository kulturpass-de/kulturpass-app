import Clipboard from '@react-native-clipboard/clipboard'
import { ThemedSvgImageType } from '../../components/svg-image/svg-image'
import { Offer } from '../../services/api/types/commerce/api-types'
import { OfferWithId, ProductDetail, ProductTypes } from './types/product-detail'

export const isOfferWithId = (offer: Offer): offer is OfferWithId => !!offer.id

export const svgForProductType: { [productType in ProductTypes]?: ThemedSvgImageType } = {
  stagedEventProductWsDTO: 'pic-concert-2',
  exhibitProductWsDTO: 'pic-museum-2',
  cinemaProductWsDTO: 'pic-cinema-2',
  bookProductWsDTO: 'pic-books-2',
  seasonTicketProductWsDTO: 'pic-books-2',
  audioProductWsDTO: 'pic-soundcarrier-2',
  sheetMusicProductWsDTO: 'pic-notes-2',
  musicInstrumentProductWsDTO: 'pic-instruments-2',
  workshopProductWsDTO: 'pic-workshop-confirm',
}

export const svgForVoucherCategory: { [key: string]: ThemedSvgImageType | undefined } = {
  couponsConcertAndStage: 'pic-concert-2',
  couponsMuseumAndPark: 'pic-museum-2',
  couponsCinema: 'pic-cinema-2',
  couponsBooks: 'pic-books-2',
  couponsAudioMedia: 'pic-soundcarrier-2',
  couponsSheetMusic: 'pic-notes-2',
  couponsMusicInstrument: 'pic-instruments-2',
}

type Address = {
  name?: string
  street?: string
  city?: string
  postalCode?: string
}

export const copyAddressToClipboard = (address: Address) => {
  // YES, this is formatted correctly
  Clipboard.setString(`${address.name}
${address.street}
${address.postalCode} ${address.city}`)
}

export const isVoucher = (fulfillmentOption: ProductDetail['fulfillmentOption'] | string) => {
  return fulfillmentOption === 'REDEMPTION_CODE' || fulfillmentOption === 'VENDOR_CODE'
}

export const isDefinedAddress = (address?: {
  name?: string
  street?: string
  city?: string
  postalCode?: string
}): address is {
  name?: string
  street?: string
  city?: string
  postalCode?: string
} => {
  return (
    address !== undefined &&
    (address.name !== undefined ||
      address.city !== undefined ||
      address.postalCode !== undefined ||
      address.street !== undefined)
  )
}

export const isFiveDigitNumber = (str: string | undefined = ''): boolean => /^\d{5}$/.test(str)

export const containsSpecialCharacter = (str: string | undefined = ''): boolean => /[!@#$%^*_<>?+\\]/.test(str)

export const isStartingWithNumber = (str: string | undefined = ''): boolean => /^\d/.test(str.trim())

export const isValidLocationSuggestionString = (str: string | undefined = ''): boolean =>
  str.length > 1 && !isStartingWithNumber(str) && !containsSpecialCharacter(str)
