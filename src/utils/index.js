function getCookie(cookieName){
  const strCookie = document.cookie
  const cookieList = strCookie.split(';')
  // console.log(cookieList);
  for(let i = 0; i < cookieList.length; i++) {
    const arr = cookieList[i].split('=')
    if (cookieName == arr[0].trim()) {
      // 返回cookie值
      return arr[1];
    }
  }
}




export {getCookie}

