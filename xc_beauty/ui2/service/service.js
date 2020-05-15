var _data;

function _defineProperty(t, a, e) {
    return a in t ? Object.defineProperty(t, a, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = e, t;
}

var app = getApp(), common = require("../common/common.js");

function getlist(e) {
    var t = {
        op: "list",
        page: e.data.page,
        pagesize: e.data.pagesize
    };
    -1 != e.data.sortCurr && (t.cid = e.data.class[e.data.sortCurr].id), 1 == e.data.tagCurr ? t.home = 1 : 2 == e.data.tagCurr && (t.shop = 1), 
    app.util.request({
        url: "entry/wxapp/service",
        data: t,
        success: function(t) {
            var a = t.data;
            "" != a.data ? e.setData({
                list: e.data.list.concat(a.data),
                page: e.data.page + 1
            }) : e.setData({
                isbottom: !0
            });
        }
    });
}

Page({
    data: (_data = {
        pagePath: "service/service",
        page: 1,
        pagesize: 20,
        isbottom: !1,
        curr: 0,
        sortName: "分类",
        tagName: "方式"
    }, _defineProperty(_data, "page", 1), _defineProperty(_data, "pagesize", 20), _defineProperty(_data, "isbottom", !1), 
    _defineProperty(_data, "sortCurr", -1), _defineProperty(_data, "tagCurr", -1), _defineProperty(_data, "type", 1), 
    _defineProperty(_data, "sort_list", !1), _defineProperty(_data, "tag_list", !1), 
    _defineProperty(_data, "list", []), _defineProperty(_data, "tags", [ "上门服务", "到店服务" ]), 
    _data),
    choose: function(t) {
        var a = t.currentTarget.dataset.index;
        a != this.data.type && this.setData({
            type: a
        });
    },
    all: function(t) {
        var a = this;
        0 != a.data.curr && (a.setData({
            curr: 0,
            sortCurr: -1,
            sortName: "类别",
            tagCurr: -1,
            tagName: "标签",
            list: [],
            page: 1,
            isbottom: !1
        }), getlist(a));
    },
    sort: function() {
        this.setData({
            sort_list: !this.data.sort_list,
            tag_list: !1
        });
    },
    sortChoose: function(t) {
        var a = this, e = t.currentTarget.dataset.index;
        a.setData({
            sort_list: !1,
            sortCurr: e,
            sortName: a.data.class[e].name,
            curr: 1,
            list: [],
            page: 1,
            isbottom: !1
        }), getlist(a);
    },
    tag: function() {
        this.setData({
            tag_list: !this.data.tag_list,
            sort_list: !1
        });
    },
    tagChoose: function(t) {
        var a = this, e = t.currentTarget.dataset.index;
        a.setData({
            tag_list: !1,
            tagCurr: e,
            tagName: a.data.tags[e - 1],
            curr: 2,
            list: [],
            page: 1,
            isbottom: !1
        }), getlist(a);
    },
    onLoad: function(r) {
        var i = this;
        if (common.config(i), common.theme(i), app.util.request({
            url: "entry/wxapp/service",
            data: {
                op: "pclass"
            },
            success: function(t) {
                var a = t.data;
                if ("" != a.data) {
                    var e = -1;
                    if (null != r.cid && null != r.cid) {
                        for (var s = 0; s < a.data.length; s++) a.data[s].id == r.cid && (e = s);
                        i.setData({
                            sortCurr: e,
                            sortName: a.data[e].name,
                            curr: 1,
                            list: [],
                            page: 1,
                            isbottom: !1
                        });
                    }
                    i.setData({
                        class: a.data
                    }), getlist(i);
                } else getlist(i);
            }
        }), "" != app.config && null != app.config) {
            var t = app.config;
            "" != t.content.service_sort && null != t.content.service_sort && i.setData({
                type: t.content.service_sort
            });
        }
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        this.data.isbottom || getlist(this);
    },
    onShareAppMessage: function() {
        var t = this, a = "/xc_beauty/ui2/service/service";
        a = escape(a);
        var e = t.data.config.title + "-首页";
        "" != t.data.config.share_service_title && null != t.data.config.share_service_title && (e = t.data.config.share_service_title);
        var s = "";
        "" != t.data.config.share_service_img && null != t.data.config.share_service_img && (s = t.data.config.share_service_img);
        var r = "/xc_beauty/pages/base/base?&share=" + a, i = 1;
        return "" != app.share && null != app.share && "" != app.share.content && null != app.share.content && (i = app.share.content.status), 
        1 == i && (r = r + "&scene=" + app.userinfo.openid), {
            title: e,
            path: r,
            imageUrl: s,
            success: function(t) {
                console.log(t);
            },
            fail: function(t) {
                console.log(t);
            }
        };
    }
});