import Cookies from 'vue-cookie'

const set = ( value) => {
  Cookies.set('dashBoardToken', value)
}

// 获取方式
const get = () => {
  return Cookies.get('dashBoardToken')
}

// 删除方式
const remove = () => {
  Cookies.delete('dashBoardToken')
}

export {
  set,
  get,
  remove
}
