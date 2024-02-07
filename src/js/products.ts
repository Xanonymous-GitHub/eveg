import productRaw from '../products.json'
import type { Product } from './typing'
export const products = productRaw as unknown as Array<Readonly<Product>>
//
// export const productDetails = []
//
// export function initProducts(callback) {
//   for (let i = 0; i < imagesArr.length; i++) {
//     const thisProduct = {
//       name: imagesArr[i][0],
//       type: imagesArr[i][1],
//       image: imagesArr[i][2],
//       packsize: imagesArr[i][3],
//       units: imagesArr[i][4],
//       price: imagesArr[i][5],
//       productID: i,
//     }
//     productDetails.push(thisProduct)
//   }
//   if (callback !== undefined)
//     callback()
// }
//
// export function setCookie(cname, cvalue) {
//   const d = new Date()
//   d.setTime(d.getTime() + (60 * 60 * 1000))
//   const expires = `expires=${d.toUTCString()}`
//   document.cookie = `${cname}=${cvalue};${expires};path=/`
// }
//
// export function getCookie(cname) {
//   const name = `${cname}=`
//   const decodedCookie = decodeURIComponent(document.cookie)
//   const ca = decodedCookie.split(';')
//   for (let i = 0; i < ca.length; i++) {
//     let c = ca[i]
//     while (c.charAt(0) === ' ')
//       c = c.substring(1)
//
//     if (c.indexOf(name) === 0)
//       return c.substring(name.length, c.length)
//   }
//   return ''
// }
