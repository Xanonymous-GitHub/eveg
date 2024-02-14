import { getCookie, initProducts, productDetails, setCookie } from './products.js'


let searchStr = ''
const basket = {}
// Each product is based on a 'card'; a box that contains information about that product.
// You can change the card template here. The [EVEGPRODUCT#] will always be subsituted for
// the element in the imagesArr (see fruit.js)
// The classes can be styled using CSS
// The adjustDown and adjustUp buttons have their behaviour specified below, but you can change this if you like
// To change the quantity of a product, change the value of the input (with the class of buyInput), you can then recalculate the basket with refreshBasket()
// Or you can adjust the basket object via javascript and call updateQuantityInputs() and refreshBasket()
const cardTemplate = `<div class="shop-product" data-num="[EVEGPRODUCT#]">
<div class="shop-product-details shop-product-img" data-field="img" data-num="[EVEGPRODUCT#]"></div>
<div class="shop-product-details shop-product-title card__title" data-field="title" data-num="[EVEGPRODUCT#]"></div>
<div class="card__content" data-num="[EVEGPRODUCT#]">  
<div class="shop-product-details shop-product-weight" data-field="weight" data-num="[EVEGPRODUCT#]"></div>
<div class="shop-product-details shop-product-price" data-field="price" data-num="[EVEGPRODUCT#]"></div>
<div class="shop-product-details shop-product-units" data-field="units" data-num="[EVEGPRODUCT#]"></div>
<div class="shop-product-buying" data-num="[EVEGPRODUCT#]">
    <div class="productBasketDiv">
      <div id = "buttonBasket" class="adjustDiv2">
        <button class="addToBasket btn btn-warning">Add to Basket</button>
      </div>
      <div id = "trio" class="adjustDiv hidden">
        <button class="btn adjustDown">-</button>
        <input class="buyInput" data-num="[EVEGPRODUCT#]" min="0" value="0" type="number">
        <button class="btn adjustUp">+</button>
      </div>
    </div>
  </div>
</div>`


function init() {
  const toggleButton = document.getElementsByClassName('toggle-button')[0]
  const hero = document.getElementsByClassName('hero')[0]
  const navbarLinks = document.getElementsByClassName('navbar-links')[0]


  // When the toggle button is pressed (if visible by the screen size, the menu is shown)
  toggleButton.addEventListener('click', () => {
    navbarLinks.classList.toggle('active')
    hero.classList.toggle('menuactive')
  })


  const searchBar = document.getElementsByClassName('search-bar')[0]
  // Show the search bar when the search link is pressed
  document.getElementById('search-link').addEventListener('click', () => {
    searchBar.classList.toggle('active')
    document.getElementById('searchbox').focus()
  })


  // Close the search bar
  document.getElementById('searchbutton').addEventListener('click', () => {
    searchStr = document.getElementById('searchbox').value
    redraw()
  })


  // Close the search bar
  document.getElementById('closesearchbutton').addEventListener('click', () => {
    searchStr = ''
    searchBar.classList.remove('active')
    redraw()
  })


  // Close the cookies message
  document.getElementById('acceptCookies').addEventListener('click', () => {
    setCookie('cookieMessageSeen', true)
    document.getElementById('cookieMessage').style.display = 'none'
  })


  if (getCookie('cookieMessageSeen') === 'true')
    document.getElementById('cookieMessage').style.display = 'none'


  initProducts(redraw)
}


/*
* When changing the page, you should make sure that each adjust button has exactly one click event
* (otherwise it might trigger multiple times)
* So this function loops through each adjustment button and removes any existing event listeners
* Then it adds another event listener
*/
function resetListeners() {
  let elements = document.getElementsByClassName('adjustUp')
  let eIn
  for (eIn = 0; eIn < elements.length; eIn++) {
    elements[eIn].removeEventListener('click', increment)
    elements[eIn].addEventListener('click', increment)
  }
  elements = document.getElementsByClassName('adjustDown')
  for (eIn = 0; eIn < elements.length; eIn++) {
    elements[eIn].removeEventListener('click', decrement)
    elements[eIn].addEventListener('click', decrement)
  }
  elements = document.getElementsByClassName('buyInput')
  for (eIn = 0; eIn < elements.length; eIn++) {
    elements[eIn].removeEventListener('change', inputchange)
    elements[eIn].addEventListener('change', inputchange)
  }
  elements = document.getElementsByClassName('addToBasket')
  for (eIn = 0; eIn < elements.length; eIn++) {
    elements[eIn].removeEventListener('click', increment)
    elements[eIn].addEventListener('click', increment)
  }
}


// When the input changes, add a 'bought' class if more than one is added
function inputchange(ev) {
  const thisID = ev.target.parentElement.closest('.card__content').getAttribute('data-num')
  changeQuantity(thisID, ev.target.parentElement.closest('.shop-product-buying').getElementsByTagName('input')[0].value)
}


/*
* Change the quantity of the product with productID
*/
function changeQuantity(productID, newQuantity) {
  basket[productID] = newQuantity
  if (newQuantity === 0)
    delete basket[productID]
  document.querySelector(`.buyInput[data-num='${productID}']`).value = newQuantity
  refreshBasket()
}


