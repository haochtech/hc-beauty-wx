var app = getApp(), common = require("../common/common.js");

Page({
    data: {},
    call: function() {
        wx.makePhoneCall({
            phoneNumber: this.data.list.store_list.mobile
        });
    },
    onLoad: function(o) {
        var t = this;
        common.config(t), common.theme(t), app.util.request({
            url: "entry/wxapp/order",
            data: {
                op: "buy_detail",
                id: o.id
            },
            success: function(o) {
                var n = o.data;
                "" != n.data && t.setData({
                    list: n.data
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});