define(['Underscore','jQuery', 'skeleton', './Analytics'],
function(_, $, sk, Analytics) {
    var HeaderView = sk.View.extend({
        vid: 'header',
        templateName: 'flow-ctrl',
        routes: {
            "": "home",
            "share": "share",
            "find": "find",
            "forum": "forum",
            "about": "about",
            "user": "user"
        },
        events: {
            "click li.message": "toggleMessage"
        },
        configure: function(){
            _.defaults(this, HeaderView.defaults);
            this.autoHide();
            this.routeDelegate = new sk.RouteDelegate({
                view: this,
                reactTrigger: 'reactTrigger'
            });
        },
        home: function(){
            this.routeDelegate.route('home');
        },
        find: function(){
            this.routeDelegate.route('find');
        },
        share: function(){
            this.routeDelegate.route('share');
        },
        forum: function(){
            this.routeDelegate.route('forum');
        },
        about: function(){
            this.routeDelegate.route('about');
        },
        user: function(){
            this.routeDelegate.route('user');
        },
        autoHide: function() {
            var beyondHeight = this.beyondHeight;
            var effectDuration = this.effectDuration;
            var me = this;
            var $contentPadding = $('.main-header-padding');
            $(window).scroll(function(){
                var scrolledTop = document.documentElement.scrollTop + document.body.scrollTop;
                if(scrolledTop>beyondHeight){
                    me.$el.fadeOut(effectDuration);
                    $contentPadding.slideUp(effectDuration);
                }else{
                    me.$el.fadeIn(effectDuration);
                    $contentPadding.slideDown(effectDuration);
                }
            });
        },
        toggleMessage: function(e){
            var msg = this.$('li.message');
            if(msg.hasClass('active')){
                msg.removeClass('active');
            }
            else{
                msg.addClass('active');
            }
        },
        reactTrigger: function(previous, current){
            this.activateMenu(previous[0], false);
            this.activateMenu(current[0], true);
        },
        activateMenu: function(id, active){
            if(active){
                $('li>a[set='+id+']').parent().addClass('active');
            }
            else{
                $('li>a[set='+id+']').parent().removeClass('active');
            }
        },
        afterRender: function() {
        }
    });
    HeaderView.defaults = {
        beyondHeight: 40,
        effectDuration: 400
    };
    return HeaderView;
});