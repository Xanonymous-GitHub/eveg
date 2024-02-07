import productRaw from '../products.json'
import type { Product } from './typing'

export const products = productRaw as unknown as Array<Readonly<Product>>
