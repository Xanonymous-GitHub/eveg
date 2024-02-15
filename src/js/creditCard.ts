export interface CreditCard {
  name: string
  bins: RegExp
  codeLength: number
}

type CreditCardProducer = string

const cards: ReadonlyArray<CreditCard> = [
  {
    name: 'Banescard',
    bins: /^(603182)[0-9]{10,12}/,
    codeLength: 3,
  },
  {
    name: 'Maxxvan',
    bins: /^(603182)[0-9]{10,12}/,
    codeLength: 3,
  },
  {
    name: 'Cabal',
    bins: /^(604324|604330|604337|604203|604338)[0-9]{10,12}/,
    codeLength: 3,
  },
  {
    name: 'GoodCard',
    bins: /^(606387|605680|605674|603574)[0-9]{10,12}/,
    codeLength: 3,
  },
  {
    name: 'Elo',
    bins: /^(401178|401179|431274|438935|451416|457393|457631|457632|504175|627780|636297|636368|(506699|5067[0-6]\d|50677[0-8])|(50900\d|5090[1-9]\d|509[1-9]\d{2})|65003[1-3]|(65003[5-9]|65004\d|65005[0-1])|(65040[5-9]|6504[1-3]\d)|(65048[5-9]|65049\d|6505[0-2]\d|65053[0-8])|(65054[1-9]|6505[5-8]\d|65059[0-8])|(65070\d|65071[0-8])|65072[0-7]|(6509[0-9])|(65165[2-9]|6516[6-7]\d)|(65500\d|65501\d)|(65502[1-9]|6550[3-4]\d|65505[0-8]))[0-9]{10,12}/,
    codeLength: 3,
  },
  {
    name: 'Diners',
    bins: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
    codeLength: 3,
  },
  {
    name: 'Discover',
    bins: /^6(?:011|5[0-9]{2}|4[4-9][0-9]{1}|(22(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[01][0-9]|92[0-5]$)[0-9]{10}$))[0-9]{12}$/,
    codeLength: 4,
  },
  {
    name: 'Amex',
    bins: /^3[47][0-9]{13}$/,
    codeLength: 4,
  },
  {
    name: 'Aura',
    bins: /^50[0-9]{14,17}$/,
    codeLength: 3,
  },
  {
    name: 'Mastercard',
    bins: /^(603136|603689|608619|606200|603326|605919|608783|607998|603690|604891|603600|603134|608718|603680|608710|604998)|(5[1-5][0-9]{14}|2221[0-9]{12}|222[2-9][0-9]{12}|22[3-9][0-9]{13}|2[3-6][0-9]{14}|27[01][0-9]{13}|2720[0-9]{12})$/,
    codeLength: 3,
  },
  {
    name: 'Visa',
    bins: /^4[0-9]{12}(?:[0-9]{3})?$/,
    codeLength: 3,
  },
  {
    name: 'Hipercard',
    bins: /^(38[0-9]{17}|60[0-9]{14})$/,
    codeLength: 3,
  },
  {
    name: 'JCB',
    bins: /^(?:2131|1800|35\d{3})\d{11}$/,
    codeLength: 3,
  },
] satisfies ReadonlyArray<CreditCard>

const MILLENNIUM = 1000
const DEFAULT_CODE_LENGTH = 3

export function getCreditCardProducerNameByNumber(cardNumber: string) {
  return findCreditCardObjectByNumber(cardNumber)?.name || 'Credit card is invalid!'
}

export function isSecurityCodeValid(creditCardNumber: string, securityCode: string) {
  const numberLength = getCreditCardCodeLengthByNumber(creditCardNumber)
  return new RegExp(`^[0-9]{${numberLength}}$`).test(securityCode)
}

export function isExpirationDateValid(month: string, year: string) {
  const monthNumber = Number.parseInt(month)
  const yearNumber = Number.parseInt(year)
  return (
    isValidMonth(monthNumber)
    && isValidYear(yearNumber)
    && isFutureOrPresentDate(monthNumber, yearNumber)
  )
}

export function isValid(cardNumber: string, producerNames?: CreditCardProducer[]) {
  const rawNumber = removeNonNumbersCharacters(cardNumber)

  if (hasSomeInvalidDigit(cardNumber) || !hasCorrectLength(rawNumber))
    return false

  const sum = sumNumber(rawNumber)

  return checkSum(sum) && ((producerNames && validateCardsWhenRequired(cardNumber, producerNames)) ?? true)
}

function validateCardsWhenRequired(cardNumber: string, passedCardProducerNames?: string[]) {
  return !cards || !cards.length || validateCards(cardNumber, passedCardProducerNames)
}

function validateCards(cardNumber: string, passedCardProducerNames?: string[]) {
  return (
    areCardsSupported(passedCardProducerNames)
    && passedCardProducerNames
      ?.map(c => c.toLowerCase())
      .includes(getCreditCardProducerNameByNumber(cardNumber).toLowerCase())
  )
}

function hasCorrectLength(cardNumber: string) {
  return cardNumber.length <= 19
}

function removeNonNumbersCharacters(cardNumber: string) {
  return cardNumber.replace(/\D/g, '')
}

function hasSomeInvalidDigit(cardNumber: string) {
  const invalidDigits = /[^0-9- ]/
  return invalidDigits.test(cardNumber)
}

function checkSum(sum: number) {
  return sum > 0 && sum % 10 === 0
}

function areCardsSupported(passedCardProducerNames?: string[]) {
  const supportedCards = cards.map(c => c.name.toLowerCase())
  return passedCardProducerNames?.every(c => supportedCards.includes(c.toLowerCase()))
}

function findCreditCardObjectByNumber(cardNumber: string) {
  const numberOnly = cardNumber.replace(/\D/g, '')
  return cards.find(card => card.bins.test(numberOnly) && card)
}

function getCreditCardCodeLengthByNumber(cardNumber: string) {
  return findCreditCardObjectByNumber(cardNumber)?.codeLength || DEFAULT_CODE_LENGTH
}

function isValidMonth(month: number) {
  return !Number.isNaN(month) && month >= 1 && month <= 12
}

function isValidYear(year: number) {
  return !Number.isNaN(year) && isValidFullYear(formatFullYear(year))
}

function formatFullYear(year: number) {
  const stringYear = year.toString()
  if (stringYear.length === 2)
    return dateRange(year)

  return stringYear.length === 4 ? year : 0
}

function dateRange(increaseYear: number = 0) {
  const year = increaseYear
  const today = new Date()
  return Math.floor(today.getFullYear() / MILLENNIUM) * MILLENNIUM + year
}

function isValidFullYear(year: number) {
  return year >= dateRange() && year <= dateRange(MILLENNIUM)
}

function isFutureOrPresentDate(month: number, year: number) {
  const fullYear = formatFullYear(year)
  const currentDate = new Date()
  const expirationDate = new Date()

  currentDate.setFullYear(currentDate.getFullYear(), currentDate.getMonth(), 1)
  expirationDate.setFullYear(fullYear, month - 1, 1)

  return currentDate <= expirationDate
}

function sumNumber(cardNumber: string) {
  const computed = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]
  let sum = 0
  let digit = 0
  let i = cardNumber.length
  let even = true

  while (i--) {
    digit = Number.parseInt(cardNumber[i])
    even = !even
    if (even)
      sum += computed[digit]
    else
      sum += digit
  }

  return sum
}
