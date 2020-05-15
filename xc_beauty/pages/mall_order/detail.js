var app = getApp(), common = require("../common/common.js");

Page({
    data: {},
    map: function() {
        var t = this;
        wx.openLocation({
            latitude: parseFloat(t.data.list.store_list.map.latitude),
            longitude: parseFloat(t.data.list.store_list.map.longitude),
            name: t.data.list.store_list.address,
            address: t.data.list.store_list.address
        });
    },
    onLoad: function(t) {
        var o = this;
        common.config(o), common.theme(o), app.util.request({
            url: "entry/wxapp/order",
            data: {
                op: "mall_order_detail",
                id: t.id
            },
            success: function(t) {
                var a = t.data;
                "" != a.data && o.setData({
                    list: a.data
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