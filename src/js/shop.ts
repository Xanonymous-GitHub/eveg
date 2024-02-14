import Cookies from 'js-cookie'
import LazyLoad from 'vanilla-lazyload'
import { products } from './products.ts'
import { createProductCard } from './productCard.ts'
import type { Basket } from './typing'
import { readBasketCookie } from './shared'

let searchStr = ''
const basket: Basket = readBasketCookie()
const allProductElements: Array<HTMLDivElement> = []
const cookieOptions: Cookies.CookieAttributes = {
  secure: true,
  sameSite: 'strict',
}

addEventListener('DOMContentLoaded', () => init())

function init() {
  setupSearchEventListeners()
  setupCookieModalEventListeners()

  setTimeout(async () => {
    await asyncMakeProductCardElements()
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
    if (searchBox.value !== '') {
      searchBox.value = ''
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

  console.log(basket);
  Cookies.set('basket', JSON.stringify(Object.fromEntries(basket)), cookieOptions)
}

function onSetProductQuantity(productId: number, requestedQuantity: number) {
  if (requestedQuantity === 0)
    basket.delete(productId)
  else
    basket.set(productId, requestedQuantity)

  console.log(basket);
  Cookies.set('basket', JSON.stringify(Object.fromEntries(basket)), cookieOptions)
}


function onSearchSubmitted() {
  const productContainer = document.querySelectorAll('.productList > .shop-product.card')
  // toggle visibility of product cards in the productContainer based on search string
  productContainer.forEach((element) => {
    const productTitle = element.querySelector('.shop-product-title') as HTMLDivElement | null
    if (productTitle === null)
      return

    const title = productTitle.textContent
    if (title === null)
      return

    const titleLower = title.toLowerCase()
    const searchStrLower = searchStr.toLowerCase().trim()
    element.classList.toggle('d-none', !(searchStrLower === '') && !titleLower.includes(searchStrLower))
  })
}

function updateDisplayedProductCards() {
  const mainElement = document.querySelector('main') as HTMLElement | null
  const productContainer = document.querySelector('.productList') as HTMLDivElement | null

  const lazyLoader = new LazyLoad({
    container: mainElement!,
  })

  productContainer?.replaceChildren(...allProductElements)

  lazyLoader.update()
}

async function asyncMakeProductCardElements() {
  const mainElement = document.querySelector('main') as HTMLElement | null

  const observerOptions = {
    root: mainElement,
    rootMargin: '100px',
    threshold: 0,
  } satisfies IntersectionObserverInit

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('hide', !entry.isIntersecting)
    })
  }, observerOptions)

  const creationTasks = await Promise.allSettled(
    products.map(async (product) => {
      const productCard = createProductCard(product, onAddToBasketClicked, onSetProductQuantity)
      observer.observe(productCard)
      return productCard
    }),
  )

  allProductElements.push(...creationTasks.map((result) => {
    if (result.status === 'fulfilled')
      return result.value

    console.error(result.reason)
    return document.createElement('div')
  }))
}
