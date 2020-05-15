var app = getApp(), common = require("../common/common.js"), WxParse = require("../../../wxParse/wxParse.js");

function GetRequest(e) {
    e = e;
    var n = new Object();
    if (-1 != e.indexOf("?")) for (var t = e.substr(1).split("&"), a = 0; a < t.length; a++) n[t[a].split("=")[0]] = unescape(t[a].split("=")[1]);
    return n;
}

Page({
    data: {},
    onLoad: function(a) {
        var o = this;
        common.config(o, app), common.theme(o, app);
        var e = GetRequest(unescape(a.url));
        if ("" != e.id && null != e.id) app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "article",
                id: e.id
            },
            success: function(e) {
                var n = e.data;
                if ("" != n.data) {
                    if (o.setData({
                        list: n.data,
                        url: unescape(a.url)
                    }), 2 == n.data.link_type) {
                        var t = n.data.content;
                        WxParse.wxParse("content", "html", t, o, 5);
                    }
                } else {
                    o.setData({
                        list: {
                            link_type: 1
                        },
                        url: unescape(a.url)
                    });
                }
            }
        }); else {
            o.setData({
                list: {
                    link_type: 1
                },
                url: unescape(a.url)
            });
        }
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        return {
            title: app.config.webname,
            path: "/xc_beauty/ui2/link/link?&url=" + escape(this.data.url),
            success: function(e) {
                console.log(e);
            },
            fail: function(e) {
                console.log(e);
            }
        };
    }
});