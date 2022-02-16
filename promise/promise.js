/**
 * promise 特点
 * 1.有三个状态，等待（默认），成功，失败。一旦成功了就不可能失败，反过来也一样。
 * 2.每个promise实例都有一个then方法
 * 3.如果new Promise的时候抛错了，会走异常
 */
const resolvePromise = (promise2, x , resolve, reject) => {
  // 判断x的值和promise2是不是同一个
  if(promise2 === x) {
    return reject(new ErrorType('类型错误'))
  }
  if(typeof x === 'object' && x !== null || typeof x === 'function') {
    try {
      then = x.then
      if(typeof then === 'function') { // 当前有then方法，就姑且认为是promise
        then.call(x, y => { // y可能还是一个promise，知道解析出来的结果是一个普通值为止
          resolvePromise(promise2, y, resolve, reject)
        }, r => {
          reject(r)
        })
      } else {
        resolve(x) // 说明x是一个普通的对象，直接成功即可
      }
    } catch (e) {
      reject(e)
    }
  } else {
    // x是个普通值
    resolve(x) // 直接让promise2成功即可
  }
}
class Promise{
  constructor(executor) {
    this.state = 'pending' // 默认是pending状态
    this.value = undefined // 成功的值
    this.reason = undefined // 失败的原因
    this.onResolveCallbacks = [] // 成功的回调数组
    this.onRejectCallbacks = [] // 失败的回调数组
    // 成功函数
    let resolve = (value) => {
      // 状态不可逆
      if(this.state === 'pending') {
        this.value = value
        this.state = 'resolve'
        this.onResolveCallbacks.forEach(fn => fn())
      }
    }
    // 失败函数
    let reject = (reason) => {
      // 状态不可逆
      if(this.state === 'pending') {
        this.reason = reason
        this.state = 'reject'
        this.onRejectCallbacks.forEach(fn => fn())
      }
    }
    try {
      executor(resolve, reject) // 默认执行器会立刻执行
    } catch (error) {
      reject(error) // 如果执行时发生错误等价于调用失败方法 
    }
  }
  then(onFulfilled, onRejected){
    let promise2 = new Promise((resolve, reject) => { // executor会立刻执行
      // 同步
      if(this.state === 'resolve') {
        setTimeout(() => { // 宏任务 为了保证promise2已经new完了 
          try {
            // x可能是普通值，也可能是promise
            let x = onFulfilled(this.value)
            // 判断x的值 =》 promise2的状态
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0);
      }
      if(this.state === 'reject') {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)  
          } catch (e) {
            reject(e)
          }
        }, 0);
      }
      // 异步
      if(this.state === 'pending') {
        // 如果是异步就先订阅好
        this.onResolveCallbacks.push(() => {
          setTimeout(() => {
            try {
              // x可能是普通值，也可能是promise
              let x = onFulfilled(this.value)
              // 判断x的值 =》 promise2的状态
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0);
        })
        this.onRejectCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)  
            } catch (e) {
              reject(e)
            }
          }, 0);
        })
      }
    })
    return promise2
  }
}