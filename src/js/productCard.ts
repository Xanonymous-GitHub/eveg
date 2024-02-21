import swal from 'sweetalert'
import type { Product } from './typing.ts'
import { MAX_PRODUCT_QUANTITY } from './shared.ts'

const cardTemplateStr: string = `
<div class="shop-product card p-2 w-100" data-num="{{ ID }}">
  <div class="shop-product-details shop-product-img m-auto" data-field="img" data-num="{{ ID }}">
    <div class="shop-product-img-box mt-3"></div>
  </div>
  <div class="shop-product-details shop-product-title card__title text-center" data-field="title" data-num="{{ ID }}">
    <h2 class="text-nowrap overflow-hidden">{{ TITLE }}</h2>
  </div>
  <div class="card__content d-flex flex-column justify-content-center gy-5" data-num="{{ ID }}">
    <span class="shop-product-details shop-product-price m-auto" data-field="price" data-num="{{ ID }}">
      <span>{{ PRICE }}</span>
    </span>
    <span class="shop-product-details shop-product-units m-auto my-2 text-muted" data-field="units" data-num="{{ ID }}">
      <span>{{ UNITS }}</span>
    </span>
    <div class="shop-product-buying m-auto" data-num="{{ ID }}">
      <div class="productBasketDiv m-auto">
        <button class="addToBasket m-auto d-block btn btn-warning">Add to basket</button>
        <div class="adjustDiv my-2 d-none">
          <span class="m-auto d-flex justify-content-center input-group">
            <button class="btn adjustDown btn-warning">-</button>
            <input class="buyInput form-control" data-num="{{ ID }}" min="0" max="100" type="number" value="1" />
            <button class="btn adjustUp btn-warning">+</button>
          </span>
        </div>
      </div>
    </div>
  </div>
</div>
`

function createProductImageElement(src: string): HTMLImageElement {
  const img = document.createElement('img')
  img.src = src
  img.className = 'img-fluid rounded hide'
  img.alt = ''
  img.loading = 'lazy'
  return img
}

// TODO: Migrate to TSX or WebComponents.
export function createProductCard(
  product: Product,
  basketQuantity: number,
  onAddToBasketRequested: (productId: number, requestedQuantity: number) => number,
  onSetProductQuantity: (productId: number, requestedQuantity: number) => number,
): HTMLDivElement {
  const cardHTMLStr = cardTemplateStr
    .replaceAll('{{ ID }}', product.id.toString())
    .replace('{{ TITLE }}', product.name)
    .replace('{{ PRICE }}', `£${(product.unitPrice / 100).toFixed(2)}`)
    .replace('{{ UNITS }}', `${product.quantity} ${product.unit === 'unit' ? (product.quantity === 1 ? 'unit' : 'units') : product.unit}`)

  const thisProductCardTemplate = document.createElement('template')
  thisProductCardTemplate.insertAdjacentHTML('beforeend', cardHTMLStr)
  const thisProductCard = thisProductCardTemplate.firstElementChild as HTMLDivElement

  const inputBox = thisProductCard.querySelector('.buyInput') as HTMLInputElement

  // Listeners

  const onInputBoxChanged = () => {
    const addToBasketBtn = thisProductCard.querySelector('.addToBasket') as HTMLButtonElement
    const adjustDiv = addToBasketBtn.nextElementSibling as HTMLDivElement

    if (inputBox.valueAsNumber <= 0) {
      addToBasketBtn.classList.remove('d-none')
      adjustDiv.classList.add('d-none')
      onSetProductQuantity(product.id, 0)
    }
    else {
      const newQuantity = onSetProductQuantity(product.id, inputBox.valueAsNumber)
      addToBasketBtn.classList.add('d-none')
      adjustDiv.classList.remove('d-none')
      inputBox.value = newQuantity.toString();
      (thisProductCard.querySelector('.adjustUp') as HTMLButtonElement).disabled = !(newQuantity < MAX_PRODUCT_QUANTITY)
    }
  }

  inputBox?.addEventListener('change', onInputBoxChanged)
  inputBox?.addEventListener('keyup', (e) => {
    if (e.key === 'Enter')
      onInputBoxChanged()
  })

  thisProductCard.querySelector('.adjustUp')?.addEventListener('click', () => {
    const newQuantity = onAddToBasketRequested(product.id, 1)
    inputBox.value = newQuantity.toString()
    if (newQuantity === MAX_PRODUCT_QUANTITY)
      (thisProductCard.querySelector('.adjustUp') as HTMLButtonElement).disabled = true
  })

  thisProductCard.querySelector('.adjustDown')?.addEventListener('click', () => {
    const newQuantity = onAddToBasketRequested(product.id, -1)
    inputBox.value = newQuantity.toString()
    if (newQuantity === 0) {
      const addToBasketBtn = thisProductCard.querySelector('.addToBasket') as HTMLButtonElement
      const adjustDiv = addToBasketBtn.nextElementSibling as HTMLDivElement
      addToBasketBtn.classList.remove('d-none')
      adjustDiv.classList.add('d-none')
    }
    (thisProductCard.querySelector('.adjustUp') as HTMLButtonElement).disabled = false
  })

  thisProductCard.querySelector('.addToBasket')?.addEventListener(
    'click',
    (e) => {
      e.preventDefault()

      const newQuantity = onAddToBasketRequested(product.id, 1)
      const addToBasketBtn = e.target as HTMLButtonElement
      const adjustDiv = addToBasketBtn.nextElementSibling as HTMLDivElement
      addToBasketBtn.classList.add('d-none')
      adjustDiv.classList.remove('d-none')

      inputBox.value = newQuantity.toString()

      swal({
        icon: 'success',
        title: `${product.name} ${product.name.endsWith('s') ? 'were' : 'was'} added to basket.`,
        timer: 2000,
      }).then()
    },
  )

  // Set initial quantity value and dispatch change event to trigger listener
  inputBox.value = basketQuantity.toString()
  inputBox.dispatchEvent(new Event('change'))

  // Add product image
  setTimeout((thisProductCard) => {
    const img = createProductImageElement(`/images/${product.imgName}`)

    const observerOptions = {
      rootMargin: '-100px',
      threshold: 0,
    } satisfies IntersectionObserverInit

    const observer = new IntersectionObserver(async (entries) => {
      const entry = entries[0]
      if (entry.isIntersecting) {
        await new Promise(resolve => setTimeout(resolve, 300))
        entry.target.classList.remove('hide')
      }
      else {
        entry.target.classList.add('hide')
      }
    }, observerOptions)

    setTimeout(() => observer.observe(img), 0)

    thisProductCard.querySelector('.shop-product-img-box')?.appendChild(img)
  }, 0, thisProductCard)

  return thisProductCard
}
