var app = getApp(), common = require("../../common/common.js");

Page({
    data: {},
    call: function() {
        wx.makePhoneCall({
            phoneNumber: this.data.list.store_list.mobile
        });
    },
    choose: function(t) {
        var o = this.data.list, a = t.currentTarget.dataset.index;
        o.pid[a].status = -o.pid[a].status, this.setData({
            list: o
        });
    },
    onLoad: function(t) {
        var a = this;
        common.config(a), common.theme(a), app.util.request({
            url: "entry/wxapp/manage",
            method: "POST",
            data: {
                op: "pick_order_detail",
                id: t.id
            },
            success: function(t) {
                var o = t.data;
                "" != o.data && a.setData({
                    list: o.data
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