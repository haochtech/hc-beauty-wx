var app = getApp(), common = require("../common/common.js");

Page({
    data: {},
    to_index: function() {
        "theme3" == this.data.theme.name ? wx.reLaunch({
            url: "../../ui2/index/index"
        }) : wx.reLaunch({
            url: "../index/index"
        });
    },
    to_order: function() {
        var o = this;
        o.data.theme;
        "" != o.data.group && null != o.data.group ? wx.redirectTo({
            url: "../group/order"
        }) : wx.redirectTo({
            url: "../order/order"
        });
    },
    onLoad: function(o) {
        var n = this;
        common.config(n), common.theme(n), "" != o.group && null != o.group && n.setData({
            group: o.group
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});