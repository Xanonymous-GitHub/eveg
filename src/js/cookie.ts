import Cookies from 'js-cookie'
import { cookieOptions } from './shared'

const WARWICK_DCS_URL = 'https://warwick.ac.uk/fac/sci/dcs/'
const COOKIE_HTML = `<div id="cookieMessage" class="p-3 bg-light fixed-bottom d-flex flex-column align-items-center justify-content-center text-center border-top">
<h3 class="mb-3">This site uses cookies</h3>
<p class="mb-1">By using this site, you are consenting to our use of cookies</p>
<p class="mb-1">We use cookies purely for the functionality of the website - to store the products that are in your basket.</p>
<div class="mt-3 d-flex flex-row align-items-center justify-content-center">
  <button class="btn btn-success me-2" id="acceptCookies">Accept</button>
  <button class="btn btn-danger" id="rejectCookies">Reject and exit</button>
</div>
</div>`

addEventListener('DOMContentLoaded', () => init())

function init() {
  document.body.insertAdjacentHTML('afterbegin', COOKIE_HTML)
  setupCookieModalEventListeners()
}

function setupCookieModalEventListeners() {
  const cookieMsgModal = document.querySelector('#cookieMessage') as HTMLDivElement
  document.querySelector('#acceptCookies')?.addEventListener('click', () => {
    Cookies.set('cookieMessageSeen', 'true', cookieOptions)
    cookieMsgModal?.classList.add('d-none')
  })
  document.querySelector('#rejectCookies')?.addEventListener('click', () => {
    window.location.href = WARWICK_DCS_URL
  })

  if (Cookies.get('cookieMessageSeen') === 'true')
    cookieMsgModal?.classList.add('d-none')
}
