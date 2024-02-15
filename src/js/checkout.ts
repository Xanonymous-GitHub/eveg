import swal from 'sweetalert'
import Cookies from 'js-cookie'
import { products } from './products.ts'
import type { Basket } from './typing'
import { DialogCloseResult, cookieOptions, readBasketCookie } from './shared'
import { isExpirationDateValid, isSecurityCodeValid, isValid } from './creditCard.ts'

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
  document.querySelector('#clearbasket')?.addEventListener('click', (e) => {
    showSweetAlert('All items in the basket will be removed. Continue?', e, (result) => {
      if (result === DialogCloseResult.Yes) {
        basket.clear()
        Cookies.remove('basket', cookieOptions)
        window.location.reload()
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
  payByCreditCardButton.textContent = `Pay ${totalPrice > 0 ? totalPricePretty : ''}`
}

function updateCheckoutList() {
  const checkoutList = document.querySelector('.checkoutList tbody') as HTMLTableElement
  const basketItemRows: Array<HTMLTableRowElement> = []

  if (basket.size === 0) {
    (document.querySelector('#clearbasket') as HTMLButtonElement).disabled = true;
    (document.querySelector('#paycreditcard') as HTMLButtonElement).disabled = true
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
