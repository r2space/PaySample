/**
 * @file CTRL层的说明
 * @author fzcs
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var response    = smart.framework.response
  , auth        = smart.framework.auth
  , _           = smart.util.underscore
  , crypto      = require('crypto')
  , xml         = require('xml2js')
  , https       = require('https');

/**
 * @desc jump 构造参数,签名参数并跳转到支付网关
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @returns {*} 无
 */
exports.jump = function(req, res) {

  // 获取银行代码
  req.session.pay_type_code = req.param('bank_type_value');
  var type_code = req.session.pay_type_code;

  // 获取支付总额(单位:元)
  var total = req.session.pay_total;

  // 支付网关url
  var request_url = "https://gw.tenpay.com/gateway/pay.htm";

  // 商品标题
  var product_des = "点点菜" + total + "元服务";

  // 内部订单id,这里临时使用时间戳,未来可以先创建一个订单,然后将订单存入数据库,然后取mongodb中的_id.
  var order_id = new Date().getTime();

  // 构造参数
  var params = {
    input_charset : 'UTF-8',
    body: product_des,
    subject: product_des,
    attach: "test",
    return_url: "http://115.29.45.97:3002/pay_return",
    notify_url: "http://115.29.45.97:3002/pay_notify",
    partner: '1900000113',
    out_trade_no: order_id + '',
    total_fee: total * 100, //财付通要求支付价格单位为分,因此乘以100
    fee_type: '1',
    spbill_create_ip: req.ip,
    bank_type : type_code
  };

  // 组装参数以签名
  var param_str = '';
  _.each(_.keys(params).sort(),function(key){
    param_str += "&" + key + "=" + params[key];
  });
  param_str += "&key=e82573dc7e6136ba414f2e2affbe39fa";
  param_str = param_str.substr(1);

  // 签名
  var md5_str = crypto.createHash('md5').update(param_str,"utf8").digest('hex');
  // 签名后结果需要放入参数
  params.sign = md5_str;

  // 重新组装参数,用来构造跳转请求
  param_str = '';
  _.each(_.keys(params).sort(),function(key){
    param_str += "&" + key + "=" + encodeURIComponent(params[key]);
  });

  // 跳转到支付网关
  res.redirect('https://gw.tenpay.com/gateway/pay.htm?'+param_str);
};


/**
 * @desc pay_return 支付网关处理完成支付后的callback地址,
 *       此处接收到参数并判断支付成功后[!不!]执行发货的业务逻辑,
 *       发货业务逻辑在 pay_notify 中执行.
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @returns {*} 无
 */
exports.pay_return = function(req, res) {

  // 通知id,用于验证本次回调是不是真正由财付通发起
  var notify_id      = req.param('notify_id');
  // 上一步发送的本系统的order id
  var out_trade_no   = req.param('out_trade_no');
  // 财付通系统中的订单id
  var transaction_id = req.param('transaction_id');
  // 总额
  var total_fee      = req.param('total_fee');
  // 折扣
  var discount       = req.param('discount');
  // 支付状态
  var trade_state    = req.param('trade_state');
  // 支付类型(1为实时到账)
  var trade_mode     = req.param('trade_mode');

  var success = trade_mode == 1 && trade_state == 0;

  // 支付成功时error message为空,支付失败是为相应的提示信息
  var error_msg = success ? null : req.param('pay_info');

  res.render('pay_return',{success:success, error_msg:error_msg, total_fee:total_fee });

}


/**
 * @desc pay_notify 支付网关处理完成支付后主动想这个地址发起请求
 *       在接收到此请求后,先去财付通验证请求信息的合法性,
 *       如果请求合法,并且支付成功,则开始发货的业务逻辑.
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @returns {*} 无
 */
exports.pay_notify = function(req, res){

  // 通知id,用于验证本次回调是不是真正由财付通发起
  var notify_id      = req.param('notify_id');
  // 上一步发送的本系统的order id
  var out_trade_no   = req.param('out_trade_no');
  // 财付通系统中的订单id
  var transaction_id = req.param('transaction_id');
  // 总额
  var total_fee      = req.param('total_fee');
  // 折扣
  var discount       = req.param('discount');
  // 支付状态
  var trade_state    = req.param('trade_state');
  // 支付类型(1为实时到账)
  var trade_mode     = req.param('trade_mode');

  // 验证请求有效性
  // 构造验证请求的参数
  var params_str = "input_charset=UTF-8&notify_id=" + notify_id + "&partner=1900000113";;
  var md5_str = crypto.createHash('md5').update(params_str + "&key=e82573dc7e6136ba414f2e2affbe39fa","utf8").digest('hex');
  params_str += "&sign=" + md5_str;

  verify(params_str,function(err){
    if(err){
      console.log("!!!验证失败!!!");
      res.send('fail');
    }else{
      console.log("!!!验证成功!!!");

      var pay_success = trade_mode == 1 && trade_state == 0;

      if(pay_success){
        console.log("!!!支付成功,开始发货!!!");
        // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
        // 发货处理逻辑
        // 注意以下几点:
        // 1.注意交易单不要重复处理(加锁控制).
        // 2.注意判断金额是不是足额支付.
        // ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
      }else{
        console.log("!!!支付失败,不要发货!!!");
        // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
        // 支付失败时的处理逻辑
        // ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
      }

      // 返回'success'给财付通
      res.send('success');
    }
  });
}


function verify(param_str, callback){
  https.get("https://gw.tenpay.com/gateway/simpleverifynotifyid.xml?" + param_str, function(sub_res) {
    sub_res.on('data', function( data ) {
      var result_str = data.toString();

      //注意xml解析后的数据结构
      xml.parseString(result_str,function(err,result){
        if(result.root.retcode[0] === '0'){
          callback(null);
        }else{
          callback('verify_err');
        }
      });
    });
  }).on('error', function(e) {
    callback(e);
  });
}

/**
 * @desc pay 银行选择页面
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @returns {*} 无
 */
exports.pay = function(req, res) {

  req.session.pay_total = req.param('total');
  var pay_type_code = req.session.pay_type_code || -1;
  res.render('pay',{type_code : pay_type_code });

};

/**
 *  @desc product
 *  @param {Object} req 请求对象
 *  @param {Object} res 响应对象
 *  @returns {*} 无
 */
exports.product = function(req, res) {

  var total = req.session.pay_total;
  res.render('product',{total : total});

};