import swal from 'sweetalert'
import { products } from './products.ts'
import type { Basket } from './typing'
import { DialogCloseResult, readBasketCookie } from './shared'

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
  document.querySelector('#paycreditcard')?.addEventListener('click', (e) => {
    showSweetAlert(e, (result) => {
      if (result === DialogCloseResult.Yes)
        showCreditCardPage(e)
    }).then()
  })
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

async function showSweetAlert(e: Event, onDialogClose?: (result: DialogCloseResult) => void) {
  e.preventDefault()

  const result = await swal({
    title: 'Are you sure to checkout?',
    icon: 'warning',
    buttons: {
      cancel: {
        visible: true,
        text: 'Cancel',
        value: DialogCloseResult.Cancel,
      },
      yes: {
        visible: true,
        text: 'Yes',
        className: 'bg-danger',
        value: DialogCloseResult.Yes,
      },
    },
  })

  onDialogClose && onDialogClose(result)
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
