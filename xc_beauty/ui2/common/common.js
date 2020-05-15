var app = getApp();

function config(e) {
    var t = [ {
        pagePath: "../index/index",
        text: "主页",
        iconPath: "../../resource/theme3_14.png",
        selectedIconPath: "../../resource/theme3_15.png",
        status: 1
    }, {
        pagePath: "../service/service",
        text: "项目",
        iconPath: "../../resource/theme3_16.png",
        selectedIconPath: "../../resource/theme3_17.png",
        status: 1
    }, {
        pagePath: "../rotate/rotate",
        text: "抽奖",
        iconPath: "../../resource/theme3_18.png",
        selectedIconPath: "../../resource/theme3_19.png",
        status: 1
    }, {
        pagePath: "../store/porder",
        text: "预约",
        iconPath: "../../resource/theme3_20.png",
        selectedIconPath: "../../resource/theme3_21.png",
        status: 1
    }, {
        pagePath: "../user/user",
        text: "我的",
        iconPath: "../../resource/theme3_22.png",
        selectedIconPath: "../../resource/theme3_23.png",
        status: 1
    } ], o = "";
    if ("" != app.config && null != app.config) {
        if (wx.setNavigationBarTitle({
            title: app.config.content.title
        }), "" != (o = app.config.content).footer && null != o.footer) for (var a = 0; a < o.footer.length; a++) "" != o.footer[a].text && null != o.footer[a].text && (t[a].text = o.footer[a].text), 
        "" != o.footer[a].icon && null != o.footer[a].icon && (t[a].iconPath = o.footer[a].icon), 
        "" != o.footer[a].select && null != o.footer[a].select && (t[a].selectedIconPath = o.footer[a].select), 
        "" != o.footer[a].link && null != o.footer[a].link && (t[a].pagePath = o.footer[a].link), 
        "" != o.footer[a].status && null != o.footer[a].status && (t[a].status = o.footer[a].status);
        "" != app.model && null != app.model && (o.model = app.model);
    }
    for (a = 0; a < t.length; a++) "" != e.data.pagePath && null != e.data.pagePath && -1 != t[a].pagePath.indexOf(e.data.pagePath) && 1 == t[a].status && e.setData({
        footerCurr: a + 1
    });
    e.g_footer = g_footer, e.call_mobile = call_mobile, e.updateUserInfo = updateUserInfo, 
    is_user(e), e.user_close = user_close, e.setData({
        footer: t,
        config: o,
        can_bimg: app.can_bimg,
        version: app.globalData.version
    }), app.app_add_status && (e.setData({
        app_step1: !0
    }), e.app_step_next = app_step_next, e.app_step_end = app_step_end);
}

function theme(e) {
    var t = {
        name: "theme1",
        color: "#e74479",
        icon: []
    };
    if ("" != app.theme && null != app.theme) {
        var o = app.theme.content;
        if (2 == o.theme) {
            if (t.name = "theme" + o.theme, t.color = o.color, "" != o.icon && null != o.icon) for (var a = 0; a < o.icon.length; a++) "" != o.icon[a] && null != o.icon[a] && (t.icon[a] = o.icon[a]);
        } else 3 == o.theme && (t.name = "theme3", t.color = "#444444");
    }
    "theme3" == t.name ? wx.setNavigationBarColor({
        frontColor: "#000000",
        backgroundColor: "#fff",
        animation: {
            duration: 400,
            timingFunc: "easeIn"
        }
    }) : wx.setNavigationBarColor({
        frontColor: "#ffffff",
        backgroundColor: t.color,
        animation: {
            duration: 400,
            timingFunc: "easeIn"
        }
    }), e.setData({
        theme: t
    });
}

function login(e, t) {
    app.util.getUserInfo(function(e) {
        var t = {};
        "" != e.wxInfo && null != e.wxInfo ? (t = e.wxInfo).op = "userinfo" : t.op = "userinfo", 
        "" != app.scene && null != app.scene && (t.scene = app.scene), "" != app.oid && null != app.oid && (t.oid = app.oid), 
        app.util.request({
            url: "entry/wxapp/index",
            showLoading: !1,
            data: t,
            success: function(e) {
                var t = e.data;
                "" != t.data && (app.userinfo = t.data);
            }
        });
    });
}

function g_footer(e) {
    var t = e.currentTarget.dataset.url;
    -1 < t.indexOf(",") ? (t = t.split(","), wx.navigateToMiniProgram({
        appId: t[0],
        path: t[1],
        success: function(e) {
            console.log(e);
        }
    })) : -1 < t.indexOf("$") ? "store" == (t = t.split("$"))[0] && (-1 == t[1] ? app.util.request({
        url: "entry/wxapp/user",
        showLoading: !1,
        data: {
            op: "userinfo"
        },
        success: function(e) {
            var t = e.data;
            "" != t.data && "" != t.data.store && null != t.data.store && wx.navigateTo({
                url: "../../pages/store/detail?&id=" + t.data.store + "&bind=false"
            });
        }
    }) : wx.navigateTo({
        url: "../../pages/store/detail?&id=" + t[1] + "&bind=false"
    })) : wx.reLaunch({
        url: t
    });
}

function call_mobile() {
    wx.makePhoneCall({
        phoneNumber: this.data.config.mobile
    });
}

function updateUserInfo(e) {
    var o = getApp(), a = this;
    "" != e.detail.userInfo && null != e.detail.userInfo && (o.util.getUserInfo(function(e) {
        var t = {};
        "" != e.wxInfo && null != e.wxInfo ? (t = e.wxInfo).op = "userinfo" : t.op = "userinfo", 
        "" != o.scene && null != o.scene && (t.scene = o.scene), "" != o.oid && null != o.oid && (t.oid = o.oid), 
        o.util.request({
            url: "entry/wxapp/index",
            showLoading: !1,
            data: t,
            success: function(e) {
                var t = e.data;
                "" != t.data && (o.userinfo = t.data, a.setData({
                    userinfo: t.data
                }));
            }
        });
    }, e.detail), console.log(e));
}

function is_user(e) {
    var t = wx.getStorageSync("userInfo") || {};
    "" != t.wxInfo && null != t.wxInfo || e.setData({
        shadow: !0,
        get_userinfo: !0
    });
}

function user_close() {
    this.setData({
        shadow: !1,
        get_userinfo: !1
    });
}

function app_step_next() {
    this.setData({
        app_step1: !1,
        app_step2: !0
    });
}

function app_step_end() {
    var t = this;
    app.util.request({
        url: "entry/wxapp/index",
        method: "POST",
        showLoading: !1,
        data: {
            op: "app_add_log"
        },
        success: function(e) {
            "" != e.data.data && (t.setData({
                app_step2: !1
            }), app.app_add_status = !1);
        }
    });
}

module.exports = {
    config: config,
    theme: theme,
    login: login,
    g_footer: g_footer,
    call_mobile: call_mobile,
    updateUserInfo: updateUserInfo,
    is_user: is_user,
    user_close: user_close
};