// 实现 new Proxy(target, handler )
import { extend, isObject } from '@vue/shared'
import { reactive, readonly } from '.'

// 是不是仅读到，仅读的属性set会报异常
// 是不是深度的

function createGetter(isReadonly = false, shallow = false) { // 拦截获取功能
  return function get(target, key, receiver) { // let proxy = reacitve()
    // proxy + reflect
    const res = Reflect.get(target, key, receiver) // target[key]

    if(!isReadonly) {
      // 收集依赖，等会数据变化后更新对应的视图
    }

    if(shallow) {
      return res
    }

    if(isObject(res)) {  // vue2是一上来就递归，vue3是当取值时会进行代理。vue3的代理模式时懒代理
      return isReadonly ? readonly(res) : reactive(res)
    }

    return res
  }
}

function createSetter(shallow = false) { // 拦截设置功能
  return function set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver) // target[key] = value

    return result
  }
}


const get = createGetter()
const shallowGet = createGetter(false, true)
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

const set = createSetter()
const shallowSet = createSetter()

export const mutableHandlers = {
  get,
  set
}

export const shallowMutableHandlers = {
  get: shallowGet,
  set: shallowSet
}

let readonlyObj = {
  set: (target, key) => {
    console.warn(`set on key ${key} failed`)
  }
}

export const readonlyHandlers = extend({
  get: readonlyGet,
}, readonlyObj)

export const shallowReadonlyHandlers = extend({
  get: shallowReadonlyGet,
}, readonlyObj)