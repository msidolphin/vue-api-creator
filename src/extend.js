const isFunction = function (fn) {
  return Object.prototype.toString.call(fn) === '[object Function]'
}

const isArray = Array.isArray || /* istanbul ignore next */ function (ary) {
  return Object.prototype.toString.call(ary) === '[object Array]'
}

const isPlainObject = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]' && Object.getPrototypeOf(obj) === Object.prototype
}

export function extend () {
  let options
  let name
  let src
  let copy
  let copyIsArray
  let clone
  let target = arguments[0] || {}
  let i = 1
  let length = arguments.length
  let force = false

  // 如果第一个参数为布尔,判定是否深拷贝
  if (typeof target === 'boolean') {
    force = target
    target = arguments[1] || {}
    i++
  }

  // 确保接受方为一个复杂的数据类型
  if (typeof target !== 'object' && !isFunction(target)) {
    target = {}
  }

  // 如果只有一个参数，那么新成员添加于 extend 所在的对象上
  if (i === length) {
    target = this
    i--
  }

  for (; i < length; i++) {
    // 只处理非空参数
    if ((options = arguments[i]) != null) {
      for (name in options) {
        src = target[name]
        copy = options[name]

        // 防止环引用
        if (target === copy) {
          continue
        }
        if (force && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
          if (copyIsArray) {
            copyIsArray = false
            clone = src && isArray(src) ? src : []
          } else {
            clone = src && isPlainObject(src) ? src : {}
          }
          target[name] = extend(force, clone, copy)
        } else if (copy !== undefined) {
          target[name] = copy
        }
      }
    }
  }
  return target
}
