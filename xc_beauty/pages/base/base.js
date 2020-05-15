var app = getApp(), common = require("../common/common.js");

Page({
    data: {},
    onLoad: function(d) {
        common.login(this), app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "base"
            },
            showLoading: !1,
            success: function(a) {
                var e = a.data, t = 1;
                if ("" == e.data || ("" != e.data.can_bimg && null != e.data.can_bimg && (app.can_bimg = e.data.can_bimg), 
                "" != e.data.config && null != e.data.config && (app.config = e.data.config), "" != e.data.theme && null != e.data.theme && (app.theme = e.data.theme, 
                "" != e.data.theme.content && null != e.data.theme.content && 3 == e.data.theme.content.theme && (t = 3)), 
                "" != e.data.map && null != e.data.map && (app.map = e.data.map), "" != e.data.share && null != e.data.share && (app.share = e.data.share), 
                "" != e.data.audit && null != e.data.audit && (app.audit = e.data.audit), app.app_add_status = e.data.app_add_status, 
                "" == e.data.closed || null == e.data.closed)) {
                    var n = app.buy_share;
                    if ("" != d.share && null != d.share) {
                        var o = unescape(d.share);
                        wx.redirectTo({
                            url: o,
                            success: function(a) {
                                console.log(a);
                            },
                            fail: function(a) {
                                console.log(a);
                            }
                        });
                    } else "" != n && null != n && "undefined" != n ? wx.navigateTo({
                        url: n
                    }) : "" != app.store && null != app.store ? wx.redirectTo({
                        url: "../store/detail?&id=" + app.store
                    }) : "" != app.member && null != app.member ? wx.redirectTo({
                        url: "../store/member_detail?&id=" + app.member
                    }) : "" != app.mall && null != app.mall ? wx.redirectTo({
                        url: "../mall/detail?&id=" + app.mall
                    }) : "" != app.buy && null != app.buy ? wx.redirectTo({
                        url: "../order/buy?&buy=" + app.buy
                    }) : 3 == t ? wx.redirectTo({
                        url: "../../ui2/index/index"
                    }) : wx.redirectTo({
                        url: "../index/index"
                    });
                    app.util.request({
                        url: "entry/wxapp/grouprefund",
                        showLoading: !1
                    }), app.util.request({
                        url: "entry/wxapp/orderdo",
                        showLoading: !1
                    });
                } else wx.redirectTo({
                    url: "../closed/closed"
                });
            }
        }), wx.getSystemInfo({
            success: function(a) {
                app.model = a.model;
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