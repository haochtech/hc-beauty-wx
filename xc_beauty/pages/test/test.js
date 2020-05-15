var app = getApp(), common = require("../common/common.js");

Page({
    data: {},
    test: function(o) {
        wx.getSystemInfo({
            success: function(o) {
                console.log(o), wx.showModal({
                    title: "手机型号",
                    content: o.model
                });
            }
        });
    },
    onLoad: function(o) {
        common.config(this), common.theme(this);
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});