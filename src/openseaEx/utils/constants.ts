
export const MAX_DIGITS_IN_UNSIGNED_256_INT = 78 // 78 solt

export const DEFAULT_EXPIRATION_TIME = (86400 * 30); //1天= 86400 s
export const MAX_EXPIRATION_TIME = (86400 * 180); //1天= 86400 s


export const DEFAULT_LISTING_TIME = Math.round(Date.now() / 1000);
export const MAX_LISTING_TIME = (86400 * 365)


export const MIN_EXPIRATION_SECONDS = 10
export const MIN_Listing_SECONDS = 10
export const ORDER_MATCHING_LATENCY_SECONDS = 60 * 60 * 24 * 7

// FEE
export const DEFAULT_BUYER_FEE_BASIS_POINTS = 0
export const DEFAULT_SELLER_FEE_BASIS_POINTS = 250 //2.5%
export const DEFAULT_MAX_BOUNTY = DEFAULT_SELLER_FEE_BASIS_POINTS

//BOUNTY
export const ELEMENT_SELLER_BOUNTY_BASIS_POINTS = 100 //1%
export const INVERSE_BASIS_POINT = 10000 //100%

//static call
export const STATIC_EXTRADATA = '0x0c225aad' //succeedIfTxOriginMatchesHardcodedAddress
