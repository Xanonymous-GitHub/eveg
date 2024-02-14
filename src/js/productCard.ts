import Swal from 'sweetalert2'
import type { Product } from './typing.ts'

const cardTemplateStr: string = `
<div class="shop-product card p-2 w-100" data-num="{{ ID }}">
  <div class="shop-product-details shop-product-img m-auto" data-field="img" data-num="{{ ID }}"></div>
  <div class="shop-product-details shop-product-title card__title text-center" data-field="title" data-num="{{ ID }}">
    <h2 class="text-nowrap overflow-hidden">{{ TITLE }}</h2>
  </div>
  <div class="card__content d-flex flex-column justify-content-center" data-num="{{ ID }}">
    <span class="shop-product-details shop-product-price m-auto" data-field="price" data-num="{{ ID }}">
      <span>{{ PRICE }}</span>
    </span>
    <span class="shop-product-details shop-product-units m-auto" data-field="units" data-num="{{ ID }}">
      <span>{{ UNITS }}</span>
    </span>
    <div class="shop-product-buying m-auto" data-num="{{ ID }}">
      <div class="productBasketDiv m-auto">
        <button class="addToBasket m-auto d-block btn btn-warning">Add to Basket</button>
        <div class="adjustDiv my-2 d-none">
          <span class="m-auto d-flex justify-content-center input-group">
            <button class="btn adjustDown">-</button>
            <input class="buyInput form-control" data-num="{{ ID }}" min="0" type="number" value="1" />
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
  onSetProductQuantity: (productId: number, requestedQuantity: number) => void,
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

  const onInputBoxChanged = () => {
    if (inputBox.value === '0' || inputBox.value === '') {
      const addToBasketBtn = thisProductCard.querySelector('.addToBasket') as HTMLDivElement
      const adjustDiv = addToBasketBtn.nextElementSibling as HTMLDivElement
      addToBasketBtn.classList.remove('d-none')
      adjustDiv.classList.add('d-none')
    }
    else {
      onSetProductQuantity(product.id, Number.parseInt(inputBox.value))
    }
  }

  inputBox?.addEventListener('change', onInputBoxChanged)

  inputBox?.addEventListener('keyup', (e) => {
    if (e.key === 'Enter')
      onInputBoxChanged()
  })

  thisProductCard.querySelector('.adjustUp')?.addEventListener('click', () => {
    onAddToBasketRequested(product.id, 1)
    inputBox.value = (Number.parseInt(inputBox.value) + 1).toString()
  })

  thisProductCard.querySelector('.adjustDown')?.addEventListener('click', () => {
    onAddToBasketRequested(product.id, -1)
    const newValue = Number.parseInt(inputBox.value) - 1
    inputBox.value = newValue <= 0 ? '1' : newValue.toString()
    if (newValue === 0) {
      const addToBasketBtn = thisProductCard.querySelector('.addToBasket') as HTMLDivElement
      const adjustDiv = addToBasketBtn.nextElementSibling as HTMLDivElement
      addToBasketBtn.classList.remove('d-none')
      adjustDiv.classList.add('d-none')
    }
  })

  thisProductCard.querySelector('.addToBasket')?.addEventListener(
    'click',
    async (e) => {
      onAddToBasketRequested(product.id, 1)
      const addToBasketBtn = e.target as HTMLButtonElement
      const adjustDiv = addToBasketBtn.nextElementSibling as HTMLDivElement
      addToBasketBtn.classList.add('d-none')
      adjustDiv.classList.remove('d-none')
      const newValue = Number.parseInt(inputBox.value)
      inputBox.value = newValue <= 0 ? '1' : newValue.toString()

      await Swal.fire({
        timerProgressBar: true,
        icon: 'success',
        title: `${product.name} was added to basket.`,
        showConfirmButton: false,
        timer: 2000, // Close after 1500ms (1.5 seconds)
      })
    },
  )

  const img = createProductImageElement(`/images/${product.imgName}`)
  setTimeout((thisProductCard) => {
    thisProductCard.querySelector('.shop-product-img')?.appendChild(img)
  }, 0, thisProductCard)

  return thisProductCard
}
