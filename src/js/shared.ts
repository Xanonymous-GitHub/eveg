import Cookies from 'js-cookie'
import type { Basket } from './typing.ts'

export function readBasketCookie(): Basket {
  const cookies = Cookies.get('basket')
  const entries = Object.entries<number>(JSON.parse(cookies ?? '{}'))
  const basket = new Map<number, number>()
  for (const [key, value] of entries)
    basket.set(Number.parseInt(key), value)

  return basket
}
