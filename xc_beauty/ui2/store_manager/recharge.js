var app = getApp(), common = require("../common/common.js");

function sign(a) {
    var t = a.data.userinfo, e = a.data.amount, n = "";
    "" != e && null != e || (n = "请输入或选择充值金额"), "" != t && null != t || (n = "请选择要充值的会员"), 
    "" == n ? a.setData({
        submit: !0
    }) : wx.showModal({
        title: "错误",
        content: n
    });
}

Page({
    data: {
        submit: !1,
        over: -1
    },
    input: function(a) {
        var t = this;
        switch (a.currentTarget.dataset.name) {
          case "search":
            t.setData({
                search: a.detail.value
            });
            break;

          case "amount":
            t.setData({
                amount: a.detail.value
            });
            break;

          case "gift":
            t.setData({
                gift: a.detail.value
            });
            break;

          case "content":
            t.setData({
                content: a.detail.value
            });
        }
    },
    choose: function(a) {
        var t = a.currentTarget.dataset.index, e = this.data.card.content.recharge, n = e[t].r_price, o = "";
        "" != e[t].g_price && null != e[t].r_price && (o = e[t].g_price), this.setData({
            amount: n,
            gift: o,
            over: t
        });
    },
    submit: function() {
        var e = this, a = e.data.search;
        "" != a && null != a ? app.util.request({
            url: "entry/wxapp/user",
            data: {
                op: "member_search",
                search: e.data.search,
                store: e.data.store_id
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && e.setData({
                    userinfo: t.data
                });
            }
        }) : wx.showModal({
            title: "错误",
            content: "请输入手机号"
        });
    },
    pay: function() {
        var t = this;
        if (sign(t), t.data.submit) {
            var a = {
                openid: t.data.userinfo.openid,
                amount: t.data.amount,
                store: t.data.store_id
            };
            "" != t.data.gift && null != t.data.gift && (a.gift = t.data.gift), "" != t.data.content && null != t.data.content && (a.content = t.data.content), 
            app.util.request({
                url: "entry/wxapp/admincard",
                data: a,
                success: function(a) {
                    "" != a.data.data && (t.setData({
                        userinfo: "",
                        over: -1,
                        amount: "",
                        gift: "",
                        content: "",
                        submit: !1
                    }), wx.showToast({
                        title: "充值成功",
                        icon: "success",
                        duration: 2e3
                    }));
                }
            });
        }
    },
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e), e.setData({
            store_id: a.store_id
        }), app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "store_detail",
                id: a.store_id
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && ("" != t.data.store && null != t.data.store && wx.setNavigationBarTitle({
                    title: t.data.store.name
                }), "" != t.data.store_manager && null != t.data.store_manager && e.setData({
                    store_manager: t.data.store_manager
                }));
            }
        }), app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "card"
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && e.setData({
                    card: t.data
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