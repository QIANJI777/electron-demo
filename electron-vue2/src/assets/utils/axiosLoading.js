import { Loading } from 'element-ui'
import _ from 'lodash'
let needLoadingRequestCount = 0
let loading
let loadingText = '加载中……'
function startLoading (text) {
  loading = Loading.service({
    // target: document.querySelector('.winshow'),
    // target: '.sub-main',
    lock: true,
    text: text || loadingText,
    background: 'rgba(0, 0, 0, 0.5)',
  })
}

function endLoading () {
  loading.close()
}

const tryCloseLoading = () => {
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

export function showLoading (text) {
  if (needLoadingRequestCount === 0) {
    startLoading(text)
  }
  needLoadingRequestCount++
}

export function hideLoading () {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    _.debounce(tryCloseLoading, 300)()
  }
}
