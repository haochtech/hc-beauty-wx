var app = getApp(), common = require("../common/common.js");

function member_search(e) {
    var a = {
        op: "member_search",
        page: e.data.page,
        pagesize: e.data.pagesize,
        id: e.data.id,
        curr: e.data.curr
    };
    1 == e.data.curr && (a.search = e.data.search), app.util.request({
        url: "entry/wxapp/manage",
        data: a,
        success: function(a) {
            var t = a.data;
            "" != t.data ? e.setData({
                list: e.data.list.concat(t.data),
                page: e.data.page + 1
            }) : e.setData({
                isbottom: !0
            });
        }
    });
}

Page({
    data: {
        page: 1,
        pagesize: 20,
        isbottom: !1,
        list: []
    },
    input: function(a) {
        this.setData({
            search: a.detail.value
        });
    },
    submit: function() {
        var a = this, t = a.data.search;
        "" != t && null != t ? (a.setData({
            list: [],
            page: 1,
            isbottom: !1
        }), member_search(a)) : wx.showModal({
            title: "错误",
            content: "请输入手机号"
        });
    },
    call: function(a) {
        var t = a.currentTarget.dataset.index;
        wx.makePhoneCall({
            phoneNumber: this.data.list[t].mobile
        });
    },
    onLoad: function(a) {
        var t = this;
        common.config(t), common.theme(t), t.setData({
            id: a.id,
            curr: a.curr
        }), 1 == a.curr && t.setData({
            search: a.search
        }), app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "store_detail",
                id: a.id
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && "" != t.data.store && null != t.data.store && wx.setNavigationBarTitle({
                    title: t.data.store.name
                });
            }
        }), member_search(t);
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        this.data.isbottom || member_search(this);
    }
});