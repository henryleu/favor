/**
 * Created with JetBrains WebStorm.
 * User: henryleu
 * Date: 13-7-3
 * Time: 上午10:15
 * To change this template use File | Settings | File Templates.
 */

(function($){
    /**
     * Run this funciton before debuging ajax calls.
     * it will alert some important error message
     */
    $.ajaxSetup({"error":function(XMLHttpRequest,textStatus, errorThrown) {
        alert(textStatus);
        alert(errorThrown);
        alert(XMLHttpRequest.responseText);
    }});

})(jQuery);

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

(function() {
    var loadUrl = Backbone.History.prototype.loadUrl;

    Backbone.History.prototype.loadUrl = function(fragmentOverride) {
        var matched = loadUrl.apply(this, arguments),
            gaFragment = this.fragment;
        if (!/^\//.test(gaFragment)) gaFragment = '/' + gaFragment;
        (function(i,r){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();
        })(window,'ga');
        ga('create', 'UA-43530384-1', 'realsaas.com');
        ga('send', 'pageview');
        console.log('send pageview - ' + gaFragment);
        if(window._gaq !== undefined) {
            window._gaq.push(['_trackPageview', gaFragment]);
            ga('send', 'pageview');
            console.log('send pageview - ' + gaFragment);
        }
        return matched;
    };

}).call(this);

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-43530384-1', 'realsaas.com');
ga('send', 'pageview');
console.log('send pageview - init');
