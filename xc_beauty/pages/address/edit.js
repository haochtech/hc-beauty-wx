var app = getApp(), common = require("../common/common.js");

function sign(a) {
    var t = a.data.name, e = a.data.mobile, n = a.data.map, s = !0;
    "" != t && null != t || (s = !1), "" != e && null != e || (s = !1);
    /^[1][0-9]{10}$/.test(e) || (s = !1);
    var d = a.data.config;
    "" != d.map_status && null != d.map_status && 1 == d.map_status && ("" != n && null != n || (s = !1)), 
    a.setData({
        submit: s
    });
}

Page({
    data: {
        submit: !1
    },
    input: function(a) {
        var t = this;
        switch (a.currentTarget.dataset.name) {
          case "name":
            t.setData({
                name: a.detail.value
            });
            break;

          case "mobile":
            t.setData({
                mobile: a.detail.value
            });
            break;

          case "address":
            t.setData({
                address: a.detail.value
            });
            break;

          case "content":
            t.setData({
                content: a.detail.value
            });
        }
        sign(t);
    },
    map: function() {
        var t = this;
        wx.chooseLocation({
            success: function(a) {
                t.setData({
                    address: a.address,
                    map: a
                }), sign(t);
            }
        });
    },
    wx_address: function() {
        var t = this;
        wx.chooseAddress({
            success: function(a) {
                t.setData({
                    name: a.userName,
                    mobile: a.telNumber
                }), sign(t);
            }
        });
    },
    submit: function() {
        var a = this;
        if (a.data.submit) {
            var t = {
                op: "address_add",
                name: a.data.name,
                mobile: a.data.mobile
            };
            "" != a.data.content && null != a.data.content && (t.content = a.data.content), 
            "" != a.data.id && null != a.data.id && (t.id = a.data.id), "" != a.data.map && a.data.map && (t.map = JSON.stringify(a.data.map)), 
            "" != a.data.address && null != a.data.address && "undefined" != a.data.address && (t.address = a.data.address), 
            app.util.request({
                url: "entry/wxapp/user",
                data: t,
                success: function(a) {
                    "" != a.data.data && (wx.showToast({
                        title: "操作成功",
                        icon: "success",
                        duration: 2e3
                    }), setTimeout(function() {
                        wx.navigateBack({
                            delta: 1
                        });
                    }, 2e3));
                }
            });
        } else wx.showModal({
            title: "提示",
            content: "请完善信息"
        });
    },
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e), null != a.id && "" != a.id && (e.setData({
            id: a.id
        }), app.util.request({
            url: "entry/wxapp/user",
            data: {
                op: "address",
                id: a.id
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && e.setData({
                    name: t.data.name,
                    mobile: t.data.mobile,
                    map: t.data.map,
                    address: t.data.address,
                    content: t.data.content
                });
            }
        }));
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});