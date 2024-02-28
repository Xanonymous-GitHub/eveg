import Cookies from 'js-cookie'
import { products } from './products.ts'
import { createProductCard } from './productCard.ts'
import type { Basket } from './typing'
import { MAX_PRODUCT_QUANTITY, SORT_METHOD, cookieOptions, readBasketCookie } from './shared'

let searchStr = ''
const basket: Basket = readBasketCookie()
let allProductElements: Array<HTMLDivElement> = []

addEventListener('DOMContentLoaded', () => init())

function init() {
  setupSearchEventListeners()
  setupSortingEventListeners()

  setTimeout(async () => {
    await asyncMakeProductCardElements()
    updateDisplayedProductCards()
  })
}

function setupSearchEventListeners() {
  const searchBox = document.querySelector('#searchbox') as HTMLInputElement
  const noResultsDiv = document.querySelector('#noSearchResults') as HTMLDivElement
  const searchButton = document.querySelector('#searchbutton') as HTMLButtonElement
  const closeSearchButton = document.querySelector('#closesearchbutton') as HTMLButtonElement

  searchBox?.addEventListener('input', () => {
    searchStr = searchBox.value.trim()
    if (searchStr === '') {
      onSearchSubmitted()
      closeSearchButton.disabled = false
    }
  })

  searchButton?.addEventListener('click', (e) => {
    e.preventDefault()
    searchStr = searchBox.value.trim()
    onSearchSubmitted()
    if (searchStr.length > 0)
      closeSearchButton.disabled = false
  })

  closeSearchButton?.addEventListener('click', (e) => {
    e.preventDefault()
    if (searchBox.value !== '') {
      searchBox.value = ''
      searchStr = ''
      onSearchSubmitted()
    }
    closeSearchButton.disabled = true
    noResultsDiv.classList.add('d-none')
  })
}

function setupSortingEventListeners() {
  const sortMethodSelect = document.querySelector('#sortMethod') as HTMLSelectElement

  sortMethodSelect?.addEventListener('change', () => {
    sortAndUpdateProductCards(Number.parseInt(sortMethodSelect.value) as SORT_METHOD)
    // TODO: Store sort method in a cookie
  })
}

function onAddToBasketClicked(productId: number, requestedQuantity: number) {
  const currentQuantity = basket.get(productId) ?? 0
  const newQuantity = Math.min(currentQuantity + requestedQuantity, MAX_PRODUCT_QUANTITY) // max quantity 100 per product

  if (newQuantity === 0)
    basket.delete(productId)
  else
    basket.set(productId, newQuantity)

  Cookies.set('basket', JSON.stringify(Object.fromEntries(basket)), cookieOptions)
  return newQuantity
}

function onSetProductQuantity(productId: number, requestedQuantity: number) {
  const newQuantity = Math.min(requestedQuantity, MAX_PRODUCT_QUANTITY)
  if (requestedQuantity === 0)
    basket.delete(productId)
  else
    basket.set(productId, newQuantity)

  Cookies.set('basket', JSON.stringify(Object.fromEntries(basket)), cookieOptions)
  return newQuantity
}

function onSearchSubmitted() {
  const productContainer = document.querySelectorAll('.productList > .shop-product.card')
  const noResultsDiv = document.querySelector('#noSearchResults') as HTMLDivElement
  let itemFound = false
  // toggle visibility of product cards in the productContainer based on search string
  productContainer.forEach((element) => {
    const productTitle = element.querySelector('.shop-product-title') as HTMLDivElement
    if (productTitle === null)
      return

    const title = productTitle.textContent
    if (title === null)
      return

    const titleLower = title.toLowerCase()
    const searchStrLower = searchStr.toLowerCase().trim()
    if (titleLower.includes(searchStrLower)) {
      element.classList.remove('d-none')
      itemFound = true
    }
    else {
      element.classList.add('d-none')
    }
  })

  if (!itemFound)
    noResultsDiv.classList.remove('d-none')
  else
    noResultsDiv.classList.add('d-none')
}

function updateDisplayedProductCards() {
  const productContainer = document.querySelector('.productList') as HTMLDivElement
  productContainer?.replaceChildren(...allProductElements)
}

async function asyncMakeProductCardElements() {
  const mainElement = document.querySelector('main') as HTMLElement

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
      const basketQuantity = basket.get(product.id) ?? 0
      const productCard = createProductCard(product, basketQuantity, onAddToBasketClicked, onSetProductQuantity)
      observer.observe(productCard)
      return productCard
    }),
  )

  allProductElements.push(...creationTasks.map((result) => {
    if (result.status === 'fulfilled')
      return result.value

    return document.createElement('div')
  }))
}

async function sortAndUpdateProductCards(sortMethod: SORT_METHOD) {
  if (sortMethod === SORT_METHOD.PRICE_ASC)
    products.sort((a, b) => a.unitPrice - b.unitPrice)

  else if (sortMethod === SORT_METHOD.PRICE_DESC)
    products.sort((a, b) => b.unitPrice - a.unitPrice)

  else
    products.sort((a, b) => a.name.localeCompare(b.name))

  allProductElements = []
  await asyncMakeProductCardElements()
  updateDisplayedProductCards()
  onSearchSubmitted()
}
