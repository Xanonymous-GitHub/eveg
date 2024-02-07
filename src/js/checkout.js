import Cookies from 'js-cookie'
import { products } from './products.ts'

const creditCardShown = false

/*
* When the page is loaded, initialise the products and reset the listeners
*/
function init() {
  // initProducts takes a callback function - when the products are loaded the basket will be recalculated
  calculateBasket()
  resetListeners()
}

// When changing the page, you should make sure that each adjust button has exactly one click event
// (otherwise it might trigger multiple times)
function resetListeners() {
  document.getElementById('paycreditcard').removeEventListener('click', showCreditCardPage)
  document.getElementById('paycreditcard').addEventListener('click', showCreditCardPage)
}

// When the pay by credit card link is clicked, show the creditcard.html in an iframe
function showCreditCardPage() {
  if (!creditCardShown) {
    const payIFrame = document.createElement('iframe')
    payIFrame.src = 'creditcard.html'
    payIFrame.width = '50%'

    document.querySelector('#customerDetails').appendChild(payIFrame)
  }
}

/*
* Calculate the totals and show the basket
*/
function calculateBasket() {
  let thisProduct
  let total = 0
  const cookies = Cookies.get()
  const basket = JSON.parse(cookies.basket)
  document.querySelector('.checkoutList').innerHTML = ''
  for (const productID in basket) {
    const quantity = basket[productID]
    const price = products[productID].unitPrice
    const productTotal = price * quantity
    total = total + productTotal
    const rowHTML = `<td>${products[productID].name}</td><td>${quantity}</td><td>${(price / 100).toFixed(2)}</td><td>£${(productTotal / 100).toFixed(2)}</td>`
    thisProduct = document.createElement('tr')
    thisProduct.innerHTML = rowHTML
    document.querySelector('.checkoutList').appendChild(thisProduct)
  }
  const rowHTML = `<td colspan="3">Total:</td><td>£${(total / 100).toFixed(2)}</td>`
  thisProduct = document.createElement('tr')
  thisProduct.innerHTML = rowHTML
  document.querySelector('.checkoutList').appendChild(thisProduct)
}

window.addEventListener('load', init)
