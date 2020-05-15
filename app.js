App({
    onLaunch: function(e) {},
    onShow: function(e) {
        var o = this, n = unescape(e.query.scene);
        "" != n && null != n && "undefined" != n && (o.share = "", o.buy_share = "", o.store = "", 
        o.member = "", o.mall = "", -1 != n.indexOf("c_beauty/pages/order/buy") ? "/" == n.slice(0, 1) ? o.buy_share = n : o.buy_share = "/" + n : -1 != n.indexOf("_") && (-1 != n.indexOf("buy_share") || -1 != n.indexOf("mall") || -1 != n.indexOf("store") || -1 != n.indexOf("member")) || -1 != n.indexOf("buy") ? (n = n.split("_"), 
        console.log(n), 2 <= n.length && (o[n[0]] = n[1]), 4 <= n.length && (o[n[2]] = n[3])) : o.scene = n);
    },
    onHide: function() {},
    onError: function(e) {},
    util: require("we7/resource/js/util.js"),
    tabBar: {
        color: "#123",
        selectedColor: "#1ba9ba",
        borderStyle: "#1ba9ba",
        backgroundColor: "#fff",
        list: [ {
            pagePath: "/we7_wxappdemo/pages/index/index",
            iconPath: "/we7/resource/icon/home.png",
            selectedIconPath: "/we7/resource/icon/homeselect.png",
            text: "首页"
        }, {
            pagePath: "/we7_wxappdemo/pages/footer/footer",
            iconPath: "/we7/resource/icon/user.png",
            selectedIconPath: "/we7/resource/icon/userselect.png",
            text: "底部"
        }, {
            pagePath: "/we7_wxappdemo/pages/todo/todo",
            iconPath: "/we7/resource/icon/todo.png",
            selectedIconPath: "/we7/resource/icon/todoselect.png",
            text: "ToDo"
        }, {
            pagePath: "/we7_wxappdemo/pages/pay/pay",
            iconPath: "/we7/resource/icon/pay.png",
            selectedIconPath: "/we7/resource/icon/payselect.png",
            text: "支付"
        } ]
    },
    app_add_status: !1,
    globalData: {
        userInfo: null,
        version: "3.2.7"
    },
    siteInfo: require("siteinfo.js")
});