// Add 1 to the quantity
function increment(ev) {
  const thisID = ev.target.parentElement.closest('.card__content').getAttribute('data-num')
  if (basket[thisID] === undefined)
    basket[thisID] = 0


  changeQuantity(thisID, Number.parseInt(basket[thisID]) + 1)
}


// Subtract 1 from the quantity
function decrement(ev) {
  const thisID = ev.target.parentElement.closest('.card__content').getAttribute('data-num')
  if (basket[thisID] === undefined) {
    changeQuantity(thisID, 0)
  }
  else {
    if (basket[thisID] > 0)
      changeQuantity(thisID, Number.parseInt(basket[thisID]) - 1)
  }
}


function filterFunction(a) {
  /* This demonstrates how to filter based on the search term */
  return a.name.toLowerCase().includes(searchStr.toLowerCase())


  // If you wanted to just filter based on fruit/veg you could do something like this:
  // return a.type == 'veg';
  // return a.type == 'fruit';
  // return true;
}


function sortFunction(a, b) {
  return a.price > b.price
}


// Redraw all products based on the card template
function redraw() {
  // Reset the product list (there are possibly more efficient ways of doing this, but this is simplest)
  document.querySelector('.productList').innerHTML = ''


  const shownProducts = productDetails.filter(filterFunction)


  shownProducts.sort(sortFunction)


  const numProducts = shownProducts.length


  for (let i = 0; i < numProducts; i++) {
    const cardHTML = cardTemplate.replaceAll('[EVEGPRODUCT#]', shownProducts[i].productID)
    const thisProduct = document.createElement('div')
    thisProduct.innerHTML = cardHTML
    document.querySelector('.productList').appendChild(thisProduct.firstChild)
  }


  document.querySelectorAll('.shop-product-details').forEach((element) => {
    const field = element.getAttribute('data-field')
    const num = element.getAttribute('data-num')
    switch (field) {
      case 'title':
        element.textContent = productDetails[num].name
        break
      case 'img':
        element.innerHTML = `<span class="imgspacer"></span><img src="images/${productDetails[num].image}" alt=''>`
        break
      case 'weight':
        element.innerHTML = `<div> ${productDetails[num].weight} </div>`
        break
      case 'price':
        element.innerHTML = `<span class="with-padding">£${(productDetails[num].price / 100).toFixed(2)}</span>`
        break
      case 'units':
        element.innerHTML = `<span class="fontreductionandcolor">${productDetails[num].packsize}/${productDetails[num].units}</span>`
        break
    }
  })
  resetListeners()
  updateQuantityInputs()
}


document.addEventListener('DOMContentLoaded', () => {
  init();


  // Add event listener to toggle visibility
  document.querySelectorAll('.addToBasket').forEach((addToBasketBtn) => {
    addToBasketBtn.addEventListener('click', function () {
     
      const addToBasketBtn = this;
      const adjustDiv = addToBasketBtn.closest('.shop-product').querySelector('.adjustDiv');
      // window.alert(adjustDiv.classList);
      // window.alert(addToBasketBtn.classList)
      addToBasketBtn.classList.add('hidden');
      adjustDiv.classList.remove('hidden');
      // window.alert(adjustDiv.classList);
      // window.alert(addToBasketBtn.classList);
    });
  });


  document.querySelectorAll('.buyInput').forEach((buyInput) => {
    buyInput.addEventListener('change', function (event) {
      const currentValue = event.target.value;
      const addInput = this;
      const button = addInput.closest('.shop-product').querySelector('.addToBasket');
      const trio = addInput.closest('.shop-product').querySelector('.adjustDiv');
      if (Number(currentValue) === 0) {
        // window.alert(button.classList)
        // window.alert(trio.classList)
        trio.classList.add('hidden');
        button.classList.remove('hidden');
        // window.alert(button.classList)
        // window.alert(trio.classList)
      }
      //  else {
      //   addInput.classList.add('hidden');
      //   adjustDiv.classList.remove('hidden');
      // }


      const thisID = this.getAttribute('data-num');
      changeQuantity(thisID, currentValue);
    });
  });


  document.querySelectorAll('.btn').forEach((adjustBtn) => {
    adjustBtn.addEventListener('click', function () {
      const button = this.closest('.shop-product').querySelector('.addToBasket');
      const adjustDiv = this.closest('.shop-product').querySelector('.adjustDiv');
      window.alert(Number(button.querySelector('.buyInput').value));
      if (Number(button.querySelector('.buyInput').value) === 0) {
        button.classList.remove('hidden');
        adjustDiv.classList.add('hidden');
      }
    });
  });
});


function updateQuantityInputs() {
  for (const buyInput of document.querySelectorAll('.buyInput')) {
    let quantity = basket[buyInput.getAttribute('data-num')]
    if (Number.isNaN(quantity))
      quantity = 0


    buyInput.value = quantity
  }
}


// Recalculate basket
function refreshBasket() {
  let total = 0
  for (const productID in basket) {
    const quantity = basket[productID]
    const price = productDetails[productID].price
    total = total + (price * quantity)
  }
  setCookie('basket', JSON.stringify(basket))
  try {
    document.querySelector('#basketNumTotal').innerHTML = (total / 100).toFixed(2)
  }
  catch (e) {


  }
  return total
}



