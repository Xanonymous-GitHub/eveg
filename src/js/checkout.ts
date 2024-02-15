import swal from 'sweetalert'
import Cookies from 'js-cookie'
import { products } from './products.ts'
import type { Basket } from './typing'
import { DialogCloseResult, cookieOptions, readBasketCookie } from './shared'
import { isExpirationDateValid, isSecurityCodeValid, isValid } from './creditCard.ts'

const basket: Basket = readBasketCookie()

const EMPTY_BASKET_HTML = `<div id="basket" class="table-group-divider overflow-y-auto h-100"><tr><td colspan="5" class="text-center">Nothing here 🥹!</td></tr></div>`

addEventListener('DOMContentLoaded', init)

function init() {
  setTimeout(() => {
    updateCheckoutList()
    updateTotalPrice()
    resetListeners()
  })
}

function resetListeners() {
  document.querySelector('#clearbasket')?.addEventListener('click', (e) => {
    showSweetAlert('All items in the basket will be removed. Continue?', e, (result) => {
      if (result === DialogCloseResult.Yes) {
        basket.clear()
        Cookies.remove('basket', cookieOptions)
        updateCheckoutList()
        updateTotalPrice()
      }
    }).then()
  })
  const form = document.querySelector('.needs-validation') as HTMLFormElement
  document.querySelector('#paycreditcard')?.addEventListener('click', e => onCheckoutButtonClicked(e, form))
  initiateCreditCardFormDataBinding(form)
}

function onCheckoutButtonClicked(e: Event, form: HTMLFormElement) {
  e.preventDefault()
  e.stopPropagation()

  if (!isCheckoutFormValidated(form)) {
    form.classList.add('was-validated') // TODO: Does this do anything
    return
  }

  showSweetAlert('Are you sure?', e, (result) => {
    if (result === DialogCloseResult.Yes)
      showCreditCardPage(e)
  }).then()
}

function isCheckoutFormValidated(form: HTMLFormElement): boolean {
  return form.checkValidity()
}

function initiateCreditCardFormDataBinding(parentForm: HTMLFormElement) {
  const cardNumberInput = parentForm['cc-number'] as HTMLInputElement
  const cardNumberInputInvalidFeedback = cardNumberInput.nextElementSibling as HTMLDivElement

  const cardExpirationInput = parentForm['cc-expiration'] as HTMLInputElement
  const cardExpirationInputInvalidFeedback = cardExpirationInput.nextElementSibling as HTMLDivElement

  const cardCVCInput = parentForm['cc-cvv'] as HTMLInputElement
  const cardCVCInputInvalidFeedback = cardCVCInput.nextElementSibling as HTMLDivElement

  const allInputBoxEvents = ['change', 'keyup', 'unfocus']
  allInputBoxEvents.forEach((event) => {
    cardNumberInput.addEventListener(event, () => {
      cardNumberInput.setCustomValidity(
        isValid(cardNumberInput.value) ? '' : 'Invalid card number',
      )
      cardNumberInputInvalidFeedback.textContent = cardNumberInput.value.trim() === ''
        ? 'Credit card number is required'
        : cardNumberInput.validationMessage
    })
    cardExpirationInput.addEventListener(event, () => {
      const [year, month] = cardExpirationInput.value.split('-')
      cardExpirationInput.setCustomValidity(
        isExpirationDateValid(month, year) ? '' : 'Invalid expiration date',
      )
      cardExpirationInputInvalidFeedback.textContent = cardExpirationInput.value.trim() === ''
        ? 'Expiration date is required'
        : cardExpirationInput.validationMessage
    })
    cardCVCInput.addEventListener(event, () => {
      cardCVCInput.setCustomValidity(
        isSecurityCodeValid(cardNumberInput.value, cardCVCInput.value) ? '' : 'Invalid security code',
      )
      cardCVCInputInvalidFeedback.textContent = cardCVCInput.value.trim() === ''
        ? 'Security code is required'
        : cardCVCInput.validationMessage
    })
  })
}

