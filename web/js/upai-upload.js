/**
 * jQuery extension for UpaiYun form API
 */

(function($) {

    var uuid = 0;

    $.fn.upaiUpload = function(callback) {
        var self = this, inputs, checkbox, checked,
            iframeName = 'upai_upload_' + ++uuid,
            iframe = $('<iframe name="' + iframeName + '" style="position:absolute;top:-9999px" />').appendTo('body'),
            form = '<form target="' + iframeName + '" method="post" enctype="multipart/form-data" />';

        var bucket = 'favor-image';
        var uploadUrl = 'http://v0.api.upyun.com/' + bucket;
        console.debug(self);

        form = self.wrapAll(form).parent('form').attr('action', uploadUrl);

        var form_api_secret = 'hlt6AYN9jPpFdU2mAZ2RY+R8wQE=';

        var options = {
            'bucket': bucket, /// 空间名
            'expiration': Math.round(Date.now()/1000) + 600, /// 授权过期时间
            'save-key': '/dealImages/{year}/{mon}/{day}/{random}{.suffix}', /// 文件名生成格式，请参阅 API 文档
            'allow-file-type': 'jpg,jpeg,gif,png', /// 控制文件上传的类型，可选
            'content-length-range': '0,5120000', /// 限制文件大小，<5M
            'image-width-range': '100,1024000', /// 限制图片宽度，可选
            'image-height-range': '100,1024000', /// 限制图片高度，可选
            'return-url': 'http://localhost/upaireturn'
        };

        console.debug(JSON.stringify(options));
        var policy = Base64.encode(JSON.stringify(options));
        //use cryptojs to generate MD5 code
        //src="http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/md5.js"
        console.debug(policy + '&' + form_api_secret);
        var sign = CryptoJS.MD5(policy + '&' + form_api_secret).toString();
        console.debug(sign);
        var data = {
            policy: policy,
            signature: sign
        }

        inputs = createInputs(data);
        inputs = inputs ? $(inputs).appendTo(form) : null;

        form.submit(function() {
            console.debug(form);
            console.debug(self.filename + $(self).val());

            iframe.load(function() {
                var data = handleData(this);

                form.after(self).remove();
                if (inputs) {
                    inputs.remove();
                }

                setTimeout(function() {
                    iframe.remove();
                    if (callback) {
                        callback.call(self, data);
                    }
                }, 0);
            });
        }).submit();

        return this;
    };

    function createInputs(data) {
        return $.map(param(data), function(param) {
            return '<input type="hidden" name="' + param.name + '" value="' + param.value + '"/>';
        }).join('');
    }

    function param(data) {
        if ($.isArray(data)) {
            return data;
        }
        var params = [];

        function add(name, value) {
            params.push({name:name, value:value});
        }

        if (typeof data === 'object') {
            $.each(data, function(name) {
                if ($.isArray(this)) {
                    $.each(this, function() {
                        add(name, this);
                    });
                } else {
                    add(name, $.isFunction(this) ? this() : this);
                }
            });
        } else if (typeof data === 'string') {
            $.each(data.split('&'), function() {
                var param = $.map(this.split('='), function(v) {
                    return decodeURIComponent(v.replace(/\+/g, ' '));
                });

                add(param[0], param[1]);
            });
        }

        return params;
    }

    function handleData(iframe) {
        var data, contents = $(iframe).contents().get(0);

        if ($.isXMLDoc(contents) || contents.XMLDocument) {
            return contents.XMLDocument || contents;
        }
        data = $(contents).find('body').find('pre').html();

        var result;
        try {
            result = JSON.parse(data);
            if (!result.code) {
                result.code = '-1';
            }
        } catch(e) {
            result.code = '-1';
        }

        return result;
    }

})(jQuery);
