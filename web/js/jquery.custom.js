define(['jQuery'], function(jQuery) {
    var $ = jQuery;

    var slideRightHide = {
//        "height": "hide",
        "paddingRight": "hide", "marginRight": "hide", "paddingLeft": "hide", "marginLeft": "hide",
        "width": "hide", "opacity": "hide"};

    var slideLeftShow = {
//        "height":"show",
        "paddingRight":"show","marginRight":"show", "paddingLeft":"show","marginLeft":"show",
        "width":"show","opacity":"show"};

    jQuery.fn.extend({
        slideRightShow: function() {
            return this.each(function() {
                $(this).show('slide', {direction: 'right'}, 1000);
            });
        },
        slideLeftHide: function() {
            return this.each(function() {
                $(this).hide('slide', {direction: 'left'}, 1000);
            });
        },
        slideRightHide: function(speed, easing, callback) {
            return this.animate( slideRightHide, speed, easing, callback );
        },
        slideLeftShow: function(speed, easing, callback) {
            return this.animate( slideLeftShow, speed, easing, callback );
//            return this.each(function( speed, easing, callback ) {
//                return $(this).animate( slideLeftShow, speed, easing, callback );
//            });
        }
    });
    return jQuery;
});