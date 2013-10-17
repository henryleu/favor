define([], function() {
    Date.prototype.toString=function(format,loc){
        var time={};
        time.Year=this.getFullYear();
        time.TYear=(""+time.Year).substr(2);
        time.Month=this.getMonth()+1;
        time.TMonth=time.Month<10?"0"+time.Month:time.Month;
        time.Day=this.getDate();
        time.TDay=time.Day<10?"0"+time.Day:time.Day;
        time.Hour=this.getHours();
        time.THour=time.Hour<10?"0"+time.Hour:time.Hour;
        time.hour=time.Hour<13?time.Hour:time.Hour-12;
        time.Thour=time.hour<10?"0"+time.hour:time.hour;
        time.Minute=this.getMinutes();
        time.TMinute=time.Minute<10?"0"+time.Minute:time.Minute;
        time.Second=this.getSeconds();
        time.TSecond=time.Second<10?"0"+time.Second:time.Second;
        time.Millisecond=this.getMilliseconds();
        time.Week=this.getDay();

        var MMMArrEn=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        var MMMArr=["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
        var WeekArrEn=["Sun","Mon","Tue","Web","Thu","Fri","Sat"];
        var WeekArr=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];

        var oNumber=time.Millisecond/1000;

        if(format!=undefined && format.replace(/\s/g,"").length>0){
            if(loc!=undefined && loc =="en"){
                MMMArr=MMMArrEn.slice(0);
                WeekArr=WeekArrEn.slice(0);
            }
            format=format
                .replace(/yyyy/ig,time.Year)
                .replace(/yyy/ig,time.Year)
                .replace(/yy/ig,time.TYear)
                .replace(/y/ig,time.TYear)
                .replace(/MMM/g,MMMArr[time.Month-1])
                .replace(/MM/g,time.TMonth)
                .replace(/M/g,time.Month)
                .replace(/dd/ig,time.TDay)
                .replace(/d/ig,time.Day)
                .replace(/HH/g,time.THour)
                .replace(/H/g,time.Hour)
                .replace(/hh/g,time.Thour)
                .replace(/h/g,time.hour)
                .replace(/mm/g,time.TMinute)
                .replace(/m/g,time.Minute)
                .replace(/ss/ig,time.TSecond)
                .replace(/s/ig,time.Second)
                .replace(/fff/ig,time.Millisecond)
                .replace(/ff/ig,oNumber.toFixed(2)*100)
                .replace(/f/ig,oNumber.toFixed(1)*10)
                .replace(/EEE/g,WeekArr[time.Week]);
        }
        else{
            format=time.Year+"-"+time.Month+"-"+time.Day+" "+time.Hour+":"+time.Minute+":"+time.Second;
        }
        return format;
    };
    return null;
});