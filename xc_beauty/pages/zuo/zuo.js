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
    submit: function() {
        var a = this;
        "theme3" == a.data.theme.name ? wx.navigateTo({
            url: "../../ui2/store/porder?&id=" + a.data.list.cid + "&member_id=" + a.data.list.id + "&member_name=" + a.data.list.name
        }) : wx.navigateTo({
            url: "porder?&id=" + a.data.list.cid + "&member_id=" + a.data.list.id + "&member_name=" + a.data.list.name
        });
    },
    onLoad: function(a) {
        var t = this;
        if (common.config(t), common.theme(t), "" != a.bimg && null != a.bimg) {
            var e = JSON.parse(a.bimg);
            t.setData({
                bimg: e
            });
        }
        app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "member_detail",
                id: a.id
            },
            success: function(a) {
                var e = a.data;
                "" != e.data && t.setData({
                    list: e.data
                });
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
        var a = this, e = "/xc_beauty/pages/zuo/zuo?&bimg=" + JSON.stringify(a.data.bimg) + "&id=" + a.data.list.id;
        return e = escape(e), {
            title: a.data.config.title,
            path: "/xc_beauty/pages/base/base?&share=" + e,
            success: function(a) {
                console.log(a);
            },
            fail: function(a) {
                console.log(a);
            }
        };
    }
});