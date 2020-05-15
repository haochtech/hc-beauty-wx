var app = getApp();

function config(e) {
    var o = [ {
        pagePath: "../index/index",
        text: "首页",
        iconPath: "../../resource/footer01.png",
        selectedIconPath: "../../resource/footer001.png",
        status: 1
    }, {
        pagePath: "../service/service",
        text: "优惠套餐",
        iconPath: "../../resource/footer02.png",
        selectedIconPath: "../../resource/footer002.png",
        status: 1
    }, {
        pagePath: "../rotate/rotate",
        text: "抽奖",
        iconPath: "../../resource/footer03.png",
        selectedIconPath: "../../resource/footer03.png",
        status: 1
    }, {
        pagePath: "../store/porder",
        text: "预约",
        iconPath: "../../resource/footer07.png",
        selectedIconPath: app.can_bimg.footer007,
        status: 1
    }, {
        pagePath: "../user/user",
        text: "我的",
        iconPath: "../../resource/footer05.png",
        selectedIconPath: "../../resource/footer005.png",
        status: 1
    } ];
    "" != app.theme && null != app.theme && 3 == app.theme.content.theme && (o = [ {
        pagePath: "../../ui2/index/index",
        text: "主页",
        iconPath: "../../resource/theme3_14.png",
        selectedIconPath: "../../resource/theme3_15.png",
        status: 1
    }, {
        pagePath: "../../ui2/service/service",
        text: "项目",
        iconPath: "../../resource/theme3_16.png",
        selectedIconPath: "../../resource/theme3_17.png",
        status: 1
    }, {
        pagePath: "../../ui2/rotate/rotate",
        text: "抽奖",
        iconPath: "../../resource/theme3_18.png",
        selectedIconPath: "../../resource/theme3_19.png",
        status: 1
    }, {
        pagePath: "../../ui2/store/porder",
        text: "预约",
        iconPath: "../../resource/theme3_20.png",
        selectedIconPath: "../../resource/theme3_21.png",
        status: 1
    }, {
        pagePath: "../../ui2/user/user",
        text: "我的",
        iconPath: "../../resource/theme3_22.png",
        selectedIconPath: "../../resource/theme3_23.png",
        status: 1
    } ]);
    var t = "";
    if ("" != app.config && null != app.config) {
        if (wx.setNavigationBarTitle({
            title: app.config.content.title
        }), "" != (t = app.config.content).footer && null != t.footer) for (var n = 0; n < t.footer.length; n++) "" != t.footer[n].text && null != t.footer[n].text && (o[n].text = t.footer[n].text), 
        "" != t.footer[n].icon && null != t.footer[n].icon && (o[n].iconPath = t.footer[n].icon), 
        "" != t.footer[n].select && null != t.footer[n].select && (o[n].selectedIconPath = t.footer[n].select), 
        "" != t.footer[n].link && null != t.footer[n].link && (o[n].pagePath = t.footer[n].link), 
        "" != t.footer[n].status && null != t.footer[n].status && (o[n].status = t.footer[n].status);
        "" != app.model && null != app.model && (t.model = app.model);
    }
    for (n = 0; n < o.length; n++) "" != e.data.pagePath && null != e.data.pagePath && -1 != o[n].pagePath.indexOf(e.data.pagePath) && 1 == o[n].status && e.setData({
        footerCurr: n + 1
    });
    e.g_footer = g_footer, e.call_mobile = call_mobile, e.updateUserInfo = updateUserInfo, 
    is_user(e), e.user_close = user_close, e.setData({
        footer: o,
        config: t,
        can_bimg: app.can_bimg,
        version: app.globalData.version
    }), app.app_add_status && (e.setData({
        app_step1: !0
    }), e.app_step_next = app_step_next, e.app_step_end = app_step_end);
}

