var app = getApp(), common = require("../common/common.js"), wxCharts = require("../../../utils/wxcharts.js"), windowWidth = 320, areaChart = null, table_value = [];

function getTable(a) {
    var t = [];
    if (1 == a.data.curr) {
        t = [ "01", "06", "11", "16", "21", "26" ];
        var e = new Date(a.data.date);
        t.push(getDaysInMonth(e)), (table_value = [ a.data.date + "-01", a.data.date + "-06", a.data.date + "-11", a.data.date + "-16", a.data.date + "-21", a.data.date + "-26" ]).push(a.data.date + "-" + getDaysInMonth(e));
    } else if (2 == a.data.curr) {
        table_value = [];
        for (var r = 6; 0 <= r; r--) t.push(getDay(a.data.date, -r));
    }
    return t;
}

function isLeapYear(a) {
    var t = a.getFullYear();
    return 0 == t % 4 && 0 != t % 100 || 0 == t % 400;
}

function getDaysInMonth(a) {
    var t = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    return t[1] = isLeapYear(a) ? 29 : 28, t[a.getMonth()];
}

function getDay(a, t) {
    var e = new Date(a), r = e.getTime(), n = 864e5 * t;
    e.setTime(parseInt(r + n));
    var o = e.getFullYear(), d = (e.getMonth() + 1).toString();
    d.length <= 1 && (d = "0" + d);
    var i = e.getDate().toString();
    return i.length <= 1 && (i = "0" + i), table_value.push(o + "-" + d + "-" + i), 
    i;
}

function setTable(a, t) {
    areaChart = new wxCharts({
        canvasId: "areaCanvas",
        type: "area",
        categories: a,
        animation: !0,
        series: [ {
            name: "成交量",
            data: t,
            format: function(a) {
                return parseFloat(a).toFixed(2);
            }
        } ],
        yAxis: {
            format: function(a) {
                return a.toFixed(2);
            },
            min: 0,
            fontColor: "#c1c1c1",
            gridColor: "#efefef"
        },
        xAxis: {
            fontColor: "#c1c1c1",
            gridColor: "#efefef"
        },
        extra: {
            legendTextColor: "#f45a46"
        },
        width: windowWidth,
        height: 200
    });
}

Page({
    data: {
        list: [],
        page: 1,
        pagesize: 20,
        isbottom: !1,
        curr: 1
    },
    bindDateChange: function(a) {
        var e = this;
        e.setData({
            date: a.detail.value
        });
        var r = getTable(e);
        app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "store_income",
                store: e.data.store_id,
                plan_date: e.data.date,
                curr: e.data.curr,
                table_x: table_value
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && (e.setData({
                    xc: t.data
                }), setTable(r, t.data.table_y));
            }
        });
    },
    tab: function(a) {
        var e = this, t = a.currentTarget.dataset.index;
        if (t != e.data.curr) {
            e.setData({
                curr: t
            });
            var r = new Date(), n = r.getFullYear(), o = r.getMonth() + 1;
            o < 10 && (o = "0" + o);
            var d = r.getDate();
            d < 10 && (d = "0" + d), 1 == e.data.curr ? e.setData({
                date: n + "-" + o
            }) : 2 == e.data.curr && e.setData({
                date: n + "-" + o + "-" + d
            });
            var i = getTable(e);
            app.util.request({
                url: "entry/wxapp/manage",
                data: {
                    op: "store_income",
                    store: e.data.store_id,
                    plan_date: e.data.date,
                    curr: e.data.curr,
                    table_x: table_value
                },
                success: function(a) {
                    var t = a.data;
                    "" != t.data && (e.setData({
                        xc: t.data
                    }), setTable(i, t.data.table_y));
                }
            });
        }
    },
    touchHandler: function(a) {
        areaChart.showToolTip(a);
    },
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e);
        var t = new Date(), r = t.getFullYear(), n = t.getMonth() + 1;
        n < 10 && (n = "0" + n), e.setData({
            store_id: a.store_id,
            date: r + "-" + n
        }), app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "store_detail",
                id: a.store_id
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && "" != t.data.store && null != t.data.store && wx.setNavigationBarTitle({
                    title: t.data.store.name
                });
            }
        });
        try {
            var o = wx.getSystemInfoSync();
            windowWidth = o.windowWidth;
        } catch (a) {
            console.error("getSystemInfoSync failed!");
        }
        var d = getTable(e);
        app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "store_income",
                store: a.store_id,
                plan_date: e.data.date,
                curr: e.data.curr,
                table_x: table_value
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && (e.setData({
                    xc: t.data
                }), setTable(d, t.data.table_y));
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