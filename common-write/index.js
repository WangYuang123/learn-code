// 防抖：事件在触发n秒后执行，如果n秒内再次触发，则重新计时
function debounce(fn, delay = 1000) {
  const timer = null
  return (...args) => {
    if(timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      fn.call(this, args)
    }, delay);
  }
}
// 节流
// 深拷贝