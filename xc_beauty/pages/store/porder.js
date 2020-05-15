var app = getApp(), common = require("../common/common.js");

function GetDateStr(a) {
    var t = new Date();
    t.setDate(t.getDate() + a);
    t.getFullYear();
    return t.getMonth() + 1 + "月" + t.getDate() + "日";
}

function GetDate(a) {
    var t = new Date();
    return t.setDate(t.getDate() + a), t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate();
}

function getMyDay(a) {
    var t = new Date();
    return t.setDate(t.getDate() + a), 0 == t.getDay() && "周日", 1 == t.getDay() && "周一", 
    2 == t.getDay() && "周二", 3 == t.getDay() && "周三", 4 == t.getDay() && "周四", 5 == t.getDay() && "周五", 
    6 == t.getDay() && "周六", t.getDay();
}

function getMyDay2(a) {
    var t, e = new Date();
    return e.setDate(e.getDate() + a), 0 == e.getDay() && (t = "周日"), 1 == e.getDay() && (t = "周一"), 
    2 == e.getDay() && (t = "周二"), 3 == e.getDay() && (t = "周三"), 4 == e.getDay() && (t = "周四"), 
    5 == e.getDay() && (t = "周五"), 6 == e.getDay() && (t = "周六"), t;
}

function get_time(d) {
    var i = d.data.times, s = [], r = !1;
    d.setData({
        time_list: r,
        tip: r
    }), 1 == d.data.online_time && app.util.request({
        url: "entry/wxapp/user",
        showLoading: !1,
        data: {
            op: "plan_date",
            plan_date: d.data.date[d.data.date_curr].date,
            id: d.data.id
        },
        success: function(a) {
            var t = a.data;
            if ("" != t.data) {
                if (1 == t.data.status) for (var e = 0; e < i.length; e++) i[e].week == d.data.date[d.data.date_curr].week ? s = i[e].content : 7 == i[e].week && 0 == d.data.date[d.data.date_curr].week && (s = i[e].content); else r = !0;
                "" != d.data.member_id && null != d.data.member_id ? app.util.request({
                    url: "entry/wxapp/user",
                    data: {
                        op: "times_log",
                        member: d.data.member_id,
                        plan_date: d.data.date[d.data.date_curr].date,
                        list: JSON.stringify(s),
                        index: d.data.date[d.data.date_curr].index,
                        week: d.data.date[d.data.date_curr].week,
                        type: d.data.service_type
                    },
                    success: function(a) {
                        var t = a.data;
                        "" != t.data ? d.setData({
                            tip: r,
                            time_curr: -1,
                            time_list: t.data
                        }) : d.setData({
                            tip: r,
                            time_curr: -1,
                            time_list: s
                        });
                    }
                }) : d.setData({
                    time_curr: -1,
                    time_list: s,
                    tip: r
                });
            }
        }
    });
}

function sign(a) {
    var t = a.data.time_curr, e = a.data.name, d = a.data.mobile, i = a.data.member_id, s = a.data.service_id, r = a.data.service_type, n = !0;
    1 == a.data.online_time && -1 == t && (n = !1), "" != e && null != e || (n = !1), 
    "" != d && null != d || (n = !1);
    /^[1][0-9]{10}$/.test(d) || (n = !1), -1 == r && (n = !1), "" != i && null != i && "" != s && null != s || (n = !1), 
    a.setData({
        submit: n
    });
}

function getPackage(e) {
    "" != e.data.service_id && null != e.data.service_id && "" != e.data.id && null != e.data.id ? app.util.request({
        url: "entry/wxapp/index",
        data: {
            op: "getPackage",
            service: e.data.service_id,
            store: e.data.id
        },
        success: function(a) {
            var t = a.data;
            "" != t.data ? e.setData({
                package_list: t.data
            }) : e.setData({
                package_list: "",
                package_curr: -1
            });
        }
    }) : e.setData({
        package_list: "",
        package_curr: -1
    });
}

function getArea(e) {
    if (1 == e.data.service_type) if ("" != e.data.list && null != e.data.list) {
        var a = e.data.list;
        1 == a.distance_status && "" != a.distance && null != a.distance ? "" != e.data.map && null != e.data.map ? (e.setData({
            area_load: !1
        }), app.util.request({
            url: "entry/wxapp/service",
            data: {
                op: "area",
                store: a.id,
                latitude: e.data.map.latitude,
                longitude: e.data.map.longitude
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && e.setData({
                    area_status: t.data.area_status,
                    area_load: !0
                });
            }
        })) : e.setData({
            area_status: -1
        }) : e.setData({
            area_status: 1
        });
    } else e.setData({
        area_status: 1
    }); else e.setData({
        area_status: 1
    });
}

