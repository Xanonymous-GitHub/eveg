const imagesArr = [['Artichokes', 'veg', 'reut-malichi-GQ62pYNohW0-unsplash.jpg', '1', 'unit', 200], ['Asparagus', 'veg', 'markus-spiske-DPcj8-pMYSs-unsplash.jpg', 125, 'g', 180], ['Beetroot', 'veg', 'emma-jane-hobden-lFxgx7Snyfw-unsplash.jpg', 1, 'kg', 90], ['Peppers', 'veg', 'vino-li-v7H-fV9Ydkk-unsplash.jpg', 3, 'unit', 140], ['Broccoli', 'veg', 'hans-ripa-3hzBK2aPf8s-unsplash.jpg', 350, 'g', 60], ['Brussels Sprouts', 'veg', 'jez-timms-ia9z68YnJdY-unsplash.jpg', 250, 'g', 150], ['Butternut Squash', 'veg', 'andie-kolbeck-lEKiF28dxbk-unsplash.jpg', 1, 'unit', 180], ['Cabbage', 'veg', 'mattia-barbotti-vXTt84S01F0-unsplash.jpg', 1, 'unit', 70], ['Carrots', 'veg', 'k8-GHRT9j21m2M-unsplash.jpg', 1, 'kg', 100], ['Cauliflower', 'veg', 'karolina-kolodziejczak-y4j_bKe0b6Q-unsplash.jpg', 1, 'unit', 90], ['Chard', 'veg', 'heather-barnes-ZGXhE1L7VL8-unsplash.jpg', 150, 'g', 180], ['Chilis', 'veg', 'alexander-schimmeck-JA3FrZ5IEK8-unsplash.jpg', 50, 'g', 60], ['Cucumber', 'veg', 'harshal-s-hirve-2GiRcLP_jkI-unsplash.jpg', 1, 'unit', 50], ['Garlic', 'veg', 'bryam-blanco-c27y-WuwSUA-unsplash.jpg', 150, 'g', 150], ['Kale', 'veg', 'deborah-rainford-3uJcymbLnYA-unsplash.jpg', 250, 'g', 125], ['Leek', 'veg', 'heather-gill-NyI6X3oj7mg-unsplash.jpg', 500, 'g', 95], ['Lettuce', 'veg', 'mae-mu-hugb85v0J04-unsplash.jpg', 1, 'unit', 50], ['Mushrooms', 'veg', 'harshal-s-hirve-oZ0xzQFVCWY-unsplash.jpg', 300, 'g', 100], ['Onion', 'veg', 'leonita-yuliana-sriyanto-wIc_yXhklos-unsplash.jpg', 1, 'kg', 65], ['Peas', 'veg', 'jarek-jordan-WuqQtfhdyfM-unsplash.jpg', 500, 'g', 150], ['Potatoes', 'veg', 'lars-blankers-B0s3Xndk6tw-unsplash.jpg', 1, 'kg', 300], ['Pumpkin', 'veg', 'keenan-sultanik-oxXUePN3u4Q-unsplash.jpg', 1, 'unit', 80], ['Radish', 'veg', 'matilda-bellman-p7R7zdTXXH4-unsplash.jpg', 150, 'g', 100], ['Spinach', 'veg', 'monika-grabkowska-i14VzlCp-Eo-unsplash.jpg', 200, 'g', 255], ['Sweetcorn', 'veg', 'simona-sergi-k8knGtJAaHc-unsplash.jpg', 3, 'unit', 100], ['Tomatoes', 'veg', 'alice-butenko-c1P1mXEHrik-unsplash.jpg', 500, 'g', 350], ['Apples', 'fruit', 'matheus-cenali-wXuzS9xR49M-unsplash.jpg', 6, 'unit', 225], ['Apricots', 'fruit', 'masa-zeks-P_n9OZOcGrw-unsplash.jpg', 320, 'g', 190], ['Blackberries', 'fruit', 'kateryna-moskalova-tFj5BMAwK-Q-unsplash.jpg', 300, 'g', 250], ['Blueberries', 'fruit', 'melissa-belanger-usE0kpV_yLo-unsplash.jpg', 200, 'g', 160], ['Cherries', 'fruit', 'vino-li-OseN2JZdcY4-unsplash.jpg', 700, 'g', 545], ['Grapefruit', 'fruit', 'rayia-soderberg-gUS4Ouhy1pU-unsplash.jpg', 2, 'unit', 310], ['Nectarines', 'fruit', 'dmitriy-koryas--P2YUqgo1Qs-unsplash.jpg', 4, 'unit', 200], ['Peaches', 'fruit', 'jocelyn-morales-ULg84Va3wdA-unsplash.jpg', 2, 'unit', 400], ['Pears', 'fruit', 'tijana-drndarski-RUiYB0Wjx9k-unsplash.jpg', 6, 'unit', 200], ['Plums', 'fruit', 'max-griss-Zfpa8iH5ZkU-unsplash.jpg', 250, 'g', 395], ['Pomegranates', 'fruit', 'gr-stocks-SCMnIJV3DrQ-unsplash.jpg', 1, 'unit', 130], ['Raspberries', 'fruit', 'sina-asgari-sgwxjKLqO24-unsplash.jpg', 300, 'g', 300], ['Strawberries', 'fruit', 'maksim-shutov-IXOjM_g-XBQ-unsplash.jpg', 800, 'g', 300], ['Watermelon', 'fruit', 'juven-dunn-hUkZv0Y47Ic-unsplash.jpg', 1, 'unit', 295], ['Salmon', 'other', 'abstral-official-dKhkCiD4zEQ-unsplash.jpg', 240, 'g', 400], ['Jelly Beans', 'other', 'amit-lahav-3t07n27XK-w-unsplash.jpg', 50, 'g', 100], ['Honey', 'other', 'art-rachen-Asj5DFw8UAw-unsplash.jpg', 1, 'unit', 480], ['Ketchup', 'other', 'ashkan-forouzani-dYAPoTlWWZs-unsplash.jpg', 240, 'g', 300], ['Milk', 'dairy', 'elizabeth-dunne-ccV4kUrSYIM-unsplash.jpg', 1, 'pint', 180], ['Biscuits', 'other', 'ellieelien-04yMqTmUeHQ-unsplash.jpg', 200, 'g', 150], ['Burgers', 'other', 'izzy-park-OKBCiPpTHag-unsplash.jpg', 4, 'unit', 450], ['Sausages', 'other', 'jonathan-taylor-GydZBn-7LMM-unsplash.jpg', 6, 'unit', 400], ['Bread', 'other', 'laura-ockel-uugOo5Lr_iM-unsplash.jpg', 1, 'unit', 160], ['Basil plant', 'other', 'monika-grabkowska-rICRgergpIc-unsplash.jpg', 1, 'unit', 250], ['Crisps', 'other', 'mustafa-bashari-S4PC4SeKwKg-unsplash.jpg', 6, 'unit', 275], ['Eggs', 'other', 'nick-fewings-qlLCBkTSYAI-unsplash.jpg', 6, 'unit', 110], ['Orange Juice', 'other', 'paul-hanaoka-8WYjqXqNZs4-unsplash.jpg', 1, 'pint', 180], ['Rice', 'other', 'pierre-bamin--LdilhDx3sk-unsplash.jpg', 2000, 'g', 130], ['Chocolate Bar', 'other', 'tamas-pap-6IDGTjq_Pic-unsplash.jpg', 1, 'unit', 190], ['Peanut Butter', 'other', 'tetiana-bykovets-Ht7ZhGt2UXg-unsplash.jpg', 300, 'g', 210],
]

export const productDetails = []


export function initProducts(callback) {
  for (let i = 0; i < imagesArr.length; i++) {
    const thisProduct = {
      name: imagesArr[i][0],
      type: imagesArr[i][1],
      image: imagesArr[i][2],
      packsize: imagesArr[i][3],
      units: imagesArr[i][4],
      price: imagesArr[i][5],
      weight: "500g",
      productID: i,
    }
    productDetails.push(thisProduct)
  }
  if (callback !== undefined)
    callback()
}


export function setCookie(cname, cvalue) {
  const d = new Date()
  d.setTime(d.getTime() + (60 * 60 * 1000))
  const expires = `expires=${d.toUTCString()}`
  document.cookie = `${cname}=${cvalue};${expires};path=/`
}

export function getCookie(cname) {
  const name = `${cname}=`
  const decodedCookie = decodeURIComponent(document.cookie)
  const ca = decodedCookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ')
      c = c.substring(1)

    if (c.indexOf(name) === 0)
      return c.substring(name.length, c.length)
  }
  return ''
}
