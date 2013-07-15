this["JST"] = this["JST"] || {};

this["JST"]["catalog"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="row-fluid btn-toolbar "><nav>\n    <div class="btn-group pull-left" data-toggle="buttons-radio">\n        <a href="catalog-newest" class="btn active"><i class="icon-rocket"></i> 最新</a>\n        <a href="catalog-hottest" class="btn "><i class="icon-signal"></i> 热门</a>\n        <a href="catalog-selfrun" class="btn "><i class="icon-trophy"></i> 自营</a>\n    </div>\n    <div class="btn-group pull-right" data-toggle="buttons-radio">\n        <a class="btn active"><i class="icon-th-large"></i> 大图</a>\n        <a class="btn "><i class="icon-th"></i> 小图</a>\n        <a class="btn "><i class="icon-th-list"></i> 列表</a>\n    </div>\n</nav></div>\n<div class="row-fluid content" >\n    <div class="show" data-view-id="catalog-newest"></div>\n    <div class="hide" data-view-id="catalog-hottest"></div>\n    <div class="hide" data-view-id="catalog-selfrun"></div>\n</div>';

}
return __p
};

this["JST"]["large-icons"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '\n    <div class="offset2 span1">\n        <a class="carousel-control left" href="#carousel_' +
((__t = (id)) == null ? '' : __t) +
'" data-slide="prev" data-bypass>&lsaquo;</a>\n    </div>\n    <div class="span6">\n        <div id="carousel_' +
((__t = (id)) == null ? '' : __t) +
'" class="carousel slide">\n            <div class="row-fluid">\n                <ol class="carousel-indicators">\n                    ';
 _.each(input, function(item, index) { ;
__p += '\n                    <li data-target="#carousel_' +
((__t = (id)) == null ? '' : __t) +
'" data-slide-to="' +
((__t = (index)) == null ? '' : __t) +
'" class="' +
((__t = (index==0?'active':'')) == null ? '' : __t) +
'"></li>\n                    ';
 }); ;
__p += '\n                </ol>\n\n                <!-- Carousel items -->\n                <div class="carousel-inner">\n                    ';
 _.each(input, function(item, index) { ;
__p += '\n                    <div class="' +
((__t = (index==0?'active':'')) == null ? '' : __t) +
' item">\n                        <li class="large-item">\n                            <a target="_blank"><img alt="' +
((__t = (item.title)) == null ? '' : __t) +
'" src="' +
((__t = (item.imageUrl)) == null ? '' : __t) +
'"></a>\n                            <h4 data-placement="bottom" data-toggle="tooltip" title="' +
((__t = (item.title)) == null ? '' : __t) +
'">' +
((__t = (item.title)) == null ? '' : __t) +
'</h4>\n                            <p>\n                                <span class="fanciers"><i class="icon-heart"></i><span class="fanciers_count">' +
((__t = (item.likes)) == null ? '' : __t) +
'</span></span>\n                                <span class="owners"><i class="icon-check"></i><span class="owners_count">' +
((__t = (item.views)) == null ? '' : __t) +
'</span></span>\n                                <span class="owners"><i class="icon-eye-open"></i><span class="owners_count">' +
((__t = (item.views)) == null ? '' : __t) +
'</span></span>\n                            </p>\n                        </li>\n                    </div>\n                    ';
 }); ;
__p += '\n                <!-- Carousel nav -->\n            </div>\n            </div>\n        </div>\n    </div>\n    <div class="span1">\n        <a class="carousel-control right" href="#carousel_' +
((__t = (id)) == null ? '' : __t) +
'" data-slide="next" data-bypass>&rsaquo;</a>\n    </div>\n';

}
return __p
};

this["JST"]["list-items"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '\n<div class="offset2 span1">\n    <a class="carousel-control left" href="#myCarousel" data-slide="prev" data-bypass>&lsaquo;</a>\n</div>\n<div class="span6">\n    <div id="myCarousel" class="carousel slide">\n        <div class="row-fluid">\n            <ol class="carousel-indicators">\n                ';
 _.each(input, function(item, index) { ;
__p += '\n                <li data-target="#myCarousel" data-slide-to="' +
((__t = (index)) == null ? '' : __t) +
'" class="' +
((__t = (index==0?'active':'')) == null ? '' : __t) +
'"></li>\n                ';
 }); ;
__p += '\n            </ol>\n\n            <!-- Carousel items -->\n            <div class="carousel-inner">\n                ';
 _.each(input, function(item, index) { ;
__p += '\n                <div class="' +
((__t = (index==0?'active':'')) == null ? '' : __t) +
' item">\n                    <li class="large-item">\n                        <a target="_blank"><img alt="' +
((__t = (item.title)) == null ? '' : __t) +
'" src="' +
((__t = (item.imageUrl)) == null ? '' : __t) +
'"></a>\n                        <h4 data-placement="bottom" data-toggle="tooltip" title="' +
((__t = (item.title)) == null ? '' : __t) +
'">' +
((__t = (item.title)) == null ? '' : __t) +
'</h4>\n                        <p>\n                            <span class="fanciers"><i class="icon-heart"></i><span class="fanciers_count">' +
((__t = (item.likes)) == null ? '' : __t) +
'</span></span>\n                            <span class="owners"><i class="icon-check"></i><span class="owners_count">' +
((__t = (item.views)) == null ? '' : __t) +
'</span></span>\n                            <span class="owners"><i class="icon-eye-open"></i><span class="owners_count">' +
((__t = (item.views)) == null ? '' : __t) +
'</span></span>\n                        </p>\n                    </li>\n                </div>\n                ';
 }); ;
__p += '\n                <!-- Carousel nav -->\n            </div>\n        </div>\n    </div>\n</div>\n<div class="span1">\n    <a class="carousel-control right" href="#myCarousel" data-slide="next" data-bypass>&rsaquo;</a>\n</div>\n';

}
return __p
};

