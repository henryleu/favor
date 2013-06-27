
var jQuery = typeof(jQuery) === 'undefined' ? null : jQuery;

(function($) {

    "use strict";

    var controlToInputNumber = function(event){
        // Allow: backspace, delete, tab, escape, and enter
        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
            // Allow: Ctrl+A
            (event.keyCode == 65 && event.ctrlKey === true) ||
            // Allow: home, end, left, right
            (event.keyCode >= 35 && event.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        else {
            // Ensure that it is a number and stop the keypress
            if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
                event.preventDefault();
            }
        }
    };
    var scopeNumber = {
        onfocus: function(event){
            $(this).data('ov', this.value);
        },
        onblur: function(min, max){
            return function(event){
                var num = parseInt(event.target.value);
                if (min > num || max < num) {
                    event.preventDefault();
                    var $el = $(event.target);
                    $el.val($el.data('ov'));
                    $el.focus();
                }
            };
        }
    };

    $.fn.extend({
        inputNumber: function() {
            return this.each(function(){
                $(this).keydown(controlToInputNumber);
            });
        },
        scopeNumber: function(min, max) {
            return this.each(function(){
                $(this).focus(scopeNumber.onfocus).blur(scopeNumber.onblur(min, max));
            });
        }

    });

}(jQuery));
