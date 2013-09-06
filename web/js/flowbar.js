define(['Underscore', 'jQuery'], function(_, $) {
    var Flowbar = function(o){
        this.initialize(o);
    };
    Flowbar.prototype = {
        initialize: function(o){
            this.defaults = {
                flowbar: 'flowbar',
                beyondHeight: 10
            };
            this.o = o||{};
            this.options = _.clone(this.o);
            _.defaults(this.options, this.defaults);
        },
        start: function(){
            var id = '#'+this.options.flowbar;
            var beyondHeight = this.options.beyondHeight;
            $(window).scroll(function(){
                var scrolledTop = document.documentElement.scrollTop + document.body.scrollTop;
                if(scrolledTop>beyondHeight){
                    $(id).fadeIn(400);
                }else{
                    $(id).stop().fadeOut(400);
                }
            });
            $(id).click(function(){ //当点击标签的时候,使用animate在200毫秒的时间内,滚到顶部
                $("html,body").animate({scrollTop:"0px"},200);
            });
        }
    };
    return Flowbar;
});