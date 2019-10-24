import Http from './axios'

const jsSHA = require('jssha')

export function getWx() {
  return Http.post('/wxsite/index/getTicket',{}).then(res => {

    let timestamp = (new Date().getTime() / 1000).toFixed(0)
    let noncestr = Math.random()
      .toString(36)
      .substr(2)
    let e = decodeURIComponent(
      'jsapi_ticket=' +
      res.data.data.ticket +
      '&noncestr=' +
      noncestr +
      '&timestamp=' +
      timestamp +
      '&url=' +
      location.href.split('#')[0]
    )
    let s = new jsSHA('SHA-1', 'TEXT')
    s.update(e)
    let ticket = s.getHash('HEX')
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端//alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: 'wxc72b57ad73571b5c', // 必填，公众号的唯一标识
      timestamp: timestamp, // 必填，生成签名的时间戳
      nonceStr: noncestr, // 必填，生成签名的随机串
      signature: ticket, // 必填，签名，见附录1
      jsApiList: ['scanQRCode', 'chooseWXPay', 'updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    })
  })
}

export function scanQRCode(needResult = 0, callback) {
  wx.ready(function () {
    wx.scanQRCode({
      needResult: needResult, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
      success: function (res) {
        (callback && typeof (callback) === 'function') && callback(res)
        // var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
      },
      fail: function (res) {

        wx.closeWindow();
      },
      cancel: function (res) {

        wx.closeWindow();
      }
    })
  })
}


export function chooseWXPay(options, callback = {}) {
  let success = callback.success || null
  let cancel = callback.cancel || null
  let fail = callback.fail || null
  wx.ready(function () {
    wx.chooseWXPay({
      timestamp: options.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      nonceStr: options.nonceStr, // 支付签名随机串，不长于 32 位
      package: options.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
      signType: options.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      paySign: options.paySign, // 支付签名
      success: function () {
        // 支付成功后的回调函数
        success()
      },
      cancel: function () {
        // alert('取消支付');
        cancel()
      },
      fail: function () {
        // alert("支付失败");
        fail()
      }
    })
  })
}




