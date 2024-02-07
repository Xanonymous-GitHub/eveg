import Cookies from 'js-cookie'
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
  const toggleButton = document.querySelectorAll('.toggle-button')[0]
  const hero = document.querySelectorAll('.hero')[0]
  const navbarLinks = document.querySelectorAll('.navbar-links')[0]

  // When the toggle button is pressed (if visible by the screen size, the menu is shown)
  toggleButton.addEventListener('click', () => {
    navbarLinks.classList.toggle('active')
    hero.classList.toggle('menuactive')
  })

  const searchBar = document.querySelector('.search-bar') as HTMLDivElement
  // Show the search bar when the search link is pressed
  document.querySelector('#search-link')?.addEventListener('click', () => {
    searchBar.classList.remove('invisible')
    setTimeout(() => (document.querySelector('#searchbox') as HTMLInputElement | null)?.focus())
  })

  // Close the search bar
  document.querySelector('#searchbutton')?.addEventListener('click', () => {
    searchStr = (document.querySelector('#searchbox') as HTMLInputElement).value.trim()
    onSearchSubmitted()
  })

  // Close the search bar
  document.querySelector('#closesearchbutton')?.addEventListener('click', () => {
    searchStr = ''
    searchBar.classList.add('invisible')
    setTimeout(onSearchSubmitted)
  })

  // Close the cookies message
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

  setTimeout(() => {
    allProductElements.push(...createProductCards(products, onAddToBasketClicked))
    displayedProductElements.push(...allProductElements)
    updateDisplayedProductCards()
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
  productContainer?.replaceChildren()
  for (const card of displayedProductElements)
    productContainer?.appendChild(card)
}
