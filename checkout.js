let productDetails = {};
let creditCardShown = false;

/*
* When the page is loaded, initialise the products and reset the listeners
*/
function init(){
  //initProducts takes a callback function - when the products are loaded the basket will be recalculated
  initProducts(calculateBasket);
  resetListeners();
}

//When changing the page, you should make sure that each adjust button has exactly one click event
//(otherwise it might trigger multiple times)
function resetListeners(){
document.getElementById("paycreditcard").removeEventListener("click",showCreditCardPage);
document.getElementById("paycreditcard").addEventListener('click',showCreditCardPage);
}

//When the pay by credit card link is clicked, show the creditcard.html in an iframe
function showCreditCardPage(){
  if(!creditCardShown){
    var payIFrame = document.createElement("iframe");
    payIFrame.src = "creditcard.html";
    payIFrame.width = "50%";
  
    document.querySelector('#customerDetails').appendChild(payIFrame);
  }
}


/*
* Calculate the totals and show the basket
*/
function calculateBasket(){
  let total = 0;
  let basket = JSON.parse(getCookie("basket"));
  document.querySelector('.checkoutList').innerHTML = '';
  for(const productID in basket){
    let quantity = basket[productID];
    let price = productDetails[productID].price;
    let productTotal = price * quantity;
    total = total + productTotal;
    let rowHTML = `<td>${productDetails[productID].name}</td><td>${quantity}</td><td>${(price / 100).toFixed(2)}</td><td>£${(productTotal / 100).toFixed(2)}</td>`;
    var thisProduct = document.createElement("tr");
    thisProduct.innerHTML = rowHTML;
    document.querySelector('.checkoutList').appendChild(thisProduct);
  }
  let rowHTML = `<td colspan="3">Total:</td><td>£${(total / 100).toFixed(2)}</td>`;
  var thisProduct = document.createElement("tr");
  thisProduct.innerHTML = rowHTML;
  document.querySelector('.checkoutList').appendChild(thisProduct);
}

window.addEventListener("load", init);