function showCreditCardPage(e: Event) {
  e.preventDefault()

  const payIFrame = document.createElement('iframe')
  payIFrame.src = 'creditcard.html'
  payIFrame.width = '100%'
  payIFrame.height = '500px'
  document.querySelector('#customerDetails')?.replaceChildren(payIFrame);
  (document.querySelector('#clearbasket') as HTMLButtonElement).disabled = true
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
  payByCreditCardButton.textContent = `Pay ${totalPrice > 0 ? totalPricePretty : ''}`
}

function updateCheckoutList() {
  const checkoutList = document.querySelector('.checkoutList tbody') as HTMLTableElement
  const basketItemRows: Array<HTMLTableRowElement> = []

  if (basket.size === 0) {
    (document.querySelector('#clearbasket') as HTMLButtonElement).disabled = true;
    (document.querySelector('#paycreditcard') as HTMLButtonElement).disabled = true
    const checkoutListBody = document.querySelector('.checkoutList tbody')
    checkoutListBody?.replaceChildren()
    checkoutListBody?.insertAdjacentHTML('afterbegin', EMPTY_BASKET_HTML)
    return
  }

  for (const [id, quantity] of basket) {
    const rowHeader = document.createElement('th')
    const nameCol = document.createElement('td')
    const adjustDown = document.createElement('button')
    const quantityCol = document.createElement('td')
    const adjustUp = document.createElement('button')
    const priceCol = document.createElement('td')
    const totalCol = document.createElement('td')
    const removeCol = document.createElement('td')
    const removeButton = document.createElement('button')
    const row = document.createElement('tr')

    const unitPrice = (products[id].unitPrice / 100)

    rowHeader.scope = 'row'
    nameCol.textContent = products[id].name

    adjustDown.classList.add('btn', 'btn-sm', 'btn-outline-secondary', 'me-2', 'adjustDown')
    adjustDown.textContent = '-'
    adjustDown.addEventListener('click', (e) => {
      const newQuantity = quantity - 1
      if (newQuantity <= 0) {
        showSweetAlert('Are you sure you want to remove this item?', e, (result) => {
          if (result === DialogCloseResult.Yes) {
            basket.delete(id)
            Cookies.set('basket', JSON.stringify(Object.fromEntries(basket)), cookieOptions)
            updateCheckoutList()
            updateTotalPrice()
          }
        }).then()
      }
      else { basket.set(id, newQuantity) }

      Cookies.set('basket', JSON.stringify(Object.fromEntries(basket)), cookieOptions)
      updateCheckoutList()
      updateTotalPrice()
    })
    adjustUp.classList.add('btn', 'btn-sm', 'btn-outline-secondary', 'adjustUp', 'ms-2')
    adjustUp.textContent = '+'
    adjustUp.addEventListener('click', () => {
      basket.set(id, basket.get(id)! + 1)
      Cookies.set('basket', JSON.stringify(Object.fromEntries(basket)), cookieOptions)
      updateCheckoutList()
      updateTotalPrice()
    })
    quantityCol.replaceChildren(adjustDown, `${quantity.toString()}`, adjustUp)

    priceCol.textContent = `£ ${unitPrice.toFixed(2)}`
    totalCol.textContent = `£ ${(unitPrice * quantity).toFixed(2)}`

    removeButton.classList.add('btn', 'btn-outline-danger', 'text-nowrap', 'm-0', 'p-1')
    removeButton.innerHTML = `<i class='bi bi-trash'></i>`
    removeCol.style.whiteSpace = 'nowrap'

    removeButton.addEventListener('click', (e) => {
      showSweetAlert('Are you sure you want to remove this item?', e, (result) => {
        if (result === DialogCloseResult.Yes) {
          basket.delete(id)
          Cookies.set('basket', JSON.stringify(Object.fromEntries(basket)), cookieOptions)
          updateCheckoutList()
          updateTotalPrice()
        }
      }).then()
    })

    removeCol.appendChild(removeButton)
    row.replaceChildren(nameCol, quantityCol, priceCol, totalCol, removeCol)
    basketItemRows.push(row)
  }

  checkoutList.replaceChildren(...basketItemRows)
}
