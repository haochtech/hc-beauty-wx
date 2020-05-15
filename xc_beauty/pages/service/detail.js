var dd, app = getApp(), WxParse = require("../../../wxParse/wxParse.js"), common = require("../common/common.js");

function timeup1(e) {
    setInterval(function() {
        for (var a = e.data.group_list, t = 0; t < a.length; t++) -1 == a[t].status && (0 < parseInt(a[t].second) ? a[t].second = parseInt(a[t].second) - 1 : 0 < parseInt(a[t].min) ? (a[t].second = 59, 
        a[t].min = parseInt(a[t].min) - 1) : 0 < parseInt(a[t].hour) ? (a[t].second = 59, 
        a[t].min = 59, a[t].hour = parseInt(a[t].hour) - 1) : a.splice(t, 1));
        e.setData({
            group_list: a
        });
    }, 1e3);
}

function timeup2(e) {
    setInterval(function() {
        for (var a = e.data.group_list2, t = 0; t < a.length; t++) -1 == a[t].status && (0 < parseInt(a[t].second) ? a[t].second = parseInt(a[t].second) - 1 : 0 < parseInt(a[t].min) ? (a[t].second = 59, 
        a[t].min = parseInt(a[t].min) - 1) : 0 < parseInt(a[t].hour) ? (a[t].second = 59, 
        a[t].min = 59, a[t].hour = parseInt(a[t].hour) - 1) : a.splice(t, 1));
        e.setData({
            group_list2: a
        });
    }, 1e3);
}

function time_up(t) {
    dd = setInterval(function() {
        var a = t.data.list;
        1 == a.is_flash && (0 < a.second ? a.second = a.second - 1 : 0 < a.min ? (a.min = a.min - 1, 
        a.second = 59) : 0 < a.hour ? (a.hour = a.hour - 1, a.min = 59, a.second = 59) : 0 < a.day ? (a.day = a.day - 1, 
        a.hour = 23, a.min = 59, a.second = 59) : (a.is_flash = -1, clearInterval(dd)), 
        t.setData({
            list: a
        }));
    }, 1e3);
}

