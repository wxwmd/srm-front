export function setCookie (cName, value, expire) {
  let date = new Date()
  date.setSeconds(date.getSeconds() + expire)
  document.cookie = cName + '=' + escape(value) + '; expires=' + date.toGMTString()
}

export function getCookie (cName) {
  if (document.cookie.length > 0) {
    let cStart = document.cookie.indexOf(cName + '=')
    if (cStart !== -1) {
      cStart = cStart + cName.length + 1
      let cEnd = document.cookie.indexOf(';', cStart)
      if (cEnd === -1) cEnd = document.cookie.length
      return unescape(document.cookie.substring(cStart, cEnd))
    }
  }
  return ''
}

export function delCookie (cName) {
  setCookie(cName, '', -1)
}

export function saveUser (user) {
  let expire = 24 * 60 * 60 * 1000
  setCookie('userName', user.userName, expire)
}
export function saveToken (data) {
  let expire = 24 * 60 * 60 * 1000
  setCookie('token', data.token, expire)
}
export function saveValue (key, value) {
  let expire = 24 * 60 * 60 * 1000
  setCookie(key, value, expire)
}

export function cleanUser () {
  delCookie('userName')
  delCookie('token')
  delCookie('menu')
}
