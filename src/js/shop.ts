import Cookies from 'js-cookie'
import LazyLoad from 'vanilla-lazyload'
import { products } from './products.ts'
import { createProductCards } from './productCard.ts'
import type { Basket } from './typing'

let searchStr = ''
const basket: Basket = new Map<number, number>()
const allProductElements: Array<HTMLDivElement> = []
let displayedProductElements: Array<HTMLDivElement> = []
const cookieOptions: Cookies.CookieAttributes = {
  secure: true,
  sameSite: 'strict',
}

addEventListener('DOMContentLoaded', () => init())

function init() {
  setupSearchEventListeners()
  setupCookieModalEventListeners()
  setTimeout(() => {
    allProductElements.push(...createProductCards(products, onAddToBasketClicked))
    displayedProductElements.push(...allProductElements)
    updateDisplayedProductCards()
  })
}

function setupCookieModalEventListeners() {
  const cookieMsgModal = document.querySelector('#cookieMessage') as HTMLDivElement | null
  document.querySelector('#acceptCookies')?.addEventListener('click', () => {
    Cookies.set('cookieMessageSeen', 'true', {
      secure: true,
      sameSite: 'strict',
    })
    cookieMsgModal?.classList.add('d-none')
  })

  if (Cookies.get('cookieMessageSeen') === 'true')
    cookieMsgModal?.classList.add('d-none')
}

function setupSearchEventListeners() {
  const searchBox = document.querySelector('#searchbox') as HTMLInputElement

  searchBox?.addEventListener('input', () => {
    searchStr = searchBox.value.trim()
    if (searchStr === '')
      onSearchSubmitted()
  })

  document.querySelector('#searchbutton')?.addEventListener('click', (e) => {
    e.preventDefault()
    searchStr = searchBox.value.trim()
    onSearchSubmitted()
  })

  document.querySelector('#closesearchbutton')?.addEventListener('click', (e) => {
    e.preventDefault()
    searchBox.value = ''
    if (searchStr !== '') {
      searchStr = ''
      onSearchSubmitted()
    }
  })
}

function onAddToBasketClicked(productId: number, requestedQuantity: number) {
  const currentQuantity = basket.get(productId) ?? 0
  const newQuantity = currentQuantity + requestedQuantity

  if (newQuantity === 0)
    basket.delete(productId)
  else
    basket.set(productId, newQuantity)

  Cookies.set('basket', JSON.stringify(Object.fromEntries(basket)), cookieOptions)

  updateBasketTotalNum()
}

function updateBasketTotalNum() {
  const basketTotalNumElement = document.querySelector('#basketNumTotal')

  if (basketTotalNumElement !== null) {
    const total = Array.from(
      basket,
      ([productID, quantity]) => products[productID].unitPrice * quantity,
    ).reduce((a, b) => a + b, 0)

    basketTotalNumElement.textContent = (total / 100).toFixed(2)
  }
}

function onSearchSubmitted() {
  if (searchStr === undefined || searchStr === '') {
    displayedProductElements = allProductElements
  }
  else {
    displayedProductElements = allProductElements.filter((productCard) => {
      const shownName = productCard.querySelector('.shop-product-title')?.textContent
      if (!shownName)
        return false

      return shownName.toLowerCase().includes(searchStr.toLowerCase())
    })
  }

  updateDisplayedProductCards()
}

function updateDisplayedProductCards() {
  const productContainer = document.querySelector('.productList') as HTMLDivElement | null
  const lazyLoader = new LazyLoad({
    container: productContainer!,
  })

  productContainer?.replaceChildren(...displayedProductElements)

  lazyLoader.update()
}