Page({
    data: {
        pagePath: "store/porder",
        date_curr: 0,
        page: 1,
        pagesize: 20,
        isbottom: !1,
        submit: !1,
        time_curr: -1,
        service_type: -1,
        package_curr: -1,
        area_status: 1,
        area_load: !0
    },
    tab: function(a) {
        var t = this, e = (t.data.service_home, a.currentTarget.dataset.index);
        e != t.data.service_type && (t.setData({
            service_type: e,
            member_id: "",
            member_name: "",
            service_id: "",
            service_name: ""
        }), get_time(t), sign(t), getPackage(t), getArea(t));
    },
    qie: function() {
        var e = this;
        if (-1 != e.data.id) {
            e.setData({
                store_page: !0,
                store_list: []
            });
            var a = {
                op: "store",
                page: e.data.page,
                pagesize: e.data.pagesize
            };
            null != e.data.latitude && "" != e.data.latitude && (a.latitude = e.data.latitude), 
            null != e.data.longitude && "" != e.data.longitude && (a.longitude = e.data.longitude), 
            app.util.request({
                url: "entry/wxapp/order",
                data: a,
                success: function(a) {
                    var t = a.data;
                    "" != t.data && e.setData({
                        store_list: t.data
                    });
                }
            });
        }
    },
    store_close: function() {
        this.setData({
            store_page: !1
        });
    },
    store_choose: function(a) {
        var t = this, e = a.currentTarget.dataset.index;
        t.setData({
            list: t.data.store_list[e],
            id: t.data.store_list[e].id,
            store_page: !1,
            member_id: "",
            service_id: ""
        }), sign(t), getPackage(t), getArea(t);
    },
    call: function(a) {
        var t = this;
        null != t.data.id && "" != t.data.id && (-1 == t.data.id ? wx.makePhoneCall({
            phoneNumber: t.data.map.content.mobile
        }) : wx.makePhoneCall({
            phoneNumber: t.data.list.mobile
        }));
    },
    map: function(a) {
        var t = this;
        null != t.data.id && "" != t.data.id && (-1 == t.data.id ? wx.openLocation({
            latitude: parseFloat(t.data.map.content.latitude),
            longitude: parseFloat(t.data.map.content.longitude),
            name: t.data.map.content.address,
            address: t.data.map.content.address,
            scale: 28
        }) : wx.openLocation({
            latitude: parseFloat(t.data.list.map.latitude),
            longitude: parseFloat(t.data.list.map.longitude),
            name: t.data.list.address,
            address: t.data.list.address,
            scale: 28
        }));
    },
    date_choose: function(a) {
        var t = this, e = a.currentTarget.dataset.index;
        e != t.data.date_curr && (t.setData({
            date_curr: e,
            time_curr: -1
        }), get_time(t), sign(t));
    },
    date_left: function() {
        var a = this;
        if (0 < a.data.date_curr) a.setData({
            date_curr: a.data.date_curr - 1,
            time_curr: -1
        }), get_time(a), sign(a); else {
            var t = a.data.date;
            if (0 < t[a.data.date_curr].index) {
                var e = {};
                e.index = t[a.data.date_curr].index - 1, e.date = GetDateStr(e.index), e.plan_date = GetDate(e.index), 
                e.week = getMyDay(e.index), 0 == e.index ? e.name = "今天" : e.name = getMyDay2(e.index), 
                t.splice(t.length - 1, 1), t.unshift(e), a.setData({
                    date: t,
                    time_curr: -1
                }), get_time(a), sign(a);
            }
        }
    },
    date_right: function() {
        var a = this, t = a.data.config, e = -1;
        if (1 == t.yu_status && "" != t.yu_value && null != t.yu_value) {
            var d = a.data.date;
            parseInt(d[d.length - 1].index) + 1 >= parseInt(t.yu_value) && (e = 1);
        }
        if (-1 == e) if (a.data.date_curr < a.data.date.length - 1) a.setData({
            date_curr: a.data.date_curr + 1,
            time_curr: -1
        }), get_time(a), sign(a); else {
            d = a.data.date;
            var i = {};
            i.index = d[a.data.date_curr].index + 1, i.date = GetDateStr(i.index), i.plan_date = GetDate(i.index), 
            i.week = getMyDay(i.index), 0 == i.index ? i.name = "今天" : i.name = getMyDay2(i.index), 
            d.splice(0, 1), d.push(i), a.setData({
                date: d,
                time_curr: -1
            }), get_time(a), sign(a);
        }
    },
    time_choose: function(a) {
        var t = this, e = a.currentTarget.dataset.index;
        e != t.data.time_curr && (t.setData({
            time_curr: e
        }), sign(t));
    },
    member_on: function() {
        var e = this;
        if ("" != e.data.id && null != e.data.id) {
            if (e.data.service_type) {
                e.setData({
                    member_page: !0
                });
                var a = {
                    op: "store_member",
                    id: e.data.id,
                    page: e.data.page,
                    pagesize: e.data.pagesize
                };
                "" != e.data.service_id && null != e.data.service_id && (a.service = e.data.service_id), 
                -1 != e.data.service_type && (a.service_type = e.data.service_type), app.util.request({
                    url: "entry/wxapp/index",
                    data: a,
                    success: function(a) {
                        var t = a.data;
                        "" != t.data ? e.setData({
                            member_list: t.data,
                            page: e.data.page
                        }) : e.setData({
                            isbottom: !0
                        });
                    }
                });
            }
        } else wx.showModal({
            title: "提示",
            content: "请先选择门店",
            success: function(a) {
                a.confirm ? console.log("用户点击确定") : a.cancel && console.log("用户点击取消");
            }
        });
    },
    member_close: function() {
        this.setData({
            member_page: !1,
            page: 1,
            isbottom: !1,
            member_list: []
        });
    },
    member_choose: function(a) {
        var t = this, e = a.currentTarget.dataset.index, d = t.data.member_list;
        t.setData({
            member_id: d[e].id,
            member_name: d[e].name,
            member_page: !1,
            page: 1,
            isbottom: !1,
            member_list: []
        }), sign(t), get_time(t), getPackage(t);
    },
    service_on: function() {
        var e = this;
        if ("" != e.data.id && null != e.data.id) {
            e.setData({
                shadow: !0,
                service_page: !0
            });
            var a = {
                op: "store_service",
                id: e.data.id
            };
            "" != e.data.member_id && null != e.data.member_id && (a.member = e.data.member_id), 
            -1 != e.data.service_type && (a.service_type = e.data.service_type), app.util.request({
                url: "entry/wxapp/index",
                data: a,
                success: function(a) {
                    var t = a.data;
                    "" != t.data && e.setData({
                        service_list: t.data
                    });
                }
            });
        } else wx.showModal({
            title: "提示",
            content: "请先选择门店",
            success: function(a) {
                a.confirm ? console.log("用户点击确定") : a.cancel && console.log("用户点击取消");
            }
        });
    },
    service_close: function() {
        this.setData({
            shadow: !1,
            service_page: !1,
            service_list: []
        });
    },
    service_choose: function(a) {
        var t = a.currentTarget.dataset.index, e = this.data.service_list;
        this.setData({
            shadow: !1,
            service_page: !1,
            service_id: e[t].id,
            service_name: e[t].name,
            service_list: []
        }), sign(this), getPackage(this);
    },
    reset: function(a) {
        var t = a.currentTarget.dataset.index;
        1 == t ? this.setData({
            member_id: "",
            member_name: ""
        }) : 2 == t && this.setData({
            service_id: "",
            service_name: ""
        }), sign(this), getPackage(this);
    },
    submit: function(a) {
      var t = this;
      var uInfo = wx.getStorageSync("userInfo");
      if (!uInfo) {
        t.setData({
          shadow: !0,
          get_userinfo: !0
        })
        return false;
      }
        if (t.data.submit) {
            var e = {
                id: t.data.service_id,
                total: 1,
                name: t.data.name,
                mobile: t.data.mobile,
                store: t.data.id,
                member: t.data.member_id,
                service_type: t.data.service_type,
                form_id: a.detail.formId
            };
            1 == t.data.online_time && (e.date = t.data.date[t.data.date_curr].date, e.plan_date = t.data.date[t.data.date_curr].date + " " + t.data.time_list[t.data.time_curr].start + "-" + t.data.time_list[t.data.time_curr].end, 
            e.plan_start = t.data.date[t.data.date_curr].plan_date + " " + t.data.time_list[t.data.time_curr].start, 
            e.plan_end = t.data.date[t.data.date_curr].plan_date + " " + t.data.time_list[t.data.time_curr].end), 
            "" != t.data.address && null != t.data.address && "undefined" != t.data.address && (e.address = t.data.address), 
            "" != t.data.map && null != t.data.map && "undefined" != t.data.map && (e.map = JSON.stringify(t.data.map)), 
            -1 != t.data.package_curr && (e.package_id = t.data.package_list[t.data.package_curr].id), 
            app.util.request({
                url: "entry/wxapp/setorder",
                data: e,
                success: function(a) {
                    var t = a.data;
                    "" != t.data && (wx.showToast({
                        title: "提交成功",
                        icon: "success",
                        duration: 2e3
                    }), setTimeout(function() {
                        wx.navigateTo({
                            url: "../porder/pay?&out_trade_no=" + t.data.out_trade_no
                        });
                    }, 2e3));
                }
            });
        }
    },
    onLoad: function(e) {
        var d = this;
        common.config(d), common.theme(d);
        for (var a = [], t = 0; t < 5; t++) {
            var i = {};
            i.index = t, i.plan_date = GetDate(t), i.date = GetDateStr(t), i.week = getMyDay(t), 
            i.name = 0 == t ? "今天" : getMyDay2(t), a.push(i);
        }
        if (console.log(a), d.setData({
            date: a
        }), "" != e.id && null != e.id) d.setData({
            id: e.id
        }); else {
            var s = app.map, r = -1;
            null != s && "" != s && "" != s.content && null != s.content && 1 == s.content.store && (r = ""), 
            d.setData({
                id: r,
                map: s
            });
        }
        wx.getLocation({
            type: "wgs84",
            success: function(a) {
                var t = a.latitude, e = a.longitude;
                a.speed, a.accuracy;
                d.setData({
                    latitude: t,
                    longitude: e
                });
            },
            complete: function() {
                var a = {
                    op: "store_order"
                };
                "" != d.data.id && null != d.data.id && -1 != d.data.id && (a.id = d.data.id), "" != e.package && null != e.package && "" != e.package_service && null != e.package_service && (a.package = e.package, 
                a.package_service = e.package_service), null != d.data.latitude && "" != d.data.latitude && (a.latitude = d.data.latitude), 
                null != d.data.longitude && "" != d.data.longitude && (a.longitude = d.data.longitude), 
                app.util.request({
                    url: "entry/wxapp/service",
                    data: a,
                    success: function(a) {
                        var t = a.data;
                        "" != t.data && ("" != t.data.list && null != t.data.list && d.setData({
                            list: t.data.list,
                            id: t.data.list.id
                        }), "" != e.member_id && null != e.member_id && "" != e.member_name && null != e.member_name && d.setData({
                            member_id: e.member_id,
                            member_name: e.member_name
                        }), "" != t.data.times && null != t.data.times && (d.setData({
                            times: t.data.times
                        }), get_time(d)), "" != t.data.package && null != t.data.package && "" != t.data.package_service && null != t.data.package_service && (d.setData({
                            package_list: t.data.package,
                            service_id: t.data.package_service.id,
                            service_name: t.data.package_service.name,
                            service_home: t.data.package_service
                        }), 1 == parseInt(t.data.package_service.shop) ? d.setData({
                            service_type: 2
                        }) : 1 == parseInt(t.data.package_service.home) && d.setData({
                            service_type: 1
                        })), d.setData({
                            more_store: t.data.more_store
                        }), getArea(d));
                    }
                });
            }
        });
        var n = d.data.config, c = -1, u = -1, l = -1;
        "" != n && null != n && ("" != n.home_status && null != n.home_status && (c = n.home_status), 
        "" != n.shop_status && null != n.shop_status && (l = n.shop_status), "" != n.online_time && null != n.online_time && (u = n.online_time)), 
        d.setData({
            home_status: c,
            shop_status: l,
            online_time: u
        }), -1 == c && 1 == l ? d.setData({
            service_type: 2
        }) : 1 == c && -1 == l && d.setData({
            service_type: 1
        });
    },
    onReady: function() {},
    onShow: function() {
        var d = this;
        app.util.request({
            url: "entry/wxapp/service",
            showLoading: !1,
            data: {
                op: "address_default"
            },
            success: function(a) {
                var t = a.data;
                if ("" != t.data) {
                    var e = t.data.address;
                    "" != t.data.content && null != t.data.content && (e += t.data.content), "" != t.data.map && null != t.data.map && d.setData({
                        map: t.data.map
                    }), d.setData({
                        name: t.data.name,
                        mobile: t.data.mobile,
                        address: e
                    }), sign(d), getArea(d);
                }
            }
      }),d.setData({
        shadow: !1
      });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var e = this;
        !e.data.isbottom && e.data.member_page && app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "store_member",
                id: e.data.id,
                page: e.data.page,
                pagesize: e.data.pagesize
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? e.setData({
                    member_list: e.data.member_list.concat(t.data),
                    page: e.data.page
                }) : e.setData({
                    isbottom: !0
                });
            }
        });
    },
    package_choose: function(a) {
        var t = a.currentTarget.dataset.index;
        t != this.data.package_curr ? this.setData({
            package_curr: t
        }) : this.setData({
            package_curr: -1
        });
    }
});