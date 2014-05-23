/**
 * @file CTRL层的说明
 * @author fzcs
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var response    = smart.framework.response
  , auth        = smart.framework.auth;


/**
 * @desc Login
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @returns {*} 无
 */
exports.login = function(req, res) {

  auth.simpleLogin(req, res, function(err, result) {
    if(err){
      return response.send(res, err, result);
    }else{
      return res.redirect("/product");
    }
  });

};

/**
 * @desc Logout
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @returns {*} 无
 */
exports.logout = function(req, res) {

  auth.simpleLogout(req);
  return res.redirect("/login");

};
