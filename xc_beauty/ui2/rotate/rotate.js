var app = getApp(), common = require("../common/common.js"), canRoll = !0, num = 1, lotteryArrLen = 0, lottery = [];

Page({
    data: {
        pagePath: "rotate/rotate",
        navCurrent: "0",
        userImg: "",
        annList: [],
        signed: 0,
        todaySign: !1,
        signList: [],
        signText: "你今天还没签到哦！",
        rotated: 0,
        awardTime: "",
        awardContent: ""
    },
    linechange: function(t) {
        var a = this.data.annList;
        this.setData({
            line: a[t.detail.current].line
        });
    },
    signFunc: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/service",
            data: {
                op: "sign"
            },
            success: function(t) {
                if ("" != t.data.data) {
                    var a = parseInt(e.data.signed) + 1;
                    e.setData({
                        todaySign: !0,
                        signed: a,
                        signText: "您今天已成功签到，请明天再来签到！"
                    }), e.data.signed == e.data.signList.length && e.setData({
                        signText: "恭喜您已经完成签到，赶快去抽奖吧！",
                        rotated: parseInt(e.data.rotated) + 1
                    });
                }
            }
        });
    },
    onLoad: function() {
        var n = this;
        common.config(n), common.theme(n), wx.getUserInfo({
            success: function(t) {
                n.setData({
                    userImg: t.userInfo.avatarUrl,
                    nick: t.userInfo.nickName
                });
            }
        }), app.util.request({
            url: "entry/wxapp/service",
            data: {
                op: "rotate"
            },
            success: function(t) {
                var a = t.data;
                if ("" != a.data) {
                    "" != a.data.rotate && null != a.data.rotate && n.setData({
                        rotate: a.data.rotate,
                        signList: a.data.signList
                    }), "" != a.data.rotate_user && null != a.data.rotate_user && n.setData({
                        signed: a.data.rotate_user.times,
                        todaySign: a.data.rotate_user.todaySign,
                        rotated: a.data.rotate_user.rotated
                    }), "" != a.data.coupon && null != a.data.coupon && n.setData({
                        coupon: a.data.coupon
                    }), "" != a.data.prize && null != a.data.prize && (lottery = a.data.prize, n.setData({
                        prize: a.data.prize,
                        total_time: a.data.total_time
                    })), "" != a.data.list && null != a.data.list && n.setData({
                        annList: a.data.list
                    }), n.data.todaySign && n.setData({
                        signText: "您今天已成功签到，请明天再来签到！"
                    }), n.data.signed == n.data.signList.length && n.setData({
                        signText: "恭喜您已经完成签到，赶快去抽奖吧！"
                    }), n.setPlateData();
                    var e = wx.createAnimation({
                        duration: 2e3,
                        timingFunction: "ease"
                    });
                    n.aniData = e;
                }
            }
        });
    },
    setPlateData: function() {
        if ((lotteryArrLen = lottery.length) < 2) ; else if (lotteryArrLen < 3 && 1 < lotteryArrLen) {
            for (var t = new Array(), a = 0; a < 4; a++) t[a] = a % 2 == 0 ? lottery[0] : lottery[1];
            lottery = [].concat(t);
        } else {
            for (var e = 0, n = new Array(), o = 0; o < lotteryArrLen; o++) n[o] = lottery[e], 
            e++;
            lottery = [].concat(n);
        }
        lotteryArrLen = lottery.length, this.setData({
            lottery: lottery
        });
    },
    startRollTap: function() {
        var o = this;
        if (0 == o.data.rotated) wx.showModal({
            title: "您已经没有抽奖机会了",
            content: "欢迎下次再来",
            showCancel: !1,
            confirmText: "确定"
        }); else if (canRoll) {
            var r = this.aniData, t = Math.random() * parseInt(o.data.total_time);
            console.log("随机数是" + t);
            for (var i = void 0, a = 0; a < lottery.length; a++) t > parseInt(lottery[a].min) && t < parseInt(lottery[a].max) && (i = a);
            console.log(i), console.log("奖品是：" + lottery[i].name), app.util.request({
                url: "entry/wxapp/service",
                showLoading: !1,
                data: {
                    op: "sign_log",
                    id: o.data.lottery[i].id
                },
                success: function(t) {
                    if ("" != t.data.data) if (canRoll = !1, r.rotate(3600 * num - 360 / lotteryArrLen * i).step(), 
                    o.setData({
                        aniData: r.export()
                    }), num++, 3 != lottery[i].type) {
                        o.awardShow(lottery[i].name, lottery[i].type);
                        var a = o.data.annList, e = {
                            title: lottery[i].name,
                            nick: o.data.nick
                        };
                        if (a.push(e), o.setData({
                            annList: a
                        }), -1 != parseInt(lottery[i].member) && (lottery[i].member = parseInt(lottery[i].member) - 1, 
                        0 == lottery[i].member)) {
                            lottery.splice(i, 1), o.setPlateData();
                            var n = wx.createAnimation({
                                duration: 2e3,
                                timingFunction: "ease"
                            });
                            o.aniData = n;
                        }
                    } else setTimeout(function() {
                        wx.showModal({
                            title: lottery[i].name,
                            content: lottery[i].name,
                            showCancel: !1,
                            confirmText: "确定"
                        }), o.setData({
                            rotated: parseInt(o.data.rotated) - 1
                        }), canRoll = !0;
                    }, 2100);
                }
            });
        }
    },
    openConfirm: function() {
        wx.showModal({
            title: "抽奖失败",
            content: "很抱歉，您的签到次数不足" + this.data.signList.length + "次，暂时还不能参加大抽奖！",
            showCancel: !1,
            confirmText: "确定"
        });
    },
    awardShow: function(n, o) {
        var r = this;
        setTimeout(function() {
            wx.showModal({
                title: "恭喜",
                content: "您抽得" + n,
                showCancel: !1,
                confirmText: "确定"
            });
            var t = new Date(), a = t.getMonth() + 1 + "月" + t.getDate() + "日", e = "";
            1 == o ? e = "您可以在“我的-优惠券”内查看！" : 2 == o && (e = "您可以在“我的-中奖纪录”内查看！"), r.setData({
                rotated: parseInt(r.data.rotated) - 1,
                awardTime: a,
                awardContent: n,
                signText: e
            }), canRoll = !0;
        }, 2100);
    }
});