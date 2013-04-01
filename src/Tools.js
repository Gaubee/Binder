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
    ArrayIndexOf:function(arr,val){
        var i,Length = arr.length;
        for ( i = 0; i < Length; i++) {
            if(arr[i] === val){
                return i;
            };
        };
        return -1;
    },
    noExtendSet: function(Sobj,Tobj){
        var i,Stype,Ttype;
        for (i in Tobj) {
            Stype = typeof Sobj[i];
            Ttype = typeof Tobj[i];
            if (i in Sobj) {
                if (Ttype === Stype === "object") {
                    arguments.callee(Sobj[i],Tobj[i])
                }else if (Ttype === Stype === "function") {
                    Stype = eval("(function(){return "+ Tobj[i] +" })()");
                    arguments.callee(Sobj[i],Tobj[i]);
                    arguments.callee(Sobj[i].prototype,Tobj[i].prototype);
                }else{
                    Sobj[i] = Tobj[i];
                };
            };
        };
    },
    Extend:function(Sobj,Tobj){//extend no change old value
        var i,Stype,Ttype;
        for (i in Tobj) {
            Stype = typeof Sobj[i];
            Ttype = typeof Tobj[i];
            if (i in Sobj) {
                if (Ttype === Stype === "object") {
                    arguments.callee(Sobj[i],Tobj[i])
                }else if (Ttype === Stype === "function") {
                    Stype = eval("(function(){return "+ Tobj[i] +" })()");
                    arguments.callee(Sobj[i],Tobj[i]);
                    arguments.callee(Sobj[i].prototype,Tobj[i].prototype);
                }else{
                    Sobj[i] = Tobj[i];
                };
            };
        };
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