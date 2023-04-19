import { SvgImageType } from '../../components/svg-image/svg-image'
import { Offer } from '../../services/api/types/commerce/api-types'
import { OfferWithId } from './types/product-detail'

export const isOfferWithId = (offer: Offer): offer is OfferWithId => !!offer.id

export const svgForCategory: { [category: string]: SvgImageType | undefined } = {
  concertAndStage: 'pic-concert-2',
  museumAndPark: 'pic-museum-2',
  cinema: 'pic-cinema-2',
  book: 'pic-books-2',
  audioMedia: 'pic-soundcarrier-2',
  sheetMusic: 'pic-notes-2',
  musicInstrument: 'pic-instruments-2',
}
