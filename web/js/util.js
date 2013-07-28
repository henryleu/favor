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
