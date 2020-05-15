var app = getApp(), common = require("../common/common.js");

Page({
    data: {},
    to_recharge: function(t) {
        var a = this;
        if (1 == a.data.userinfo.card) if ("" != a.data.userinfo.store && null != a.data.userinfo.store) {
            var o = t.currentTarget.dataset.index;
            wx.navigateTo({
                url: "recharge?&edit=" + o + "&order_type=1"
            });
        } else wx.showModal({
            title: "提示",
            content: "请先绑定门店"
        }); else wx.showModal({
            title: "提示",
            content: "请先开通会员",
            success: function(t) {
                t.confirm ? wx.navigateTo({
                    url: "../card/info?&edit=1"
                }) : t.cancel;
            }
        });
    },
    to_record: function() {
        1 == this.data.userinfo.card ? wx.navigateTo({
            url: "record"
        }) : wx.showModal({
            title: "提示",
            content: "请先开通会员",
            success: function(t) {
                t.confirm ? wx.navigateTo({
                    url: "../card/info?&edit=1"
                }) : t.cancel && console.log("用户点击取消");
            }
        });
    },
    onLoad: function(t) {
        var o = this;
        common.config(o), common.theme(o), app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "card"
            },
            success: function(t) {
                var a = t.data;
                "" != a.data && o.setData({
                    card: a.data
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        var o = this;
        app.util.request({
            url: "entry/wxapp/user",
            data: {
                op: "userinfo"
            },
            success: function(t) {
                var a = t.data;
                "" != a.data && (a.data.money = parseFloat(a.data.money).toFixed(2), o.setData({
                    userinfo: a.data
                }));
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});