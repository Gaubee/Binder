module.exports = {
    ArrayCopy: function (copyer, newer) {
        newer = newer || [];
        try {
            var Length = copyer.length;
        } catch (e) {
            console.log("error copy:" + e);
            return null;
        }
        for (var i = 0; i < Length; i++) {
            newer[i] = copyer[i];
        }
        return newer;
    },
    TimeOut: function (fn, time, objarr)//要定时运行的函数，[定时时间]，[fn（）内的参数，数组形式传递]
    {
        time = time || 0;

        setTimeout(function () {
            if (typeof objarr === "object") {
                for (var i in objarr) {
                    arguments[arguments.length] = objarr[i];
                    arguments.length++;
                }
            } else {
                arguments[0] = objarr;
                arguments.length++;
            }
            fn.apply(fn, arguments);
        }, time);
    },
    GetType:function($){
        return Object.prototype.toString.call($).split(' ')[1].replace(']','').toLowerCase();
    }
};