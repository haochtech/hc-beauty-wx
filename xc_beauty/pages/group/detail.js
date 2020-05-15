var app = getApp(), common = require("../common/common.js");

function timeup(t) {
    setInterval(function() {
        var a = t.data.list;
        -1 == a.status && (0 < parseInt(a.second) ? a.second = parseInt(a.second) - 1 : 0 < parseInt(a.min) ? (a.second = 59, 
        a.min = parseInt(a.min) - 1) : 0 < parseInt(a.hour) ? (a.second = 59, a.min = 59, 
        a.hour = parseInt(a.hour) - 1) : a.status = 2), t.setData({
            list: a
        });
    }, 1e3);
}

Page({
    data: {},
    menu_on: function() {
        var a = this;
        "theme3" == a.data.theme.name ? wx.navigateTo({
            url: "../../ui2/porder/porder?&id=" + a.data.list.pid + "&group=1&group_id=" + a.data.list.id
        }) : wx.navigateTo({
            url: "../porder/porder?&id=" + a.data.list.pid + "&group=1&group_id=" + a.data.list.id
        });
    },
    to_index: function() {
        (this.data.theme.name = "theme3") ? wx.redirectTo({
            url: "../../ui2/index/index"
        }) : wx.redirectTo({
            url: "../index/index"
        });
    },
    to_order: function() {
        wx.navigateTo({
            url: "../order/detail?&out_trade_no=" + this.data.list.out_trade_no
        });
    },
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e), app.util.request({
            url: "entry/wxapp/order",
            data: {
                op: "group_detail",
                id: a.id
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && (-1 == t.data.status && (t.data.hour = parseInt(t.data.fail / 3600), 
                t.data.min = parseInt((t.data.fail - 3600 * t.data.hour) / 60), t.data.second = t.data.fail % 60), 
                e.setData({
                    list: t.data
                }), timeup(e));
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        var a = this;
        if ("theme3" == a.data.theme.name) var t = "../../pages/group/detail?&id=" + a.data.list.id; else t = "../../pages/group/detail?&id=" + a.data.list.id;
        var e = a.data.config.title + "-首页";
        "" != a.data.config.share_group_title && null != a.data.config.share_group_title && (e = a.data.config.share_group_title);
        var n = "";
        "" != a.data.config.share_group_img && null != a.data.config.share_group_img && (n = a.data.config.share_group_img);
        var o = 1;
        "" != app.share && null != app.share && "" != app.share.content && null != app.share.content && (o = app.share.content.status), 
        1 == o && (t = t + "&scene=" + app.userinfo.openid);
        var i = "/xc_beauty/pages/base/base?&share=" + (t = escape(t));
        return -1 == a.data.list.group_public && app.userinfo.openid != a.data.list.openid && (i = "/xc_beauty/pages/base/base"), 
        console.log(i), {
            title: e,
            path: i,
            imageUrl: n,
            success: function(a) {
                console.log(a);
            },
            fail: function(a) {
                console.log(a);
            }
        };
    }
});