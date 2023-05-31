import { Category } from '../../../services/api/types/commerce/api-types'

export type RandomProduct = {
  code: string
  name: string
  url: string
  categories: Category[]
}
