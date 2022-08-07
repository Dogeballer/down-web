const UATest = function () {
  // 获取浏览器UA信息，对nodejs环境做兼容处理
  this.ua = typeof window.navigator !== 'undefined' ? window.navigator.userAgent : ''

  /**
   * [uaInfo 浏览器信息]
   * @type {Object}
   */
  this.uaInfo = {
    browser: {}, // 浏览器名称及版本号
    os: {bit: ''}, // 操作系统及版本号
    client: {}, // 客户端类型
    enigne: {} // 内核类型及版本号
  }

  /**
   * [regexp 各匹配点正则表达式]
   * @type {Object}
   */
  this.regexp = {
    browser: {
      IE: /MSIE (\d+)|rv:(11)\.0/ig, // IE 浏览器
      Edge: /Edge\/(\d+)/ig, // IE Edge 浏览器
      Chrome: /Chrome\/(\d+)/ig, // Chrome 浏览器
      FireFox: /Firefox\/(\d+)/ig, // 火狐浏览器
      Safari: /Safari\/(\d+)/ig, // Safari 浏览器
      Opera: /OPR\/(\d+)/ig, // Opera 浏览器
      Wecat: /MicroMessenger\/(\d+)/ig // 微信内置浏览器
    },
    os: {
      Windows: /Windows NT (\d+\.\d+); WOW(\d*){0,1}/ig, // Windows 操作系统
      MacOS: /Mac OS X (\d{0,9}_?\d{0,9}_?\d{0,9})/, // 苹果桌面操作系统
      IOS: /iP.*;.* OS (\d+_?\d+_?\d{0,9})/ig, // 苹果移动设备操作系统
      Android: /Android (\d{0,9}\.?\d{0,9}\.?\d{0,9})/ig, // 安卓
      Linux: /Linux/ig, // Linux
      BlackBerry: /BB(\d+)/ig, // 黑莓
      Tablet: /Tablet OS (\d{0,9}\.?\d{0,9}\.?\d{0,9})/ig // 黑莓
      // KindleFHD: /KFAPWI\ Build\/(\s+\d+)/ig // 黑莓
    },
    client: {
      PC: /Windows|Mac OS X /ig, // PC设备
      iPhone: /iPhone/ig, // 苹果手机
      iPad: /iPad/ig, // 苹果平板设备
      Android: /Android/ig, // 安卓设备
      Mobile: /iPhone|Android|BB\d+|PlayBook|Mobile/ig,
      Pad: /iPad/ig
    },
    enigne: {
      WebKit: /WebKit\/(\d+)/ig,
      Trident: /Trident\/(\d+)/ig,
      Gecko: /Gecko\/(\d+)/ig,
      AppleWebKit: /AppleWebKit\/(\d+)/ig
    }
  }
}

/**
* [customUA 自定义UA字符串测试]
* @param  {String} uaString [自定义的字符串]
* @return {Object}          [类型判断结果]
*/
UATest.prototype.customUA = function (uaString) {
  return this.testFull(uaString)
}

/**
* [testBrowser 测试所有信息]
*/
UATest.prototype.testFull = function (uaString) {
  var ua = uaString || this.ua
  var regexps = this.regexp

  for (let re in regexps) {
    const _re = regexps[re]
    for (var item in _re) {
      var result = _re[item].exec(ua)
      if (result) {
        if (re === 'client') {
          this.uaInfo[re][item] = item
        } else if (re === 'os' && result[2]) { // 获取操作系统的位数
          this.uaInfo[re][item] = result[1] // 操作系统版本
          this.uaInfo[re].bit = result[2] // 操作系统位数
        } else {
          if (result[1]) {
            this.uaInfo[re][item] = result[1]
          } else if (result[2]) {
            this.uaInfo[re][item] = result[2]
          } else {
            this.uaInfo[re][item] = item
          }
        }
      } else {
        this.uaInfo[re][item] = null
      }
    }
  }
  return this.uaInfo
}

const _UATest = new UATest()
const uaInfo = _UATest.testFull()

export default uaInfo