Page({
    data: {
        indicatorDots: !0,
        autoplay: !0,
        interval: 5e3,
        duration: 1e3,
        kind: -1,
        page: 1,
        pagesize: 15,
        isbottom: !1,
        imgheights: [],
        current: 0,
        parameter_price: ""
    },
    imageLoad: function(a) {
        var t = a.detail.width, e = t / (i = a.detail.height);
        console.log(t, i);
        var i = 750 / e, s = this.data.imgheights;
        s.push(i), this.setData({
            imgheights: s
        });
    },
    bindchange: function(a) {
        console.log(a.detail.current), this.setData({
            current: a.detail.current
        });
    },
    menu_on: function() {
        this.setData({
            shadow: !0,
            menu: !0
        });
    },
    menu_close: function() {
        this.setData({
            shadow: !1,
            menu: !1
        });
    },
    choose: function(a) {
        var t = this, e = a.currentTarget.dataset.index;
        if (e != t.data.kind) {
            var i = "";
            "" != t.data.list.parameter[e].price && null != t.data.list.parameter[e].price && (i = t.data.list.parameter[e].price), 
            t.setData({
                kind: e,
                kind_name: t.data.list.parameter[e].name,
                parameter_price: i
            });
        }
    },
    submit: function(a) {
        var t = this, e = "../porder/porder?&id=" + t.data.list.id;
        1 == a.currentTarget.dataset.flash && (e += "&flash=1"), "" != t.data.list.parameter && null != t.data.list.parameter && 1 != t.data.list.is_flash ? -1 == t.data.kind ? t.setData({
            menu: !0,
            shadow: !0
        }) : wx.navigateTo({
            url: e + "&kind=" + t.data.kind_name
        }) : wx.navigateTo({
            url: e
        });
    },
    to_index: function() {
        wx.reLaunch({
            url: "../index/index"
        });
    },
    submit2: function() {
        wx.navigateTo({
            url: "../porder/porder?&id=" + this.data.list.id + "&group=1"
        });
    },
    to_group: function(a) {
        var t = a.currentTarget.dataset.index;
        wx.navigateTo({
            url: "../porder/porder?&id=" + this.data.group_list[t].pid + "&group=1&group_id=" + this.data.group_list[t].id
        });
    },
    to_more: function() {
        this.setData({
            shadow: !0,
            group_menu: !0
        });
    },
    group_cancel: function() {
        this.setData({
            shadow: !1,
            group_menu: !1
        });
    },
    scrolltolower: function(a) {
        var i = this;
        i.data.isbottom || app.util.request({
            url: "entry/wxapp/service",
            data: {
                op: "group_order",
                page: i.data.page,
                pagesize: i.data.pagesize,
                pid: i.data.list.id
            },
            success: function(a) {
                var t = a.data;
                if ("" != t.data) {
                    for (var e = 0; e < t.data.length; e++) -1 == t.data[e].status && (t.data[e].hour = parseInt(t.data[e].fail / 3600), 
                    t.data[e].min = parseInt((t.data[e].fail - 3600 * t.data[e].hour) / 60), t.data[e].second = t.data[e].fail % 60);
                    i.setData({
                        group_list2: i.data.group_list2.concat(t.data),
                        page: i.data.page + 1
                    });
                } else i.setData({
                    isbottom: !0
                });
            }
        });
    },
    to_group2: function(a) {
        var t = a.currentTarget.dataset.index;
        wx.navigateTo({
            url: "../porder/porder?&id=" + this.data.group_list2[t].pid + "&group=1&group_id=" + this.data.group_list2[t].id
        });
    },
    onLoad: function(a) {
        var d = this;
        common.config(d), common.theme(d), app.util.request({
            url: "entry/wxapp/service",
            data: {
                op: "detail",
                id: a.id
            },
            success: function(a) {
                var t = a.data;
                if ("" != t.data) {
                    var e, i, s, n;
                    if (1 == t.data.is_flash) e = parseInt(parseInt(t.data.fail) / 86400), i = parseInt((t.data.fail - 86400 * e) / 3600), 
                    s = parseInt((t.data.fail - 86400 * e - 3600 * i) / 60), n = parseInt(t.data.fail % 60), 
                    t.data.day = e, t.data.hour = i, t.data.min = s, t.data.second = n;
                    if (d.setData({
                        list: t.data
                    }), 2 == t.data.content_type) {
                        var r = t.data.content2;
                        WxParse.wxParse("content", "html", r, d, 5);
                    }
                    1 == t.data.is_flash && time_up(d);
                }
            }
        }), app.util.request({
            url: "entry/wxapp/service",
            data: {
                op: "group_order",
                page: 1,
                pagesize: 2,
                pid: a.id
            },
            success: function(a) {
                var t = a.data;
                if ("" != t.data) {
                    for (var e = 0; e < t.data.length; e++) -1 == t.data[e].status && (t.data[e].hour = parseInt(t.data[e].fail / 3600), 
                    t.data[e].min = parseInt((t.data[e].fail - 3600 * t.data[e].hour) / 60), t.data[e].second = t.data[e].fail % 60);
                    d.setData({
                        group_list: t.data
                    }), timeup1(d);
                }
            }
        }), app.util.request({
            url: "entry/wxapp/service",
            data: {
                op: "group_order",
                page: d.data.page,
                pagesize: d.data.pagesize,
                pid: a.id
            },
            success: function(a) {
                var t = a.data;
                if ("" != t.data) {
                    for (var e = 0; e < t.data.length; e++) -1 == t.data[e].status && (t.data[e].hour = parseInt(t.data[e].fail / 3600), 
                    t.data[e].min = parseInt((t.data[e].fail - 3600 * t.data[e].hour) / 60), t.data[e].second = t.data[e].fail % 60);
                    d.setData({
                        group_list2: t.data,
                        page: d.data.page + 1
                    }), timeup2(d);
                } else d.setData({
                    isbottom: !0
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        var d = this;
        app.util.request({
            url: "entry/wxapp/service",
            data: {
                op: "detail",
                id: d.data.list.id
            },
            success: function(a) {
                wx.stopPullDownRefresh();
                var t = a.data;
                if ("" != t.data) {
                    var e, i, s, n;
                    if (1 == t.data.is_flash) e = parseInt(parseInt(t.data.fail) / 86400), i = parseInt((t.data.fail - 86400 * e) / 3600), 
                    s = parseInt((t.data.fail - 86400 * e - 3600 * i) / 60), n = parseInt(t.data.fail % 60), 
                    t.data.day = e, t.data.hour = i, t.data.min = s, t.data.second = n;
                    if (d.setData({
                        list: t.data
                    }), 2 == t.data.content_type) {
                        var r = t.data.content2;
                        WxParse.wxParse("content", "html", r, d, 5);
                    }
                    1 == t.data.is_flash && (clearInterval(dd), time_up(d));
                }
            }
        });
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {
        var a = this, t = "/xc_beauty/pages/service/detail?&id=" + a.data.list.id, e = "/xc_beauty/pages/base/base?&share=" + (t = escape(t)), i = 1;
        "" != app.share && null != app.share && "" != app.share.content && null != app.share.content && (i = app.share.content.status), 
        1 == i && (e = e + "&scene=" + app.userinfo.openid);
        var s = a.data.config.title + "-" + a.data.list.name;
        "" != a.data.list.share_title && null != a.data.list.share_title && (s = a.data.list.share_title);
        var n = "";
        return "" != a.data.list.share_img && null != a.data.list.share_img && (n = a.data.list.share_img), 
        {
            title: s,
            path: e,
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