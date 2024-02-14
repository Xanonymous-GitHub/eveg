import Swal from 'sweetalert2'
import { products } from './products.ts'
import type { Basket } from './typing'
import { readBasketCookie } from './shared'

const creditCardShown = false
const basket: Basket = readBasketCookie()

addEventListener('DOMContentLoaded', init)

function init() {
  setTimeout(() => {
    updateCheckoutList()
    updateTotalPrice()
    resetListeners()
  })
}

function resetListeners() {
  // document.querySelector('#paycreditcard')?.addEventListener('click', showCreditCardPage)
  document.querySelector('#paycreditcard')?.addEventListener('click', showSweetAlert)
}

function showCreditCardPage(e: Event) {
  e.preventDefault()

  if (!creditCardShown) {
    const payIFrame = document.createElement('iframe')
    payIFrame.src = 'creditcard.html'
    payIFrame.width = '100%'
    payIFrame.height = '500px'
    document.querySelector('#customerDetails')?.replaceChildren(payIFrame)
  }
}

function showSweetAlert(e: Event) {
  e.preventDefault()

  Swal.fire({
    title: 'Are you sure to checkout?',
    icon: 'warning',
    confirmButtonText: 'Yes',
    confirmButtonColor: '#d33',
    showCancelButton: true,
  }).then((result) => {
    if (result.isConfirmed)
      showCreditCardPage(e)
  })
}

function calculateTotalPrice() {
  return Array.from(
    basket,
    ([productID, quantity]) => products[productID].unitPrice * quantity,
  ).reduce((a, b) => a + b, 0)
}

function updateTotalPrice() {
  const totalPrice = calculateTotalPrice()
  const totalPriceElement = document.querySelector('#basket-total-price') as HTMLTableCellElement
  totalPriceElement.textContent = `£ ${(totalPrice / 100).toFixed(2)}`
}

function updateCheckoutList() {
  const checkoutList = document.querySelector('.checkoutList tbody') as HTMLTableElement
  const basketItemRows: Array<HTMLTableRowElement> = []

  if (basket.size === 0)
    return

  for (const [id, quantity] of basket) {
    const rowHeader = document.createElement('th')
    const nameCol = document.createElement('td')
    const quantityCol = document.createElement('td')
    const priceCol = document.createElement('td')
    const totalCol = document.createElement('td')
    const row = document.createElement('tr')

    const unitPrice = (products[id].unitPrice / 100)

    rowHeader.scope = 'row'
    nameCol.textContent = products[id].name
    quantityCol.textContent = quantity.toString()
    priceCol.textContent = `£ ${unitPrice.toFixed(2)}`
    totalCol.textContent = `£ ${(unitPrice * quantity).toFixed(2)}`

    row.replaceChildren(nameCol, quantityCol, priceCol, totalCol)
    basketItemRows.push(row)
  }

  checkoutList.replaceChildren(...basketItemRows)
}
