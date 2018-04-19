import axios from 'axios'
/**
 * 发起一个post请求
 */
export const postAxios = (api, data, cb, failCB) => {
  let params = new FormData()
  for (let key in data) {
    params.append(key, data[key])
  }
  axios.post(api, params)
    .then(res => {
      if (res.data) {
        if (cb) {
          cb(res.data.data)
        }
      } else {
        if (failCB) {
          failCB(res.status)
        }
      }
    })
    .catch(err => {
      console.log(err)
    })
}
/**
 * 登录
 * @param loginInfo
 */
export const loginAxios = (loginInfo, callback) => {
  let params = new FormData()
  params.append('name', loginInfo.name)
  params.append('password', loginInfo.password)
  axios.post('/cgi-bin/login.py', params)
    .then(response => {
      callback(response.data)
    })
    .catch(err => {
      if (err) {
        // err
      }
    })
}
// // 退出登录
// export const logoutAxios = (cb) => {
//   axios.get('')
//     .then(res => {
//       if (res.data && res.data.success) {
//         delCookie('userName')
//         delCookie('userId')
//         delCookie('root')
//         cb()
//       }
//     })
//     .catch(err => {
//       if (err) {
//         console.log(err)
//       }
//     })
// }

// 设置cookie
export const setCookie = (name, value, exdays) => {
  if (exdays !== undefined) {
    let d = new Date()
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
    const expires = 'expires=' + d.toUTCString()
    document.cookie = name + '=' + value + ';' + expires
  } else {
    document.cookie = name + '=' + value + ';'
  }
}

// 获取cookie
export const getCookie = (cname) => {
  let name = cname + '='
  let ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    var c = ca[i].trim()
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}

// 删除cookie
export const delCookie = (cname) => {
  setCookie(cname, '', -1)
}