this["JST"]["medium-icons"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '\n<div class="offset2 span1">\n    <a class="carousel-control left" href="#myCarousel" data-slide="prev" data-bypass>&lsaquo;</a>\n</div>\n<div class="span6">\n    <div id="myCarousel" class="carousel slide">\n        <div class="row-fluid">\n            <ol class="carousel-indicators">\n                ';
 _.each(input, function(item, index) { ;
__p += '\n                <li data-target="#myCarousel" data-slide-to="' +
((__t = (index)) == null ? '' : __t) +
'" class="' +
((__t = (index==0?'active':'')) == null ? '' : __t) +
'"></li>\n                ';
 }); ;
__p += '\n            </ol>\n\n            <!-- Carousel items -->\n            <div class="carousel-inner">\n                ';
 _.each(input, function(item, index) { ;
__p += '\n                <div class="' +
((__t = (index==0?'active':'')) == null ? '' : __t) +
' item">\n                    <li class="large-item">\n                        <a target="_blank"><img alt="' +
((__t = (item.title)) == null ? '' : __t) +
'" src="' +
((__t = (item.imageUrl)) == null ? '' : __t) +
'"></a>\n                        <h4 data-placement="bottom" data-toggle="tooltip" title="' +
((__t = (item.title)) == null ? '' : __t) +
'">' +
((__t = (item.title)) == null ? '' : __t) +
'</h4>\n                        <p>\n                            <span class="fanciers"><i class="icon-heart"></i><span class="fanciers_count">' +
((__t = (item.likes)) == null ? '' : __t) +
'</span></span>\n                            <span class="owners"><i class="icon-check"></i><span class="owners_count">' +
((__t = (item.views)) == null ? '' : __t) +
'</span></span>\n                            <span class="owners"><i class="icon-eye-open"></i><span class="owners_count">' +
((__t = (item.views)) == null ? '' : __t) +
'</span></span>\n                        </p>\n                    </li>\n                </div>\n                ';
 }); ;
__p += '\n                <!-- Carousel nav -->\n            </div>\n        </div>\n    </div>\n</div>\n<div class="span1">\n    <a class="carousel-control right" href="#myCarousel" data-slide="next" data-bypass>&rsaquo;</a>\n</div>\n';

}
return __p
};

this["JST"]["share-subject"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="row-fluid">\n<br>\n</div>\n<div class="row-fluid">\n<div class="span4">\n    <div class="row-fluid">\n    <h4 class="span12">效果预览：</h4>\n    <ul class="thumbnails">\n        <li class="span12">\n            <div class="thumbnail row-fluid">\n            <a href="/share" id="previewLink">\n            <img id="previewImg" src="#" class="img-rounded span12" height="800">\n            <h4 id="previewSDes" class="text-center" data-placement="bottom" data-toggle="tooltip">简短概括</h4>\n            <p id="previewLDes" data-placement="bottom" data-toggle="tooltip">更多描述</p>\n            </a>\n            </div>\n        </li>\n    </ul>\n    </div>\n</div>\n<div class="span8">\n    <div class="row-fluid">\n        <div class="span12">\n        <h4>信息详情：</h4>\n        <hr>\n        <div class="row-fluid">\n            <label class="control-label span2 text-right" for="imageFile">商品图片</label>\n            <div class="span10">\n                <span class="btn fileinput-button span12">\n                    <span id="fileName">选择本地图片...</span>\n                    <!-- The file input field used as target for the file upload widget -->\n                    <input id="imageFile" class="span12" type="file" name="files[]">\n                </span>\n            </div>\n        </div>\n        <div class="row-fluid">\n            <ul class="nav nav-list offset2 span10">\n                <li><a href="javascript: $(\'#myModal\').modal(\'show\');"><i class="icon-external-link"></i>使用远程图片...</a></li>\n            </ul>\n        </div>\n        <div class="row-fluid">\n            <label class="control-label span2 text-right" for="shortDes">简短概括</label>\n            <div class="span10">\n                <input class="span12" id="shortDes" type="text" placeholder="简单概括下商品">\n            </div>\n        </div>\n        <div class="row-fluid">\n            <label class="control-label span2 text-right" for="longDes">推荐理由</label>\n            <div class="span10">\n                <textarea class="span12" rows="5" id="longDes" placeholder="说说为什么推荐这个商品吧～～"></textarea>\n            </div>\n        </div>\n        <div class="row-fluid">\n            <label class="control-label span2 text-right" for="productLink">商品链接</label>\n            <div class="span10">\n                <input class="span12" id="productLink" type="text" placeholder="商品来源网站的完整链接">\n            </div>\n        </div>\n        <div class="row-fluid">\n            <div class="offset2 span10">\n                <button type="submit" class="btn btn-primary">公开分享信息</button>\n                <button class="btn">清空信息</button>\n            </div>\n        </div>\n        </div>\n    </div>\n</div>\n</div>\n<div id="myModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\n    <div class="modal-body">\n        <div class="row-fluid">\n        <h4 id="myModalLabel" class="control-label span12" for="imageLink">远程图片链接地址：</h4>\n        <input class="span12" id="imageLink" type="text" placeholder="远程图片的完整链接">\n        <div class="controls text-right">\n            <button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>\n            <button id="saveImageLink" class="btn btn-primary">保存链接</button>\n        </div>\n        </div>\n    </div>\n</div>\n';

}
return __p
};