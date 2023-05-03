import { SvgImageType } from '../../components/svg-image/svg-image'
import { Offer } from '../../services/api/types/commerce/api-types'
import { OfferWithId, ProductTypes } from './types/product-detail'

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
