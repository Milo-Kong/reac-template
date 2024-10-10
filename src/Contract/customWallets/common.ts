export function isMetaMask() {
  if (window.ethereum?.isMetaMask)
    return true;
  return false;
}

export function isOkxWallet(){
  if (window.okexchain)
    return true;
  return false;
}

export function isBitget(){
  if (window.bitkeep)
    return true
  return false
}

export function isGate(){
  if (window.gatewallet)
    return true
  return false
}

export function isTokenPocket(){
  if (typeof window.ethereum?.isTokenPocket !== 'undefined') {
    return true
  }
  return false
}

export function isTrustWallet(){
  if (window.ethereum?.isTrust || window.ethereum?.isTrustWallet){
    return true
  }
  return false
}

export function isCoin98(){
  if (window.ethereum?.isCoin98){
    return true
  }
  return false
}

export function isCoinbaseWallet(){
  if (window.ethereum?.isCoinbaseWallet){
    return true
  }
  return false
}
