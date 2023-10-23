import Clipboard from '@react-native-clipboard/clipboard'
import { SvgImageType } from '../../components/svg-image/svg-image'
import { Offer } from '../../services/api/types/commerce/api-types'
import { OfferWithId, ProductDetail, ProductTypes } from './types/product-detail'

export const isOfferWithId = (offer: Offer): offer is OfferWithId => !!offer.id

export const svgForProductType: { [productType in ProductTypes]?: SvgImageType } = {
  stagedEventProductWsDTO: 'pic-concert-2',
  exhibitProductWsDTO: 'pic-museum-2',
  cinemaProductWsDTO: 'pic-cinema-2',
  bookProductWsDTO: 'pic-books-2',
  audioProductWsDTO: 'pic-soundcarrier-2',
  sheetMusicProductWsDTO: 'pic-notes-2',
  musicInstrumentProductWsDTO: 'pic-instruments-2',
}

export const svgForVoucherCategory: { [key: string]: SvgImageType | undefined } = {
  couponsConcertAndStage: 'pic-concert-2',
  couponsMuseumAndPark: 'pic-museum-2',
  couponsCinema: 'pic-cinema-2',
  couponsBooks: 'pic-books-2',
  couponsAudioMedia: 'pic-soundcarrier-2',
  couponsSheetMusic: 'pic-notes-2',
  couponsMusicInstrument: 'pic-instruments-2',
}

export const isProductVoucherPickup = (productDetail: ProductDetail) => {
  return productDetail.productType === ProductTypes.Voucher && productDetail.isVoucherPickupRequired
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
