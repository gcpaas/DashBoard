import * as http from '@/http'
import * as Service from '@/service'
export const $gc = {
  get: http.get,
  post: http.post,
  del: http.del,
  put: http.post,
  ...Service
}

export default {
  $gc
}
