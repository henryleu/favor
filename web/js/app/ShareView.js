define(['jQuery', 'skeleton'],
function($, sk) {
    //TODO: what does it mean? "upload server setting for jquery-file-upload, no longer used."
    //image server URL of UpaiYun
    var imageServer = 'http://favor-image.b0.upaiyun.com'; //TODO: get it from config object

    var ShareView = sk.View.extend({
        vid: 'share',
        templateName: 'share',
        routes: {
            'share/:dealId': 'loadDealInfo'
        },
        events: {
            'change #imageURL': 'changeImageURL',
            'change #shortDes': 'changeShortDes',
            'change #longDes': 'changeLongDes',
            'change #dealLink': 'changeDealLink',
            'keyup #imageURL': 'changeImageURL',
            'keyup #shortDes': 'changeShortDes',
            'keyup #longDes': 'changeLongDes',
            'keyup #dealLink': 'changeDealLink',
            'mouseover .floatButton': 'onMouseoverButton',
            'mouseleave .floatButton': 'onMouseleaveButton',
            'click #changeImageMode': 'changeImageMode',
            'click .previewImage': 'uploadLocalImage',
            'click #saveImageLinkSetting': 'saveImageLinkSetting',
            'click #publishDealInfo': 'publishDealInfo',
            'click #updateDealInfo': 'updateDealInfo',
            'click #deleteDealInfo': 'deleteDealInfo',
            'click #clearDealInfo': 'clearDealInfo',
            'click #abandonChange': 'clearDealInfo'
        },
        configure: function() {
            var me = this;
            this.usingLocalImage = true;
            this.uploadingImage = false;
            this.listenTo(this.model, 'sync', function(model, res, options) {
                console.debug('ShareSubjectView sync event callback: ' + me.syncMethod);
                switch(me.syncMethod) {
                    case 'create':
                    case 'update':
                        me.model.clear();
                        console.log('Successfully ' + me.syncMethod + ': ' + JSON.stringify(res));
                        var deal = JSON.parse(JSON.stringify(res));
                        me.doRender();
                        $('.alert-success').show();
                        break;
                    case 'delete':
                        me.clearDealInfo();
                        console.log('Successfully delete: ' + JSON.stringify(res));
                        $('.alert-success').show();
                        break;
                    case 'read':
                        console.log('Successfully read: ' + JSON.stringify(res));
                        JSON.parse(JSON.stringify(res), function(key, value) {
                            me.model.set(key, value);
                        });
                        Backbone.history.navigate('share');
                        me.doRender();
                        $('.alert-success').hide();
                        break;
                    default:
                        break;
                }
            });
            this.listenTo(this.model, 'error', function(model, xhr, options) {
                console.log('Error occurred when ' + me.syncMethod + ' deal. -> ' + JSON.stringify(xhr));
                $('.alert-error').show();
            });
        },
        afterRender: function() {
            var me = this;

            //Initialize file upload plugin 'jquery-file-upload', no longer used.
//            var uploadBaseUrl = uploadServer + '/files/';
//            this.$('#imageFile').fileupload({
//                url: uploadBaseUrl,
//                dataType: 'json',
//                timeout: 30000,
//                error: function(xhr, status, e) {
//                    $('.previewImage').attr('src', imageServer + '/share-alt-image.png');
//                    $('.alert-error').find('strong').html('抱歉，上传失败。');
//                    $('.alert-error').find('span').html('您选择的图片可能过大，或者因为网络状况不佳上传超时。');
//                    $('.alert-error').show();
//                },
//                add: function(e, data) {
//                    $('.previewImage').attr('src', imageServer + '/background.png');
//                    $('.icon-spinner').removeClass('hide');
//                    $('.icon-spinner').addClass('icon-spin');
//                    me.uploadingImage = true;
//                    $('#fileName').html(data.files[0].name);
//                    data.submit();
//                },
//                done: function(e, data) {
//                    $('.alert-error').hide();
//                    var imageURL = uploadBaseUrl + data.result.files[0].name;
//                    $('.previewImage').attr('src', imageURL);
//                    $('#imageURL').val(imageURL);
//                    me.model.set('image', imageURL);
//                    $('#imageURLContainer').removeClass('error');
//                },
//                always: function(e, data) {
//                    $('.icon-spinner').removeClass('icon-spin');
//                    $('.icon-spinner').addClass('hide');
//                    me.uploadingImage = false;
//                }
//            }).prop('disabled', !$.support.fileInput)
//                .parent().addClass($.support.fileInput ? undefined : 'disabled');

            //Enable local image upload to UpaiYun directly
            this.$('#upaiUploadFile').change(function(event) {
                var input = event.currentTarget;
                if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $('.previewImage').attr('src', e.target.result);
                    }
                    reader.readAsDataURL(input.files[0]);
                }
                $(event.currentTarget).upaiUpload(function(result) {
                    console.debug(result);
                    if (result.code != '200') {
                        $('.alert-error').find('strong').html('抱歉，您选择的本地图片上传失败，别人将无法看到该图片。');
                        $('.alert-error').find('span').html('您可以选择其他图片再试。');
                        $('.alert-error').show();
                    } else {
                        $('#imageURLContainer').removeClass('error');
                        $('.alert-error').hide();
                        var imageURL = imageServer + result.url;
                        $('.previewImage').attr('src', imageURL);
                        $('#imageURL').val(imageURL);
                        me.model.set('image', imageURL);
                    }
                })
            });
            if (this.model.get('image') == undefined) {
                this.$('.previewImage').attr('src', 'http://favor-image.b0.upaiyun.com/share-alt-image.png');
            } else {
                this.$('.previewImage').attr('src', this.model.get('image'));
            }
        },
        onMouseoverButton: function(event) {
            $(event.currentTarget).removeClass('btn-link');
            $(event.currentTarget).addClass('btn-success');
            if (this.usingLocalImage == true) {
                $(event.currentTarget).html('图片链接');
            } else {
                $(event.currentTarget).html('本地图片');
            }
        },
        onMouseleaveButton: function(event) {
            $(event.currentTarget).removeClass('btn-success');
            $(event.currentTarget).addClass('btn-link');
            if (this.usingLocalImage == true) {
                $(event.currentTarget).html('本地图片');
            } else {
                $(event.currentTarget).html('图片链接');
            }
        },
        changeImageMode: function() {
            if (this.usingLocalImage == true) {
                $('#changeImageMode').html('图片链接');
                $('#imageURL').removeAttr('disabled');
                $('#imageURL').val('');
                $('.previewImage').attr('src', imageServer + '/background.png');
                this.usingLocalImage = false;
            } else {
                $('#changeImageMode').html('本地图片');
                $('#imageURL').attr('disabled', 'disabled');
                $('.previewImage').attr('src', imageServer + '/share-alt-image.png');
                this.usingLocalImage = true;
            }
        },
        uploadLocalImage: function() {
            if (this.usingLocalImage != true) return;
            if (this.uploadingImage == true) return;

            //trigger jquery-file-upload, no longer used.
//            $('#imageFile').click();

            //trigger UpaiYun upload
            $('#upaiUploadFile').click();
        },
        changeImageURL: function(event) {
            //Regular expression for test user input url of image
            //var reg = /^http:\/\/[\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*(\.([\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*))*\/[\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*(\/[\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*)*\.(jpg|jpeg|png|gif)$/;
            var reg = /^http:\/\/[\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*(\.([\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*))*\//;

            var imageURL = $('#imageURL').val();
            var isValidURL = false;
            if (reg.test(imageURL)) {
                isValidURL = true;
            }
            if (isValidURL) {
                $('.previewImage').attr('src', imageURL);
                this.model.set('image', imageURL);
                $('#imageURLContainer').removeClass('error');
            } else {
                $('#imageURLContainer').addClass('error');
            }
        },
        changeShortDes: function() {
            var sDesc = $('#shortDes').val();
            if (sDesc.length > 0) {
                $('#previewSDes').html(sDesc);
                this.model.set('sDesc', sDesc);
                $('#shortDesContainer').removeClass('error');
            } else {
                $('#previewSDes').html($('#shortDes').attr('placeholder'));
                $('#shortDesContainer').addClass('error');
            }
        },
        changeLongDes: function() {
            var lDesc = $('#longDes').val();
            if (lDesc.length > 0) {
                $('#previewLDes').html(lDesc);
                this.model.set('lDesc', lDesc);
                $('#longDesContainer').removeClass('error');
            } else {
                $('#previewLDes').html($('#longDes').attr('placeholder'));
                $('#longDesContainer').addClass('error');
            }
        },
        changeDealLink: function() {
            //Regular expression for test user input url
            //var reg = /^(http|https):\/\/[\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*(\.([\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*))*\/[\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*(\/[\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*)*$/;
            var reg = /^(http|https):\/\/[\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*(\.([\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*))*\//;

            var url = $('#dealLink').val();
            if (reg.test(url)) {
                $('#previewLink').attr('href', 'javascript: window.open(\'' + url + '\');');
                this.model.set('dUrl', url);
                $('#dealLinkContainer').removeClass('error');
            } else {
                $('#previewLink').attr('href', '/share');
                $('#dealLinkContainer').addClass('error');
            }
        },
        publishDealInfo: function() {
            if (!this.isFulfilled()) return;
            this.syncMethod = 'create';
            this.model.save();
        },
        updateDealInfo: function() {
            if (!this.isFulfilled()) return;
            this.model.set('actionType', 'update');
            this.syncMethod = 'update';
            this.model.save();
        },
        deleteDealInfo: function() {
            this.syncMethod = 'delete';
            this.model.destroy();
        },
        clearDealInfo: function() {
            this.model.clear();
            this.usingLocalImage = true;
            this.uploadingImage = false;
            this.doRender();
        },
        isFulfilled: function() {
            if ($('#imageURL').val().length == 0) {
                $('#imageURLContainer').addClass('error');
            }
            if (!($('#shortDes').val().length > 0)) {
                $('#shortDesContainer').addClass('error');
            }
            if (!($('#longDes').val().length > 0)) {
                $('#longDesContainer').addClass('error');
            }
            if (!($('#dealLink').val().length > 0)) {
                $('#dealLinkContainer').addClass('error');
            }
            if ($('.error').length > 0) {
                return false;
            } else {
                return true;
            }
        },
        loadDealInfo: function(dealId) {
            this.model.id = dealId;
            this.syncMethod = 'read';
            this.model.fetch();
        }
    });

    return ShareView;
});