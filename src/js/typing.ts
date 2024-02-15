export interface Product {
  id: number
  name: string
  category: string
  imgName: string
  quantity: number
  unit: string
  unitPrice: number
}

export type Basket = Map<number, number>

export enum SORT_METHOD {
  ALPHABETICAL,
  PRICE_ASC,
  PRICE_DESC,
}
