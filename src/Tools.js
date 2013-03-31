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
        time = parseInt(time);
        if (time.toString()!=='NaN') {
            setTimeout(function () {
                fn.apply(fn, objarr);
            }, time);
        }else{
            fn.apply(fn, objarr);
        }
    },
    GetType:function($){
        return Object.prototype.toString.call($).split(' ')[1].replace(']','');//.toLowerCase();
    }
};