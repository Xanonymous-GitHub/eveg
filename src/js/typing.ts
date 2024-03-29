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