function theme(e) {
    var o = {
        name: "theme1",
        color: "#e74479",
        icon: [ "../../resource/icon01.png", "../../resource/icon02.png", "../../resource/icon03.png", "../../resource/icon04.png", "../../resource/icon05.png", "../../resource/icon06.png", "../../resource/icon07.png", "../../resource/icon08.png", "../../resource/icon09.png", "../../resource/icon10.png", "../../resource/icon11.png", "../../resource/icon12.png", "../../resource/icon13.png", "../../resource/icon14.png", "../../resource/icon15.png", "../../resource/icon16.png", "../../resource/icon17.png", "../../resource/icon18.png", "../../resource/icon19.png", "../../resource/icon20.png", "../../resource/icon21.png", "../../resource/icon22.png", "../../resource/icon23.png", "../../resource/icon24.png", app.can_bimg.icon25, app.can_bimg.icon26, "../../resource/icon28.png", app.can_bimg.icon28, "../../resource/group03.png", app.can_bimg.icon29, "../../resource/icon29.png", "../../resource/package2.png", "../../resource/footer07.png" ]
    };
    if ("" != app.theme && null != app.theme) {
        var t = app.theme.content;
        if (2 == t.theme) {
            if (o.name = "theme" + t.theme, o.color = t.color, "" != t.icon && null != t.icon) for (var n = 0; n < t.icon.length; n++) "" != t.icon[n] && null != t.icon[n] && (o.icon[n] = t.icon[n]);
        } else 3 == t.theme && (o.name = "theme3", o.color = "#444444");
    }
    "theme3" == o.name ? wx.setNavigationBarColor({
        frontColor: "#000000",
        backgroundColor: "#fff",
        animation: {
            duration: 400,
            timingFunc: "easeIn"
        }
    }) : wx.setNavigationBarColor({
        frontColor: "#ffffff",
        backgroundColor: o.color,
        animation: {
            duration: 400,
            timingFunc: "easeIn"
        }
    }), e.setData({
        theme: o
    });
}

function login(e, o) {
    app.util.getUserInfo(function(e) {
        var o = {};
        "" != e.wxInfo && null != e.wxInfo ? (o = e.wxInfo).op = "userinfo" : o.op = "userinfo", 
        "" != app.scene && null != app.scene && (o.scene = app.scene), "" != app.oid && null != app.oid && (o.oid = app.oid), 
        app.util.request({
            url: "entry/wxapp/index",
            showLoading: !1,
            data: o,
            success: function(e) {
                var o = e.data;
                "" != o.data && (app.userinfo = o.data);
            }
        });
    });
}

function g_footer(e) {
    var o = e.currentTarget.dataset.url;
    -1 < o.indexOf(",") ? (o = o.split(","), wx.navigateToMiniProgram({
        appId: o[0],
        path: o[1],
        success: function(e) {
            console.log(e);
        }
    })) : -1 < o.indexOf("$") ? "store" == (o = o.split("$"))[0] && (-1 == o[1] ? app.util.request({
        url: "entry/wxapp/user",
        showLoading: !1,
        data: {
            op: "userinfo"
        },
        success: function(e) {
            var o = e.data;
            "" != o.data && "" != o.data.store && null != o.data.store && wx.navigateTo({
                url: "../store/detail?&id=" + o.data.store + "&bind=false"
            });
        }
    }) : wx.navigateTo({
        url: "../store/detail?&id=" + o[1] + "&bind=false"
    })) : wx.reLaunch({
        url: o
    });
}

function call_mobile() {
    wx.makePhoneCall({
        phoneNumber: this.data.config.mobile
    });
}

function updateUserInfo(e) {
    var t = getApp(), n = this;
    "" != e.detail.userInfo && null != e.detail.userInfo && (t.util.getUserInfo(function(e) {
        var o = {};
        "" != e.wxInfo && null != e.wxInfo ? (o = e.wxInfo).op = "userinfo" : o.op = "userinfo", 
        "" != t.scene && null != t.scene && (o.scene = t.scene), "" != t.oid && null != t.oid && (o.oid = t.oid), 
        t.util.request({
            url: "entry/wxapp/index",
            showLoading: !1,
            data: o,
            success: function(e) {
                var o = e.data;
                "" != o.data && (t.userinfo = o.data, n.setData({
                    userinfo: o.data
                }));
            }
        });
    }, e.detail), console.log(e));
}

function is_user(e) {
    var o = wx.getStorageSync("userInfo") || {};
    "" != o.wxInfo && null != o.wxInfo || e.setData({
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
    var o = this;
    app.util.request({
        url: "entry/wxapp/index",
        method: "POST",
        showLoading: !1,
        data: {
            op: "app_add_log"
        },
        success: function(e) {
            "" != e.data.data && (o.setData({
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