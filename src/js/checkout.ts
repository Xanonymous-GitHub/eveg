import swal from 'sweetalert'
import Cookies from 'js-cookie'
import { products } from './products.ts'
import type { Basket } from './typing'
import { DialogCloseResult, cookieOptions, readBasketCookie } from './shared'

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
    showSweetAlert('Are you sure?', e, (result) => {
      if (result === DialogCloseResult.Yes)
        showCreditCardPage(e)
    }).then()
  })

  document.querySelector('#clearbasket')?.addEventListener('click', (e) => {
    showSweetAlert('All items in the basket will be removed. Continue?', e, (result) => {
      if (result === DialogCloseResult.Yes) {
        basket.clear()
        Cookies.remove('basket', cookieOptions)
        window.location.reload()
      }
    }).then()
  })
  document.querySelector('#paycreditcard')?.addEventListener('click', onCheckoutButtonClicked)
}

function onCheckoutButtonClicked(e: Event) {
  if (!isCheckoutFormValidated()) {
    e.preventDefault()
    e.stopPropagation()
    return
  }
  showSweetAlert(e, (result) => {
    if (result === DialogCloseResult.Yes)
      showCreditCardPage(e)
  }).then()
}

function isCheckoutFormValidated(): boolean {
  const form = document.querySelector('.needs-validation') as HTMLFormElement
  const isValidated = form.checkValidity()
  if (!isValidated)
    form.classList.add('was-validated')
  return isValidated
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

async function showSweetAlert(message: string, e: Event, onDialogClose?: (result: DialogCloseResult) => void) {
  e.preventDefault()

  const result = await swal({
    title: message,
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
  const payByCreditCardButton = document.querySelector('#paycreditcard') as HTMLButtonElement

  const totalPricePretty = `£${(totalPrice / 100).toFixed(2)}`
  totalPriceElement.textContent = totalPricePretty
  payByCreditCardButton.textContent = `Pay ${totalPricePretty}`
}

function updateCheckoutList() {
  const checkoutList = document.querySelector('.checkoutList tbody') as HTMLTableElement
  const basketItemRows: Array<HTMLTableRowElement> = []

  if (basket.size === 0) {
    (document.querySelector('#clearbasket') as HTMLButtonElement).disabled = true
    return
  }

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
