import Cookies from 'js-cookie'
import type { Basket } from './typing.ts'

export const cookieOptions: Cookies.CookieAttributes = {
  secure: true,
  sameSite: 'strict',
}

export enum DialogCloseResult {
  Yes,
  No,
  Cancel,
}

export function readBasketCookie(): Basket {
  const cookies = Cookies.get('basket')
  const entries = Object.entries<number>(JSON.parse(cookies ?? '{}'))
  const basket = new Map<number, number>()
  for (const [key, value] of entries)
    basket.set(Number.parseInt(key), value)

  return basket
}

export enum SORT_METHOD {
  ALPHABETICAL,
  PRICE_ASC,
  PRICE_DESC,
}

export const MAX_PRODUCT_QUANTITY = 100
