var app = getApp(), common = require("../common/common.js");

Page({
    data: {},
    getprize: function(t) {
        var a = this, o = t.currentTarget.dataset.index, n = a.data.list;
        app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "getprize",
                id: n.order_list[o].id
            },
            success: function(t) {
                "" != t.data.data && (n.order_list[o].prize = 1, wx.showToast({
                    title: "领取成功"
                }), a.setData({
                    list: n
                }));
            }
        });
    },
    onLoad: function(t) {
        var o = this;
        common.config(o), common.theme(o), o.setData({
            id: t.id
        }), app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "prize",
                id: o.data.id
            },
            success: function(t) {
                var a = t.data;
                "" != a.data && ("" != a.data.backcolor && null != a.data.backcolor || (a.data.backcolor = "#ec7583"), 
                o.setData({
                    list: a.data
                }));
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