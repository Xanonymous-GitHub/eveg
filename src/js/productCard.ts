import type { Product } from './typing.ts'

const cardTemplateStr: string = `
  <div class="shop-product card p-2 w-100" data-num="{{ ID }}">
  <div class="shop-product-details shop-product-title card__title text-center" data-field="title" data-num="{{ ID }}">
    <h3 class="text-nowrap overflow-hidden">{{ TITLE }}</h3>
  </div>
  <div class="card__content d-flex flex-column justify-content-center" data-num="{{ ID }}">
    <div class="shop-product-details shop-product-img m-auto" data-field="img" data-num="{{ ID }}">
    </div>
    <div class="shop-product-details shop-product-price m-auto" data-field="price" data-num="{{ ID }}">
      <span>{{ PRICE }}</span>
    </div>
    <div class="shop-product-details shop-product-units m-auto" data-field="units" data-num="{{ ID }}">
      <span>{{ UNITS }}</span>
    </div>
    <div class="shop-product-buying m-auto" data-num="{{ ID }}">
      <div class="productBasketDiv m-auto">
        <button class="addToBasket m-auto d-block btn btn-warning">Add to Basket</button>
        <div class="adjustDiv my-2">
          <span class="m-auto d-flex justify-content-center input-group">
          <button class="btn adjustDown">-</button>
          <input class="buyInput form-control" data-num="{{ ID }}" min="0" type="number" value="0">
          <button class="btn adjustUp">+</button>
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
  img.className = 'img-fluid lazy'
  img.alt = ''
  img.loading = 'lazy'
  return img
}

// TODO: Migrate to TSX or WebComponents.
export function createProductCard(
  product: Product,
  onAddToBasketRequested: (productId: number, requestedQuantity: number) => void,
): HTMLDivElement {
  const cardHTMLStr = cardTemplateStr
    .replaceAll('{{ ID }}', product.id.toString())
    .replace('{{ TITLE }}', product.name)
    .replace('{{ PRICE }}', `£${(product.unitPrice / 100).toFixed(2)}`)
    .replace('{{ UNITS }}', `${product.quantity} ${product.unit}`)

  const thisProductCardTemplate = document.createElement('template')
  thisProductCardTemplate.insertAdjacentHTML('beforeend', cardHTMLStr)
  const thisProductCard = thisProductCardTemplate.firstElementChild as HTMLDivElement

  const inputBox = thisProductCard.querySelector('.buyInput') as HTMLInputElement

  thisProductCard.querySelector('.adjustUp')?.addEventListener('click', () => {
    inputBox.value = (Number.parseInt(inputBox.value) + 1).toString()
  })

  thisProductCard.querySelector('.adjustDown')?.addEventListener('click', () => {
    const newValue = Number.parseInt(inputBox.value) - 1
    inputBox.value = newValue < 0 ? '0' : newValue.toString()
  })

  thisProductCard.querySelector('.addToBasket')?.addEventListener(
    'click',
    () => onAddToBasketRequested(product.id, Number.parseInt(inputBox.value)),
  )

  const img = createProductImageElement(`/images/${product.imgName}`)
  setTimeout((thisProductCard) => {
    thisProductCard.querySelector('.shop-product-img')?.appendChild(img)
  }, 0, thisProductCard)

  return thisProductCard
}
