/**
 * debounce函数装饰器
 * 使用时在函数上方加 @debounce(200)
 * */

export function debounce (delay = 250, immediate = false) {
  return (
    target,
    key,
    desciptor
  ) => {
    let timer = null
    const func = desciptor.value
    desciptor.value = (...args) => {
      if (immediate && !timer) func.apply(target, ...args)
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        if (!immediate) func.apply(target, ...args)
        timer = null
      }, delay)
    }
    return desciptor
  }
}
